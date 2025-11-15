# swipeshare

# SwipeShare - Meal Swipe Transfer Platform

## 🎯 Project Overview

**SwipeShare** is a Ticketmaster-style mobile platform that enables students to digitally transfer meal swipes to other verified students. The app uses AI-powered matching to connect students with extra meal swipes to those experiencing food insecurity.

### The Problem
- Students lose thousands of unused meal swipes each semester
- Other students face food insecurity
- No easy way to transfer or donate unused swipes
- Current GET Mobile app doesn't support peer-to-peer transfers

### The Solution
SwipeShare creates a virtual swipe transfer system where:
1. **Donors** create digital meal swipes with QR codes
2. **AI matching** prioritizes students with genuine need
3. **Recipients** receive QR codes on their phones (like Ticketmaster)
4. **Dining halls** scan QR codes to validate and complete transfers

---

## 📱 Key Features

### 1. Virtual Swipe Transfer
- Create digital meal swipe tokens
- Generate unique QR codes for each transfer
- Set validity periods and location restrictions
- Transfer instantly to verified students

### 2. AI-Powered Matching
- Prioritizes students without meal plans
- Considers location and timing compatibility
- Tracks reliability and completion rates
- Ensures fair distribution (prevents over-receiving)

### 3. Ticketmaster-Style UX
- Clean, modern interface inspired by Ticketmaster
- Full-screen QR code display
- Apple Wallet integration (future)
- Real-time transfer notifications

### 4. Verification & Security
- University email verification required
- Student ID validation
- Cryptographic QR code signatures
- GPS verification at dining halls
- Rate limiting to prevent fraud

### 5. Impact Tracking
- Track meals shared and received
- Community impact dashboard
- Completion rate monitoring
- Reputation system for donors and recipients

---

## 🏗️ Technical Architecture

### Frontend Stack
```
React 18+ (Functional Components + Hooks)
├── Tailwind CSS (Utility-first styling)
├── Lucide React (Icons)
├── React Hooks (useState, useEffect, useContext)
└── Mobile-first responsive design
```

### Backend Stack (Recommended)
```
Node.js + Express
├── PostgreSQL (User data, transactions)
├── Redis (Session management, rate limiting)
├── JWT (Authentication tokens)
├── Anthropic Claude API (AI matching)
└── QR Code Generation (qrcode library)
```

### Data Flow
```
┌─────────────────────────────────────┐
│   User Interface (React App)       │
│   - Create swipe                    │
│   - View inbox                      │
│   - Scan QR codes                   │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   API Layer (Express)               │
│   - Authentication                  │
│   - Swipe management                │
│   - AI matching requests            │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   AI Matching Engine                │
│   (Claude API)                      │
│   - Analyze recipient needs         │
│   - Prioritize by urgency           │
│   - Generate optimal matches        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   Database (PostgreSQL)             │
│   - Users & verification            │
│   - Virtual swipes                  │
│   - Transaction history             │
│   - Reputation scores               │
└─────────────────────────────────────┘
```

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  student_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  meal_plan_type VARCHAR(100),
  meal_plan_linked BOOLEAN DEFAULT FALSE,
  
  -- Reputation
  rating DECIMAL(3,2) DEFAULT 5.0,
  completion_rate DECIMAL(5,2) DEFAULT 100.0,
  swipes_shared INTEGER DEFAULT 0,
  swipes_received INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  verified_at TIMESTAMP,
  last_active TIMESTAMP
);
```

### Virtual Swipes Table
```sql
CREATE TABLE virtual_swipes (
  id UUID PRIMARY KEY,
  qr_code VARCHAR(500) UNIQUE NOT NULL,
  display_code VARCHAR(50) UNIQUE NOT NULL,
  
  -- Ownership
  original_owner UUID REFERENCES users(id),
  current_owner UUID REFERENCES users(id),
  transferred_at TIMESTAMP,
  
  -- Validity
  created_at TIMESTAMP DEFAULT NOW(),
  valid_from TIMESTAMP NOT NULL,
  valid_until TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'available',
  
  -- Restrictions
  dining_halls JSONB,
  meal_times JSONB,
  quantity INTEGER DEFAULT 1,
  
  -- Usage
  used_at TIMESTAMP,
  used_at_location VARCHAR(255),
  confirmed_by_donor BOOLEAN DEFAULT FALSE,
  confirmed_by_recipient BOOLEAN DEFAULT FALSE,
  
  -- Security
  security_hash VARCHAR(255) NOT NULL,
  gps_verified BOOLEAN DEFAULT FALSE
);
```

### Transfer History Table
```sql
CREATE TABLE transfer_history (
  id UUID PRIMARY KEY,
  swipe_id UUID REFERENCES virtual_swipes(id),
  from_user UUID REFERENCES users(id),
  to_user UUID REFERENCES users(id),
  ai_match_score DECIMAL(5,2),
  timestamp TIMESTAMP DEFAULT NOW(),
  
  -- Feedback
  donor_rating INTEGER,
  recipient_rating INTEGER,
  issues TEXT
);
```

---

## 🤖 AI Matching Algorithm

### Claude API Integration

The AI matching system uses Claude to analyze and prioritize recipients based on multiple factors:

```javascript
async function matchSwipeToRecipient(virtualSwipe, potentialRecipients) {
  const prompt = `
Match this virtual meal swipe with the most appropriate recipient.

SWIPE DETAILS:
- Quantity: ${virtualSwipe.quantity}
- Valid until: ${virtualSwipe.validUntil}
- Dining halls: ${virtualSwipe.diningHalls.join(', ')}
- Meal times: ${virtualSwipe.mealTimes.join(', ')}

POTENTIAL RECIPIENTS (${potentialRecipients.length}):
${potentialRecipients.map((r, i) => `
${i + 1}. ${r.name}
   - Meal plan: ${r.hasMealPlan ? 'Has plan' : 'No meal plan'}
   - Recent requests: ${r.requestsThisWeek}/week
   - Times helped: ${r.timesReceived}
   - Completion rate: ${r.completionRate}%
   - Need score: ${r.needScore}/10
   - Urgency: ${r.urgency}
`).join('\n')}

Rank recipients by:
1. Genuine need (no meal plan = highest priority)
2. Reliability (high completion rate)
3. Fairness (hasn't received too recently)
4. Logistics (location, timing)

Return top 3 matches with scores in JSON.
`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }]
    })
  });

  const data = await response.json();
  return JSON.parse(data.content[0].text);
}
```

### Matching Criteria

**Priority Factors (Weighted):**
1. **Need Level (40%)** - Students without meal plans ranked highest
2. **Reliability (25%)** - Completion rate and past behavior
3. **Fairness (20%)** - Time since last received, frequency limits
4. **Logistics (15%)** - Location proximity, schedule compatibility

**Need Score Calculation:**
```javascript
function calculateNeedScore(student) {
  let score = 0;
  
  // No meal plan = highest priority
  if (!student.hasMealPlan) score += 40;
  
  // Request frequency indicates genuine need
  score += Math.min(student.requestsThisWeek * 5, 25);
  
  // Financial aid or food pantry usage
  if (student.hasFinancialAid) score += 15;
  if (student.usesFoodPantry) score += 20;
  
  return Math.min(score, 100);
}
```

---

## 🔒 Security Features

### 1. QR Code Security
```javascript
// Generate cryptographically secure QR codes
function generateSecureQRCode(swipeId, userId) {
  const payload = {
    swipeId,
    userId,
    timestamp: Date.now(),
    validUntil: swipe.validUntil
  };
  
  // Create HMAC signature
  const signature = crypto
    .createHmac('sha256', process.env.SECRET_KEY)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return {
    code: `SWIPE-${generateCode()}`,
    qrData: Buffer.from(JSON.stringify({...payload, signature})).toString('base64'),
    signature
  };
}
```

### 2. Verification Requirements
- ✅ University email verification (.edu domain)
- ✅ Student ID photo upload with AI validation
- ✅ GPS location verification at dining halls
- ✅ Rate limiting (max 5 transfers per day)
- ✅ Two-factor authentication for high-value accounts

### 3. Fraud Prevention
```javascript
// Anti-fraud checks
async function validateSwipeUsage(swipeId, location) {
  // Check if swipe already used
  if (swipe.status === 'used') throw new Error('Already redeemed');
  
  // Verify GPS location matches dining hall
  if (!isNearDiningHall(location, swipe.diningHalls)) {
    throw new Error('Location verification failed');
  }
  
  // Check for suspicious patterns
  const recentActivity = await getUserRecentActivity(swipe.currentOwner);
  if (recentActivity.swipesUsedToday > 5) {
    flagForReview(swipe.currentOwner);
    throw new Error('Daily limit exceeded');
  }
  
  return true;
}
```

---

## 🎨 UI/UX Components

### Component Structure
```
src/
├── components/
│   ├── Home/
│   │   ├── HeroCard.jsx          (Plan overview)
│   │   ├── QuickActions.jsx      (Primary CTAs)
│   │   └── RecentActivity.jsx    (Transaction feed)
│   ├── Transfer/
│   │   ├── SwipeQuantity.jsx     (Select 1-5 swipes)
│   │   ├── ValiditySelector.jsx  (Time restrictions)
│   │   ├── DiningHallPicker.jsx  (Location filters)
│   │   └── AIMatchButton.jsx     (AI matching CTA)
│   ├── Inbox/
│   │   ├── SwipeCard.jsx         (Incoming swipe display)
│   │   ├── QRCodeDisplay.jsx     (QR code viewer)
│   │   └── SwipeDetails.jsx      (Validity, location, message)
│   ├── MySwipes/
│   │   ├── PlanOverview.jsx      (Meal plan stats)
│   │   └── TransferList.jsx      (Active transfers)
│   ├── Navigation/
│   │   ├── Header.jsx            (Top app bar)
│   │   └── BottomNav.jsx         (Tab navigation)
│   └── Shared/
│       ├── QRModal.jsx           (Full-screen QR)
│       ├── Button.jsx            (Reusable button)
│       └── StatusBadge.jsx       (Pending/Complete/Expired)
└── utils/
    ├── api.js                    (API calls)
    ├── qrcode.js                 (QR generation)
    └── validation.js             (Input validation)
```

### Design System

**Colors:**
```javascript
const colors = {
  primary: {
    50: '#EFF6FF',   // Light blue backgrounds
    500: '#3B82F6',  // Primary buttons
    600: '#2563EB',  // Primary hover
    700: '#1D4ED8'   // Dark accents
  },
  success: '#10B981',  // Completed status
  warning: '#F59E0B',  // Pending status
  error: '#EF4444',    // Cancelled/Error
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    600: '#4B5563',
    900: '#111827'
  }
};
```

**Typography:**
```css
/* Headings */
h1: text-2xl font-bold (24px)
h2: text-xl font-semibold (20px)
h3: text-lg font-semibold (18px)

/* Body */
body: text-base (16px)
caption: text-sm (14px)
label: text-xs (12px)

/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ...
```

---

## 🚀 Implementation Roadmap

### Phase 1: MVP (Hackathon - 10 hours)
**Goal:** Working prototype with core features

**Features:**
- ✅ Virtual swipe creation flow
- ✅ QR code generation
- ✅ Basic AI matching (simulated)
- ✅ Transfer notifications
- ✅ Email verification only
- ✅ Demo with mock data

**Tech Stack:**
- React + Tailwind CSS
- Local state management
- Hardcoded AI responses
- Mock API calls

### Phase 2: Beta Launch (Weeks 1-4)
**Goal:** 50 beta users testing the platform

**Features:**
- User authentication (JWT)
- Real database (PostgreSQL)
- Claude API integration for matching
- Student ID verification
- Reputation system
- Push notifications
- Analytics dashboard

**Metrics to Track:**
- Daily active users
- Swipes transferred
- Completion rate
- Average match score
- User satisfaction (NPS)

### Phase 3: University Partnership (Months 2-3)
**Goal:** Official approval and dining hall integration

**Activities:**
- Present pilot data to dining services
- Negotiate official partnership
- Integrate with dining hall POS systems
- Staff training on QR scanner
- Scale to 500+ users
- Marketing campaign

### Phase 4: Full Integration (Semester 2)
**Goal:** Campus-wide rollout with GET Mobile API

**Features:**
- Direct GET Mobile API integration
- Automated account reconciliation
- Real-time swipe balance updates
- Apple Wallet integration
- Multi-university expansion
- Mobile app (iOS + Android)

---

## 📈 Metrics & Analytics

### Key Performance Indicators (KPIs)

**User Acquisition:**
- Daily active users (DAU)
- Monthly active users (MAU)
- New user signups per week
- Verification completion rate

**Engagement:**
- Swipes transferred per week
- Average swipes per donor
- Completion rate (% of swipes actually used)
- Time to match (donor post → recipient claim)

**Impact:**
- Total meals shared
- Students helped
- Food waste prevented (estimated lbs)
- Community satisfaction score

**Quality:**
- AI match accuracy
- Donor satisfaction rating
- Recipient satisfaction rating
- Platform uptime %

### Analytics Dashboard
```javascript
// Example metrics API
GET /api/metrics/summary
{
  "totalSwipesShared": 1247,
  "studentsHelped": 342,
  "completionRate": 87.3,
  "averageMatchScore": 8.7,
  "mealsThisWeek": 89,
  "topDiningHall": "North Campus Dining"
}
```

---

## 🤝 University Partnership Strategy

### Pitch to Dining Services

**Subject:** Student Initiative to Reduce Meal Swipe Waste

**Email Template:**
```
Dear [Dining Services Director],

I'm a student at [University] who developed SwipeShare, 
a platform to help students coordinate meal sharing within 
existing dining hall policies.

THE PROBLEM:
• Students lose thousands of unused meal swipes each semester
• Other students face food insecurity
• Current system has no way to connect them

OUR SOLUTION:
• Students transfer virtual meal swipes via mobile app
• AI matches donors with students who genuinely need help
• QR codes make redemption simple and secure
• Works within existing GET Mobile policies

PILOT PROPOSAL:
• 1 semester pilot at [Dining Hall Name]
• Student-run, no cost to university
• Monthly impact reports
• Can integrate with your POS systems

BENEFITS FOR [UNIVERSITY]:
✓ Addresses student food insecurity (aligns with DEI goals)
✓ Reduces food waste (sustainability win)
✓ Positive press and student satisfaction
✓ Zero cost implementation
✓ Data insights on food insecurity patterns

We already have 50 students interested in beta testing.

Can we schedule 15 minutes to discuss?

Best regards,
[Your Name]
```

### Partnership Benefits
1. **Food Security Initiative** - Aligns with university DEI goals
2. **Sustainability** - Reduces food waste significantly
3. **Zero Cost** - Student-built and maintained
4. **Data Insights** - Track food insecurity patterns
5. **PR Opportunity** - "University fights food insecurity"
6. **Student Satisfaction** - Community-building program

---

## 🛠️ Setup Instructions

### Local Development

**Prerequisites:**
```bash
Node.js 18+ installed
npm or yarn
```

**Installation:**
```bash
# Clone repository
git clone https://github.com/yourusername/swipeshare.git
cd swipeshare

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev
```

**Environment Variables:**
```bash
# .env file
REACT_APP_API_URL=http://localhost:3001
ANTHROPIC_API_KEY=sk-ant-your-key-here
DATABASE_URL=postgresql://user:pass@localhost:5432/swipeshare
JWT_SECRET=your-secret-key
REDIS_URL=redis://localhost:6379
```

### Deployment

**Recommended Platforms:**
- **Frontend:** Vercel or Netlify
- **Backend:** Railway, Render, or Heroku
- **Database:** Supabase or Railway PostgreSQL
- **Redis:** Upstash

**Deploy to Vercel:**
```bash
npm install -g vercel
vercel
```

---

## 📱 Mobile App (Future)

### React Native Version

**Features:**
- Native iOS and Android apps
- Apple Wallet / Google Pay integration
- Push notifications
- Offline QR code viewing
- Faster performance
- Native camera for QR scanning

**Tech Stack:**
```
React Native + Expo
├── React Navigation (routing)
├── Expo Camera (QR scanning)
├── AsyncStorage (offline data)
└── Expo Notifications (push)
```

---

## 🧪 Testing Strategy

### Unit Tests
```javascript
// Example test for AI matching
describe('AI Matching Algorithm', () => {
  it('prioritizes students without meal plans', async () => {
    const recipients = [
      { id: 1, hasMealPlan: true, needScore: 50 },
      { id: 2, hasMealPlan: false, needScore: 80 },
    ];
    
    const matches = await matchSwipeToRecipient(swipe, recipients);
    expect(matches[0].id).toBe(2); // No meal plan prioritized
  });
});
```

### Integration Tests
- API endpoint testing
- Database transaction integrity
- QR code generation and validation
- Authentication flow

### User Testing
- Usability testing with 10-20 students
- A/B testing on UI variations
- Accessibility testing (WCAG compliance)
- Performance testing (load times)

---

## 📞 Support & Community

### Contact
- **Email:** support@swipeshare.app
- **Discord:** discord.gg/swipeshare
- **Instagram:** @swipeshare_app

### Contributing
We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md)

### License
MIT License - See [LICENSE](LICENSE)

---

## 🙏 Acknowledgments

- **GET Mobile / Transact** - Existing dining platform
- **Anthropic Claude** - AI matching engine
- **Ticketmaster** - UX inspiration
- **Student Food Pantries** - Partner organizations

---

## 📝 Changelog

### v1.0.0 (MVP)
- Initial release
- Core swipe transfer functionality
- Basic AI matching
- QR code generation

### Future Versions
- v1.1: University partnership integration
- v1.2: GET Mobile API integration
- v2.0: Native mobile apps
- v2.1: Multi-university expansion

---

**Built with ❤️ by students, for students**