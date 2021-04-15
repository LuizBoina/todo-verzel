import React from 'react';

import './index.css';

const Modal = props => (
  <div className="modal">
    <section className="modal-content">{props.children}</section>
    <section className="modal-actions">
      {props.canCancel && (
        <button className="btn cancel" onClick={props.onCancel}>
          Cancelar
        </button>
      )}
      {props.canConfirm && (
        <button className="btn confirm" onClick={props.onConfirm}>
          Confirmar
        </button>
      )}
    </section>
  </div>
);

export default Modal;