# SwipeShare Developer Quick Reference

## Quick Import Guide

### Using Index Files (Recommended)
```javascript
// Import from components index
import { Button, Card, Badge, Modal } from './components';
import { HomeView, TransferView } from './views';
```

### Direct Imports
```javascript
import Button from './components/common/Button';
import SwipeCard from './components/swipes/SwipeCard';
import HomeView from './views/HomeView';
```

## Common Component Usage

### Button
```javascript
<Button variant="primary" size="full" onClick={() => {}}>
  Click Me
</Button>

// Variants: primary, secondary, success, danger, gradient
// Sizes: sm, md, lg, full
```

### Card
```javascript
<Card variant="bordered" onClick={handleClick}>
  <h3>Card Title</h3>
  <p>Card content here</p>
</Card>

// Variants: default, bordered, gradient, highlighted
```

### Badge
```javascript
<Badge variant="success">Completed</Badge>
<Badge variant="pending">Pending</Badge>

// Variants: default, success, warning, danger, pending
```

### Modal
```javascript
<Modal isOpen={true} onClose={() => {}} title="Modal Title">
  Modal content
</Modal>

// Add fullscreen={true} for full-screen modal
```

## View Props Reference

### HomeView
```javascript
<HomeView 
  onNavigate={(view) => {}}  // Navigate to another view
  mySwipes={[...]}           // Array of swipes
/>
```

### TransferView
```javascript
<TransferView 
  onTransfer={(details) => {}}  // Handle transfer creation
/>
```

### InboxView
```javascript
<InboxView 
  incomingSwipes={[...]}     // Array of incoming swipes
  onSwipeAction={(action, id) => {}}  // Handle swipe actions
/>
```

### MySwipesView
```javascript
<MySwipesView 
  mySwipes={[...]}           // Array of outgoing swipes
  onSwipeAction={(action, id) => {}}  // Handle swipe actions
/>
```

### ProfileView
```javascript
<ProfileView 
  onLogout={() => {}}        // Handle logout
/>
```

## Data Structures

### Swipe (Outgoing)
```javascript
{
  id: 'swipe_001',
  recipient: 'Jamie Chen',
  status: 'pending' | 'completed',
  validUntil: 'Today, 8:00 PM',
  location: 'Any dining hall',
  createdAt: 'Nov 15, 2:34 PM'
}
```

### Swipe (Incoming)
```javascript
{
  id: 'swipe_003',
  donor: 'Sarah Williams',
  code: 'SWIPE-NK7H-92JD-4KLP',
  validUntil: 'Today, 8:00 PM',
  location: 'Any dining hall',
  message: 'Hope this helps!',
  hoursLeft: 4.5
}
```

### Stats
```javascript
{
  planName: 'Unlimited Plan',
  daysLeft: 87,
  thisWeekUsed: 10,
  thisWeekTotal: 14,
  weekProgress: 71,
  swipesShared: 12,
  mealsGiven: 12
}
```

### User
```javascript
{
  name: 'Jordan Smith',
  email: 'jordan@cornell.edu',
  rating: 4.8,
  reliability: 'High',
  completionRate: 98,
  memberSince: 'Nov 2024'
}
```

## Component Hierarchy

```
App.js
├── Header
├── View (current)
│   ├── HomeView
│   │   ├── ImpactStats
│   │   ├── Button (Quick Actions)
│   │   └── SwipeCard[]
│   │
│   ├── TransferView
│   │   └── MatchingOption
│   │
│   ├── InboxView
│   │   ├── SwipeCard[]
│   │   └── QRCodeModal
│   │
│   ├── MySwipesView
│   │   ├── ImpactStats
│   │   └── SwipeCard[]
│   │
│   └── ProfileView
│       ├── UserProfile
│       ├── Card (Stats)
│       └── Card (Settings)
│
└── BottomNav
```

## Adding New Components

### Step 1: Create Component File
```javascript
// src/components/common/NewComponent.js
import React from 'react';

export const NewComponent = ({ prop1, prop2 }) => {
  return (
    <div className="...">
      {/* Component JSX */}
    </div>
  );
};

export default NewComponent;
```

### Step 2: Add to Index
```javascript
// src/components/index.js
export { default as NewComponent } from './common/NewComponent';
```

### Step 3: Use in Views
```javascript
import { NewComponent } from '../components';

<NewComponent prop1="value" prop2="value" />
```

## Styling Tips

### Tailwind Classes Used
- Colors: `blue-600`, `green-600`, `red-600`, `gray-900`, `text-white`
- Spacing: `gap-2`, `p-4`, `mb-3`, `px-4 py-3`
- Layout: `flex`, `grid grid-cols-2`, `rounded-xl`
- Responsive: `max-w-2xl`, `w-full`, `flex-1`

### Add Custom Styles
```javascript
const MyComponent = () => {
  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
      Custom styled component
    </div>
  );
};
```

## State Management Pattern

### In Views
```javascript
const [currentView, setCurrentView] = useState('home');

const handleNavigate = (view) => {
  setCurrentView(view);
};

// Pass to other components
<BottomNav currentView={currentView} onNavigate={handleNavigate} />
```

## Testing Tips

### Mock Data Already Included
- `App.js` contains mock swipes and users
- No API calls required to test UI
- Easily swap mock data for API responses

### Testing Components Individually
```javascript
import HomeView from './views/HomeView';

function TestApp() {
  return (
    <HomeView 
      onNavigate={(v) => console.log(v)} 
      mySwipes={mockSwipes}
    />
  );
}
```

## Common Patterns

### Conditional Rendering
```javascript
{loading ? (
  <div>Loading...</div>
) : items.length > 0 ? (
  <div>{items.map(item => <Card key={item.id}>{item}</Card>)}</div>
) : (
  <Card className="text-center">No items yet</Card>
)}
```

### Event Handling
```javascript
const handleSwipeAction = (action, swipeId) => {
  switch(action) {
    case 'view-qr':
      setSelectedSwipe(swipes.find(s => s.id === swipeId));
      setShowQR(true);
      break;
    case 'use':
      console.log('Marked as used:', swipeId);
      break;
  }
};

<SwipeCard 
  swipe={swipe} 
  onAction={handleSwipeAction}
/>
```

### Form Handling
```javascript
const [selected, setSelected] = useState('today');

<label className="flex items-center gap-3">
  <input 
    type="radio" 
    checked={selected === 'today'}
    onChange={() => setSelected('today')}
  />
  <span>Today only</span>
</label>
```

## Performance Optimization

### Use React.memo for Expensive Components
```javascript
const SwipeCard = React.memo(({ swipe, onAction }) => {
  return <Card>{/* ... */}</Card>;
});
```

### Move State Up When Needed
```javascript
// Instead of state in each child, use parent state
const [selectedSwipe, setSelectedSwipe] = useState(null);
<SwipeCard swipe={swipe} selected={selectedSwipe === swipe.id} />
```

## Debugging Tips

### Console Logging
```javascript
const handleAction = (action, id) => {
  console.log('Action:', action, 'ID:', id);
};
```

### React DevTools
- Install React DevTools browser extension
- Inspect component props and state
- Check component hierarchy

### Tailwind IntelliSense
- Install Tailwind CSS IntelliSense extension
- Get class name suggestions while typing
- Preview colors and spacing

## Common Issues & Solutions

### Import Errors
```javascript
// ❌ Wrong
import Button from './components/common/Button.js';

// ✅ Correct
import Button from './components/common/Button';
```

### Styling Not Applied
- Check class names match Tailwind classes
- Ensure Tailwind CSS is loaded
- Check specificity (more specific classes override generic)

### Component Not Rendering
- Check component exports use `export default`
- Verify props are passed correctly
- Check conditional rendering logic

## Resources

- **Tailwind CSS**: https://tailwindcss.com/docs
- **Lucide Icons**: https://lucide.dev/
- **React Docs**: https://react.dev/
- **Component Props**: Check each component file for PropTypes
