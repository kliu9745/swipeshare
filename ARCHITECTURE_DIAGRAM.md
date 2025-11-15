# SwipeShare Component Relationship Diagram

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         App.js                              │
│              (Main App Orchestrator & Router)                │
└────────────┬──────────────────────────────────────────────┬─┘
             │                                              │
      ┌──────▼──────────┐                         ┌────────▼─────────┐
      │   Header        │                         │    BottomNav     │
      │ (Always Shown)  │                         │  (Always Shown)  │
      └──────────────────┘                        └──────────────────┘
             │
      ┌──────▼─────────────────────────────────────────────┐
      │          Current View (One of 5)                   │
      │  (Determined by currentView state)                 │
      └──────┬──────────┬──────────┬───────────┬──────────┘
             │          │          │           │
        ┌────▼────┐ ┌───▼────┐ ┌──▼───┐ ┌────▼─────┐
        │  Home   │ │Transfer│ │Inbox │ │ MySwipes │
        │  View   │ │  View  │ │ View │ │   View   │
        └────┬────┘ └────┬───┘ └──┬───┘ └────┬─────┘
             │           │        │          │
      ┌──────┴──────┬────┴────┬───┴──────┬───┴──────┬─────────┐
      │             │         │          │          │         │
   ┌──▼──┐ ┌────────▼──────┐  │    ┌─────▼────┐ ┌──▼──┐ ┌───▼────┐
   │Stat │ │MatchingOption│  │    │ SwipeCard │ │Stat │ │Profile │
   │Card │ │  or Manual    │  │    │  (Multi)  │ │Card │ │ View   │
   └─────┘ │   Matching    │  │    └───────────┘ └─────┘ └────────┘
           │               │  │
           └────────┬──────┘  │
                    │         │
               ┌────▼─────┐   │
               │ Match    │   │
               │ Result   │   │
               │ (Cards)  │   │
               └──────────┘   │
                              │
                    ┌─────────▼──────┐
                    │  QRCodeModal   │
                    │ (Full-screen)  │
                    └────────────────┘
```

## Component Dependencies

```
Common Components (Base Layer)
├── Button ────────┐
├── Card ──────────┤
├── Badge ─────────┤
├── Modal ─────────┤
└── Stat ──────────┘
                   │
                   ▼
Specialized Components (Mid Layer)
├── Layout
│   ├── Header ──────────┐
│   └── BottomNav ──────┤
├── Swipes
│   ├── SwipeCard ──────┤
│   └── QRCodeModal ────┤
├── Matching
│   ├── MatchingOption ─┤
│   └── MatchResult ────┤
└── Profile
    ├── ImpactStats ───┤
    └── UserProfile ───┘
                   │
                   ▼
Views (Feature Layer)
├── HomeView ──────┐
├── TransferView ──┤
├── InboxView ─────┤
├── MySwipesView ──┤
└── ProfileView ───┘
                   │
                   ▼
               App.js
```

## State Flow

```
┌────────────────────────────────────────────────┐
│              App.js (State)                    │
│  ┌──────────────────────────────────────────┐ │
│  │ - currentView (home/transfer/etc)        │ │
│  │ - mySwipes (array)                       │ │
│  │ - incomingSwipes (array)                 │ │
│  │ - userProfile (object)                   │ │
│  │ - handleNavigate()                       │ │
│  │ - handleLogout()                         │ │
│  └──────────────┬───────────────────────────┘ │
└─────────────────┼────────────────────────────┘
                  │
        ┌─────────▼──────────┐
        │ Passes to Views    │
        │ and Components     │
        └─────────┬──────────┘
                  │
    ┌─────────────┼──────────────────┐
    │             │                  │
    ▼             ▼                  ▼
┌─────────┐  ┌──────────┐  ┌──────────────┐
│HomeView │  │TransferV │  │InboxView etc │
│(props)  │  │ (props)  │  │   (props)    │
└────┬────┘  └─────┬────┘  └──────┬───────┘
     │             │               │
     └─────────────┼───────────────┘
                   │
            ┌──────▼──────┐
            │Components   │
            │(Stateless)  │
            └─────────────┘
```

## Data Flow Example: Transfer Action

```
User clicks "Transfer Swipe"
         ↓
   TransferView
         ↓
   MatchingOption Component
         ↓
   User selects AI matching
         ↓
   Calls onAIMatch()
         ↓
   TransferView handlers
         ↓
   Calls onTransfer() prop
         ↓
   App.js updates state
         ↓
   Re-renders HomeView
         ↓
   Shows new transfer in recent activity
```

## Component Usage Frequency

```
Used in Every View:
┌──────────────┐
│ Button       │ ███████████ Used in 5/5 views
│ Card         │ ████████████ Used in all views
│ Badge        │ ██████████ Heavily used
│ Header       │ ███████████ Top of every page
│ BottomNav    │ ███████████ Bottom of every page
└──────────────┘

Used in Multiple Views:
┌──────────────┐
│ SwipeCard    │ ████████ Used in 3 views
│ ImpactStats  │ ██████ Used in 2 views
└──────────────┘

Specialized Usage:
┌──────────────┐
│ QRCodeModal  │ ██ Used only in InboxView
│ UserProfile  │ ██ Used only in ProfileView
│ MatchingOpt  │ ██ Used only in TransferView
└──────────────┘
```

## View Composition

```
HomeView
├── ImpactStats (from profile/)
├── Button (common) - Transfer button
├── Button (common) - Inbox button
└── SwipeCard[] (from swipes/) - Recent activity

TransferView
├── Button (common) - Swipe count selector
├── Badge (common) - Form labels
└── MatchingOption (from matching/)
    ├── Button (common) - AI Match button
    └── Button (common) - Manual Transfer button

InboxView
├── SwipeCard[] (from swipes/) - incoming swipes
│   ├── Button (common) - View QR button
│   └── Button (common) - I've Used This button
└── QRCodeModal (from swipes/)
    └── Modal (common) - Full-screen container

MySwipesView
├── ImpactStats (from profile/)
└── SwipeCard[] (from swipes/) - outgoing swipes
    ├── Button (common) - Cancel button
    └── Badge (common) - Status badge

ProfileView
├── UserProfile (from profile/)
│   └── Badge (common) - Achievement badges
├── Card (common) - Statistics
├── Badge (common) - Achievement badges
└── Button (common) - Settings/Logout buttons
```

## Mobile Layout Flow

```
Desktop:                Mobile:
┌──────────┐           ┌──────┐
│ Header   │           │Header│
├──────────┤           ├──────┤
│          │           │      │
│   View   │  =====>   │ View │
│ (max-w)  │           │ Full │
│          │           │Width │
├──────────┤           ├──────┤
│ BottomNav│           │BottomNav
└──────────┘           └──────┘

All components use:
- Tailwind responsive classes
- Mobile-first design
- Touch-friendly buttons
- Full-width cards
- Stacked layouts on mobile
```

## Navigation Relationships

```
              ┌─────────┐
              │ Profile │◄────┐
              └────┬────┘      │
                   │           │
        ┌──────────┼───────────┤
        │          │           │
        ▼          │           │
    ┌─────────┐    │     Profile Click
    │  Home   │◄───┘          │
    └────┬────┘                │
         │                     │
    ┌────▼──────────────┬──────────────────┐
    │                   │                  │
    ▼                   ▼                  ▼
 Transfer           Inbox           MySwipes
   View             View             View
    │                │                │
    └────────┬───────┴────────┬───────┘
             │                │
             ▼                ▼
    Can navigate back to Home or any other view via BottomNav
```

## Component Dependency Tree

```
App.js (1)
│
├── Header (1)
│
├── HomeView (1)
│   ├── ImpactStats (1)
│   │   └── Card (1)
│   │       └── Stat (3)
│   ├── Button (2)
│   │   ├── Gift Icon
│   │   └── Inbox Icon
│   └── SwipeCard (2)
│       ├── Card (1)
│       ├── Badge (1)
│       └── Icons
│
├── TransferView (1)
│   ├── Button (5) - swipe count selector
│   └── MatchingOption (1)
│       ├── Card (1)
│       ├── Button (2)
│       └── Icons
│
├── InboxView (1)
│   ├── SwipeCard (1)
│   │   ├── Card (1)
│   │   ├── Badge (1)
│   │   ├── Button (2)
│   │   └── Icons
│   └── QRCodeModal (1)
│       ├── Modal (1)
│       ├── Icons
│       └── Button (1)
│
├── MySwipesView (1)
│   ├── ImpactStats (1)
│   └── SwipeCard (n)
│
├── ProfileView (1)
│   ├── UserProfile (1)
│   │   ├── Card (1)
│   │   ├── Icons
│   │   └── Stars
│   ├── Card (n)
│   ├── Badge (n)
│   └── Button (n)
│
└── BottomNav (1)
    ├── Button (4)
    └── Icons

Total Rendered Components: 50+ depending on data
```

## CSS/Styling Cascade

```
Tailwind Classes
      │
      ├─ Colors
      │  ├─ blue-600 (primary)
      │  ├─ green-600 (success)
      │  ├─ red-600 (danger)
      │  └─ gray-900 (text)
      │
      ├─ Spacing
      │  ├─ gap-2 to gap-4
      │  ├─ p-4, p-6
      │  └─ mb-3, mt-4
      │
      ├─ Layout
      │  ├─ flex
      │  ├─ grid
      │  └─ max-w-2xl
      │
      └─ Components
         ├─ Button styles
         ├─ Card styles
         ├─ Modal styles
         └─ Badge styles
              │
              ▼
          Rendered UI
```

---

This architecture enables:
✅ Easy navigation  
✅ Component reusability  
✅ Clean state management  
✅ Scalable structure  
✅ Clear relationships  
✅ Maintainable codebase  
