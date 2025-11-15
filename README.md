# swipeshare

# SwipeShare - Meal Swipe Transfer Platform

## 🎯 Project Overview

**SwipeShare** is a Ticketmaster-style mobile platform that enables students to digitally transfer meal swipes to other verified students. The app uses AI-powered matching to connect students with extra meal swipes to those experiencing food insecurity.

### The Problem
- Students lose thousands of unused meal swipes each semester (since meal swipes expire on weekly basis)
- Other students face food insecurity
- No easy way to transfer or donate unused swipes
- Current GET Mobile app doesn't support peer-to-peer transfers

### The Solution
SwipeShare creates a virtual swipe transfer system where:
1. **Donors** create digital meal swipes with QR codes
2. **AI matching** prioritizes students with genuine need
3. **Send Meal Swipes to Specified Person** can send email to person with the QR code of the virtual meal swipe
4. **Recipients** receive QR codes on their phones (like Ticketmaster)
5. **Dining halls** scan QR codes to validate and complete transfers

### How to Run
1. Install Node.js (if not already installed)
2. cd /swipeshare/swipeshare
3. npm install
4. npm run build
5. npm start

---

## 📱 Key Features

### 1. Virtual Swipe Transfer
- Create digital meal swipe tokens
- Can choose to use AI to find match or send to a specific person
- Generate unique QR codes for each transfer
- Set validity periods and location restrictions (optional)
- Transfer instantly to verified students

### 2. AI-Powered Matching
- Prioritizes students without meal plans
- Considers location and timing compatibility
- Tracks reliability and completion rates
- Ensures fair distribution (prevents over-receiving)

### 3. Ticketmaster-Style UX
- Clean, modern interface inspired by Ticketmaster
- Full-screen QR code display
- Real-time transfer notifications

### 4. Profile Page
- Displays user info along with rating score
- Displays badges & achievements

### 5. Impact Tracking
- Track total meal swipes shared and number of students helped
- Community impact dashboard
- Completion rate monitoring
- Reputation system for donors and recipients (with reviews of the donors)

### 6. Home Page
- Displays number of meal swipes sent in total
- Displays incoming meal swipes (inbox)
- Shows recent activity
- Allows for quick actions (like transfer swipe and viewing current inbox)
  
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

### Backend Stack 
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






