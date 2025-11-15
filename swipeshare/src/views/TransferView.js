import React, { useState } from 'react';
import MatchingOption from '../components/matching/MatchingOption';
import { VALIDITY_OPTIONS, getAllDiningHalls } from '../utils/constants';
import './TransferView.css';

export const TransferView = ({ onTransfer = null }) => {
  const [selectedCount, setSelectedCount] = useState(1);
  const [selectedValidity, setSelectedValidity] = useState(VALIDITY_OPTIONS.TODAY.value);
  const [selectedHalls, setSelectedHalls] = useState(['any']);
  const diningHalls = getAllDiningHalls();

  const handleHallToggle = (hall) => {
    if (hall === 'any') {
      setSelectedHalls(['any']);
    } else {
      setSelectedHalls(prev => {
        const filtered = prev.filter(h => h !== 'any');
        if (filtered.includes(hall)) {
          return filtered.filter(h => h !== hall);
        }
        return [...filtered, hall];
      });
    }
  };

  const handleAIMatch = () => {
    console.log('AI Matching initiated');
  };

  const handleManualTransfer = () => {
    console.log('Manual transfer initiated');
  };

  return (
    <div className="transfer-view">
      <div className="transfer-header">
        <h2 className="transfer-title">Transfer Meal Swipe</h2>
        <p className="transfer-subtitle">Share a meal with another student</p>
      </div>

      <div className="transfer-form">
        {/* Number of Swipes */}
        <div className="form-section">
          <label className="form-label">How many swipes?</label>
          <div className="swipe-selector">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => setSelectedCount(num)}
                className={`swipe-button ${selectedCount === num ? 'swipe-button-selected' : ''}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Valid Until */}
        <div className="form-section">
          <label className="form-label">Valid until:</label>
          <div className="radio-group">
            {Object.values(VALIDITY_OPTIONS).map(option => (
              <label 
                key={option.value}
                className="radio-option"
              >
                <input 
                  type="radio" 
                  name="validity" 
                  checked={selectedValidity === option.value}
                  onChange={() => setSelectedValidity(option.value)}
                  className="radio-input" 
                />
                <span className="radio-label">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Dining Halls */}
        <div className="form-section">
          <label className="form-label">Which dining halls?</label>
          <div className="checkbox-group">
            <label className="checkbox-option">
              <input 
                type="checkbox" 
                checked={selectedHalls.includes('any')}
                onChange={() => handleHallToggle('any')}
                className="checkbox-input" 
              />
              <span className="checkbox-label">Any dining hall</span>
            </label>
            {diningHalls.map(hall => (
              <label key={hall} className="checkbox-option">
                <input 
                  type="checkbox" 
                  checked={selectedHalls.includes(hall)}
                  onChange={() => handleHallToggle(hall)}
                  className="checkbox-input" 
                />
                <span className="checkbox-label">{hall}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Matching Options */}
        <MatchingOption 
          onAIMatch={handleAIMatch}
          onManual={handleManualTransfer}
        />
      </div>
    </div>
  );
};

export default TransferView;
