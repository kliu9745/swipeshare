import React from 'react';
import { QrCode, Clock, MapPin } from 'lucide-react';
import Modal from '../common/Modal';
import './QRCodeModal.css';

export const QRCodeModal = ({ isOpen, onClose, swipe }) => {
  if (!swipe) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} fullscreen>
      <div className="qr-modal-container">
        <div className="qr-modal-header">
          <h2 className="qr-modal-title">Ready to Use This Swipe?</h2>
          <p className="qr-modal-subtitle">Show this to dining hall staff</p>
        </div>
        
        <div className="qr-code-display">
          <QrCode className="qr-code-icon" />
        </div>
        
        <div className="qr-code-text">
          {swipe.code}
        </div>

        <div className="qr-modal-details">
          <div className="qr-detail-card">
            <div className="qr-detail-row">
              <Clock className="qr-detail-icon" />
              <span className="qr-detail-text">Valid until: {swipe.validUntil}</span>
            </div>
            <div className="qr-detail-row">
              <MapPin className="qr-detail-icon" />
              <span className="qr-detail-text">{swipe.location}</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="qr-close-button"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QRCodeModal;
