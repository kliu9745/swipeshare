import React from 'react';
import { QrCode } from 'lucide-react';
import Modal from '../common/Modal';
import { Clock, MapPin } from 'lucide-react';

export const QRCodeModal = ({ isOpen, onClose, swipe }) => {
  if (!swipe) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} fullscreen>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-white">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Ready to Use This Swipe?</h2>
          <p className="text-gray-300">Show this to dining hall staff</p>
        </div>
        
        <div className="w-80 h-80 bg-white rounded-2xl flex items-center justify-center mb-6">
          <QrCode className="w-64 h-64 text-gray-800" />
        </div>
        
        <div className="font-mono text-xl font-bold mb-8">
          {swipe.code}
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Valid until: {swipe.validUntil}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">{swipe.location}</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full bg-white text-gray-900 rounded-xl py-4 font-bold hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default QRCodeModal;
