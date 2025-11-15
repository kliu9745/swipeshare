/**
 * Minimal AI matching engine for frontend tests.
 * Provides matchOfferToRequests and matchRequestToOffers with simple scoring.
 */

function scoreMatch(offer, request, userProfile) {
  // Simple heuristic: higher if request is urgent or requester has no meal plan
  let score = 50;
  if (request.urgency === 'HIGH') score += 25;
  if (userProfile && userProfile.needProfile && userProfile.needProfile.hasMealPlan === false) score += 20;
  // proximity: if dining halls overlap
  if (offer.diningHalls && offer.diningHalls.length && request.preferredDiningHalls && request.preferredDiningHalls.length) {
    const common = offer.diningHalls.filter(h => request.preferredDiningHalls.includes(h));
    if (common.length) score += 10;
  }
  return Math.min(100, score);
}

const matchingEngine = {
  async matchOfferToRequests(offer, activeRequests = [], userProfiles = []) {
    // Return simple ranked matches
    return activeRequests.map(req => {
      const user = userProfiles.find(u => u.id === req.requesterId) || {};
      const matchScore = scoreMatch(offer, req, user);
      return {
        requestId: req.id,
        matchScore,
        reasoning: `Score ${matchScore} (heuristic)`,
        priority: matchScore > 80 ? 'HIGH' : (matchScore > 60 ? 'MEDIUM' : 'LOW')
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  },

  async matchRequestToOffers(request, activeOffers = [], userProfiles = []) {
    return activeOffers.map(off => {
      const user = userProfiles.find(u => u.id === request.requesterId) || {};
      const matchScore = scoreMatch(off, request, user);
      return {
        offerId: off.id,
        matchScore,
        reasoning: `Score ${matchScore} (heuristic)`,
        priority: matchScore > 80 ? 'HIGH' : (matchScore > 60 ? 'MEDIUM' : 'LOW')
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }
};

export default matchingEngine;
