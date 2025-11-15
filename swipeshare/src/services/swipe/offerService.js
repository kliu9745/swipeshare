/**
 * Frontend in-memory offer service.
 * Provides the subset of methods used by UI components/tests.
 */

function genId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;
}

class OfferService {
  constructor() {
    this.offers = [];
  }

  createOffer(userId, offerData = {}) {
    const offer = {
      id: genId('offer'),
      type: 'OFFER',
      giverId: userId,
      giverName: offerData.giverName || 'Unknown',
      quantity: offerData.quantity || 1,
      diningHalls: offerData.diningHalls || [],
      mealTimes: offerData.mealTimes || [],
      availableTimes: offerData.availableTimes || [],
      createdAt: new Date().toISOString(),
      expiresAt: offerData.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      message: offerData.message || '',
      reason: offerData.reason || '',
      matchingPreference: offerData.matchingPreference || 'AI_MATCH',
      specificRecipients: offerData.specificRecipients || [],
      viewCount: 0,
      interestedUsers: [],
      matchedWith: null,
      aiGenerated: false,
      matchScore: null
    };

    this.offers.push(offer);
    return offer;
  }

  getActiveOffers(filters = {}) {
    let offers = this.offers.filter(o => o.status === 'ACTIVE' && new Date(o.expiresAt) > new Date());

    if (filters.diningHall) {
      offers = offers.filter(o => o.diningHalls.length === 0 || o.diningHalls.includes(filters.diningHall));
    }

    if (filters.mealTime) {
      offers = offers.filter(o => o.mealTimes.length === 0 || o.mealTimes.includes(filters.mealTime));
    }

    if (filters.minQuantity) {
      offers = offers.filter(o => o.quantity >= filters.minQuantity);
    }

    return offers;
  }

  getOfferById(id) {
    return this.offers.find(o => o.id === id);
  }

  getUserOffers(userId) {
    return {
      active: this.offers.filter(o => o.giverId === userId && o.status === 'ACTIVE'),
      matched: this.offers.filter(o => o.giverId === userId && o.status === 'MATCHED'),
      completed: this.offers.filter(o => o.giverId === userId && o.status === 'COMPLETED')
    };
  }
}

export default new OfferService();
