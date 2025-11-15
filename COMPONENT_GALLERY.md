# SwipeShare Component Usage Guide

## 🎨 Component Gallery & Examples

### Common Components

#### Button Component
```javascript
import { Button } from './components';

// Primary Button
<Button variant="primary" size="full">
  <Gift className="w-5 h-5" />
  Transfer Swipe
</Button>

// Secondary Button
<Button variant="secondary" size="md">Cancel</Button>

// Success Button
<Button variant="success" size="lg">I've Used This</Button>

// Danger Button
<Button variant="danger" size="sm">Delete</Button>

// Gradient Button
<Button variant="gradient" size="full">Create Virtual Swipe</Button>
```

**Available Props:**
- `variant`: `primary` | `secondary` | `success` | `danger` | `gradient`
- `size`: `sm` | `md` | `lg` | `full`
- `onClick`: callback function
- `disabled`: boolean
- Standard HTML button props

---

#### Card Component
```javascript
import { Card } from './components';

// Default Card
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Bordered Card
<Card variant="bordered">
  <p>With border styling</p>
</Card>

// Gradient Card
<Card variant="gradient">
  <p className="text-white">With gradient background</p>
</Card>

// Highlighted Card
<Card variant="highlighted">
  <p>Special attention card</p>
</Card>

// Clickable Card
<Card onClick={() => console.log('clicked')}>
  <p>This card is clickable</p>
</Card>
```

**Available Props:**
- `variant`: `default` | `bordered` | `gradient` | `highlighted`
- `className`: Add custom Tailwind classes
- `onClick`: Make card clickable
- `children`: Card content

---

#### Badge Component
```javascript
import { Badge } from './components';

// Status Badges
<Badge variant="success">✓ Completed</Badge>
<Badge variant="pending">⏳ Pending</Badge>
<Badge variant="warning">⚠️ Warning</Badge>
<Badge variant="danger">✗ Cancelled</Badge>
<Badge variant="default">Info Badge</Badge>
```

**Available Props:**
- `variant`: `default` | `success` | `warning` | `danger` | `pending`
- `children`: Badge text
- `className`: Custom styling

---

#### Modal Component
```javascript
import { Modal } from './components';
import { useState } from 'react';

// Centered Modal
function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        title="My Modal"
      >
        <p>Modal content goes here</p>
      </Modal>
    </>
  );
}

// Full-Screen Modal (for QR codes)
<Modal 
  isOpen={true} 
  onClose={() => {}}
  fullscreen={true}
  title="QR Code"
>
  <div className="flex items-center justify-center h-full">
    {/* QR code content */}
  </div>
</Modal>
```

**Available Props:**
- `isOpen`: boolean (required)
- `onClose`: callback function (required)
- `title`: string
- `children`: Modal content
- `fullscreen`: boolean (default: false)

---

#### Stat Component
```javascript
import { Stat } from './components';

<div className="grid grid-cols-2 gap-4">
  <Stat label="Swipes Shared" value="24" />
  <Stat label="Meals Given" value="18" />
  <Stat 
    label="Students Helped" 
    value="15"
    color="bg-green-100"
  />
</div>
```

**Available Props:**
- `label`: string (label text)
- `value`: string or number
- `color`: Tailwind color class (default: `bg-white`)

---

### Layout Components

#### Header
```javascript
import { Header } from './components';

<Header onProfileClick={() => navigate('profile')} />
```

**Features:**
- Sticky positioning
- Logo on left
- Profile button on right
- Clean, minimal design

**Props:**
- `onProfileClick`: callback when profile button clicked

---

#### BottomNav
```javascript
import { BottomNav } from './components';

<BottomNav 
  currentView="home"
  onNavigate={(view) => setCurrentView(view)}
/>
```

**Features:**
- 4 main tabs (Home, Transfer, Inbox, MySwipes)
- Active tab highlighting
- Notification badge on Inbox
- Mobile-friendly

**Props:**
- `currentView`: current active view
- `onNavigate`: callback with view name

---

### Swipes Components

#### SwipeCard
```javascript
import { SwipeCard } from './components';

// Outgoing Swipe
<SwipeCard 
  swipe={{
    id: 'swipe_001',
    recipient: 'Jamie Chen',
    status: 'pending',
    validUntil: 'Today, 8:00 PM',
    location: 'North Dining',
    createdAt: 'Nov 15, 2:34 PM'
  }}
  type="outgoing"
  onAction={(action, id) => console.log(action)}
/>

// Incoming Swipe
<SwipeCard 
  swipe={{
    id: 'swipe_003',
    donor: 'Sarah Williams',
    code: 'SWIPE-NK7H-92JD-4KLP',
    validUntil: 'Today, 8:00 PM',
    location: 'Any dining hall',
    message: 'Hope this helps!',
    hoursLeft: 4.5
  }}
  type="incoming"
  onAction={(action, id) => handleSwipeAction(action, id)}
/>
```

**Props:**
- `swipe`: swipe object
- `type`: `outgoing` | `incoming`
- `onAction`: callback with (action, swipeId)

**Actions Emitted:**
- `cancel`: Cancel transfer
- `view-qr`: Show QR code
- `use`: Mark as used

---

#### QRCodeModal
```javascript
import { QRCodeModal } from './components';

<QRCodeModal 
  isOpen={showQR}
  onClose={() => setShowQR(false)}
  swipe={{
    code: 'SWIPE-NK7H-92JD-4KLP',
    validUntil: 'Today, 8:00 PM',
    location: 'Any dining hall'
  }}
/>
```

**Features:**
- Full-screen display
- Large QR code
- Human-readable code
- Validity and location info
- Close button

**Props:**
- `isOpen`: boolean
- `onClose`: callback
- `swipe`: swipe object

---

### Matching Components

#### MatchingOption
```javascript
import { MatchingOption } from './components';

<MatchingOption 
  onAIMatch={() => console.log('AI matching')}
  onManual={() => console.log('Manual entry')}
/>
```

**Features:**
- Two matching options
- AI matching with gradient styling
- Manual email entry
- Clear visual hierarchy

---

#### MatchResult
```javascript
import { MatchResult } from './components';

<MatchResult 
  matches={[
    {
      name: 'Jamie Chen',
      location: 'North Campus',
      score: 0.95,
      needScore: 9,
      completionRate: 98,
      hasMealPlan: false
    }
  ]}
  isLoading={false}
  onSelectMatch={(match) => handleTransfer(match)}
/>
```

**Features:**
- Loading state
- Match cards with scores
- Location and reliability info
- Select action

**Props:**
- `matches`: array of match objects
- `isLoading`: boolean
- `onSelectMatch`: callback

---

### Profile Components

#### ImpactStats
```javascript
import { ImpactStats } from './components';

<ImpactStats stats={{
  planName: 'Unlimited Plan',
  daysLeft: 87,
  thisWeekUsed: 10,
  thisWeekTotal: 14,
  weekProgress: 71,
  swipesShared: 12,
  mealsGiven: 12
}} />
```

**Features:**
- Gradient background
- Progress bar
- Key statistics
- Responsive layout

---

#### UserProfile
```javascript
import { UserProfile } from './components';

<UserProfile user={{
  name: 'Jordan Smith',
  email: 'jordan@cornell.edu',
  rating: 4.8,
  reliability: 'High',
  completionRate: 98,
  memberSince: 'Nov 2024'
}} />
```

**Features:**
- User avatar
- Star rating
- Account statistics
- Clean card layout

---

### View Components

#### HomeView
```javascript
import { HomeView } from './views';

<HomeView 
  onNavigate={(view) => setCurrentView(view)}
  mySwipes={swipesList}
/>
```

**Features:**
- Impact stats card
- Quick action buttons
- Recent activity list
- Mobile-optimized

---

#### TransferView
```javascript
import { TransferView } from './views';

<TransferView onTransfer={(details) => handleTransfer(details)} />
```

**Features:**
- Swipe count selector
- Validity period picker
- Dining hall selector
- AI and manual matching options

---

#### InboxView
```javascript
import { InboxView } from './views';

<InboxView 
  incomingSwipes={swipesList}
  onSwipeAction={(action, id) => handleAction(action, id)}
/>
```

**Features:**
- List of incoming swipes
- QR code display
- Action buttons
- Empty state

---

#### MySwipesView
```javascript
import { MySwipesView } from './views';

<MySwipesView 
  mySwipes={swipesList}
  onSwipeAction={(action, id) => handleAction(action, id)}
/>
```

**Features:**
- Meal plan overview
- Active transfers list
- Status tracking
- Cancel transfer option

---

#### ProfileView
```javascript
import { ProfileView } from './views';

<ProfileView onLogout={() => handleLogout()} />
```

**Features:**
- User profile card
- Impact summary
- Badges and achievements
- Settings and logout

---

## 🎯 Complete Example Page

```javascript
import { HomeView } from './views';
import { Header, BottomNav } from './components';
import { useState } from 'react';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  
  const swipes = [
    {
      id: 'swipe_001',
      recipient: 'Jamie Chen',
      status: 'pending',
      validUntil: 'Today, 8:00 PM',
      location: 'Any dining hall',
      createdAt: 'Nov 15, 2:34 PM'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header onProfileClick={() => setCurrentView('profile')} />
      
      <div className="max-w-2xl mx-auto">
        {currentView === 'home' && (
          <HomeView 
            onNavigate={setCurrentView} 
            mySwipes={swipes}
          />
        )}
      </div>
      
      <BottomNav 
        currentView={currentView} 
        onNavigate={setCurrentView}
      />
    </div>
  );
}
```

---

## 📋 Component Quick Reference

| Component | Imports From | Common Props | Returns |
|-----------|------------|--------------|---------|
| Button | `./components` | `variant`, `size`, `onClick` | Styled button |
| Card | `./components` | `variant`, `onClick` | Card container |
| Badge | `./components` | `variant` | Small label |
| Modal | `./components` | `isOpen`, `onClose`, `title` | Dialog |
| Stat | `./components` | `label`, `value`, `color` | Stat display |
| Header | `./components` | `onProfileClick` | Top bar |
| BottomNav | `./components` | `currentView`, `onNavigate` | Nav bar |
| SwipeCard | `./components` | `swipe`, `type`, `onAction` | Swipe display |
| QRCodeModal | `./components` | `isOpen`, `onClose`, `swipe` | QR modal |
| MatchResult | `./components` | `matches`, `isLoading` | Match list |
| ImpactStats | `./components` | `stats` | Stats card |
| UserProfile | `./components` | `user` | Profile card |
| HomeView | `./views` | `onNavigate`, `mySwipes` | Home page |
| TransferView | `./views` | `onTransfer` | Transfer page |
| InboxView | `./views` | `incomingSwipes`, `onSwipeAction` | Inbox page |
| MySwipesView | `./views` | `mySwipes`, `onSwipeAction` | Swipes page |
| ProfileView | `./views` | `onLogout` | Profile page |

---

**Happy Coding! 🎉**
