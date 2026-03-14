# Verityn News App - Product Requirements Document

## Original Problem Statement
Convert an existing news app codebase (Expo/React Native with Firebase backend) into a polished, production-ready mobile app for iOS and Android App Store/Play Store publishing. The app aggregates news from multiple sources, clusters related articles into stories, and provides AI-powered summaries.

## Architecture Overview

### Tech Stack
- **Frontend**: React (Mobile-first web app simulating React Native)
- **Backend**: Firebase Cloud Functions (Node.js 20)
- **AI Integration**: OpenAI GPT-4.1-mini for summarization
- **Data Sources**: RSS feeds (BBC, NYT, Bloomberg, etc.), GDELT, Google Topics
- **Storage**: localStorage for client-side persistence

### Firebase Endpoint
- `https://us-central1-verityn-news-app.cloudfunctions.net/generateNow`

## User Personas
1. **News Enthusiasts** - Want curated, summarized news without information overload
2. **Busy Professionals** - Need quick access to important stories during commute
3. **Tech-Savvy Users** - Appreciate AI-powered features and modern UI

## Core Requirements (Static)
- Dark theme only design
- Topic-based onboarding
- AI-generated story summaries
- Story clustering with timelines
- Save/bookmark functionality
- Three-tab navigation system
- Mobile-first responsive design

## What's Been Implemented (January 2026)

### ✅ v1.0 - MVP Complete
- Basic feed, onboarding, save functionality

### ✅ v2.0 - Three-Tab System (Current)

**New Architecture:**
1. **Briefs Tab** - AI-curated story intelligence
   - Premium card design with hero images
   - AI BRIEF badge on each card
   - Source count badges (e.g., "12 sources")
   - AI-generated summaries visible on cards
   - Save/bookmark functionality

2. **Latest Tab** - Real-time chronological feed
   - Compact list view for quick scanning
   - Time-based ordering (30m ago, 1h ago, etc.)
   - Source attribution
   - Save functionality

3. **Saved Tab** - Bookmarked articles
   - Article count in header
   - Empty state with helpful message
   - Remove saved items

**Story Detail View:**
- Hero image with gradient overlay
- AI Summary card with badge
- Timeline showing story evolution
- Read Original link
- Back navigation

**UX Improvements:**
- Removed verbose "loading from cache" messages
- Silent fail on API errors with graceful fallback
- Cleaner toast notifications
- Faster perceived performance

## Backend Function Files (Updated)
- `clusterStories.js` - Entity + keyword matching with cluster center comparison
- `extractEntities.js` - Proper noun and acronym extraction
- `selectDiverseStories.js` - Scoring based on importance + cluster size
- `extractKeywords.js` - Enhanced stopword filtering

## Prioritized Backlog

### P0 - Critical
- [ ] Fix CORS for Firebase endpoint in production
- [ ] Push notifications for breaking news
- [ ] User authentication (Firebase Auth)

### P1 - High Priority  
- [ ] Pull-to-refresh gesture
- [ ] Share story functionality
- [ ] Search across stories
- [ ] Offline mode with cached stories

### P2 - Medium Priority
- [ ] Personalized feed based on reading history
- [ ] Topic management in settings
- [ ] Reading progress indicator

### P3 - Nice to Have
- [ ] Social feed integration
- [ ] Story bookmarking with folders
- [ ] Widget support

## Next Tasks
1. Configure CORS on Firebase for production domain
2. Build native React Native version using Expo codebase
3. Implement push notifications
4. Add user authentication
5. Submit to App Store / Play Store
