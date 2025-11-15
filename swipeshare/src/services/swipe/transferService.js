/**
 * Minimal transfer service stub for frontend tests.
 */

class TransferService {
  constructor() {
    this.transfers = [];
  }

  createTransfer(transfer) {
    const t = Object.assign({ id: `t_${Date.now()}`, status: 'PENDING', createdAt: new Date().toISOString() }, transfer);
    this.transfers.push(t);
    return t;
  }

  getTransfersForUser(userId) {
    return this.transfers.filter(t => t.donorId === userId || t.recipientId === userId);
  }
}

export default new TransferService();
