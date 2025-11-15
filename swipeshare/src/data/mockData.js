import { SWIPE_STATUS, MEAL_PLANS } from '../utils/constants';

// Mock Users
export const mockUsers = {
  currentUser: {
    id: 'user_001',
    name: 'Jordan Smith',
    email: 'jordan@cornell.edu',
    planType: MEAL_PLANS.UNLIMITED,
    planDaysRemaining: 87,
    thisWeekUsed: 10,
    thisWeekTotal: 14,
    rating: 4.8,
    reliability: 'High',
    completionRate: 98,
    memberSince: 'Nov 2024',
    swipesShared: 24,
    studentsHelped: 18,
    badges: [
      { id: 'badge_1', name: '🌟 Super Donor', variant: 'success' },
      { id: 'badge_2', name: '💯 Reliable', variant: 'default' },
      { id: 'badge_3', name: '🤝 Community Helper', variant: 'default' }
    ]
  },
  otherUsers: [
    {
      id: 'user_002',
      name: 'Jamie Chen',
      email: 'jamie@cornell.edu',
      rating: 4.9
    },
    {
      id: 'user_003',
      name: 'Alex Kumar',
      email: 'alex@cornell.edu',
      rating: 4.7
    },
    {
      id: 'user_004',
      name: 'Sarah Williams',
      email: 'sarah@cornell.edu',
      rating: 5.0
    },
    {
      id: 'user_005',
      name: 'Michael Brown',
      email: 'michael@cornell.edu',
      rating: 4.6
    }
  ]
};

// Mock Outgoing Swipes (swipes the current user sent)
export const mockMySwipes = [
  {
    id: 'swipe_001',
    donorId: 'user_001',
    recipientId: 'user_002',
    recipient: 'Jamie Chen',
    status: SWIPE_STATUS.PENDING,
    validUntil: 'Today, 8:00 PM',
    location: 'Any dining hall',
    createdAt: 'Nov 15, 2:34 PM',
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString() // 5 hours from now
  },
  {
    id: 'swipe_002',
    donorId: 'user_001',
    recipientId: 'user_003',
    recipient: 'Alex Kumar',
    status: SWIPE_STATUS.COMPLETED,
    validUntil: 'Nov 14, 8:00 PM',
    location: 'North Star Dining Room',
    createdAt: 'Nov 14, 6:12 PM',
    usedAt: 'Nov 14, 7:45 PM'
  },
  {
    id: 'swipe_003',
    donorId: 'user_001',
    recipientId: 'user_005',
    recipient: 'Michael Brown',
    status: SWIPE_STATUS.PENDING,
    validUntil: 'Today, 9:00 PM',
    location: 'Morrison Dining Room',
    createdAt: 'Nov 15, 1:20 PM',
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours from now
  }
];

// Mock Incoming Swipes (swipes sent to current user)
export const mockIncomingSwipes = [
  {
    id: 'swipe_004',
    donorId: 'user_004',
    donor: 'Sarah Williams',
    recipientId: 'user_001',
    code: 'SWIPE-NK7H-92JD-4KLP',
    validUntil: 'Today, 8:00 PM',
    location: 'Any dining hall',
    message: 'Hope this helps! Enjoy your meal 😊',
    hoursLeft: 4.5,
    status: SWIPE_STATUS.PENDING,
    createdAt: 'Nov 15, 3:30 PM',
    expiresAt: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'swipe_005',
    donorId: 'user_003',
    donor: 'Alex Kumar',
    recipientId: 'user_001',
    code: 'SWIPE-8FGH-23LM-9XYZ',
    validUntil: 'Today, 9:00 PM',
    location: '104West!',
    message: 'Extra swipe for today! 🍽️',
    hoursLeft: 5.5,
    status: SWIPE_STATUS.PENDING,
    createdAt: 'Nov 15, 3:00 PM',
    expiresAt: new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Transfer History (all past transfers)
export const mockTransferHistory = [
  {
    id: 'swipe_006',
    donorId: 'user_001',
    recipientId: 'user_002',
    recipient: 'Jamie Chen',
    status: SWIPE_STATUS.COMPLETED,
    validUntil: 'Nov 13, 7:00 PM',
    location: 'Okenshields',
    createdAt: 'Nov 13, 4:15 PM',
    usedAt: 'Nov 13, 6:30 PM'
  },
  {
    id: 'swipe_007',
    donorId: 'user_001',
    recipientId: 'user_004',
    recipient: 'Sarah Williams',
    status: SWIPE_STATUS.COMPLETED,
    validUntil: 'Nov 12, 8:00 PM',
    location: 'Becker House Dining Room',
    createdAt: 'Nov 12, 5:00 PM',
    usedAt: 'Nov 12, 7:15 PM'
  },
  {
    id: 'swipe_008',
    donorId: 'user_001',
    recipientId: 'user_003',
    recipient: 'Alex Kumar',
    status: SWIPE_STATUS.COMPLETED,
    validUntil: 'Nov 11, 8:00 PM',
    location: 'Cook House Dining Room',
    createdAt: 'Nov 11, 6:30 PM',
    usedAt: 'Nov 11, 7:45 PM'
  }
];

// Mock Impact Stats for the current user
export const mockImpactStats = {
  planName: mockUsers.currentUser.planType,
  daysLeft: mockUsers.currentUser.planDaysRemaining,
  thisWeekUsed: mockUsers.currentUser.thisWeekUsed,
  thisWeekTotal: mockUsers.currentUser.thisWeekTotal,
  weekProgress: Math.round((mockUsers.currentUser.thisWeekUsed / mockUsers.currentUser.thisWeekTotal) * 100),
  swipesShared: mockUsers.currentUser.swipesShared,
  mealsGiven: mockUsers.currentUser.swipesShared
};

// Helper function to generate a unique swipe code
export const generateSwipeCode = () => {
  const segments = 4;
  const segmentLength = 4;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude similar looking characters
  
  let code = 'SWIPE';
  for (let i = 0; i < segments; i++) {
    code += '-';
    for (let j = 0; j < segmentLength; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return code;
};

// Helper function to calculate hours until expiration
export const getHoursLeft = (expiresAt) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const hoursLeft = (expiry - now) / (1000 * 60 * 60);
  return Math.max(0, hoursLeft).toFixed(1);
};

export default {
  mockUsers,
  mockMySwipes,
  mockIncomingSwipes,
  mockTransferHistory,
  mockImpactStats,
  generateSwipeCode,
  getHoursLeft
};