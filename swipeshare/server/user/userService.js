class UserService {
  
  /**
   * Get user's complete activity state
   */
  getUserActivityState(userId) {
    return {
      // Balance
      swipeBalance: this.getSwipeBalance(userId),
      
      // Active posts (can have BOTH!)
      activeOffers: offerService.getUserOffers(userId).active,
      activeRequests: requestService.getUserRequests(userId).active,
      
      // Pending transfers (as giver or receiver)
      pendingTransfers: transferService.getUserTransfers(userId).pending,
      
      // Available actions
      canOffer: this.getSwipeBalance(userId) > 0,
      canRequest: true, // Anyone can request
      
      // Stats
      stats: {
        totalGiven: this.getTotalSwipesGiven(userId),
        totalReceived: this.getTotalSwipesReceived(userId),
        netBalance: this.getTotalSwipesGiven(userId) - this.getTotalSwipesReceived(userId)
        // Positive = net giver, Negative = net receiver
      }
    };
  }
  
  /**
   * Check if user can create offer
   */
  canUserOffer(userId, quantity) {
    const balance = this.getSwipeBalance(userId);
    const pendingOffers = offerService.getUserOffers(userId).active
      .reduce((sum, offer) => sum + offer.quantity, 0);
    
    const available = balance - pendingOffers;
    return available >= quantity;
  }
  
  /**
   * Check if user can create request
   */
  canUserRequest(userId, quantity) {
    // Anyone can request, but maybe limit frequency
    const recentRequests = requestService.getUserRequests(userId).active;
    
    // Don't allow more than 3 active requests at once
    if (recentRequests.length >= 3) {
      return {
        canRequest: false,
        reason: 'You have too many active requests. Cancel some first.'
      };
    }
    
    return { canRequest: true };
  }
}