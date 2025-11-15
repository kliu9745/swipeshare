import React from 'react';
import { X } from 'lucide-react';
import './Modal.css';

export const Modal = ({ isOpen, onClose, children, title, fullscreen = false }) => {
  if (!isOpen) return null;

  if (fullscreen) {
    return (
      <div className="modal-fullscreen">
        <div className="modal-fullscreen-content">
          {title && (
            <div className="modal-fullscreen-header">
              <h2 className="modal-fullscreen-title">{title}</h2>
              <button 
                onClick={onClose}
                className="modal-fullscreen-close"
              >
                <X className="modal-close-icon" />
              </button>
            </div>
          )}
          <div className="modal-fullscreen-body">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {title && (
          <div className="modal-header">
            <h2 className="modal-title">{title}</h2>
            <button 
              onClick={onClose}
              className="modal-close"
            >
              <X className="modal-close-icon" />
            </button>
          </div>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
