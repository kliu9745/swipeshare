import React from 'react';
import { Gift } from 'lucide-react';
import './MatchingOption.css';

export const MatchingOption = ({ onAIMatch, onManual }) => {
  return (
    <div className="matching-option">
      {/* AI Matching */}
      <div className="ai-matching-card">
        <div className="ai-matching-header">
          <div className="ai-icon-wrapper">
            <Gift className="ai-icon" />
          </div>
          <div>
            <div className="ai-title">Let AI match me</div>
            <div className="ai-subtitle">with someone who needs this most</div>
          </div>
        </div>
        <button 
          onClick={onAIMatch}
          className="ai-button"
        >
          <Gift className="ai-button-icon" />
          Create Virtual Swipe
        </button>
      </div>

      {/* Manual Transfer */}
      <div className="manual-section">
        <label className="manual-label">
          Or enter recipient's email directly
        </label>
        <input
          type="email"
          placeholder="recipient@cornell.edu"
          className="manual-input"
        />
        <button 
          onClick={onManual}
          className="manual-button"
        >
          Send Transfer
        </button>
      </div>
    </div>
  );
};

export default MatchingOption;
