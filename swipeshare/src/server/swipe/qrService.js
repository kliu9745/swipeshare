/**
 * qrService.js
 * Generate and validate QR codes for digital swipe transfers
 */

import { v4 as uuidv4 } from 'uuid';
import CryptoJS from 'crypto-js';

class QRService {
  constructor() {
    this.secretKey = process.env.REACT_APP_QR_SECRET_KEY || 'swipeshare-secret-2024';
  }

  /**
   * Generate QR code for a transfer
   * @param {Object} transferData - { giverId, requesterId, quantity, diningHall, timestamp }
   * @returns {Object} - { encrypted, displayCode, securityHash }
   */
  generateTransferQRCode(transferData) {
    const qrId = uuidv4();
    
    const payload = {
      id: qrId,
      giverId: transferData.giverId,
      requesterId: transferData.requesterId,
      quantity: transferData.quantity,
      diningHall: transferData.diningHall,
      timestamp: transferData.timestamp || Date.now(),
      random: Math.random().toString(36).substring(7)
    };

    // Encrypt the payload
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(payload),
      this.secretKey
    ).toString();

    // Generate human-readable display code
    const displayCode = this.generateDisplayCode();

    // Generate security hash
    const securityHash = CryptoJS.SHA256(
      `${qrId}-${transferData.giverId}-${transferData.requesterId}-${Date.now()}`
    ).toString();

    return {
      encrypted,
      displayCode,
      securityHash,
      qrId
    };
  }

  /**
   * Validate and decrypt QR code
   * @param {string} encryptedQR
   * @returns {Object|null} - Decrypted payload or null if invalid
   */
  validateAndDecrypt(encryptedQR) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedQR, this.secretKey);
      const decryptedStr = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedStr) {
        return null;
      }

      const payload = JSON.parse(decryptedStr);
      
      // Validate required fields
      if (!payload.id || !payload.giverId || !payload.requesterId) {
        return null;
      }

      return payload;
    } catch (error) {
      console.error('QR validation error:', error);
      return null;
    }
  }

  /**
   * Generate human-readable display code
   * Format: SWIPE-XXXX-XXXX-XXXX
   * @returns {string}
   */
  generateDisplayCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'SWIPE-';
    
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      if (i < 2) code += '-';
    }
    
    return code;
  }

  /**
   * Verify display code format
   * @param {string} code
   * @returns {boolean}
   */
  isValidDisplayCode(code) {
    const pattern = /^SWIPE-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/;
    return pattern.test(code);
  }

  /**
   * Generate security hash
   * @param {string} data
   * @returns {string}
   */
  generateSecurityHash(data) {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Verify security hash
   * @param {string} data
   * @param {string} hash
   * @returns {boolean}
   */
  verifySecurityHash(data, hash) {
    const computed = this.generateSecurityHash(data);
    return computed === hash;
  }
}

export default new QRService();