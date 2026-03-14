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
- Category filtering
- Mobile-first responsive design

## What's Been Implemented (January 2026)

### ✅ Completed Features
1. **Onboarding Screen**
   - Topic selection (AI, Technology, Business, Science, Geopolitics, Energy, Climate, Sports)
   - Animated pill buttons with selection state
   - Continue button with topic count

2. **Home Feed**
   - Hero story card with AI summary badge
   - Category filter pills (All, AI, Technology, Business, Science, Climate)
   - Story list with thumbnails
   - Save/bookmark functionality with toast notifications
   - Refresh button
   - Time-ago timestamps

3. **Story Detail View**
   - Hero image with gradient overlay
   - AI Summary card with sparkle badge
   - Timeline view with chronological events
   - Read Original Article link
   - Back navigation
   - Save button

4. **Saved Screen**
   - Header with article count
   - Saved stories list
   - Unsave functionality
   - Empty state design

5. **Bottom Navigation**
   - Feed and Saved tabs
   - Active state indicator
   - Positioned above Emergent badge

### Design Implementation
- Dark theme (#09090b base)
- Playfair Display + Inter fonts
- Glassmorphism effects
- Smooth animations (fade-in, slide-in)
- Touch feedback on interactions

## Prioritized Backlog

### P0 - Critical (Not Yet Implemented)
- [ ] Push notifications for breaking news
- [ ] Offline mode with cached stories
- [ ] User authentication (Firebase Auth)

### P1 - High Priority
- [ ] Share story functionality
- [ ] Search across stories
- [ ] Pull-to-refresh gesture
- [ ] Reading progress indicator
- [ ] Story read/unread state

### P2 - Medium Priority
- [ ] Personalized feed based on reading history
- [ ] Dark/Light theme toggle
- [ ] Text size adjustment
- [ ] Topic management in settings
- [ ] Onboarding skip option for returning users

### P3 - Nice to Have
- [ ] Social feed integration
- [ ] Comments/discussion feature
- [ ] Story bookmarking with folders
- [ ] Widget support (iOS/Android)
- [ ] Watch OS / Wear OS support

## Next Tasks
1. Connect to Firebase endpoint with proper CORS configuration
2. Implement push notifications
3. Add user authentication
4. Build native React Native version for App Store submission
5. Implement offline caching

## Technical Notes
- Firebase endpoint has CORS restrictions in preview - works with mock data fallback
- Mock stories provide complete functionality for demo/testing
- localStorage persists saved articles and onboarding state
