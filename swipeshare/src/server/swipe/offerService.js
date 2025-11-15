/**
 * offerService.js
 * When users HAVE extra swipes and want to share them
 */

import { v4 as uuidv4 } from 'uuid';
import qrService from './qrService';
import matchingEngine from '../ai/matchingEngine';

class OfferService {
  constructor() {
    this.offers = []; // Available swipe offers
  }

  /**
   * User creates an offer (has swipes to give)
   * @param {string} userId
   * @param {Object} offerData
   * @returns {Object} - Created offer
   */
  createOffer(userId, offerData) {
    const offer = {
      id: uuidv4(),
      type: 'OFFER', // User HAS swipes
      
      // Owner info
      giverId: userId,
      giverName: offerData.giverName,
      
      // Offer details
      quantity: offerData.quantity,
      diningHalls: offerData.diningHalls || [], // empty = any
      mealTimes: offerData.mealTimes || [], // empty = any
      availableTimes: offerData.availableTimes || [],
      
      // Validity
      createdAt: new Date().toISOString(),
      expiresAt: offerData.expiresAt,
      
      // Status
      status: 'ACTIVE', // ACTIVE, MATCHED, COMPLETED, CANCELLED
      
      // Optional message
      message: offerData.message || '',
      reason: offerData.reason || '', // "Going home for weekend", etc.
      
      // Matching preferences
      matchingPreference: offerData.matchingPreference || 'AI_MATCH',
      // Options: 'AI_MATCH', 'FRIEND_ONLY', 'MANUAL_SELECT', 'FIRST_COME'
      
      // If FRIEND_ONLY or MANUAL_SELECT
      specificRecipients: offerData.specificRecipients || [], // Array of userIds
      
      // Tracking
      viewCount: 0,
      interestedUsers: [], // Users who clicked "interested"
      matchedWith: null, // UserId once matched
      
      // AI metadata (if AI matching used)
      aiGenerated: false,
      matchScore: null
    };

    this.offers.push(offer);
    return offer;
  }

  /**
   * Get all active offers (for requesters to browse)
   * @param {Object} filters - Optional filters
   * @returns {Array} - Filtered offers
   */
  getActiveOffers(filters = {}) {
    let offers = this.offers.filter(o => 
      o.status === 'ACTIVE' && 
      new Date(o.expiresAt) > new Date()
    );

    // Apply filters
    if (filters.diningHall) {
      offers = offers.filter(o => 
        o.diningHalls.length === 0 || 
        o.diningHalls.includes(filters.diningHall)
      );
    }

    if (filters.mealTime) {
      offers = offers.filter(o =>
        o.mealTimes.length === 0 ||
        o.mealTimes.includes(filters.mealTime)
      );
    }

    if (filters.minQuantity) {
      offers = offers.filter(o => o.quantity >= filters.minQuantity);
    }

    return offers;
  }

  /**
   * User expresses interest in an offer
   * @param {string} offerId
   * @param {string} userId
   * @returns {Object} - Updated offer
   */
  expressInterest(offerId, userId) {
    const offer = this.getOfferById(offerId);
    
    if (!offer) throw new Error('Offer not found');
    if (offer.giverId === userId) throw new Error('Cannot express interest in your own offer');
    
    if (!offer.interestedUsers.includes(userId)) {
      offer.interestedUsers.push({
        userId,
        timestamp: new Date().toISOString()
      });
      offer.viewCount++;
    }

    return offer;
  }

  /**
   * Giver accepts a specific requester
   * @param {string} offerId
   * @param {string} giverId - Must be the offer owner
   * @param {string} requesterId - User to give swipe to
   * @returns {Object} - Match result
   */
  acceptRequester(offerId, giverId, requesterId) {
    const offer = this.getOfferById(offerId);
    
    if (!offer) throw new Error('Offer not found');
    if (offer.giverId !== giverId) throw new Error('Unauthorized');
    if (offer.status !== 'ACTIVE') throw new Error('Offer is no longer active');

    // Mark as matched
    offer.status = 'MATCHED';
    offer.matchedWith = requesterId;
    offer.matchedAt = new Date().toISOString();

    return {
      offerId: offer.id,
      giverId,
      requesterId,
      quantity: offer.quantity,
      matchedAt: offer.matchedAt
    };
  }

  /**
   * Use AI to find best matches for this offer
   * @param {string} offerId
   * @param {Array} activeRequests - Current requests from requestService
   * @param {Array} userProfiles - User data
   * @returns {Promise<Array>} - AI-ranked matches
   */
  async findAIMatches(offerId, activeRequests, userProfiles) {
    const offer = this.getOfferById(offerId);
    
    if (!offer) throw new Error('Offer not found');
    if (offer.matchingPreference !== 'AI_MATCH') {
      throw new Error('AI matching not enabled for this offer');
    }

    // Use AI matching engine
    const matches = await matchingEngine.matchOfferToRequests(
      offer,
      activeRequests,
      userProfiles
    );

    offer.aiGenerated = true;
    offer.suggestedMatches = matches;

    return matches;
  }

  /**
   * Get offers for a specific user (as giver)
   * @param {string} userId
   * @returns {Object} - Categorized offers
   */
  getUserOffers(userId) {
    return {
      active: this.offers.filter(o => 
        o.giverId === userId && 
        o.status === 'ACTIVE'
      ),
      matched: this.offers.filter(o =>
        o.giverId === userId &&
        o.status === 'MATCHED'
      ),
      completed: this.offers.filter(o =>
        o.giverId === userId &&
        o.status === 'COMPLETED'
      )
    };
  }

  getOfferById(offerId) {
    return this.offers.find(o => o.id === offerId);
  }

  /**
   * Cancel an offer
   */
  cancelOffer(offerId, userId) {
    const offer = this.getOfferById(offerId);
    
    if (!offer) throw new Error('Offer not found');
    if (offer.giverId !== userId) throw new Error('Unauthorized');
    if (offer.status === 'MATCHED') {
      throw new Error('Cannot cancel - already matched. Contact recipient instead.');
    }

    offer.status = 'CANCELLED';
    offer.cancelledAt = new Date().toISOString();

    return offer;
  }
}

export default new OfferService();