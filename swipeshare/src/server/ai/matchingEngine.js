/**
 * MatchingEngine
 * Uses Claude to intelligently match swipe donors with recipients
 */

import claudeService from './claudeService';
import { buildMatchingPrompt } from './prompts';


// this class handles matching logic between swipe offers and requests, based on user profiles and preferences
class MatchingEngine {
  
  /**
   * Match a swipe offer with potential recipients
   * @param {Object} offer - The swipe offer
   * @param {Array} requests - Array of active requests
   * @param {Array} userProfiles - User data for context
   * @returns {Promise<Array>} - Ranked list of matches with scores
   */
    async matchOfferToRequests(offer, requests, userProfiles) {
    // If no requests, return empty
    if (!requests || requests.length === 0) {
      return [];
    }

    try {
      // Build comprehensive prompt
      const prompt = buildMatchingPrompt(offer, requests, userProfiles);
      
      // Call Claude
      const response = await claudeService.callClaude(prompt, 2000);
      
      // Parse JSON response
      const matches = claudeService.parseJSONResponse(response);
      
      // Validate and sort matches
      return this.validateMatches(matches, requests);
      
    } catch (error) {
      console.error('AI matching failed, using fallback:', error);
      // Fallback to rule-based matching
      return this.fallbackMatching(offer, requests, userProfiles);
    }
  }

  /**
   * Match a request with available offers
   * @param {Object} request - The swipe request
   * @param {Array} offers - Array of available offers
   * @param {Array} userProfiles - User data for context
   * @returns {Promise<Array>} - Ranked list of offers
   */
  async matchRequestToOffers(request, offers, userProfiles) {
    if (!offers || offers.length === 0) {
      return [];
    }

    try {
      const prompt = this.buildRequestMatchingPrompt(request, offers, userProfiles);
      const response = await claudeService.callClaude(prompt, 1500);
      const matches = claudeService.parseJSONResponse(response);
      
      return this.validateMatches(matches, offers);
      
    } catch (error) {
      console.error('Request matching failed:', error);
      return this.fallbackOfferMatching(request, offers, userProfiles);
    }
  }


  /**
   * Validate AI matches against actual data
   * @param {Array} matches - AI-generated matches
   * @param {Array} items - Actual requests/offers
   * @returns {Array} - Validated matches
   */
  validateMatches(matches, items) {
    if (!Array.isArray(matches)) {
      throw new Error('Invalid match format from AI');
    }

    return matches
      .filter(match => {
        // Ensure match references valid item
        return items.some(item => item.id === match.id || item.id === match.requestId);
      })
      .map(match => ({
        ...match,
        matchScore: Math.min(100, Math.max(0, match.matchScore || 0))
      }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10); // Return top 10 matches
  }


  /**
   * Rule-based fallback matching for offers -> requests (if AI fails)
   * @param {Object} offer
   * @param {Array} requests
   * @param {Array} userProfiles
   * @returns {Array} - Simple sorted matches
   */
    fallbackOfferMatching(offer, requests, userProfiles) {
    // Simple rule-based matching
        return requests.map(request => {
        const user = userProfiles.find(u => u.id === request.requesterId);
        let score = 50;
        
        if (!user?.hasMealPlan) score += 20;
        if (request.urgency === 'HIGH') score += 15;
        if (offer.diningHalls.length === 0 || offer.diningHalls.includes(request.preferredDiningHalls[0])) score += 15;
        
        return {
            requestId: request.id,
            matchScore: score,
            reasoning: 'Fallback matching',
            priority: score > 70 ? 'high' : 'medium'
        };
        }).sort((a, b) => b.matchScore - a.matchScore);
    }

    fallbackRequestMatching(request, offers, userProfiles) {
        return offers.map(offer => {
        let score = 50;
        
        if (offer.diningHalls.length === 0 || offer.diningHalls.includes(request.preferredDiningHalls[0])) score += 25;
        if (offer.quantity >= request.quantity) score += 15;
        if (new Date(offer.expiresAt) > new Date(request.neededBy)) score += 10;
        
        return {
            offerId: offer.id,
            matchScore: score,
            reasoning: 'Fallback matching',
            priority: 'medium'
        };
        }).sort((a, b) => b.matchScore - a.matchScore);
  }

    buildRequestMatchingPrompt(request, offers, userProfiles) {
    // Similar to offer matching but reversed perspective
    return `Match this meal swipe request with the best available offers...`;
  }
}

export default new MatchingEngine();
