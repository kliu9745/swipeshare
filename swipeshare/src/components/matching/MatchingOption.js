/**
 * MatchingOption.js
 * ENHANCED VERSION - Adds business logic to your existing UI
 */

import React, { useState } from 'react';
import { Gift, Loader } from 'lucide-react';
import './MatchingOption.css';

// Import services (frontend wrappers)
import offerService from '../../services/swipe/offerService';
import requestService from '../../services/swipe/requestService';
import matchingEngine from '../../services/ai/matchingEngine';
import userService from '../../services/user/userService';

export const MatchingOption = ({ 
  // Original props (keeping backward compatibility)
  onAIMatch, 
  onManual,
  
  // New props (optional - won't break existing usage)
  offerData = null,
  currentUser = null,
  onMatchesFound = null,
  onManualTransfer = null,
  onError = null
}) => {
  // New state (doesn't affect existing code)
  const [manualEmail, setManualEmail] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * Enhanced AI Match Handler
   * If new props provided, use enhanced logic
   * Otherwise, fall back to original onAIMatch callback
   */
  const handleAIMatch = async () => {
    // If using enhanced mode
    if (offerData && currentUser && onMatchesFound) {
      setLoading(true);
      
      try {
        const offer = offerService.createOffer(currentUser.id, {
          giverName: currentUser.name,
          quantity: offerData.quantity,
          diningHalls: offerData.diningHalls || [],
          expiresAt: offerData.expiresAt,
          reason: offerData.reason || '',
          matchingPreference: 'AI_MATCH'
        });

        let activeRequests = requestService.getActiveRequests();

        // Filter requests by offer criteria
        const offerExpiryTime = new Date(offerData.expiresAt).getTime();
        
        activeRequests = activeRequests.filter(request => {
          // 1. Quantity match: request quantity <= offer quantity
          if (request.quantity > offerData.quantity) {
            return false;
          }

          // 2. Dining hall match: if offer specifies halls, request must want at least one of them
          if (offerData.diningHalls && offerData.diningHalls.length > 0) {
            const hasCommonHall = request.preferredDiningHalls.length === 0 || 
              request.preferredDiningHalls.some(hall => offerData.diningHalls.includes(hall));
            if (!hasCommonHall) {
              return false;
            }
          }

          // 3. Time window match: request needed time must be before offer expiry
          const requestNeededTime = new Date(request.neededBy).getTime();
          if (requestNeededTime > offerExpiryTime) {
            return false;
          }

          return true;
        });

        if (activeRequests.length === 0) {
          if (onError) {
            onError('No matching requests found for these criteria. Your offer has been posted and will be visible to users who need swipes.');
          }
          setLoading(false);
          return;
        }

        const requesterIds = activeRequests.map(r => r.requesterId);
        const userProfiles = requesterIds.map(id => userService.getUserById(id));

        const matches = await matchingEngine.matchOfferToRequests(
          offer,
          activeRequests,
          userProfiles
        );

        const formattedMatches = matches.map(match => {
          const request = activeRequests.find(r => r.id === match.requestId);
          const user = userProfiles.find(u => u.id === request.requesterId);
          
          return {
            requestId: match.requestId,
            offerId: offer.id,
            userId: request.requesterId,
            name: request.requesterName,
            score: match.matchScore / 100,
            location: user?.location || 'Campus',
            needScore: calculateNeedScore(user),
            completionRate: user?.stats?.completionRate || 100,
            reasoning: match.reasoning,
            priority: match.priority,
            quantity: request.quantity
          };
        });

        // Ensure all matches are unique by requestId
        const uniqueMatches = [];
        const seenRequestIds = new Set();
        
        for (const match of formattedMatches) {
          if (!seenRequestIds.has(match.requestId)) {
            uniqueMatches.push(match);
            seenRequestIds.add(match.requestId);
          }
        }

        onMatchesFound(uniqueMatches, offer);
        
      } catch (error) {
        console.error('AI matching error:', error);
        if (onError) {
          onError(error.message || 'Failed to find matches. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    } 
    // Fall back to original behavior
    else if (onAIMatch) {
      onAIMatch();
    }
  };

  /**
   * Enhanced Manual Transfer Handler
   */
  const handleManualTransfer = async () => {
    // If using enhanced mode
    if (offerData && currentUser && onManualTransfer) {
      if (!manualEmail || !manualEmail.includes('@')) {
        if (onError) {
          onError('Please enter a valid email address');
        }
        return;
      }

      setLoading(true);

      try {
        const recipient = userService.getUserByEmail(manualEmail);
        
        if (!recipient) {
          if (onError) {
            onError('User not found. Make sure they have a SwipeShare account.');
          }
          setLoading(false);
          return;
        }

        if (recipient.id === currentUser.id) {
          if (onError) {
            onError('You cannot transfer swipes to yourself');
          }
          setLoading(false);
          return;
        }

        const offer = offerService.createOffer(currentUser.id, {
          giverName: currentUser.name,
          quantity: offerData.quantity,
          diningHalls: offerData.diningHalls || [],
          expiresAt: offerData.expiresAt,
          reason: offerData.reason || '',
          matchingPreference: 'MANUAL_SELECT',
          specificRecipients: [recipient.id]
        });

        onManualTransfer({
          offer,
          recipient,
          manualTransfer: true
        });

      } catch (error) {
        console.error('Manual transfer error:', error);
        if (onError) {
          onError(error.message || 'Failed to create transfer');
        }
      } finally {
        setLoading(false);
      }
    }
    // Fall back to original behavior
    else if (onManual) {
      onManual();
    }
  };

  /**
   * Helper: Calculate need score
   */
  const calculateNeedScore = (user) => {
    if (!user) return 5;
    
    let score = 0;
    if (!user.needProfile?.hasMealPlan) score += 5;
    
    const freq = user.needProfile?.requestFrequency || 0;
    if (freq > 5) score += 3;
    else if (freq > 2) score += 2;
    else if (freq > 0) score += 1;
    
    const received = user.stats?.swipesReceived || 0;
    if (received < 3) score += 2;
    
    return Math.min(10, score);
  };

  // ==========================================
  // YOUR ORIGINAL JSX - 100% UNCHANGED
  // Just added loading states and email input binding
  // ==========================================
  return (
    <div className="matching-option">
      {/* AI Matching */}
      <div className="ai-matching-card">
        <div className="ai-matching-header">
          <div className="ai-icon-wrapper">
            {loading ? (
              <Loader className="ai-icon" style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Gift className="ai-icon" />
            )}
          </div>
          <div>
            <div className="ai-title">Let AI match me</div>
            <div className="ai-subtitle">with someone who needs this most</div>
          </div>
        </div>
        <button 
          onClick={handleAIMatch}
          className="ai-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="ai-button-icon" style={{ animation: 'spin 1s linear infinite' }} />
              Finding matches...
            </>
          ) : (
            <>
              <Gift className="ai-button-icon" />
              Create Virtual Swipe
            </>
          )}
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
          value={manualEmail}
          onChange={(e) => setManualEmail(e.target.value)}
          disabled={loading}
        />
        <button 
          onClick={handleManualTransfer}
          className="manual-button"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Send Transfer'}
        </button>
      </div>
    </div>
  );
};

export default MatchingOption;