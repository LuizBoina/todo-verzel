const listController = require('../controllers/listController');
const userController = require('../controllers/userController');

module.exports = [
  // LIST ROUTES
  {
    method: 'GET',
    url: '/api/lists',
    handler: listController.getLists
  },
  {
    method: 'POST',
    url: '/api/list',
    handler: listController.addNewList
  },
  {
    method: 'PUT',
    url: '/api/list/:id',
    handler: listController.addNewTask
  },
  {
    method: 'PUT',
    url: '/api/list/:id/task/is_done',
    handler: listController.toggleIsDone
  },
  {
    method: 'PUT',
    url: '/api/list/:id_list/task',
    handler: listController.changeTaskPosition
  },
  {
    method: 'PUT',
    url: '/api/list/:id_list_source/:id_list_dest/task',
    handler: listController.moveTask
  },
  {
    method: 'PUT',
    url: '/api/list/:id_list/:id_task',
    handler: listController.deleteTask
  },
  {
    method: 'DELETE',
    url: '/api/list/:id',
    handler: listController.deleteList
  },
  // USER ROUTES
  {
    method: 'POST',
    url: '/api/auth/signup',
    handler: userController.signUp
  },
  {
    method: 'POST',
    url: '/api/auth/signin',
    handler: userController.signIn
  },
]