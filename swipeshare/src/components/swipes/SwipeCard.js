import React from 'react';
import { User, Clock, MapPin, CheckCircle } from 'lucide-react';
import Badge from '../common/Badge';
import './SwipeCard.css';

export const SwipeCard = ({ swipe, type = 'outgoing', onAction = null }) => {
  const isCompleted = swipe.status === 'completed';
  const isPending = swipe.status === 'pending';

  if (type === 'outgoing') {
    return (
      <div className="swipe-card swipe-card-outgoing">
        <div className="swipe-card-header">
          <div className="swipe-card-user">
            <div className="swipe-card-avatar">
              <User className="swipe-card-avatar-icon" />
            </div>
            <div>
              <div className="swipe-card-name">{swipe.recipient}</div>
              <div className="swipe-card-time">{swipe.createdAt}</div>
            </div>
          </div>
          {isCompleted ? (
            <Badge variant="success">✓ Completed</Badge>
          ) : (
            <Badge variant="pending">Pending</Badge>
          )}
        </div>
        
        <div className="swipe-card-details">
          <div className="swipe-card-detail">
            <MapPin className="swipe-card-icon" />
            {swipe.location}
          </div>
          <div className="swipe-card-detail">
            <Clock className="swipe-card-icon" />
            {swipe.validUntil}
          </div>
        </div>

        {isPending && (
          <button 
            onClick={() => onAction && onAction('cancel', swipe.id)}
            className="swipe-card-cancel"
          >
            Cancel Transfer
          </button>
        )}
      </div>
    );
  }

  // incoming type
  return (
    <div className="swipe-card swipe-card-incoming">
      <div className="swipe-card-content">
        <div>
          <div className="swipe-card-from">From {swipe.donor}</div>
          <div className="swipe-card-valid">{swipe.validUntil}</div>
        </div>
        
        <div className="swipe-card-info">
          <Clock className="swipe-card-info-icon" />
          <div>
            <div className="swipe-card-info-label">Hours left</div>
            <div className="swipe-card-info-value">{swipe.hoursLeft}h</div>
          </div>
        </div>
        
        <div className="swipe-card-info">
          <MapPin className="swipe-card-info-icon" />
          <div>
            <div className="swipe-card-info-label">Location</div>
            <div className="swipe-card-info-value">{swipe.location}</div>
          </div>
        </div>

        {swipe.message && (
          <div className="swipe-card-message">
            <div className="swipe-card-message-label">Message:</div>
            <div className="swipe-card-message-text">{swipe.message}</div>
          </div>
        )}

        <div className="swipe-card-actions">
          <button 
            onClick={() => onAction && onAction('view-qr', swipe.id)}
            className="swipe-card-button swipe-card-button-primary"
          >
            View QR Code
          </button>
          <button 
            onClick={() => onAction && onAction('use', swipe.id)}
            className="swipe-card-button swipe-card-button-success"
          >
            <CheckCircle className="swipe-card-button-icon" />
            I've Used This
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwipeCard;
