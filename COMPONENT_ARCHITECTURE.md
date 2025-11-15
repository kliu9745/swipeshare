# SwipeShare - Component Architecture

## Project Structure

```
src/
├── views/                          # Main Page Views (4 views)
│   ├── HomeView.js                # Feed of available swipes, AI matches
│   ├── TransferView.js            # Create and transfer swipes
│   ├── InboxView.js               # User's incoming swipes
│   ├── MySwipesView.js            # User's outgoing swipes
│   └── ProfileView.js             # User profile and impact stats
│
├── components/                     # Reusable UI Components
│   ├── layout/                    # App structure
│   │   ├── Header.js              # Top header with title and profile button
│   │   └── BottomNav.js           # Bottom navigation (4 tabs)
│   │
│   ├── swipes/                    # Swipe-related components
│   │   ├── SwipeCard.js           # Reusable card for swipes (outgoing/incoming)
│   │   └── QRCodeModal.js         # Full-screen QR code modal
│   │
│   ├── matching/                  # AI matching UI
│   │   ├── MatchingOption.js      # AI vs Manual matching options
│   │   └── MatchResult.js         # Display match results
│   │
│   ├── profile/                   # User profile components
│   │   ├── ImpactStats.js         # Impact card with stats
│   │   └── UserProfile.js         # User info card with ratings
│   │
│   └── common/                    # Generic reusable components
│       ├── Button.js              # Reusable button with variants
│       ├── Modal.js               # Reusable modal/dialog
│       ├── Card.js                # Reusable card container
│       ├── Badge.js               # Status badges
│       └── Stat.js                # Stat display
│
└── App.js                         # Main app component (orchestrates views)
```

## Component Overview

### Views (Pages)

#### HomeView.js
- **Purpose**: Dashboard with quick actions and recent activity
- **Features**:
  - Impact stats (plan type, days left, week progress)
  - Quick action buttons (Transfer, Inbox)
  - Recent activity feed
- **Props**: `onNavigate`, `mySwipes`

#### TransferView.js
- **Purpose**: Create and transfer meal swipes
- **Features**:
  - Select number of swipes (1-5)
  - Choose validity period (today, this week, end of month)
  - Select dining halls
  - AI matching option
  - Manual email transfer
- **Props**: `onTransfer`

#### InboxView.js
- **Purpose**: View incoming swipes from other users
- **Features**:
  - Display received swipes
  - Show QR code
  - Mark as used
  - View sender details
- **Props**: `incomingSwipes`, `onSwipeAction`

#### MySwipesView.js
- **Purpose**: Track all outgoing transfers
- **Features**:
  - Plan overview
  - List of active transfers
  - Status tracking (pending/completed)
  - Cancel transfer option
- **Props**: `mySwipes`, `onSwipeAction`

#### ProfileView.js
- **Purpose**: User profile and account management
- **Features**:
  - User info and rating
  - Account statistics
  - Badges and achievements
  - Settings and sign out
- **Props**: `onLogout`

### Layout Components

#### Header.js
- Top navigation bar with logo and profile button
- Sticky positioning

#### BottomNav.js
- Bottom tab navigation
- 4 main navigation items
- Shows notification badge on Inbox

### Swipes Components

#### SwipeCard.js
- Reusable card for displaying swipe information
- **Variants**: 
  - `outgoing`: Shows recipient, status, transfer controls
  - `incoming`: Shows donor, QR code, usage controls
- **Props**: `swipe`, `type`, `onAction`

#### QRCodeModal.js
- Full-screen modal for displaying QR codes
- Shows validity and location info
- Close button
- **Props**: `isOpen`, `onClose`, `swipe`

### Matching Components

#### MatchingOption.js
- Two options for matching:
  1. AI matching (automatic)
  2. Manual email entry
- Styled with gradient highlighting
- **Props**: `onAIMatch`, `onManual`

#### MatchResult.js
- Displays AI-generated matches
- Shows match score and compatibility
- Loading state
- **Props**: `matches`, `onSelectMatch`, `isLoading`

### Profile Components

#### ImpactStats.js
- Displays user impact statistics
- Progress bar for weekly swipe usage
- Shows swipes shared and meals given
- Gradient card styling
- **Props**: `stats`

#### UserProfile.js
- User avatar and name
- Star rating display
- Account statistics (reliability, completion rate, member since)
- **Props**: `user`

### Common Components

#### Button.js
- Reusable button component
- **Variants**: `primary`, `secondary`, `success`, `danger`, `gradient`
- **Sizes**: `sm`, `md`, `lg`, `full`

#### Modal.js
- Reusable modal/dialog
- **Modes**: Normal (centered) or fullscreen
- Handles open/close state
- **Props**: `isOpen`, `onClose`, `title`, `children`, `fullscreen`

#### Card.js
- Container component for content
- **Variants**: `default`, `bordered`, `gradient`, `highlighted`
- Optional click handler
- **Props**: `variant`, `className`, `onClick`, `children`

#### Badge.js
- Status badge display
- **Variants**: `default`, `success`, `warning`, `danger`, `pending`
- **Props**: `variant`, `children`

#### Stat.js
- Displays a statistic label and value
- Customizable background color
- **Props**: `label`, `value`, `color`

## Data Models

### Swipe Object
```javascript
{
  id: string,
  recipient: string,  // or 'donor' for incoming
  status: 'pending' | 'completed',
  validUntil: string,
  location: string,
  createdAt: string,
  
  // For incoming swipes:
  donor: string,
  code: string,  // QR code
  message: string,
  hoursLeft: number
}
```

### User Object
```javascript
{
  name: string,
  email: string,
  rating: number,  // 1-5
  reliability: 'High' | 'Medium' | 'Low',
  completionRate: number,  // 0-100
  memberSince: string
}
```

### Match Object
```javascript
{
  name: string,
  location: string,
  score: number,  // 0-1
  needScore: number,  // 0-10
  completionRate: number,
  hasMealPlan: boolean
}
```

## Usage Example

### In App.js (Main orchestrator)
```javascript
import HomeView from './views/HomeView';
import TransferView from './views/TransferView';

<div>
  {currentView === 'home' && 
    <HomeView onNavigate={handleNavigate} mySwipes={mySwipes} />
  }
  {currentView === 'transfer' && 
    <TransferView onTransfer={handleTransfer} />
  }
</div>
```

### Using Common Components
```javascript
import Button from './components/common/Button';
import Card from './components/common/Card';
import Badge from './components/common/Badge';

<Card variant="bordered">
  <Badge variant="success">Completed</Badge>
  <Button variant="primary" size="full">
    Transfer Swipe
  </Button>
</Card>
```

## Styling

All components use **Tailwind CSS** for styling:
- Color scheme: Blue primary (`blue-600`), green for success, red for danger
- Spacing: 6px grid (gap-1, gap-2, gap-3, etc.)
- Border radius: Rounded corners (rounded-xl)
- Responsive: Mobile-first design with `max-w-2xl` container

## Navigation Flow

```
Home
├── Quick Actions → Transfer or Inbox
├── Recent Activity → Swipe details
└── Profile (header click)

Transfer
├── AI Match → Create Virtual Swipe
└── Manual Entry → Direct email

Inbox
├── View Swipe
└── View QR Code → Full Screen

My Swipes
├── Plan Overview
└── Active Transfers → Cancel or Details

Profile
├── User Stats
├── Achievements
└── Settings/Logout
```

## Future Enhancements

1. **AI Matching Algorithm**: Implement actual matching logic in MatchResult.js
2. **Backend Integration**: Connect to API for real swipe transfers
3. **Real-time Updates**: Add WebSocket support for live notifications
4. **Search & Filter**: Add filtering to MySwipes and Inbox
5. **Detailed Analytics**: Expand ProfileView with more impact data
6. **Chat System**: Direct messaging between donors and recipients
7. **Payment Integration**: For BRB-based transfers

## Getting Started

1. All components are already integrated in `App.js`
2. Mock data is provided in `App.js` for testing
3. Replace mock data with API calls as needed
4. Customize colors in Tailwind configuration
5. Add your own icons from `lucide-react`
