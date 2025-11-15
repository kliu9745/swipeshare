# SwipeShare - Meal Swipe Transfer Platform

## 🎯 Project Overview

**SwipeShare** is a Ticketmaster-style mobile platform that enables students to digitally transfer meal swipes to other verified students. The app uses AI-powered matching to connect students with extra meal swipes to those experiencing food insecurity.

### The Problem
- Students lose thousands of unused meal swipes each semester (swipes expire weekly)
- Food insecurity among students
- No simple way to transfer or donate unused swipes
- Existing apps (like GET Mobile) don't support peer-to-peer transfers

### The Solution
SwipeShare creates a virtual swipe transfer system where:
1. **Donors** create digital meal swipes with QR codes
2. **AI Matching** prioritizes students with genuine need using user profiles, urgency, and reliability
3. **Recipients** receive QR codes on their phones (like Ticketmaster)
4. **Dining halls** scan QR codes to validate and complete transfers
5. **Optional direct transfers** allow donors to select specific recipients

### How to Run
1. Install Node.js (if not installed)
2. `cd /swipeshare/swipeshare`
3. `npm install`
4. `npm run build`
5. `npm start`

---

## 📱 Key Features

### 1. Virtual Swipe Transfer
- Create digital meal swipe tokens with QR codes
- AI-assisted or manual transfer
- Set validity periods and optional location restrictions
- Instant transfers to verified students

### 2. AI-Powered Matching
- Prioritizes students without meal plans
- Considers location, dining hall, and timing compatibility
- Tracks reliability, completion rates, and community contribution
- Provides reasoning and optional short bios for each recommended match
- Ensures fairness and prevents over-receiving

### 3. Ticketmaster-Style UX
- Clean, modern interface
- Full-screen QR code display
- Real-time transfer notifications

### 4. Profile Page
- Displays user info, rating score, badges & achievements
- Helps donors and recipients understand trustworthiness

### 5. Impact Tracking
- Monitor total meal swipes shared and students helped
- Community impact dashboard
- Completion rate and reputation tracking

### 6. Home Page
- Displays total swipes sent
- Shows incoming meal swipes (inbox)
- Recent activity feed
- Quick actions for transfers and inbox management

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






