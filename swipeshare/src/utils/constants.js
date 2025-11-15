// Dining Hall Constants
export const DINING_HALLS = {
  CENTRAL: {
    name: 'Central Campus',
    halls: ['Okenshields']
  },
  WEST: {
    name: 'West Campus',
    halls: [
      '104West!',
      'Becker House Dining Room',
      'Cook House Dining Room',
      "Jansen's Dining Room at Bethe House",
      'Keeton House Dining Room',
      'Rose House Dining Room'
    ]
  },
  NORTH: {
    name: 'North Campus',
    halls: [
      'Morrison Dining Room',
      'North Star Dining Room',
      'Risley Dining Room'
    ]
  }
};

// Get all dining halls as a flat array
export const getAllDiningHalls = () => {
  return [
    ...DINING_HALLS.CENTRAL.halls,
    ...DINING_HALLS.WEST.halls,
    ...DINING_HALLS.NORTH.halls
  ];
};

// Get dining halls by campus
export const getDiningHallsByCampus = (campus) => {
  return DINING_HALLS[campus]?.halls || [];
};

// Swipe Status
export const SWIPE_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired'
};

// Validity Options
export const VALIDITY_OPTIONS = {
  TODAY: { value: 'today', label: 'Today only' },
  WEEK: { value: 'week', label: 'This week' },
  MONTH: { value: 'month', label: 'End of month' }
};

// Meal Plan Types
export const MEAL_PLANS = {
  UNLIMITED: 'Unlimited Plan',
  FOURTEEN: '14 Meals/Week',
  TEN: '10 Meals/Week',
  SEVEN: '7 Meals/Week'
};

// User Types
export const USER_TYPES = {
  DONOR: 'donor',
  RECIPIENT: 'recipient'
};

export default {
  DINING_HALLS,
  getAllDiningHalls,
  getDiningHallsByCampus,
  SWIPE_STATUS,
  VALIDITY_OPTIONS,
  MEAL_PLANS,
  USER_TYPES
};
