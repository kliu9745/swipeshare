
import React, { useState } from 'react';
import MatchingOption from '../components/matching/MatchingOption';
import { VALIDITY_OPTIONS, getAllDiningHalls } from '../utils/constants';
import './TransferView.css';
import './TransferView-results.css';

// export const TransferView = ({ onTransfer = null, currentUser = null }) => {
//   const [selectedCount, setSelectedCount] = useState(1);
//   const [selectedValidity, setSelectedValidity] = useState(VALIDITY_OPTIONS.TODAY.value);
//   const [selectedHalls, setSelectedHalls] = useState(['any']);
//   const diningHalls = getAllDiningHalls();

//   // UI state
//   const [matches, setMatches] = useState(null);
//   const [currentOffer, setCurrentOffer] = useState(null);
//   const [transferResult, setTransferResult] = useState(null);
//   const [error, setError] = useState(null);

//   const handleHallToggle = (hall) => {
//     if (hall === 'any') {
//       setSelectedHalls(['any']);
//     } else {
//       setSelectedHalls(prev => {
//         const filtered = prev.filter(h => h !== 'any');
//         if (filtered.includes(hall)) {
//           return filtered.filter(h => h !== hall);
//         }
//         return [...filtered, hall];
//       });
//     }
//   };

//   const calculateExpiryDate = () => {
//     const now = new Date();
//     switch(selectedValidity) {
//       case 'today': now.setHours(23, 59, 59); break;
//       case 'week': now.setDate(now.getDate() + 7); break;
//       case 'month': now.setMonth(now.getMonth() + 1); break;
//       default: now.setHours(23, 59, 59);
//     }
//     return now.toISOString();
//   };

//   const prepareOfferData = () => ({
//     quantity: selectedCount,
//     diningHalls: selectedHalls.includes('any') ? [] : selectedHalls,
//     expiresAt: calculateExpiryDate(),
//     reason: '',
//     validUntil: selectedValidity
//   });

//   const handleAIMatch = () => {
//     // For now: create dummy AI matches immediately
//     const dummyMatches = [
//       { id: 'u1', name: 'Alice', matchScore: 0.95 },
//       { id: 'u2', name: 'Bob', matchScore: 0.89 },
//     ];
//     const offer = prepareOfferData();
//     setMatches(dummyMatches);
//     setCurrentOffer(offer);
//   };

//   const handleManualTransferComplete = (data) => {
//     setTransferResult({
//       transfer: data.offer,
//       recipient: data.recipient,
//       manualTransfer: true
//     });
//   };

//   const handleTransferComplete = (result) => {
//     setTransferResult(result);
//     if (onTransfer) onTransfer(result);
//   };

//   const handleError = (errorMsg) => {
//     setError(errorMsg);
//     setTimeout(() => setError(null), 5000);
//   };

//   const handleReset = () => {
//     setSelectedCount(1);
//     setSelectedValidity('today');
//     setSelectedHalls(['any']);
//     setMatches(null);
//     setCurrentOffer(null);
//     setTransferResult(null);
//     setError(null);
//   };

//   return (
//     <div className="transfer-view">
//       {error && (
//         <div className="error-toast">
//           <span>⚠️ {error}</span>
//           <button onClick={() => setError(null)}>×</button>
//         </div>
//       )}

//       <div className="transfer-header">
//         <h2>Transfer Meal Swipe</h2>
//         <p>Share a meal with another student</p>
//       </div>

//       {/* Form */}
//       <div className="transfer-form">
//         {/* Number of Swipes */}
//         <div className="form-section">
//           <label>How many swipes?</label>
//           <div className="swipe-selector">
//             {[1,2,3,4,5].map(num => (
//               <button
//                 key={num}
//                 onClick={() => setSelectedCount(num)}
//                 className={selectedCount === num ? 'swipe-button-selected' : ''}
//               >{num}</button>
//             ))}
//           </div>
//         </div>

//         {/* Validity */}
//         <div className="form-section">
//           <label>Valid until:</label>
//           <div className="radio-group">
//             {Object.values(VALIDITY_OPTIONS).map(option => (
//               <label key={option.value}>
//                 <input
//                   type="radio"
//                   checked={selectedValidity === option.value}
//                   onChange={() => setSelectedValidity(option.value)}
//                 />
//                 {option.label}
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Dining Halls */}
//         <div className="form-section">
//           <label>Which dining halls?</label>
//           <div className="checkbox-group">
//             <label>
//               <input
//                 type="checkbox"
//                 checked={selectedHalls.includes('any')}
//                 onChange={() => handleHallToggle('any')}
//               />
//               Any
//             </label>
//             {diningHalls.map(hall => (
//               <label key={hall}>
//                 <input
//                   type="checkbox"
//                   checked={selectedHalls.includes(hall)}
//                   onChange={() => handleHallToggle(hall)}
//                   disabled={selectedHalls.includes('any')}
//                 />
//                 {hall}
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Matching Options directly on same page */}
//         <div className="transfer-actions">
//           <button className="primary-button" onClick={handleAIMatch}>
//             Let AI find matches
//           </button>
//         </div>

//         {matches && currentOffer && (
//           <MatchResult
//             matches={matches}
//             offer={currentOffer}
//             currentUser={currentUser}
//             onTransferComplete={handleTransferComplete}
//             onError={handleError}
//             isLoading={false}
//           />
//         )}
//       </div>

//       {transferResult && (
//         <div className="success-screen">
//           <h2>Transfer Complete!</h2>
//           <p>
//             Swipe sent to <strong>{transferResult.recipient?.name || 'recipient'}</strong>
//           </p>
//           <button onClick={handleReset}>Transfer More</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TransferView;


// import React, { useState } from 'react';
// import MatchingOption from '../components/matching/MatchingOption';
// import MatchResult from '../components/matching/MatchResult';
// import { VALIDITY_OPTIONS, getAllDiningHalls } from '../utils/constants';
// import './TransferView.css';

export const TransferView = ({ onTransfer = null, currentUser = null, onMatchSelected = null }) => {
  const [selectedCount, setSelectedCount] = useState(1);
  const [selectedValidity, setSelectedValidity] = useState(VALIDITY_OPTIONS.TODAY.value);
  const [selectedHalls, setSelectedHalls] = useState(['any']);
  const diningHalls = getAllDiningHalls();

  // UI state
  const [currentStep, setCurrentStep] = useState('form'); // 'form', 'results', 'success'
  const [matches, setMatches] = useState(null);
  const [currentOffer, setCurrentOffer] = useState(null);
  const [transferResult, setTransferResult] = useState(null);
  const [error, setError] = useState(null);

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

  // Calculate expiration date based on validity option
  const calculateExpiryDate = () => {
    const now = new Date();
    
    switch(selectedValidity) {
      case 'today':
        now.setHours(23, 59, 59);
        return now.toISOString();
      case 'week':
        now.setDate(now.getDate() + 7);
        return now.toISOString();
      case 'month':
        now.setMonth(now.getMonth() + 1);
        return now.toISOString();
      default:
        now.setHours(23, 59, 59);
        return now.toISOString();
    }
  };


  // Prepare offer data for matching
  const prepareOfferData = () => {
    return {
      quantity: selectedCount,
      diningHalls: selectedHalls.includes('any') ? [] : selectedHalls,
      expiresAt: calculateExpiryDate(),
      reason: '', // Could add optional reason field
      validUntil: selectedValidity
    };
  };

  /**
   * Handle AI matching - Move to matching step
   */
  const handleAIMatch = () => {
    console.log('AI Matching initiated');
    console.log('Offer data:', prepareOfferData());
    
    setCurrentStep('matching');
  };

  const handleManualTransfer = () => {
    console.log('Manual transfer initiated');
  };

  /**
   * Handle when AI finds matches
   */
  const handleMatchesFound = (matchResults, offer) => {
    console.log('✅ Matches found:', matchResults);
    setMatches(matchResults);
    setCurrentOffer(offer);
    setCurrentStep('results');
  };

  /**
   * Handle manual transfer selection
   */
  const handleManualTransferComplete = (data) => {
    console.log('✅ Manual transfer:', data);
    // Could skip matching and go straight to success
    setTransferResult({
      transfer: data.offer,
      recipient: data.recipient,
      manualTransfer: true
    });
    setCurrentStep('success');
  };

  /**
   * Handle transfer completion - currently not used, kept for compatibility
   */
  // const handleTransferComplete = (result) => {
  //   console.log('✅ Transfer complete:', result);
  //   setTransferResult(result);
  //   setCurrentStep('success');
  //   
  //   // Notify parent component (API-preserving prop is `onTransfer`)
  //   if (onTransfer) {
  //     onTransfer(result);
  //   }
  // };

  /**
   * Handle errors
   */
  const handleError = (errorMsg) => {
    console.error('❌ Error:', errorMsg);
    setError(errorMsg);
    
    // Clear error after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  /**
   * Reset form
   */
  const handleReset = () => {
    setSelectedCount(1);
    setSelectedValidity('today');
    setSelectedHalls(['any']);
    setCurrentStep('form');
    setMatches(null);
    setCurrentOffer(null);
    setTransferResult(null);
    setError(null);
  };


  return (
    <div className="transfer-view">
      {/* Error Toast */}
      {error && (
        <div className="error-toast">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button 
              className="error-close"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Step 1: Form */}
      {currentStep === 'form' && (
        <>
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
                      disabled={selectedHalls.includes('any')}
                      className="checkbox-input" 
                    />
                    <span className="checkbox-label">{hall}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Matching Options - Moved from Step 2 */}
            <div className="form-section">
              <label className="form-label">Choose how to share</label>
              <MatchingOption 
                offerData={prepareOfferData()}
                currentUser={currentUser}
                onMatchesFound={handleMatchesFound}
                onManualTransfer={handleManualTransferComplete}
                onError={handleError}
                onAIMatch={handleAIMatch}
                onManual={handleManualTransfer}
              />
            </div>
          </div>
        </>
      )}

      {/* Step 2: Match Results */}
      {currentStep === 'results' && matches && currentOffer && (
        <>
          <div className="transfer-header">
            <h2 className="transfer-title">Recommendations</h2>
            <p className="transfer-subtitle">
              {matches.length} perfect match{matches.length !== 1 ? 'es' : ''} for you
            </p>
          </div>

          <div className="match-results-container">
            {matches.map((match, index) => (
              <div key={index} className="match-card">
                <div className="match-card-top">
                  <div className="match-header">
                    <h3 className="match-name">{match.name}</h3>
                    <div className="match-score-badge">{Math.round(match.score * 100)}%</div>
                  </div>
                </div>

                <div className="match-details-grid">
                  <div className="detail-item">
                    <span className="detail-label">📍 Location</span>
                    <span className="detail-value">{match.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">🎯 Need Level</span>
                    <span className="detail-value">{match.needScore}/10</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">✓ Reliability</span>
                    <span className="detail-value">{match.completionRate}%</span>
                  </div>
                </div>

                <button 
                  className="select-match-button"
                  onClick={() => {
                    // Create incoming swipe record for current user
                    const newSwipe = {
                      id: `swipe_${Date.now()}`,
                      donorId: currentUser?.id || 'user_001',
                      donor: currentUser?.name || 'Anonymous',
                      recipientId: match.userId,
                      recipient: match.name,
                      code: `SWIPE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
                      validUntil: currentOffer?.expiresAt || 'Today',
                      location: currentOffer?.diningHalls?.[0] || 'Any dining hall',
                      message: `Virtual swipe shared with you! ${match.reasoning}`,
                      hoursLeft: 8,
                      status: 'pending',
                      createdAt: new Date().toLocaleString(),
                      expiresAt: currentOffer?.expiresAt || new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
                      quantity: match.quantity
                    };
                    
                    // Call parent to add to incoming swipes and navigate
                    if (onMatchSelected) {
                      onMatchSelected(newSwipe);
                    }
                  }}
                >
                  Send to {match.name}
                </button>
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button 
              className="exit-button"
              onClick={() => {
                // Exit back to home
                setCurrentStep('form');
                setMatches(null);
                setCurrentOffer(null);
                // Could navigate to home here if we had access to navigation
              }}
            >
              Exit & Back to Home
            </button>
          </div>
        </>
      )}

      {/* Step 3: Success Screen */}
      {currentStep === 'success' && transferResult && (
        <div className="success-screen">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Transfer Complete!</h2>
          <p className="success-subtitle">
            Your swipe has been sent to{' '}
            <strong>{transferResult.recipient?.name || 'recipient'}</strong>
          </p>

          {!transferResult.manualTransfer && transferResult.displayCode && (
            <div className="qr-code-section">
              <p className="qr-label">Transfer Code:</p>
              <div className="qr-code-display">
                {transferResult.displayCode}
              </div>
              <p className="qr-instructions">
                The recipient can use this code at any dining hall
              </p>
            </div>
          )}

          <div className="success-actions">
            <button 
              className="primary-button"
              onClick={handleReset}
            >
              Transfer More Swipes
            </button>
            <button 
              className="secondary-button"
              onClick={() => window.history.back()}
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferView;










//   return (
//     <div className="transfer-view">
//       <div className="transfer-header">
//         <h2 className="transfer-title">Transfer Meal Swipe</h2>
//         <p className="transfer-subtitle">Share a meal with another student</p>
//       </div>

//       <div className="transfer-form">
//         {/* Number of Swipes */}
//         <div className="form-section">
//           <label className="form-label">How many swipes?</label>
//           <div className="swipe-selector">
//             {[1, 2, 3, 4, 5].map(num => (
//               <button
//                 key={num}
//                 onClick={() => setSelectedCount(num)}
//                 className={`swipe-button ${selectedCount === num ? 'swipe-button-selected' : ''}`}
//               >
//                 {num}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Valid Until */}
//         <div className="form-section">
//           <label className="form-label">Valid until:</label>
//           <div className="radio-group">
//             {Object.values(VALIDITY_OPTIONS).map(option => (
//               <label 
//                 key={option.value}
//                 className="radio-option"
//               >
//                 <input 
//                   type="radio" 
//                   name="validity" 
//                   checked={selectedValidity === option.value}
//                   onChange={() => setSelectedValidity(option.value)}
//                   className="radio-input" 
//                 />
//                 <span className="radio-label">
//                   {option.label}
//                 </span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Dining Halls */}
//         <div className="form-section">
//           <label className="form-label">Which dining halls?</label>
//           <div className="checkbox-group">
//             <label className="checkbox-option">
//               <input 
//                 type="checkbox" 
//                 checked={selectedHalls.includes('any')}
//                 onChange={() => handleHallToggle('any')}
//                 className="checkbox-input" 
//               />
//               <span className="checkbox-label">Any dining hall</span>
//             </label>
//             {diningHalls.map(hall => (
//               <label key={hall} className="checkbox-option">
//                 <input 
//                   type="checkbox" 
//                   checked={selectedHalls.includes(hall)}
//                   onChange={() => handleHallToggle(hall)}
//                   className="checkbox-input" 
//                 />
//                 <span className="checkbox-label">{hall}</span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Matching Options */}
//         <MatchingOption 
//           onAIMatch={handleAIMatch}
//           onManual={handleManualTransfer}
//         />
//       </div>
//     </div>
//   );
// };

// export default TransferView;
