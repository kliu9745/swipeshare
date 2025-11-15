import React, { useState } from 'react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import MatchingOption from '../components/matching/MatchingOption';

export const TransferView = ({ onTransfer = null }) => {
  const [selectedCount, setSelectedCount] = useState(1);
  const [selectedValidity, setSelectedValidity] = useState('today');
  const [selectedHalls, setSelectedHalls] = useState('any');

  const handleAIMatch = () => {
    console.log('AI Matching initiated');
  };

  const handleManualTransfer = () => {
    console.log('Manual transfer initiated');
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Meal Swipe</h2>
        <p className="text-gray-600">Share a meal with another student</p>
      </div>

      <div className="space-y-4">
        {/* Number of Swipes */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            How many swipes?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => setSelectedCount(num)}
                className={`flex-1 py-3 border-2 rounded-xl font-semibold transition ${
                  selectedCount === num
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Valid Until */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Valid until:
          </label>
          <div className="space-y-2">
            {['today', 'week', 'month'].map(option => (
              <label 
                key={option}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition"
              >
                <input 
                  type="radio" 
                  name="validity" 
                  checked={selectedValidity === option}
                  onChange={() => setSelectedValidity(option)}
                  className="w-5 h-5 text-blue-600" 
                />
                <span className="font-medium text-gray-900">
                  {option === 'today' && 'Today only'}
                  {option === 'week' && 'This week'}
                  {option === 'month' && 'End of month'}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Dining Halls */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Which dining halls?
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition">
              <input 
                type="checkbox" 
                defaultChecked 
                className="w-5 h-5 text-blue-600 rounded" 
              />
              <span className="font-medium text-gray-900">Any dining hall</span>
            </label>
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
