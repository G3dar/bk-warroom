# 🚀 Quick Start Guide

## Your dashboard is READY! 🎉

### What's Running

The development server is currently running at:
**http://localhost:5173/**

Open this URL in your browser to see your War Room Dashboard!

### What You'll See

- **85 Complaints** loaded from your actual data file
- **Live stats** in the header
- **Filters** for categories, anger levels, and US states
- **Search functionality** across all complaints
- **SMS-style conversations** when you click a card

### Quick Actions

1. **View the dashboard**: Open http://localhost:5173/
2. **Stop the server**: Press `Ctrl+C` in the terminal
3. **Restart the server**: Run `npm run dev`
4. **Build for production**: Run `npm run build`

### Dashboard Features

#### Header (Top Bar)
- Real-time clock
- Total complaints: **85**
- High priority alerts (discrimination, health concerns)
- Average anger level
- Top complaint category

#### Left Sidebar (Filters)
- **By Complaint Type**: Fries 🍟, Burgers 🍔, Service 😤, etc.
- **By Anger Level**: Furious 🔴, Angry 🟠, Annoyed 🟡, Calm 🟢
- **By State**: All US states with complaint counts

#### Middle Feed
- Scrollable complaint cards
- Search bar for quick filtering
- Shows customer name, phone, location, message preview
- Click any card to see full conversation

#### Right Panel (Conversation)
- Full SMS thread (customer messages in blue, BK in orange)
- Customer contact information
- Location details
- Extracted data summary
- High priority flags

### Key Highlights

✅ All 85 complaints loaded successfully
✅ Realistic customer names generated (consistent per complaint ID)
✅ Phone numbers match state area codes
✅ Beautiful dark theme with glass morphism
✅ Smooth animations and transitions
✅ BK brand colors throughout (#FF8732 orange, #D62300 red)

### Pro Tips

- **Filter by multiple criteria**: Try filtering by category + anger level + state
- **Search everywhere**: Search box looks in names, messages, and locations
- **Watch for high priority**: Red pulsing indicators show urgent complaints
- **Check the stats**: Header updates dynamically based on filters

### Production Deployment

When ready to deploy:

```bash
npm run build
```

The built files will be in the `dist/` folder. Deploy this folder to any static hosting:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- etc.

### Need Help?

Check the main README.md for full documentation!

---

**Enjoy your War Room Dashboard!** 🍔👑
