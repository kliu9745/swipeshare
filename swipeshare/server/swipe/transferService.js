/**
 * transferService.js
 * Handles digital swipe transfers - NO physical meetup needed
 * Giver's swipe count is decremented, requester gets QR code
 */

import { v4 as uuidv4 } from 'uuid';
import qrService from './qrService';
import offerService from './offerService';
import requestService from './requestService';

class TransferService {
  constructor() {
    this.transfers = [];
  }

  /**
   * Create a digital transfer
   * @param {string} giverId
   * @param {string} requesterId
   * @param {Object} details - { offerId, requestId, quantity, diningHall, matchScore }
   * @returns {Object} - Transfer with QR code for requester
   */
  async createTransfer(giverId, requesterId, details) {
    const { offerId, requestId, quantity, diningHall, matchScore } = details;

    // Validate giver has enough swipes
    const giverSwipeBalance = await this.getGiverSwipeBalance(giverId);
    if (giverSwipeBalance < quantity) {
      throw new Error('Insufficient swipes available');
    }

    // Generate unique QR code for this transfer
    const qrData = qrService.generateTransferQRCode({
      giverId,
      requesterId,
      quantity,
      diningHall,
      timestamp: Date.now()
    });

    const transfer = {
      id: uuidv4(),
      
      // Participants
      giverId,
      requesterId,
      
      // Source
      initiatedBy: offerId ? 'OFFER' : 'REQUEST',
      offerId: offerId || null,
      requestId: requestId || null,
      
      // Transfer details
      quantity,
      diningHall: diningHall || 'ANY', // Which dining hall this is valid for
      
      // Digital credentials
      qrCode: qrData.encrypted,
      displayCode: qrData.displayCode, // Human-readable backup code
      securityHash: qrData.securityHash,
      
      // Status
      status: 'PENDING', // PENDING → ACTIVE → USED → COMPLETED
      createdAt: new Date().toISOString(),
      activatedAt: null, // When requester receives/views QR
      usedAt: null,
      
      // Validation
      validFrom: new Date().toISOString(),
      validUntil: this.calculateExpiry(details.validUntil),
      
      // Usage tracking
      usedAtLocation: null,
      redeemedBy: null, // Will be requesterId when used
      
      // AI metadata
      matchScore: matchScore || null,
      
      // Confirmation tracking
      giverNotified: false,
      requesterNotified: false,
      
      // Post-transfer feedback
      giverRating: null,
      requesterRating: null,
      issueReported: false
    };

    this.transfers.push(transfer);

    // Deduct swipe from giver's balance
    await this.deductGiverSwipe(giverId, quantity);

    // Update source offer/request
    if (offerId) {
      offerService.markAsTransferred(offerId, requesterId, quantity);
    }
    
    if (requestId) {
      requestService.markAsFulfilled(requestId, giverId, quantity);
    }

    // Automatically activate transfer (requester can use immediately)
    transfer.status = 'ACTIVE';
    transfer.activatedAt = new Date().toISOString();

    return transfer;
  }

  /**
   * Requester redeems the QR code at dining hall
   * @param {string} qrCode - Scanned QR code
   * @param {string} location - Dining hall name
   * @param {string} scannedBy - UserId of person redeeming (should match requesterId)
   * @returns {Object} - Redemption result
   */
  redeemQRCode(qrCode, location, scannedBy) {
    // Validate QR code
    const qrData = qrService.validateAndDecrypt(qrCode);
    if (!qrData) {
      throw new Error('Invalid QR code');
    }

    // Find transfer by QR code
    const transfer = this.transfers.find(t => t.qrCode === qrCode);
    
    if (!transfer) {
      throw new Error('Transfer not found');
    }

    // Validate requester
    if (transfer.requesterId !== scannedBy) {
      throw new Error('Unauthorized: This swipe belongs to another user');
    }

    // Check status
    if (transfer.status === 'USED' || transfer.status === 'COMPLETED') {
      throw new Error('This swipe has already been used');
    }

    if (transfer.status !== 'ACTIVE') {
      throw new Error('This swipe is not active');
    }

    // Check expiry
    if (new Date(transfer.validUntil) < new Date()) {
      transfer.status = 'EXPIRED';
      throw new Error('This swipe has expired');
    }

    // Validate location (if restricted)
    if (transfer.diningHall !== 'ANY' && transfer.diningHall !== location) {
      throw new Error(`This swipe is only valid at ${transfer.diningHall}`);
    }

    // Mark as used
    transfer.status = 'USED';
    transfer.usedAt = new Date().toISOString();
    transfer.usedAtLocation = location;
    transfer.redeemedBy = scannedBy;

    return {
      success: true,
      transfer: transfer,
      message: `✓ Swipe redeemed! Enjoy your meal at ${location}`,
      quantity: transfer.quantity,
      giverId: transfer.giverId
    };
  }

  /**
   * Mark transfer as completed (after successful use)
   * @param {string} transferId
   * @returns {Object}
   */
  completeTransfer(transferId) {
    const transfer = this.getTransferById(transferId);
    
    if (!transfer) throw new Error('Transfer not found');
    if (transfer.status !== 'USED') throw new Error('Transfer has not been used yet');

    transfer.status = 'COMPLETED';
    transfer.completedAt = new Date().toISOString();

    return transfer;
  }

  /**
   * Cancel transfer (before use)
   * @param {string} transferId
   * @param {string} userId - Must be giver or requester
   * @param {string} reason
   * @returns {Object}
   */
  cancelTransfer(transferId, userId, reason = '') {
    const transfer = this.getTransferById(transferId);
    
    if (!transfer) throw new Error('Transfer not found');
    
    if (transfer.giverId !== userId && transfer.requesterId !== userId) {
      throw new Error('Unauthorized');
    }

    if (transfer.status === 'USED' || transfer.status === 'COMPLETED') {
      throw new Error('Cannot cancel - swipe has been used');
    }

    // Refund swipe to giver
    this.refundGiverSwipe(transfer.giverId, transfer.quantity);

    // Mark as cancelled
    transfer.status = 'CANCELLED';
    transfer.cancelledAt = new Date().toISOString();
    transfer.cancelledBy = userId;
    transfer.cancellationReason = reason;

    // Reactivate source offer/request
    if (transfer.offerId) {
      offerService.reactivateOffer(transfer.offerId);
    }
    if (transfer.requestId) {
      requestService.reactivateRequest(transfer.requestId);
    }

    return transfer;
  }

  /**
   * Get transfer by QR display code
   * @param {string} displayCode
   * @returns {Object}
   */
  getTransferByDisplayCode(displayCode) {
    return this.transfers.find(t => t.displayCode === displayCode);
  }

  /**
   * Get user's transfers
   * @param {string} userId
   * @returns {Object}
   */
  getUserTransfers(userId) {
    return {
      // Swipes user gave away
      given: this.transfers.filter(t => t.giverId === userId),
      
      // Swipes user received
      received: this.transfers.filter(t => t.requesterId === userId),
      
      // Active QR codes user can use
      activeReceived: this.transfers.filter(t =>
        t.requesterId === userId &&
        t.status === 'ACTIVE' &&
        new Date(t.validUntil) > new Date()
      ),
      
      // Pending transfers
      pending: this.transfers.filter(t =>
        (t.giverId === userId || t.requesterId === userId) &&
        t.status === 'PENDING'
      ),
      
      // Completed history
      completed: this.transfers.filter(t =>
        (t.giverId === userId || t.requesterId === userId) &&
        (t.status === 'COMPLETED' || t.status === 'USED')
      )
    };
  }

  /**
   * Submit rating after transfer
   * @param {string} transferId
   * @param {string} userId
   * @param {number} rating - 1-5
   * @param {string} feedback
   * @returns {Object}
   */
  submitRating(transferId, userId, rating, feedback = '') {
    const transfer = this.getTransferById(transferId);
    
    if (!transfer) throw new Error('Transfer not found');
    
    if (transfer.status !== 'COMPLETED' && transfer.status !== 'USED') {
      throw new Error('Can only rate completed transfers');
    }

    if (transfer.giverId === userId) {
      transfer.giverRating = rating;
      transfer.giverFeedback = feedback;
    } else if (transfer.requesterId === userId) {
      transfer.requesterRating = rating;
      transfer.requesterFeedback = feedback;
    } else {
      throw new Error('Unauthorized');
    }

    return transfer;
  }

  /**
   * Report an issue with transfer
   * @param {string} transferId
   * @param {string} userId
   * @param {string} issue
   * @returns {Object}
   */
  reportIssue(transferId, userId, issue) {
    const transfer = this.getTransferById(transferId);
    
    if (!transfer) throw new Error('Transfer not found');
    
    if (transfer.giverId !== userId && transfer.requesterId !== userId) {
      throw new Error('Unauthorized');
    }

    transfer.issueReported = true;
    transfer.issueDetails = {
      reportedBy: userId,
      issue: issue,
      reportedAt: new Date().toISOString()
    };

    return transfer;
  }

  getTransferById(transferId) {
    return this.transfers.find(t => t.id === transferId);
  }

  /**
   * Calculate expiry time for transfer
   * @param {string} customExpiry - Optional custom expiry
   * @returns {string} - ISO timestamp
   */
  calculateExpiry(customExpiry) {
    if (customExpiry) {
      return customExpiry;
    }
    
    // Default: expires in 24 hours
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24);
    return expiry.toISOString();
  }

  /**
   * Get giver's current swipe balance
   * This would integrate with user's meal plan in production
   * @param {string} giverId
   * @returns {number}
   */
  async getGiverSwipeBalance(giverId) {
    // In production, this would query the user's actual meal plan
    // For now, we'll track it in memory
    if (!this.swipeBalances) {
      this.swipeBalances = new Map();
    }
    
    return this.swipeBalances.get(giverId) || 14; // Default: 14 swipes per week
  }

  /**
   * Deduct swipe from giver's balance
   * @param {string} giverId
   * @param {number} quantity
   */
  async deductGiverSwipe(giverId, quantity) {
    if (!this.swipeBalances) {
      this.swipeBalances = new Map();
    }

    const currentBalance = await this.getGiverSwipeBalance(giverId);
    const newBalance = currentBalance - quantity;
    
    if (newBalance < 0) {
      throw new Error('Insufficient swipes');
    }

    this.swipeBalances.set(giverId, newBalance);
    
    return newBalance;
  }

  /**
   * Refund swipe to giver (if transfer cancelled)
   * @param {string} giverId
   * @param {number} quantity
   */
  refundGiverSwipe(giverId, quantity) {
    if (!this.swipeBalances) {
      this.swipeBalances = new Map();
    }

    const currentBalance = this.swipeBalances.get(giverId) || 0;
    this.swipeBalances.set(giverId, currentBalance + quantity);
    
    return currentBalance + quantity;
  }

  /**
   * Get transfer statistics
   * @returns {Object}
   */
  getStats() {
    return {
      total: this.transfers.length,
      active: this.transfers.filter(t => t.status === 'ACTIVE').length,
      used: this.transfers.filter(t => t.status === 'USED').length,
      completed: this.transfers.filter(t => t.status === 'COMPLETED').length,
      cancelled: this.transfers.filter(t => t.status === 'CANCELLED').length,
      expired: this.transfers.filter(t => t.status === 'EXPIRED').length,
      totalSwipesTransferred: this.transfers
        .filter(t => t.status === 'COMPLETED' || t.status === 'USED')
        .reduce((sum, t) => sum + t.quantity, 0)
    };
  }
}

export default new TransferService();