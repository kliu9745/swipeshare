import React from 'react';
import { User, Clock, MapPin, CheckCircle } from 'lucide-react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export const SwipeCard = ({ swipe, type = 'outgoing', onAction = null }) => {
  const isCompleted = swipe.status === 'completed';
  const isPending = swipe.status === 'pending';

  if (type === 'outgoing') {
    return (
      <Card variant="bordered">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{swipe.recipient}</div>
              <div className="text-sm text-gray-500">{swipe.createdAt}</div>
            </div>
          </div>
          {isCompleted ? (
            <Badge variant="success">✓ Completed</Badge>
          ) : (
            <Badge variant="pending">Pending</Badge>
          )}
        </div>
        
        <div className="flex gap-3 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {swipe.location}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {swipe.validUntil}
          </div>
        </div>

        {isPending && (
          <button 
            onClick={() => onAction && onAction('cancel', swipe.id)}
            className="text-red-600 text-sm font-semibold hover:text-red-700"
          >
            Cancel Transfer
          </button>
        )}
      </Card>
    );
  }

  // incoming type
  return (
    <Card variant="highlighted">
      <div className="space-y-4">
        <div>
          <div className="font-semibold text-gray-900">From {swipe.donor}</div>
          <div className="text-sm text-gray-500">{swipe.validUntil}</div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-500">Hours left</div>
            <div className="font-semibold">{swipe.hoursLeft}h</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-gray-700">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-500">Location</div>
            <div className="font-semibold">{swipe.location}</div>
          </div>
        </div>

        {swipe.message && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="text-sm text-gray-600 mb-1">Message:</div>
            <div className="text-gray-900">{swipe.message}</div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button 
            onClick={() => onAction && onAction('view-qr', swipe.id)}
            className="flex-1 bg-blue-600 text-white rounded-xl py-2 font-semibold hover:bg-blue-700 transition"
          >
            View QR Code
          </button>
          <button 
            onClick={() => onAction && onAction('use', swipe.id)}
            className="flex-1 bg-green-600 text-white rounded-xl py-2 font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            I've Used This
          </button>
        </div>
      </div>
    </Card>
  );
};

export default SwipeCard;
