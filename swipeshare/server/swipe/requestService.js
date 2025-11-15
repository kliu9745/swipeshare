/**
 * requestService.js
 * Handle requests (users needing swipes)
 */

import { v4 as uuidv4 } from 'uuid';
import matchingEngine from '../ai/matchingEngine';

class RequestService {
  constructor() {
    this.requests = [];
  }

  /**
   * User creates a request (needs swipes)
   * @param {string} userId
   * @param {Object} requestData
   * @returns {Object} - Created request
   */
  createRequest(userId, requestData) {
    const request = {
      id: uuidv4(),
      type: 'REQUEST', // User NEEDS swipes
      
      // Owner info
      requesterId: userId,
      requesterName: requestData.requesterName,
      
      // Request details
      quantity: requestData.quantity,
      preferredDiningHalls: requestData.preferredDiningHalls || [], // empty = any
      mealTime: requestData.mealTime || 'any', // "breakfast", "lunch", "dinner", "any"
      neededBy: requestData.neededBy, // Timestamp
      
      // Status
      status: 'ACTIVE', // ACTIVE, FULFILLED, EXPIRED, CANCELLED
      createdAt: new Date().toISOString(),
      
      // Urgency
      urgency: requestData.urgency || 'MEDIUM', // LOW, MEDIUM, HIGH
      
      // Optional context
      reason: requestData.reason || '', // "Ran out of swipes", "Emergency"
      message: requestData.message || '',
      
      // Matching preferences
      matchingPreference: requestData.matchingPreference || 'AI_MATCH',
      // Options: 'AI_MATCH', 'FRIEND_ONLY', 'BROWSE_ALL'
      
      // If requesting from specific friend
      targetGiverId: requestData.targetGiverId || null,
      
      // Tracking
      viewCount: 0,
      potentialGivers: [], // Users who viewed/expressed interest
      fulfilledBy: null, // UserId once fulfilled
      fulfillmentHistory: [], // Track partial fulfillments
      
      // AI metadata
      aiGenerated: false,
      matchScore: null,
      suggestedMatches: null
    };

    this.requests.push(request);
    return request;
  }

  /**
   * Get all active requests (for givers to browse)
   * @param {Object} filters - Optional filters
   * @returns {Array} - Filtered requests
   */
  getActiveRequests(filters = {}) {
    let requests = this.requests.filter(r =>
      r.status === 'ACTIVE' &&
      new Date(r.neededBy) > new Date()
    );

    // Apply filters
    if (filters.diningHall) {
      requests = requests.filter(r =>
        r.preferredDiningHalls.length === 0 ||
        r.preferredDiningHalls.includes(filters.diningHall)
      );
    }

    if (filters.urgency) {
      requests = requests.filter(r => r.urgency === filters.urgency);
    }

    if (filters.mealTime) {
      requests = requests.filter(r => 
        r.mealTime === 'any' || 
        r.mealTime === filters.mealTime
      );
    }

    if (filters.maxQuantity) {
      requests = requests.filter(r => r.quantity <= filters.maxQuantity);
    }

    return requests;
  }

  /**
   * Giver responds to a request (expresses interest)
   * @param {string} requestId
   * @param {string} giverId
   * @returns {Object} - Updated request
   */
  expressInterest(requestId, giverId) {
    const request = this.getRequestById(requestId);
    
    if (!request) throw new Error('Request not found');
    if (request.requesterId === giverId) {
      throw new Error('Cannot respond to your own request');
    }
    if (request.status !== 'ACTIVE') {
      throw new Error('Request is no longer active');
    }

    // Add to interested givers if not already there
    if (!request.potentialGivers.find(g => g.userId === giverId)) {
      request.potentialGivers.push({
        userId: giverId,
        timestamp: new Date().toISOString()
      });
      request.viewCount++;
    }

    return request;
  }

  /**
   * Requester accepts a specific giver's offer
   * @param {string} requestId
   * @param {string} requesterId - Must be the request owner
   * @param {string} giverId - User offering swipe
   * @returns {Object} - Match result
   */
  acceptGiver(requestId, requesterId, giverId) {
    const request = this.getRequestById(requestId);
    
    if (!request) throw new Error('Request not found');
    if (request.requesterId !== requesterId) {
      throw new Error('Unauthorized: You do not own this request');
    }
    if (request.status !== 'ACTIVE') {
      throw new Error('Request is no longer active');
    }

    // Mark as fulfilled
    request.status = 'FULFILLED';
    request.fulfilledBy = giverId;
    request.fulfilledAt = new Date().toISOString();

    return {
      requestId: request.id,
      requesterId,
      giverId,
      quantity: request.quantity,
      fulfilledAt: request.fulfilledAt
    };
  }

  /**
   * Use AI to find best offers for this request
   * @param {string} requestId
   * @param {Array} activeOffers - Current offers from offerService
   * @param {Array} userProfiles
   * @returns {Promise<Array>} - AI-ranked offers
   */
  async findAIMatches(requestId, activeOffers, userProfiles) {
    const request = this.getRequestById(requestId);
    
    if (!request) throw new Error('Request not found');
    if (request.matchingPreference !== 'AI_MATCH') {
      throw new Error('AI matching not enabled for this request');
    }

    // Use AI matching engine (reverse direction)
    const matches = await matchingEngine.matchRequestToOffers(
      request,
      activeOffers,
      userProfiles
    );

    request.aiGenerated = true;
    request.suggestedMatches = matches;

    return matches;
  }

  /**
   * Get requests for a specific user (as requester)
   * @param {string} userId
   * @returns {Object} - Categorized requests
   */
  getUserRequests(userId) {
    return {
      active: this.requests.filter(r =>
        r.requesterId === userId &&
        r.status === 'ACTIVE'
      ),
      fulfilled: this.requests.filter(r =>
        r.requesterId === userId &&
        r.status === 'FULFILLED'
      ),
      expired: this.requests.filter(r =>
        r.requesterId === userId &&
        r.status === 'EXPIRED'
      ),
      cancelled: this.requests.filter(r =>
        r.requesterId === userId &&
        r.status === 'CANCELLED'
      ),
      all: this.requests.filter(r => r.requesterId === userId)
    };
  }

  /**
   * Mark request as fulfilled (swipe received)
   * Called by transferService when transfer is created
   * @param {string} requestId
   * @param {string} giverId
   * @param {number} quantity
   * @returns {Object} - Updated request
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
   * @param {string} requestId
   * @returns {Object} - Updated request
   */
  reactivateRequest(requestId) {
    const request = this.getRequestById(requestId);
    
    if (!request) throw new Error('Request not found');

    request.status = 'ACTIVE';
    
    return request;
  }

  /**
   * Cancel a request
   * @param {string} requestId
   * @param {string} userId
   * @param {string} reason - Optional cancellation reason
   * @returns {Object} - Cancelled request
   */
  cancelRequest(requestId, userId, reason = '') {
    const request = this.getRequestById(requestId);
    
    if (!request) throw new Error('Request not found');
    if (request.requesterId !== userId) {
      throw new Error('Unauthorized: You do not own this request');
    }
    if (request.status === 'FULFILLED') {
      throw new Error('Cannot cancel - request already fulfilled');
    }

    request.status = 'CANCELLED';
    request.cancelledAt = new Date().toISOString();
    request.cancellationReason = reason;

    return request;
  }

  /**
   * Mark expired requests
   * Run periodically to clean up old requests
   */
  markExpiredRequests() {
    const now = new Date();
    
    this.requests.forEach(request => {
      if (
        request.status === 'ACTIVE' &&
        new Date(request.neededBy) < now
      ) {
        request.status = 'EXPIRED';
        request.expiredAt = now.toISOString();
      }
    });
  }

  /**
   * Get request by ID
   * @param {string} requestId
   * @returns {Object|undefined}
   */
  getRequestById(requestId) {
    return this.requests.find(r => r.id === requestId);
  }

  /**
   * Get request statistics
   * @returns {Object}
   */
  getStats() {
    return {
      total: this.requests.length,
      active: this.requests.filter(r => r.status === 'ACTIVE').length,
      fulfilled: this.requests.filter(r => r.status === 'FULFILLED').length,
      expired: this.requests.filter(r => r.status === 'EXPIRED').length,
      cancelled: this.requests.filter(r => r.status === 'CANCELLED').length,
      avgQuantity: this.requests.length > 0
        ? this.requests.reduce((sum, r) => sum + r.quantity, 0) / this.requests.length
        : 0,
      highUrgency: this.requests.filter(r => 
        r.urgency === 'HIGH' && r.status === 'ACTIVE'
      ).length
    };
  }

  /**
   * Search requests
   * @param {string} searchQuery
   * @returns {Array}
   */
  searchRequests(searchQuery) {
    const query = searchQuery.toLowerCase();
    
    return this.requests.filter(r =>
      r.requesterName.toLowerCase().includes(query) ||
      r.reason.toLowerCase().includes(query) ||
      r.message.toLowerCase().includes(query) ||
      r.preferredDiningHalls.some(hall => hall.toLowerCase().includes(query))
    );
  }
}

export default new RequestService();