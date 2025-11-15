/**
 * requestService.js
 * Handle requests (users needing swipes)
 */

// ... (keeping most of createRequest the same)

/**
 * Mark request as fulfilled (swipe received)
 */
markAsFulfilled(requestId, giverId, quantity) {
  const request = this.getRequestById(requestId);
  
  if (!request) throw new Error('Request not found');

  // Deduct quantity
  request.quantity -= quantity;

  // If fully fulfilled, mark as complete
  if (request.quantity <= 0) {
    request.status = 'FULFILLED';
    request.fulfilledAt = new Date().toISOString();
    request.fulfilledBy = giverId;
  } else {
    // Partially fulfilled, still active
    request.status = 'ACTIVE';
  }

  // Track who gave swipes
  if (!request.fulfillmentHistory) {
    request.fulfillmentHistory = [];
  }

  request.fulfillmentHistory.push({
    giverId,
    quantity,
    timestamp: new Date().toISOString()
  });

  return request;
}

/**
 * Reactivate request (if transfer cancelled)
 */
reactivateRequest(requestId) {
  const request = this.getRequestById(requestId);
  
  if (!request) throw new Error('Request not found');

  request.status = 'ACTIVE';
  
  return request;
}