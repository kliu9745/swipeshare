import React from 'react';
import Card from '../common/Card';
import { Gift } from 'lucide-react';

export const MatchingOption = ({ onAIMatch, onManual }) => {
  return (
    <div className="space-y-4">
      {/* AI Matching */}
      <Card variant="gradient" className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 text-gray-900">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <Gift className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <div className="font-semibold">Let AI match me</div>
            <div className="text-sm text-gray-600">with someone who needs this most</div>
          </div>
        </div>
        <button 
          onClick={onAIMatch}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl py-4 font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center justify-center gap-2"
        >
          <Gift className="w-5 h-5" />
          Create Virtual Swipe
        </button>
      </Card>

      {/* Manual Transfer */}
      <div className="pt-4 border-t border-gray-200">
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Or enter recipient's email directly
        </label>
        <input
          type="email"
          placeholder="recipient@cornell.edu"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
        />
        <button 
          onClick={onManual}
          className="w-full mt-3 bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition"
        >
          Send Transfer
        </button>
      </div>
    </div>
  );
};

export default MatchingOption;
