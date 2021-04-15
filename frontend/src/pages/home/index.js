import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { format } from 'date-fns';
import Modal from '../../components/modal';
import api from '../../services/api';

import './index.css';

import PlusSvg from '../../assets/svg/plus.svg';
import MinusSvg from '../../assets/svg/minus.svg';

const Home = () => {

  const initalState = {
    showModal: '',
    haveInput: false,
    inputValue: '',
    modalText: '',
    idxList: -1,
    idxTask: -1,
  };

  const [data, setData] = useState([]);
  const [state, setState] = useState(initalState);

  useEffect(() => {
    api.get('api/lists').then(res => {
      setData(res.data);
    }).catch(err => {
      console.log(err);
    })
  }, []);

  const reorder = async (listIdx, startIdx, endIdx) => {
    try {
      const listId = data[listIdx]._id;
      const idx = { startIndex: startIdx, endIndex: endIdx };
      await api.put(`/api/list/${listId}/task`, idx);
      const aux = data[listIdx].tasks[startIdx];
      data[listIdx].tasks[startIdx] = data[listIdx].tasks[endIdx];
      data[listIdx].tasks[endIdx] = aux;
      setData(data);
    } catch (err) {
      console.log(err);
    }
  };

  // both param are obj first field (index) is the idx of task and 
  // second field (droppableId) is the idx of list
  const move = async (droppableSource, droppableDestination) => {
    try {
      const listSourceIdx = Number(droppableSource.droppableId);
      const listDestIdx = Number(droppableDestination.droppableId);
      const listSourceId = data[listSourceIdx]._id;
      const listDestId = data[listDestIdx]._id;
      const idx = { sourceIdx: droppableSource.index, destIdx: droppableDestination.index };
      const res = await api.put(`/api/list/${listSourceId}/${listDestId}/task`, idx);
      const newData = [...data];
      newData[listSourceIdx] = res.data[0];
      newData[listDestIdx] = res.data[1];
      setData(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const dataChangeHandle = (buttonType, idxList, idxTask) => {
    switch (buttonType) {
      case 'SHOW_TASK': {
        const createdeDate = format(Date.parse(data[idxList].tasks[idxTask].createdDate), 'dd/MM/yyyy kk:mm:ss');
        let message = `Data de Criação:     ${createdeDate}\n\n`;
        if (data[idxList].tasks[idxTask].isDone) {
          const donedDate = format(Date.parse(data[idxList].tasks[idxTask].doneDate), 'dd/MM/yyyy kk:mm:ss');
          message += `Data de Conclusão:${donedDate}`;
        }
        setState({
          ...state,
          showModal: 'SHOW_TASK',
          haveInput: false,
          inputValue: '',
          modalText: message,
          idxList: idxList,
          idxTask: idxTask,
        });
        break;
      }
      case 'CHECK_TASK': {
        const message = data[idxList].tasks[idxTask].isDone ? 'Deseja realmente desmarcar tarefa como concluída?'
          : 'Deseja realmente marcar tarefa como concluída?';
        setState({
          ...state,
          showModal: 'CHECK_TASK',
          haveInput: false,
          inputValue: '',
          modalText: message,
          idxList: idxList,
          idxTask: idxTask,
        });
        break;
      }
      case 'ADD_LIST':
        setState({
          ...state,
          showModal: 'ADD_LIST',
          haveInput: true,
          inputValue: '',
          modalText: 'Adicionar nova lista',
          idxList: -1,
          idxTask: -1,
        });
        break;
      case 'ADD_TASK':
        setState({
          ...state,
          showModal: 'ADD_TASK',
          haveInput: true,
          inputValue: '',
          modalText: 'Adicionar nova tarefa à lista',
          idxList: idxList,
          idxTask: -1,
        });
        break;
      case 'REMOVE_LIST':
        setState({
          ...state,
          showModal: 'REMOVE_LIST',
          haveInput: false,
          inputValue: '',
          modalText: 'Deseja realmente remover da lista?',
          idxList: idxList,
          idxTask: -1,
        });
        break;
      case 'REMOVE_TASK':
        setState({
          ...state,
          showModal: 'REMOVE_TASK',
          haveInput: false,
          inputValue: '',
          modalText: 'Deseja realmente remover da tarefa?',
          idxList: idxList,
          idxTask: idxTask,
        });
        break;
      default:
        break;
    }
  }

  const onConfirmFunctionSelect = async e => {
    e.preventDefault();
    switch (state.showModal) {
      case 'CHECK_TASK':
        try {
          const listId = data[state.idxList]._id;
          const idx = {
            taskIdx: state.idxTask,
            doneDate: Date()
          };
          await api.put(`/api/list/${listId}/task/is_done`, idx);
          const newData = [...data];
          newData[state.idxList].tasks[state.idxList].isDone = !newData[state.idxList].tasks[state.idxList].isDone;
          setData(newData);
        } catch (err) {
          console.log(err);
        }
        break;
      case 'ADD_LIST':
        const newList = {
          title: state.inputValue,
          tasks: [],
        }
        try {
          const res = await api.post('api/list', newList);
          setData([...data, res.data]);
        } catch (err) {
          console.log(err);
        }
        break;
      case 'ADD_TASK':
        if(state.inputValue) {
          const newTask = {
            taskName: state.inputValue,
          };
          const id = data[state.idxList]._id;
          const res = await api.put(`/api/list/${id}`, newTask);
          const newData = [...data];
          newData[state.idxList] = res.data;
          setData(newData);
        }
        break;
      case 'REMOVE_LIST':
        try {
          const id = data[state.idxList]._id;
          await api.delete(`/api/list/${id}`);
          const _newData = [...data];
          _newData.splice(state.idxList, 1);
          setData(_newData);
        } catch (err) {
          console.log(err);
        }
        break;
      case 'REMOVE_TASK':
        try {
          const id_list = data[state.idxList]._id;
          const id_task = data[state.idxList].tasks[state.idxTask]._id;
          await api.put(`/api/list/${id_list}/${id_task}`);
          const _newData = [...data];
          _newData[state.idxList].tasks.splice(state.idxTask, 1);
          setData(_newData);
        } catch (err) {
          console.log(err);
        }

        break;
      default:
        break;
    }
    setState(initalState);
  }

  const onDragEnd = async result => {
    const { source, destination } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      if (source.index === destination.index)
        return;
      await reorder(sInd, source.index, destination.index);
    } else {
      await move(source, destination);
    }
  }

  return (
    <div
      style={state.showModal ?
        {
          backgroundColor: 'rgba(48, 49, 48, 0.42)',
          height: '100%',
          position: 'fixed',
          width: '100%',
        }
        : {}}
    >
      <div className='lists'>
        <DragDropContext onDragEnd={onDragEnd}>
          {data.map((TodoList, idxList) => (
            <Droppable key={idxList} droppableId={`${idxList}`}>
              {(provided, snapshot) => (
                <div
                  className='list'
                  ref={provided.innerRef}
                  style={{ background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey' }}
                  {...provided.droppableProps}
                >
                  <div className='todo-list-title'>
                    <div className='todo-list-title-center'>
                      {TodoList.title}
                    </div>
                    <div>
                      <button
                      className='todo-list-title-right'
                      type='button'
                      onClick={() => dataChangeHandle('REMOVE_LIST', idxList)}
                      >
                      <img src={MinusSvg} width='15' alt='Remove list' />
                    </button>
                    </div>
                  </div>
                  {TodoList.tasks.map((item, idxTask) => (
                    <Draggable
                      isDragDisabled={true}
                      key={item._id}
                      draggableId={item._id}
                      index={idxTask}
                    >
                      {(provided, snapshot) => (
                        <div
                          className='todo-item'
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            // change background colour if dragging
                            background: snapshot.isDragging ? 'lightgreen' : 'grey',

                            // styles we need to apply on draggables
                            ...provided.draggableProps.style
                          }}
                        >
                          <input
                            type='checkbox'
                            checked={item.isDone}
                            onChange={() => dataChangeHandle('CHECK_TASK', idxList, idxTask)}
                          />
                          <div
                            className="task-name"
                            onClick={() => dataChangeHandle('SHOW_TASK', idxList, idxTask)}
                            style={{ textDecoration: item.isDone ? 'line-through' : 'none' }}
                          >
                            {item.taskName}
                          </div>
                          <button
                            type='button'
                            onClick={() => dataChangeHandle('REMOVE_TASK', idxList, idxTask)}
                          >
                            <img src={MinusSvg} width='10' alt='Remove item' />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  <div className='new-item'>
                    <button
                      type='button'
                      onClick={() => dataChangeHandle('ADD_TASK', idxList)}
                    >
                      <img src={PlusSvg} width='20' alt='Add new item' />
                    </button>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
      {/* btn to add new list */}
      
        <div className='new-list'>
          <button
            type='button'
            onClick={() => dataChangeHandle('ADD_LIST')}
          >
            Nova Lista
        </button>
        </div>
      
      {state.showModal &&
        <Modal
          canCancel={state.showModal !== 'SHOW_TASK'}
          canConfirm
          onCancel={() => setState(initalState)}
          onConfirm={onConfirmFunctionSelect}
        >

          <div>
            {state.showModal === 'SHOW_TASK' && <h3>{data[state.idxList].tasks[state.idxTask].taskName}</h3>
            }
            <p>{state.modalText}</p>
            {state.haveInput && <input
              className="modal-input"
              type='text'
              name='inputValue'
              id='inputValue'
              placeholder={state.showModal === 'ADD_TASK' ? 'Nome da tarefa...' : 'Nome da lista...'}
              value={state.inputValue}
              onChange={(event) => setState({
                ...state,
                [event.target.name]: event.target.value,
              })}
            />
            }
          </div>
        </Modal>
      }
    </div>
  );
};

export default Home;