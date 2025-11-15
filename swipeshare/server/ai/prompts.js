/**
 * prompts.js
 * AI prompt templates - UPDATED to remove physical meetup coordination
 */

/**
 * Build matching prompt
 */
export function buildMatchingPrompt(offer, requests, userProfiles) {
  const requestDetails = requests.map((req, i) => {
    const user = userProfiles.find(u => u.id === req.userId);
    
    return `
REQUEST ${i + 1}:
User: ${req.userName}
Swipes needed: ${req.quantity}
Urgency: ${req.urgency}

USER CONTEXT:
- Has meal plan: ${user?.hasMealPlan ? 'Yes' : 'No'}
- Total times given help: ${user?.stats?.swipesGiven || 0}
- Total times received help: ${user?.stats?.swipesReceived || 0}
- Net balance: ${(user?.stats?.swipesGiven || 0) - (user?.stats?.swipesReceived || 0)}
  ${(user?.stats?.swipesGiven || 0) > (user?.stats?.swipesReceived || 0) 
    ? '(NET GIVER - has helped others more than received)' 
    : '(NET RECEIVER - has received more than given)'}
- Request frequency: ${user?.needProfile?.requestFrequency || 0} per week
- Completion rate: ${user?.stats?.completionRate || 0}%
`;
  }).join('\n---\n');

  return `You are matching a swipe OFFER with REQUESTS.

IMPORTANT: Users can be BOTH givers and receivers at different times!
- A "net giver" (given > received) who occasionally needs help should be prioritized
- A user who both gives AND receives shows healthy community participation
- Prioritize users with genuine need, but also reward community contributors

Consider:
1. GENUINE NEED (40%): No meal plan, high request frequency
2. COMMUNITY CONTRIBUTION (25%): Net givers who occasionally need help
3. RELIABILITY (20%): High completion rate
4. FAIRNESS (15%): Balance across all users

${requestDetails}

Return top 5 matches with reasoning.`;
}

// export function buildMatchingPrompt(offer, requests, userProfiles) {
//   const requestDetails = requests.map((req, i) => {
//     const user = userProfiles.find(u => u.id === req.userId);
    
//     return `
// REQUEST ${i + 1} (ID: ${req.id}):
// User: ${req.userName}
// Location: ${user?.location || 'Unknown'}
// Swipes needed: ${req.quantity}
// Preferred dining hall: ${req.preferredDiningHalls?.join(', ') || 'Any'}
// Meal time: ${req.mealTime}
// Needed by: ${new Date(req.neededBy).toLocaleString()}
// Urgency: ${req.urgency}

// USER PROFILE:
// - Has meal plan: ${user?.needProfile?.hasMealPlan ? 'Yes' : 'No'}
// - Request frequency: ${user?.needProfile?.requestFrequency || 0} per week
// - Times received help: ${user?.stats?.swipesReceived || 0}
// - Times helped others: ${user?.stats?.swipesShared || 0}
// - Completion rate: ${user?.stats?.completionRate || 0}%
// - Account age: ${calculateAccountAge(user?.accountCreated)}
// `;
//   }).join('\n---\n');

//   return `You are a matching algorithm for SwipeShare, a campus meal swipe sharing platform.
// Your goal is to match students who have extra dining hall swipes with students who need them,
// prioritizing students with genuine food insecurity while maintaining fairness.

// SWIPE OFFER DETAILS:
// - Donor: ${offer.giverName || 'Anonymous'}
// - Swipes available: ${offer.quantity}
// - Dining hall(s): ${offer.diningHalls?.length > 0 ? offer.diningHalls.join(', ') : 'Any dining hall'}
// - Valid until: ${new Date(offer.expiresAt).toLocaleString()}
// - Reason for sharing: ${offer.reason || 'Not specified'}

// ACTIVE REQUESTS (${requests.length} total):
// ${requestDetails}

// MATCHING CRITERIA (prioritize in this order):

// 1. NEED ASSESSMENT (40% weight - HIGHEST PRIORITY):
//    - Students without meal plans who frequently request help
//    - Low historical receive count (haven't been helped much yet)
//    - High urgency indicators
//    - Recent account activity showing genuine need

// 2. LOGISTICS (30% weight):
//    - Dining hall preference match
//    - Meal time compatibility
//    - Quantity match
//    - Timing (needed by date)

// 3. RELIABILITY (20% weight):
//    - High completion rate (actually uses swipes received)
//    - Active account with recent usage
//    - Positive historical behavior

// 4. FAIRNESS (10% weight):
//    - Spread help across different users
//    - Give newer users a chance
//    - Consider recent match history

// IMPORTANT GUIDELINES:
// - A student WITHOUT a meal plan requesting frequently should score MUCH higher
// - Recent urgent requests (within 24 hours) should be prioritized
// - Users with 90%+ completion rates are reliable
// - Be cautious of brand new accounts with high urgency (potential abuse)
// - Balance need vs. fairness - genuine need trumps fairness

// NOTE: This is a DIGITAL transfer system. The requester will receive a QR code they can use at the dining hall independently. No physical meetup is required.

// Return a JSON array of the top 5 matches, ranked by priority:
// [
//   {
//     "requestId": "req_123",
//     "matchScore": 85,
//     "reasoning": "Student has no meal plan, high request frequency (7/week), and 95% completion rate. Dining hall matches perfectly.",
//     "priority": "high",
//     "concerns": null
//   }
// ]

// Ensure matchScore is 0-100, priority is "high"/"medium"/"low", and reasoning explains the key factors.`;
// }

/**
 * Build reverse matching prompt (request → offers)
 */
export function buildReverseMatchingPrompt(request, offers, userProfiles) {
  const offerDetails = offers.map((off, i) => {
    const user = userProfiles.find(u => u.id === off.giverId);
    
    return `
OFFER ${i + 1} (ID: ${off.id}):
Donor: ${off.giverName || 'Anonymous'}
Swipes available: ${off.quantity}
Dining halls: ${off.diningHalls?.length > 0 ? off.diningHalls.join(', ') : 'Any'}
Valid until: ${new Date(off.expiresAt).toLocaleString()}
Reason: ${off.reason || 'Not specified'}

DONOR PROFILE:
- Times shared: ${user?.stats?.swipesShared || 0}
- Times received: ${user?.stats?.swipesReceived || 0}
- Rating: ${user?.stats?.rating || 'N/A'}
- Account age: ${calculateAccountAge(user?.accountCreated)}
`;
  }).join('\n---\n');

  return `You are matching a meal swipe REQUEST with available OFFERS.

REQUEST DETAILS:
- Requester: ${request.requesterName}
- Swipes needed: ${request.quantity}
- Preferred dining halls: ${request.preferredDiningHalls?.join(', ') || 'Any'}
- Meal time: ${request.mealTime}
- Needed by: ${new Date(request.neededBy).toLocaleString()}
- Urgency: ${request.urgency}

AVAILABLE OFFERS (${offers.length} total):
${offerDetails}

MATCHING CRITERIA:

1. AVAILABILITY (40% weight):
   - Has enough swipes for request quantity
   - Valid timeframe (offer expires after request needed-by date)
   - Dining hall matches

2. DONOR RELIABILITY (30% weight):
   - Good track record of completing transfers
   - Positive ratings from past recipients
   - Active account

3. CONVENIENCE (20% weight):
   - Dining hall match/proximity
   - Meal time compatibility
   - Expiration timing

4. FAIRNESS (10% weight):
   - Donors who share frequently should be matched
   - Balance across different donors

NOTE: This is a DIGITAL transfer. The requester will receive a QR code to use independently at the dining hall.

Return JSON array of top 5 offers:
[
  {
    "offerId": "off_456",
    "matchScore": 90,
    "reasoning": "Perfect dining hall match, donor has 100% completion rate, expires well after needed-by date.",
    "priority": "high"
  }
]`;
}

/**
 * REMOVED: buildCoordinationPrompt
 * No longer needed since there's no physical meetup coordination
 */

/**
 * Build success notification prompt
 */
export function buildSuccessNotificationPrompt(transfer, giverName, requesterName) {
  return `Generate a brief, friendly notification message for a successful swipe transfer.

TRANSFER DETAILS:
- Giver: ${giverName}
- Receiver: ${requesterName}
- Quantity: ${transfer.quantity} swipe(s)
- Dining hall: ${transfer.diningHall}

Generate TWO messages:

1. For GIVER (donor):
   - Thank them for their generosity
   - Let them know the transfer is complete
   - Mention their swipes have been deducted
   - Keep it under 50 words

2. For RECEIVER (requester):
   - Let them know they've received swipes
   - How to use the QR code at dining hall
   - Express gratitude
   - Keep it under 50 words

Return as JSON:
{
  "giverMessage": "...",
  "receiverMessage": "..."
}

Keep tone warm, appreciative, and encouraging community spirit. Use 1 emoji max.`;
}

/**
 * Helper function
 */
function calculateAccountAge(createdDate) {
  if (!createdDate) return 'Unknown';
  
  const days = Math.floor((Date.now() - new Date(createdDate)) / (1000 * 60 * 60 * 24));
  
  if (days < 7) return `${days} days (new user)`;
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  return `${Math.floor(days / 30)} months`;
}

export default {
  buildMatchingPrompt,
  buildReverseMatchingPrompt,
  buildSuccessNotificationPrompt
};