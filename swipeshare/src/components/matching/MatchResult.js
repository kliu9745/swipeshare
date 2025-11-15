/**
 * MatchResult.js
 */

import React, { useState } from 'react';
import Card from '../common/Card';

// Import services
import transferService from '../../services/swipe/transferService';

export const MatchResult = ({ 
  // Original props (keeping backward compatibility)
  matches, 
  onSelectMatch, 
  isLoading = false,
  
  // New props (optional - won't break existing usage)
  offer = null,
  currentUser = null,
  onTransferComplete = null,
  onError = null
}) => {
  // New state (doesn't affect existing code)
  const [transferring, setTransferring] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);

  /**
   * Enhanced Match Selection Handler
   * If new props provided, use enhanced logic
   * Otherwise, fall back to original onSelectMatch callback
   */
  const handleSelectMatch = async (match, index) => {
    // If using enhanced mode
    if (offer && currentUser && onTransferComplete) {
      setSelectedMatch(match.requestId);
      setTransferring(true);

      try {
        const transfer = await transferService.createTransfer(
          currentUser.id,
          match.userId,
          {
            offerId: match.offerId,
            requestId: match.requestId,
            quantity: Math.min(offer.quantity, match.quantity),
            diningHall: offer.diningHalls[0] || 'ANY',
            matchScore: match.score * 100
          }
        );

        onTransferComplete({
          transfer,
          recipient: {
            name: match.name,
            userId: match.userId
          },
          qrCode: transfer.qrCode,
          displayCode: transfer.displayCode
        });

      } catch (error) {
        console.error('Transfer error:', error);
        if (onError) {
          onError(error.message || 'Failed to create transfer');
        }
        setSelectedMatch(null);
      } finally {
        setTransferring(false);
      }
    }
    // Fall back to original behavior
    else if (onSelectMatch) {
      onSelectMatch(match);
    }
  };

  // ==========================================
  // YOUR ORIGINAL JSX - 100% UNCHANGED
  // Just added loading indicators
  // ==========================================

  if (isLoading) {
    return (
      <Card className="text-center py-8">
        <div className="animate-spin w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Finding the best match...</p>
      </Card>
    );
  }

  if (!matches || matches.length === 0) {
    return (
      <Card className="text-center py-8">
        <p className="text-gray-600">No matches found at this time.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">AI Recommended Matches</h3>
      {matches.map((match, index) => {
        const isSelected = selectedMatch === match.requestId;
        const isTransferring = transferring && isSelected;

        return (
          <Card 
            key={index}
            variant="bordered"
            onClick={() => !transferring && handleSelectMatch(match, index)}
            className={`cursor-pointer hover:border-blue-400 ${
              isTransferring ? 'border-blue-500 bg-blue-50' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-semibold text-gray-900">{match.name}</div>
                <div className="text-sm text-gray-500">Match Score: {(match.score * 100).toFixed(0)}%</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{(match.score * 100).toFixed(0)}%</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>📍 {match.location}</p>
              <p>🎯 Need Level: {match.needScore}/10</p>
              <p>✓ Reliability: {match.completionRate}%</p>
            </div>
            <button className="text-blue-600 text-sm font-semibold mt-3 hover:text-blue-700">
              {isTransferring ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  Creating transfer...
                </span>
              ) : (
                `Transfer to ${match.name} →`
              )}
            </button>
          </Card>
        );
      })}
    </div>
  );
};

export default MatchResult;
