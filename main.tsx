import React, { useState } from 'react';
import { QrCode, Plus, Inbox, User, Home, Gift, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

const SwipeShareApp = () => {
  const [currentView, setCurrentView] = useState('home');
  const [userType, setUserType] = useState('donor'); // donor or recipient
  const [showQR, setShowQR] = useState(false);
  const [selectedSwipe, setSelectedSwipe] = useState(null);

  // Mock data
  const mySwipes = [
    {
      id: 'swipe_001',
      recipient: 'Jamie Chen',
      status: 'pending',
      validUntil: 'Today, 8:00 PM',
      location: 'Any dining hall',
      createdAt: 'Nov 15, 2:34 PM'
    },
    {
      id: 'swipe_002',
      recipient: 'Alex Kumar',
      status: 'completed',
      validUntil: 'Nov 14, 8:00 PM',
      location: 'North Dining',
      createdAt: 'Nov 14, 6:12 PM'
    }
  ];

  const incomingSwipes = [
    {
      id: 'swipe_003',
      donor: 'Sarah Williams',
      code: 'SWIPE-NK7H-92JD-4KLP',
      validUntil: 'Today, 8:00 PM',
      location: 'Any dining hall',
      message: 'Hope this helps! Enjoy your meal 😊',
      hoursLeft: 4.5
    }
  ];

  const renderHome = () => (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-blue-100 mb-4">Share meals, build community</p>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/20 rounded-xl p-3">
            <div className="text-3xl font-bold">12</div>
            <div className="text-sm text-blue-100">Swipes Shared</div>
          </div>
          <div className="bg-white/20 rounded-xl p-3">
            <div className="text-3xl font-bold">87</div>
            <div className="text-sm text-blue-100">Days Left</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Quick Actions</h3>
        <button 
          onClick={() => setCurrentView('transfer')}
          className="w-full bg-blue-600 text-white rounded-xl p-4 flex items-center justify-between hover:bg-blue-700 transition"
        >
          <div className="flex items-center gap-3">
            <Gift className="w-6 h-6" />
            <div className="text-left">
              <div className="font-semibold">Transfer Swipe</div>
              <div className="text-sm text-blue-100">Help someone today</div>
            </div>
          </div>
          <Plus className="w-5 h-5" />
        </button>

        <button 
          onClick={() => setCurrentView('inbox')}
          className="w-full bg-white border-2 border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-blue-300 transition"
        >
          <div className="flex items-center gap-3">
            <Inbox className="w-6 h-6 text-gray-700" />
            <div className="text-left">
              <div className="font-semibold text-gray-900">View Inbox</div>
              <div className="text-sm text-gray-500">1 new swipe</div>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        <div className="space-y-2">
          {mySwipes.slice(0, 2).map(swipe => (
            <div key={swipe.id} className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{swipe.recipient}</div>
                    <div className="text-sm text-gray-500">{swipe.createdAt}</div>
                  </div>
                </div>
                {swipe.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              <div className="text-sm text-gray-600">
                {swipe.status === 'completed' ? '✓ Completed' : 'Pending use'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderTransfer = () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Transfer Meal Swipe</h2>
        <p className="text-gray-600">Share a meal with another student</p>
      </div>

      <div className="space-y-4">
        {/* Number of Swipes */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            How many swipes?
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                className="flex-1 py-3 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition font-semibold"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Valid Until */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Valid until:
          </label>
          <div className="space-y-2">
            {['Today only', 'This week', 'End of month'].map(option => (
              <label key={option} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition">
                <input type="radio" name="validity" className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Dining Halls */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Which dining halls?
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-300 cursor-pointer transition">
              <input type="checkbox" className="w-5 h-5 text-blue-600 rounded" defaultChecked />
              <span className="font-medium text-gray-900">Any dining hall</span>
            </label>
          </div>
        </div>

        {/* AI Matching */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">Let AI match me</div>
              <div className="text-sm text-gray-600">with someone who needs this most</div>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl py-4 font-semibold hover:from-purple-700 hover:to-blue-700 transition flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            Create Virtual Swipe
          </button>
        </div>

        {/* Manual Transfer */}
        <div className="pt-4 border-t border-gray-200">
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Or enter recipient's email directly
          </label>
          <input
            type="email"
            placeholder="recipient@cornell.edu"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
          />
          <button className="w-full mt-3 bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition">
            Send Transfer
          </button>
        </div>
      </div>
    </div>
  );

  const renderInbox = () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Incoming Swipes</h2>
        <p className="text-gray-600">Meals shared with you</p>
      </div>

      <div className="space-y-4">
        {incomingSwipes.map(swipe => (
          <div key={swipe.id} className="bg-white border-2 border-blue-200 rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">From {swipe.donor}</div>
                  <div className="text-sm text-blue-100">Meal swipe</div>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="p-6 bg-gray-50">
              <div className="bg-white rounded-xl p-6 text-center">
                <div className="w-48 h-48 mx-auto bg-gray-200 rounded-xl flex items-center justify-center mb-4">
                  <QrCode className="w-32 h-32 text-gray-400" />
                </div>
                <div className="font-mono font-bold text-lg text-gray-900 mb-4">
                  {swipe.code}
                </div>
                <button 
                  onClick={() => {
                    setSelectedSwipe(swipe);
                    setShowQR(true);
                  }}
                  className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition"
                >
                  View Full Screen QR
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="p-6 space-y-3">
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Valid until</div>
                  <div className="font-semibold">{swipe.validUntil}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500">Location</div>
                  <div className="font-semibold">{swipe.location}</div>
                </div>
              </div>
              
              {swipe.message && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-4">
                  <div className="text-sm text-gray-600 mb-1">Message from donor:</div>
                  <div className="text-gray-900">{swipe.message}</div>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-green-600 text-white rounded-xl py-3 font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  I've Used This
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMySwipes = () => (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Meal Swipes</h2>
        <p className="text-gray-600">Track your transfers</p>
      </div>

      {/* Plan Overview */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold">Unlimited Plan</div>
            <div className="text-blue-100">87 days remaining</div>
          </div>
          <QrCode className="w-12 h-12 text-white/80" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>This week</span>
            <span>10/14 used</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div className="bg-white rounded-full h-3" style={{width: '71%'}}></div>
          </div>
        </div>
      </div>

      {/* Active Transfers */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Active Transfers</h3>
        {mySwipes.map(swipe => (
          <div key={swipe.id} className="bg-white border-2 border-gray-200 rounded-xl p-4">
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
              {swipe.status === 'completed' ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                  ✓ Completed
                </span>
              ) : (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                  Pending
                </span>
              )}
            </div>
            
            <div className="flex gap-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {swipe.location}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {swipe.validUntil}
              </div>
            </div>

            {swipe.status === 'pending' && (
              <button className="text-red-600 text-sm font-semibold hover:text-red-700">
                Cancel Transfer
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // QR Code Full Screen Modal
  const QRModal = () => (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-white text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Ready to Use This Swipe?</h2>
          <p className="text-gray-300">Show this to dining hall staff</p>
        </div>
        
        <div className="w-80 h-80 bg-white rounded-2xl flex items-center justify-center mb-6">
          <QrCode className="w-64 h-64 text-gray-800" />
        </div>
        
        <div className="text-white font-mono text-xl font-bold mb-8">
          {selectedSwipe?.code}
        </div>

        <div className="w-full max-w-md space-y-4">
          <div className="bg-white/10 backdrop-blur rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5" />
              <span className="font-semibold">Valid until: {selectedSwipe?.validUntil}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              <span className="font-semibold">{selectedSwipe?.location}</span>
            </div>
          </div>

          <button 
            onClick={() => setShowQR(false)}
            className="w-full bg-white text-gray-900 rounded-xl py-4 font-bold hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Bottom Navigation
  const BottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-3 safe-area-bottom">
      <div className="flex justify-around items-center">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-1 ${currentView === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-semibold">Home</span>
        </button>
        <button
          onClick={() => setCurrentView('transfer')}
          className={`flex flex-col items-center gap-1 ${currentView === 'transfer' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <Gift className="w-6 h-6" />
          <span className="text-xs font-semibold">Transfer</span>
        </button>
        <button
          onClick={() => setCurrentView('inbox')}
          className={`flex flex-col items-center gap-1 relative ${currentView === 'inbox' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <Inbox className="w-6 h-6" />
          <span className="text-xs font-semibold">Inbox</span>
          <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            1
          </span>
        </button>
        <button
          onClick={() => setCurrentView('myswipes')}
          className={`flex flex-col items-center gap-1 ${currentView === 'myswipes' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <QrCode className="w-6 h-6" />
          <span className="text-xs font-semibold">My Swipes</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">SwipeShare</h1>
          <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        {currentView === 'home' && renderHome()}
        {currentView === 'transfer' && renderTransfer()}
        {currentView === 'inbox' && renderInbox()}
        {currentView === 'myswipes' && renderMySwipes()}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* QR Modal */}
      {showQR && <QRModal />}
    </div>
  );
};

export default SwipeShareApp;