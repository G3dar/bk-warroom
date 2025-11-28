# 🍔👑 Burger King Elevation War Room Dashboard

A stunning, real-time "War Room" dashboard for the Burger King Elevation campaign. This dashboard displays customer SMS complaints sent to President Tom Curtis's hotline with a premium command center aesthetic.

## Features

- **Live Dashboard**: Real-time stats showing total complaints, high priority alerts, and average anger levels
- **Smart Filtering**: Filter by complaint category, anger level, and US state
- **Search**: Search across customer names, message content, and locations
- **SMS-Style Conversations**: Beautiful iMessage-style conversation threads
- **Customer Data Generation**: Consistent fake customer profiles generated from complaint IDs
- **Beautiful UI**: Dark mode with glass morphism, neon glows, and smooth animations

## Tech Stack

- **React 19** with TypeScript
- **Vite** for lightning-fast builds
- **Tailwind CSS v4** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

## Project Structure

```
bk-warroom/
├── src/
│   ├── components/          # React components
│   │   ├── Header.tsx       # Top bar with live stats
│   │   ├── Sidebar.tsx      # Filter sidebar
│   │   ├── ComplaintCard.tsx
│   │   ├── ComplaintFeed.tsx
│   │   ├── ConversationPanel.tsx
│   │   ├── SMSBubble.tsx
│   │   └── SearchBar.tsx
│   ├── data/
│   │   └── bk_complaint_flows.json  # ⚠️ REPLACE THIS FILE
│   ├── hooks/
│   │   └── useComplaints.ts
│   ├── utils/
│   │   ├── generateCustomerData.ts
│   │   ├── parseLocation.ts
│   │   ├── angerLevel.ts
│   │   └── formatters.ts
│   ├── types/
│   │   └── complaints.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
└── README.md
```

## Getting Started

### 1. Replace the Data File

**IMPORTANT**: You need to replace the placeholder JSON file with your actual complaint data.

Copy your `bk_complaint_flows.json` file to:
```bash
cp /path/to/your/bk_complaint_flows.json ./src/data/bk_complaint_flows.json
```

The JSON should have this structure:
```json
[
  {
    "id": 1,
    "category": "customer service",
    "tone": "frustrated",
    "priority": "high",
    "thread": [
      {
        "role": "customer",
        "message": "Customer complaint message..."
      },
      {
        "role": "bk",
        "message": "BK response..."
      }
    ],
    "extracted_data": {
      "location": "houston",
      "issue": "poor service",
      ...
    }
  }
]
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### 3. Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### 4. Preview Production Build

```bash
npm run preview
```

## Design Specifications

### Color Palette

- **Background**: `#0D0D0D` (near black)
- **Cards**: `#1A1A1A` with glass morphism
- **BK Orange**: `#FF8732`
- **BK Red**: `#D62300`
- **Success Green**: `#22C55E`
- **Warning Yellow**: `#FACC15`
- **SMS Customer**: `#2563EB` (blue)
- **SMS BK**: `#FF8732` (orange gradient)

### Features Breakdown

#### Header Component
- Live clock updating every second
- Real-time stats: Total, Today, High Priority, Avg Anger, Top Issue
- "LIVE" indicator with pulse animation
- President routing badge

#### Sidebar Filters
- **By Complaint Type**: Fries, Burgers, Wrong Orders, Wait Times, etc.
- **By Anger Level**: Furious 🔴, Angry 🟠, Annoyed 🟡, Calm 🟢
- **By State**: US states with complaint counts

#### Complaint Feed
- Scrollable list of complaint cards
- Each card shows:
  - Anger level badge
  - Customer name & phone
  - Location (city, state)
  - Message preview
  - Category emoji
  - Relative timestamp
  - Complaint ID

#### Conversation Panel
- Full SMS thread with:
  - Customer messages (blue, left-aligned)
  - BK messages (orange gradient, right-aligned)
  - Timestamps
  - Read receipts
  - President routing badge for final messages
- Customer info header
- Extracted data summary card

## Data Processing

### Customer Data Generation
Generates consistent fake customer profiles based on complaint ID:
- Names: Diverse American names
- Phone numbers: Area code matches state
- Consistent across sessions (same ID = same customer)

### Location Parsing
Parses location strings into structured data:
- Extracts street, city, state
- Maps cities to US states
- Provides state abbreviations

### Anger Level Mapping
Maps tone to anger levels:
- **Furious (8-10)**: aggressive, threatening → 🔴
- **Angry (6-7)**: frustrated, disgusted → 🟠
- **Annoyed (4-5)**: sarcastic, confused → 🟡
- **Calm (1-3)**: neutral, humorous → 🟢

## Customization

### Adding New Categories
Edit `src/utils/formatters.ts`:
```typescript
const emojiMap: Record<string, string> = {
  'your-category': '🆕',
  // ...
};
```

### Modifying Colors
Edit `src/index.css`:
```css
@theme {
  --color-bk-orange: #ff8732;
  /* Add your colors */
}
```

### Adjusting Filters
Edit `src/components/Sidebar.tsx` to add/remove filter sections.

## Performance Notes

- With 85 complaints, the app runs smoothly without virtualization
- React useMemo hooks optimize filtering and sorting
- Framer Motion animations are GPU-accelerated
- Glass morphism effects use backdrop-filter

## Browser Support

- Chrome/Edge 88+
- Firefox 103+
- Safari 15.4+

Requires support for:
- CSS backdrop-filter
- CSS custom properties
- ES2022 features

## Troubleshooting

### JSON Import Errors
Make sure `tsconfig.app.json` has:
```json
"resolveJsonModule": true
```

### Tailwind Not Working
Ensure `index.css` is imported in `main.tsx`:
```typescript
import './index.css'
```

### Build Errors
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- [ ] Real-time WebSocket updates
- [ ] Export complaints to CSV/PDF
- [ ] Advanced analytics dashboard
- [ ] Email notifications for high priority
- [ ] Admin authentication
- [ ] Dark/Light theme toggle
- [ ] Mobile responsive design
- [ ] Priority queue automation
- [ ] US state map visualization

## License

Proprietary - Burger King Elevation Campaign 2024

---

**Built with** ❤️ **for the Burger King Elevation Campaign**

For questions or issues, contact the development team.
