/**
 * Frontend in-memory request service.
 */


function genId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;
}

class RequestService {
  constructor() {
    this.requests = [];
  }

  createRequest(userId, requestData = {}) {
    const request = {
      id: genId('req'),
      type: 'REQUEST',
      requesterId: userId,
      requesterName: requestData.requesterName || 'Unknown',
      quantity: requestData.quantity || 1,
      preferredDiningHalls: requestData.preferredDiningHalls || [],
      mealTime: requestData.mealTime || 'any',
      neededBy: requestData.neededBy || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      urgency: requestData.urgency || 'MEDIUM',
      reason: requestData.reason || '',
      message: requestData.message || '',
      matchingPreference: requestData.matchingPreference || 'AI_MATCH',
      targetGiverId: requestData.targetGiverId || null,
      viewCount: 0,
      potentialGivers: [],
      fulfilledBy: null,
      fulfillmentHistory: [],
      aiGenerated: false,
      matchScore: null,
      suggestedMatches: null
    };

    this.requests.push(request);
    return request;
  }

  getActiveRequests(filters = {}) {
    let requests = this.requests.filter(r => r.status === 'ACTIVE' && new Date(r.neededBy) > new Date());

    if (filters.diningHall) {
      requests = requests.filter(r => r.preferredDiningHalls.length === 0 || r.preferredDiningHalls.includes(filters.diningHall));
    }

    if (filters.urgency) {
      requests = requests.filter(r => r.urgency === filters.urgency);
    }

    if (filters.mealTime) {
      requests = requests.filter(r => r.mealTime === 'any' || r.mealTime === filters.mealTime);
    }

    if (filters.maxQuantity) {
      requests = requests.filter(r => r.quantity <= filters.maxQuantity);
    }

    return requests;
  }

  getRequestById(id) {
    return this.requests.find(r => r.id === id);
  }
}

export default new RequestService();
