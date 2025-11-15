/**
 * testData.js
 * COMBINED mock data and test functions
 * Merges original mockData.js with service-based testing
 */

import offerService from '../services/swipe/offerService';
import requestService from '../services/swipe/requestService';
import transferService from '../services/swipe/transferService';
import userService from '../services/user/userService';
import matchingEngine from '../services/ai/matchingEngine';
import { SWIPE_STATUS, MEAL_PLANS } from '../utils/constants';

// ==========================================
// ORIGINAL MOCK DATA STRUCTURE (Preserved)
// ==========================================

// Mock Users (Original structure)
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

// Mock Outgoing Swipes (Original)
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
    expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString()
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
    expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
  }
];

// Mock Incoming Swipes (Original)
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

// Mock Transfer History (Original)
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

// Mock Impact Stats (Original)
export const mockImpactStats = {
  planName: mockUsers.currentUser.planType,
  daysLeft: mockUsers.currentUser.planDaysRemaining,
  thisWeekUsed: mockUsers.currentUser.thisWeekUsed,
  thisWeekTotal: mockUsers.currentUser.thisWeekTotal,
  weekProgress: Math.round((mockUsers.currentUser.thisWeekUsed / mockUsers.currentUser.thisWeekTotal) * 100),
  swipesShared: mockUsers.currentUser.swipesShared,
  mealsGiven: mockUsers.currentUser.swipesShared
};

// ==========================================
// SERVICE-BASED TEST DATA (New)
// ==========================================

/**
 * Initialize test data in services
 * Call this once when app loads in development
 */
export function initializeTestData() {
  console.log('🧪 Initializing test data...');

  // Create test users in userService
  const users = createTestUsers();
  
  // Create test offers in offerService
  const offers = createTestOffers(users);
  
  // Create test requests in requestService
  const requests = createTestRequests(users);

  console.log('✅ Test data initialized:', {
    users: users.length,
    offers: offers.length,
    requests: requests.length
  });

  return { users, offers, requests };
}

/**
 * Create service-based test users
 */
function createTestUsers() {
  const testUsers = [
    {
      id: 'user_sarah',
      name: 'Sarah Williams',
      email: 'sarah@cornell.edu',
      location: 'North Campus',
      hasMealPlan: true,
      mealPlanType: '14-per-week',
      stats: {
        swipesShared: 12,
        swipesReceived: 3,
        completionRate: 95,
        rating: 4.8
      },
      needProfile: {
        hasMealPlan: true,
        requestFrequency: 1
      }
    },
    {
      id: 'user_jamie',
      name: 'Jamie Chen',
      email: 'jamie@cornell.edu',
      location: 'West Campus',
      hasMealPlan: false, // No meal plan - high need
      stats: {
        swipesShared: 2,
        swipesReceived: 15,
        completionRate: 100,
        rating: 5.0
      },
      needProfile: {
        hasMealPlan: false,
        requestFrequency: 7 // Requests often
      }
    },
    {
      id: 'user_alex',
      name: 'Alex Kumar',
      email: 'alex@cornell.edu',
      location: 'Central Campus',
      hasMealPlan: true,
      stats: {
        swipesShared: 5,
        swipesReceived: 8,
        completionRate: 85,
        rating: 4.5
      },
      needProfile: {
        hasMealPlan: true,
        requestFrequency: 3
      }
    },
    {
      id: 'user_marcus',
      name: 'Marcus Lee',
      email: 'marcus@cornell.edu',
      location: 'North Campus',
      hasMealPlan: true,
      mealPlanType: 'unlimited',
      stats: {
        swipesShared: 45,
        swipesReceived: 0,
        completionRate: 100,
        rating: 5.0
      },
      needProfile: {
        hasMealPlan: true,
        requestFrequency: 0
      }
    },
    // Add Jordan Smith (original mock currentUser)
    {
      id: 'user_001',
      name: 'Jordan Smith',
      email: 'jordan@cornell.edu',
      location: 'North Campus',
      hasMealPlan: true,
      mealPlanType: MEAL_PLANS.UNLIMITED,
      planDaysRemaining: 87,
      thisWeekUsed: 10,
      thisWeekTotal: 14,
      stats: {
        swipesShared: 24,
        swipesReceived: 0,
        completionRate: 98,
        rating: 4.8
      },
      needProfile: {
        hasMealPlan: true,
        requestFrequency: 0
      },
      badges: [
        { id: 'badge_1', name: '🌟 Super Donor', variant: 'success' },
        { id: 'badge_2', name: '💯 Reliable', variant: 'default' },
        { id: 'badge_3', name: '🤝 Community Helper', variant: 'default' }
      ]
    }
  ];

  // Add users to userService
  testUsers.forEach(user => {
    userService.createUser(user);
  });

  return testUsers;
}

/**
 * Create test offers
 */
function createTestOffers(users) {
  const offers = [];

  // Sarah's offer
  offers.push(offerService.createOffer('user_sarah', {
    giverName: 'Sarah Williams',
    quantity: 3,
    diningHalls: ['North'],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    reason: 'Going home for the weekend',
    matchingPreference: 'AI_MATCH'
  }));

  // Marcus's generous offer
  offers.push(offerService.createOffer('user_marcus', {
    giverName: 'Marcus Lee',
    quantity: 10,
    diningHalls: [],
    expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    reason: 'Have unlimited plan, happy to help!',
    matchingPreference: 'AI_MATCH'
  }));

  // Jordan's offer (original currentUser)
  offers.push(offerService.createOffer('user_001', {
    giverName: 'Jordan Smith',
    quantity: 5,
    diningHalls: [],
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    reason: 'Unlimited plan, happy to share!',
    matchingPreference: 'AI_MATCH'
  }));

  return offers;
}

/**
 * Create test requests
 */
function createTestRequests(users) {
  const requests = [];

  // Jamie's urgent request (no meal plan)
  requests.push(requestService.createRequest('user_jamie', {
    requesterName: 'Jamie Chen',
    quantity: 2,
    preferredDiningHalls: ['North', 'West'],
    mealTime: 'dinner',
    neededBy: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    urgency: 'HIGH',
    reason: 'No meal plan, need help this week',
    matchingPreference: 'AI_MATCH'
  }));

  // Alex's moderate request
  requests.push(requestService.createRequest('user_alex', {
    requesterName: 'Alex Kumar',
    quantity: 1,
    preferredDiningHalls: ['Central'],
    mealTime: 'lunch',
    neededBy: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    urgency: 'MEDIUM',
    reason: 'Ran out of swipes early this week',
    matchingPreference: 'AI_MATCH'
  }));

  return requests;
}

// ==========================================
// HELPER FUNCTIONS (Original)
// ==========================================

/**
 * Generate a unique swipe code
 */
export const generateSwipeCode = () => {
  const segments = 4;
  const segmentLength = 4;
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  
  let code = 'SWIPE';
  for (let i = 0; i < segments; i++) {
    code += '-';
    for (let j = 0; j < segmentLength; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return code;
};

/**
 * Calculate hours until expiration
 */
export const getHoursLeft = (expiresAt) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const hoursLeft = (expiry - now) / (1000 * 60 * 60);
  return Math.max(0, hoursLeft).toFixed(1);
};

// ==========================================
// TEST FUNCTIONS (Service Integration)
// ==========================================

/**
 * Test AI matching
 */
export async function testAIMatching() {
  console.log('🤖 Testing AI matching...');

  const offers = offerService.getActiveOffers();
  const requests = requestService.getActiveRequests();
  const users = [
    userService.getUserById('user_jamie'),
    userService.getUserById('user_alex')
  ];

  if (offers.length === 0 || requests.length === 0) {
    console.warn('⚠️ No offers or requests available. Run initializeTestData() first.');
    return;
  }

  const offer = offers[0];
  console.log('📦 Testing with offer:', offer);

  try {
    const matches = await matchingEngine.matchOfferToRequests(
      offer,
      requests,
      users
    );

    console.log('✅ AI Matching Results:', matches);
    return matches;
  } catch (error) {
    console.error('❌ AI matching failed:', error);
    return null;
  }
}

/**
 * Test transfer creation
 */
export async function testTransfer() {
  console.log('💸 Testing transfer creation...');

  try {
    const transfer = await transferService.createTransfer(
      'user_sarah',
      'user_jamie',
      {
        offerId: 'test_offer_1',
        requestId: 'test_request_1',
        quantity: 2,
        diningHall: 'North',
        matchScore: 95
      }
    );

    console.log('✅ Transfer created:', transfer);
    console.log('🎫 QR Code:', transfer.displayCode);
    return transfer;
  } catch (error) {
    console.error('❌ Transfer failed:', error);
    return null;
  }
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('🚀 Running all tests...\n');

  // Initialize data
  const data = initializeTestData();
  console.log('\n');

  // Test matching
  await testAIMatching();
  console.log('\n');

  // Test transfer
  await testTransfer();
  console.log('\n');

  console.log('✅ All tests complete!');
}

// ==========================================
// EXPORTS
// ==========================================

export default {
  // Original mock data
  mockUsers,
  mockMySwipes,
  mockIncomingSwipes,
  mockTransferHistory,
  mockImpactStats,
  
  // Helper functions
  generateSwipeCode,
  getHoursLeft,
  
  // Service-based test functions
  initializeTestData,
  testAIMatching,
  testTransfer,
  runAllTests
};