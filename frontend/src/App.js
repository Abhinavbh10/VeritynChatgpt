import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Newspaper, Bookmark, Clock, ChevronLeft, ExternalLink, Sparkles, RefreshCw, Check, Zap, TrendingUp } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import '@/App.css';

// Firebase endpoint
const FIREBASE_ENDPOINT = 'https://us-central1-verityn-news-app.cloudfunctions.net/generateNow';

// Category images
const CATEGORY_IMAGES = {
  technology: 'https://images.unsplash.com/photo-1760978632114-0939f0d60045?w=800&q=80',
  business: 'https://images.unsplash.com/photo-1741742266218-4b3a46e4f3a0?w=800&q=80',
  science: 'https://images.unsplash.com/photo-1764504985836-d494945ee174?w=800&q=80',
  sports: 'https://images.unsplash.com/photo-1758646883151-3530cc15512e?w=800&q=80',
  general: 'https://images.unsplash.com/photo-1760421131154-f884a2e26b7e?w=800&q=80',
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  geopolitics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80',
  energy: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
  climate: 'https://images.unsplash.com/photo-1569163139599-0f4517e36f51?w=800&q=80',
};

// Mock AI Briefs - curated, summarized stories
const MOCK_BRIEFS = [
  {
    id: 1,
    title: 'OpenAI Unveils GPT-5 with Revolutionary Reasoning Capabilities',
    summary: ['OpenAI announced GPT-5, their most advanced language model featuring enhanced reasoning and multimodal understanding.', 'The release marks a significant leap in AI capabilities, with major implications for healthcare, scientific research, and creative industries.'],
    source: 'TechCrunch',
    published: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    topic: 'AI',
    url: 'https://techcrunch.com',
    image: CATEGORY_IMAGES.ai,
    importance: 95,
    articleCount: 12,
    timeline: [
      { time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), timeLabel: '6:00 AM', title: 'OpenAI sends press invites for major announcement', source: 'The Verge', url: '#' },
      { time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), timeLabel: '9:00 AM', gap: '3 hours later', title: 'GPT-5 officially announced at press event', source: 'TechCrunch', url: '#' },
      { time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), timeLabel: '11:00 AM', gap: '2 hours later', title: 'First benchmarks show 40% reasoning improvement', source: 'Bloomberg', url: '#' },
      { time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), timeLabel: '1:00 PM', gap: '2 hours later', title: 'Microsoft confirms Azure integration coming next week', source: 'Reuters', url: '#' },
    ]
  },
  {
    id: 2,
    title: 'Federal Reserve Signals Potential Rate Cut Amid Economic Data',
    summary: ['The Federal Reserve indicated openness to interest rate cuts following softer inflation data and slowing job growth.', 'Markets rallied on the news, with major indices posting significant gains as investors price in monetary easing.'],
    source: 'Financial Times',
    published: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    topic: 'Business',
    url: 'https://ft.com',
    image: CATEGORY_IMAGES.business,
    importance: 88,
    articleCount: 8,
    timeline: [
      { time: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(), timeLabel: 'Yesterday', title: 'Labor Department releases softer jobs data', source: 'WSJ', url: '#' },
      { time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), timeLabel: '9:30 AM', gap: 'Next day', title: 'Powell hints at policy shift in prepared remarks', source: 'CNBC', url: '#' },
      { time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), timeLabel: '12:00 PM', gap: '2 hours later', title: 'Markets rally as traders price in rate cuts', source: 'Bloomberg', url: '#' },
    ]
  },
  {
    id: 3,
    title: 'SpaceX Starship Achieves Full Orbital Flight Success',
    summary: ['SpaceX completed its first fully successful Starship orbital flight, marking a historic milestone in space exploration.', 'The achievement brings humanity closer to Mars missions and revolutionizes heavy-lift launch capabilities.'],
    source: 'BBC',
    published: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    topic: 'Science',
    url: 'https://bbc.com',
    image: CATEGORY_IMAGES.science,
    importance: 92,
    articleCount: 15,
    timeline: [
      { time: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), timeLabel: '4:00 AM', title: 'Starship lifts off from Boca Chica launch site', source: 'SpaceX', url: '#' },
      { time: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), timeLabel: '5:00 AM', gap: '1 hour later', title: 'Super Heavy booster successfully lands on drone ship', source: 'NASA Spaceflight', url: '#' },
      { time: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), timeLabel: '7:00 AM', gap: '2 hours later', title: 'Starship achieves stable orbit insertion', source: 'Reuters', url: '#' },
      { time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), timeLabel: '10:00 AM', gap: '3 hours later', title: 'Elon Musk confirms full mission success', source: 'BBC', url: '#' },
    ]
  },
  {
    id: 4,
    title: 'European Union Passes Comprehensive AI Regulation Framework',
    summary: ['The EU formally adopted the AI Act, establishing the world\'s first comprehensive legal framework for artificial intelligence.', 'Tech companies face strict compliance requirements with penalties up to 7% of global revenue for violations.'],
    source: 'Guardian',
    published: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    topic: 'Technology',
    url: 'https://theguardian.com',
    image: CATEGORY_IMAGES.technology,
    importance: 85,
    articleCount: 6,
    timeline: [
      { time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), title: 'EU Parliament votes in favor of AI Act', source: 'Politico', url: '#' },
      { time: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), title: 'Tech industry responds to new regulations', source: 'TechCrunch', url: '#' },
    ]
  },
  {
    id: 5,
    title: 'Global Climate Summit Reaches Historic Emissions Agreement',
    summary: ['World leaders at COP29 agreed to accelerated carbon reduction targets and a $100 billion climate finance package.', 'The deal includes binding commitments from major emitters and establishes new mechanisms for carbon trading.'],
    source: 'Al Jazeera',
    published: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    topic: 'Climate',
    url: 'https://aljazeera.com',
    image: CATEGORY_IMAGES.climate,
    importance: 82,
    articleCount: 9,
    timeline: [
      { time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), title: 'China and US announce joint climate initiative', source: 'NYT', url: '#' },
      { time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), title: 'Draft agreement circulated among delegates', source: 'BBC', url: '#' },
    ]
  },
];

// Mock Latest News - raw chronological feed
const MOCK_LATEST = [
  { id: 101, title: 'Apple announces new MacBook Pro with M4 chip', source: 'The Verge', published: new Date(Date.now() - 30 * 60 * 1000).toISOString(), topic: 'Technology', url: '#', image: CATEGORY_IMAGES.technology },
  { id: 102, title: 'Bitcoin surges past $100,000 as institutional demand grows', source: 'Bloomberg', published: new Date(Date.now() - 45 * 60 * 1000).toISOString(), topic: 'Business', url: '#', image: CATEGORY_IMAGES.business },
  { id: 103, title: 'NASA confirms water ice deposits on Moon\'s south pole', source: 'Space.com', published: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), topic: 'Science', url: '#', image: CATEGORY_IMAGES.science },
  { id: 104, title: 'Google DeepMind achieves breakthrough in protein folding', source: 'Nature', published: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(), topic: 'AI', url: '#', image: CATEGORY_IMAGES.ai },
  { id: 105, title: 'Tesla delivers record number of vehicles in Q4', source: 'Reuters', published: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), topic: 'Business', url: '#', image: CATEGORY_IMAGES.business },
  { id: 106, title: 'World Cup 2026 venue cities announced', source: 'ESPN', published: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(), topic: 'Sports', url: '#', image: CATEGORY_IMAGES.sports },
  { id: 107, title: 'Microsoft acquires gaming studio for $2 billion', source: 'CNBC', published: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), topic: 'Technology', url: '#', image: CATEGORY_IMAGES.technology },
  { id: 108, title: 'New COVID variant detected in Southeast Asia', source: 'WHO', published: new Date(Date.now() - 3.5 * 60 * 60 * 1000).toISOString(), topic: 'Science', url: '#', image: CATEGORY_IMAGES.science },
  { id: 109, title: 'Amazon expands drone delivery to 10 new cities', source: 'TechCrunch', published: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), topic: 'Technology', url: '#', image: CATEGORY_IMAGES.technology },
  { id: 110, title: 'Oil prices drop amid OPEC production increase', source: 'Financial Times', published: new Date(Date.now() - 4.5 * 60 * 60 * 1000).toISOString(), topic: 'Energy', url: '#', image: CATEGORY_IMAGES.energy },
  { id: 111, title: 'Meta unveils new AR glasses prototype', source: 'Wired', published: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), topic: 'Technology', url: '#', image: CATEGORY_IMAGES.technology },
  { id: 112, title: 'Champions League quarterfinal draw results', source: 'BBC Sport', published: new Date(Date.now() - 5.5 * 60 * 60 * 1000).toISOString(), topic: 'Sports', url: '#', image: CATEGORY_IMAGES.sports },
];

// Utility functions
const timeAgo = (dateString) => {
  if (!dateString) return 'Recently';
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const getCategoryImage = (topic) => {
  const normalizedTopic = (topic || 'general').toLowerCase();
  return CATEGORY_IMAGES[normalizedTopic] || CATEGORY_IMAGES.general;
};

// Components
const LoadingSkeleton = () => (
  <div className="space-y-6 p-5">
    <div className="skeleton h-64 rounded-3xl" />
    <div className="skeleton h-48 rounded-2xl" />
    <div className="skeleton h-48 rounded-2xl" />
  </div>
);

// Three-tab bottom navigation
const BottomNav = ({ activeTab, onTabChange }) => (
  <nav 
    data-testid="bottom-navigation"
    className="fixed left-1/2 -translate-x-1/2 w-full max-w-md glass-heavy border-t border-white/5"
    style={{ zIndex: 9999, bottom: '50px' }}
  >
    <div className="flex items-center justify-around h-16">
      <button
        data-testid="nav-briefs-btn"
        onClick={() => onTabChange('briefs')}
        className={`flex flex-col items-center gap-1 px-6 py-2 transition-all touch-feedback ${
          activeTab === 'briefs' ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'
        }`}
        aria-label="AI Briefs"
      >
        <Sparkles size={22} />
        <span className="text-[10px] font-medium">Briefs</span>
      </button>
      <button
        data-testid="nav-latest-btn"
        onClick={() => onTabChange('latest')}
        className={`flex flex-col items-center gap-1 px-6 py-2 transition-all touch-feedback ${
          activeTab === 'latest' ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'
        }`}
        aria-label="Latest news"
      >
        <TrendingUp size={22} />
        <span className="text-[10px] font-medium">Latest</span>
      </button>
      <button
        data-testid="nav-saved-btn"
        onClick={() => onTabChange('saved')}
        className={`flex flex-col items-center gap-1 px-6 py-2 transition-all touch-feedback ${
          activeTab === 'saved' ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'
        }`}
        aria-label="Saved articles"
      >
        <Bookmark size={22} />
        <span className="text-[10px] font-medium">Saved</span>
      </button>
    </div>
  </nav>
);

// AI Brief Card - premium look for curated stories
const BriefCard = ({ story, onSave, isSaved, onClick, index }) => (
  <div
    data-testid={`brief-card-${index}`}
    className="relative rounded-2xl overflow-hidden cursor-pointer touch-feedback animate-fade-in-up mx-5 mb-4"
    style={{ animationDelay: `${index * 100}ms` }}
    onClick={onClick}
  >
    <div className="relative aspect-[16/10]">
      <img
        src={story.image || getCategoryImage(story.topic)}
        alt={story.title}
        className="absolute inset-0 w-full h-full object-cover"
        loading={index < 2 ? 'eager' : 'lazy'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      
      {/* AI Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
        <Sparkles size={10} className="text-blue-400" />
        <span className="text-[9px] font-bold text-blue-300 uppercase tracking-wider">AI Brief</span>
      </div>
      
      {/* Article count badge */}
      {story.articleCount && (
        <div className="absolute top-3 right-12 flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 backdrop-blur-sm">
          <Newspaper size={10} className="text-zinc-300" />
          <span className="text-[9px] font-medium text-zinc-300">{story.articleCount} sources</span>
        </div>
      )}
      
      {/* Save button */}
      <button
        data-testid={`save-brief-${index}-btn`}
        onClick={(e) => { e.stopPropagation(); onSave(story); }}
        className={`absolute top-3 right-3 p-2 rounded-full transition-all ${
          isSaved ? 'bg-blue-500 text-white' : 'bg-black/40 backdrop-blur-sm text-white hover:bg-black/60'
        }`}
        aria-label={isSaved ? 'Saved' : 'Save'}
      >
        {isSaved ? <Check size={14} /> : <Bookmark size={14} />}
      </button>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">{story.topic}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-[10px] text-zinc-400">{story.source}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-[10px] text-zinc-500">{timeAgo(story.published)}</span>
        </div>
        
        <h3 className="font-serif text-lg font-bold leading-tight text-white mb-2 line-clamp-2">
          {story.title}
        </h3>
        
        {story.summary && (
          <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2">
            {Array.isArray(story.summary) ? story.summary[0] : story.summary}
          </p>
        )}
      </div>
    </div>
  </div>
);

// Latest news item - compact list style
const LatestNewsItem = ({ article, onSave, isSaved, onClick, index }) => (
  <div
    data-testid={`latest-item-${index}`}
    className="flex gap-3 px-5 py-3 cursor-pointer touch-feedback animate-fade-in border-b border-zinc-900/50"
    style={{ animationDelay: `${index * 50}ms` }}
    onClick={onClick}
  >
    <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
      <img
        src={article.image || getCategoryImage(article.topic)}
        alt={article.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    
    <div className="flex-1 min-w-0 flex flex-col justify-center">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[9px] font-semibold text-blue-400 uppercase tracking-wider">{article.topic}</span>
        <span className="text-zinc-700">•</span>
        <span className="text-[9px] text-zinc-500">{timeAgo(article.published)}</span>
      </div>
      <h4 className="text-sm font-medium text-white leading-snug line-clamp-2">
        {article.title}
      </h4>
      <span className="text-[10px] text-zinc-500 mt-1">{article.source}</span>
    </div>
    
    <button
      data-testid={`save-latest-${index}-btn`}
      onClick={(e) => { e.stopPropagation(); onSave(article); }}
      className={`self-center p-1.5 rounded-full transition-all ${
        isSaved ? 'text-blue-500' : 'text-zinc-600 hover:text-zinc-400'
      }`}
      aria-label={isSaved ? 'Saved' : 'Save'}
    >
      {isSaved ? <Check size={16} /> : <Bookmark size={16} />}
    </button>
  </div>
);

// Briefs Tab - AI curated stories
const BriefsTab = ({ briefs, loading, onRefresh, savedIds, onSave, onStoryClick }) => (
  <div data-testid="briefs-tab" className="pb-32">
    {/* Header */}
    <div className="sticky top-0 z-40 glass-heavy">
      <div className="flex items-center justify-between px-5 py-4 pt-10">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Briefs</h1>
          <p className="text-xs text-zinc-500 mt-0.5">AI-curated story intelligence</p>
        </div>
        <button
          data-testid="refresh-briefs-btn"
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors touch-feedback"
          aria-label="Refresh"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
    
    {loading && briefs.length === 0 ? (
      <LoadingSkeleton />
    ) : (
      <div className="mt-2">
        {briefs.map((story, idx) => (
          <BriefCard
            key={story.id || idx}
            story={story}
            index={idx}
            onSave={onSave}
            isSaved={savedIds.has(story.url || story.id)}
            onClick={() => onStoryClick(story)}
          />
        ))}
      </div>
    )}
  </div>
);

// Latest Tab - chronological news feed
const LatestTab = ({ articles, loading, onRefresh, savedIds, onSave, onArticleClick }) => (
  <div data-testid="latest-tab" className="pb-32">
    {/* Header */}
    <div className="sticky top-0 z-40 glass-heavy">
      <div className="flex items-center justify-between px-5 py-4 pt-10">
        <div>
          <h1 className="font-serif text-2xl font-bold text-white">Latest</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Real-time news from all sources</p>
        </div>
        <button
          data-testid="refresh-latest-btn"
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors touch-feedback"
          aria-label="Refresh"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </div>
    
    {loading && articles.length === 0 ? (
      <LoadingSkeleton />
    ) : (
      <div className="mt-2">
        {articles.map((article, idx) => (
          <LatestNewsItem
            key={article.id || idx}
            article={article}
            index={idx}
            onSave={onSave}
            isSaved={savedIds.has(article.url || article.id)}
            onClick={() => onArticleClick(article)}
          />
        ))}
      </div>
    )}
  </div>
);

// Saved Tab
const SavedTab = ({ savedStories, onStoryClick, onRemove }) => (
  <div data-testid="saved-tab" className="pb-32">
    <div className="sticky top-0 z-40 glass-heavy px-5 py-4 pt-10">
      <h1 className="font-serif text-2xl font-bold text-white">Saved</h1>
      <p className="text-xs text-zinc-500 mt-0.5">{savedStories.length} article{savedStories.length !== 1 ? 's' : ''} saved</p>
    </div>
    
    {savedStories.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
          <Bookmark size={24} className="text-zinc-600" />
        </div>
        <p className="text-zinc-400 mb-1 text-sm">No saved articles</p>
        <p className="text-zinc-600 text-xs">Bookmark stories to read later</p>
      </div>
    ) : (
      <div className="mt-2">
        {savedStories.map((story, idx) => (
          <LatestNewsItem
            key={story.url || story.id || idx}
            article={story}
            index={idx}
            onSave={() => onRemove(story)}
            isSaved={true}
            onClick={() => onStoryClick(story)}
          />
        ))}
      </div>
    )}
  </div>
);

// Story Detail View
const StoryDetail = ({ story, onBack, onSave, isSaved }) => {
  if (!story) return null;
  
  const hasSummary = story.summary && (Array.isArray(story.summary) ? story.summary.length > 0 : story.summary);
  
  return (
    <div data-testid="story-detail" className="min-h-screen pb-32 animate-fade-in">
      {/* Hero image */}
      <div className="relative h-64">
        <img
          src={story.image || getCategoryImage(story.topic)}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
        
        {/* Back button */}
        <button
          data-testid="back-btn"
          onClick={onBack}
          className="absolute top-10 left-4 p-2 rounded-full bg-black/40 backdrop-blur-sm text-white touch-feedback"
          aria-label="Go back"
        >
          <ChevronLeft size={20} />
        </button>
        
        {/* Save button */}
        <button
          data-testid="detail-save-btn"
          onClick={() => onSave(story)}
          className={`absolute top-10 right-4 p-2 rounded-full transition-all touch-feedback ${
            isSaved ? 'bg-blue-500 text-white' : 'bg-black/40 backdrop-blur-sm text-white'
          }`}
          aria-label={isSaved ? 'Saved' : 'Save'}
        >
          {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
        </button>
      </div>
      
      {/* Content */}
      <div className="px-5 -mt-16 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">{story.topic}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-[10px] text-zinc-500">{story.source}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-[10px] text-zinc-500">{timeAgo(story.published)}</span>
        </div>
        
        <h1 className="font-serif text-xl font-bold leading-tight text-white mb-5">
          {story.title}
        </h1>
        
        {/* AI Summary card */}
        {hasSummary && (
          <div data-testid="ai-summary-card" className="bg-zinc-900/80 p-4 rounded-xl border border-white/10 backdrop-blur-md mb-6 relative">
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">
              <Sparkles size={8} className="text-blue-400" />
              <span className="text-[8px] font-bold text-blue-400 uppercase">AI Summary</span>
            </div>
            <div className="space-y-2 pr-16">
              {(Array.isArray(story.summary) ? story.summary : [story.summary]).map((sentence, idx) => (
                <p key={idx} className="text-sm text-zinc-300 leading-relaxed">
                  {sentence}
                </p>
              ))}
            </div>
          </div>
        )}
        
        {/* Timeline */}
        {story.timeline && story.timeline.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Story Timeline
            </h3>
            <div className="relative pl-6 border-l-2 border-zinc-800 ml-1 space-y-1">
              {story.timeline.map((event, idx) => (
                <div key={idx} className="relative animate-slide-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  {/* Time gap label */}
                  {event.gap && (
                    <div className="flex items-center gap-2 py-2 -ml-6 pl-6">
                      <div className="h-px flex-1 bg-zinc-800" />
                      <span className="text-[9px] text-zinc-600 uppercase tracking-wide px-2">{event.gap}</span>
                      <div className="h-px flex-1 bg-zinc-800" />
                    </div>
                  )}
                  
                  {/* Timeline node */}
                  <div className="relative pb-4">
                    <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-zinc-950" />
                    <div className="bg-zinc-900/50 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] text-blue-400 font-medium">
                          {event.timeLabel || timeAgo(event.time)}
                        </span>
                        <span className="text-zinc-700">•</span>
                        <span className="text-[10px] text-zinc-500">{event.source}</span>
                      </div>
                      <p className="text-xs text-white font-medium leading-snug">{event.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Read original */}
        {story.url && story.url !== '#' && (
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="read-original-link"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm font-medium transition-all hover:bg-zinc-800 touch-feedback"
          >
            Read Original
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
};

// Onboarding Screen
const OnboardingScreen = ({ onComplete }) => {
  const [selected, setSelected] = useState([]);
  const topics = ['AI', 'Technology', 'Business', 'Science', 'Geopolitics', 'Energy', 'Climate', 'Sports'];
  
  const toggleTopic = (topic) => {
    setSelected(prev => 
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };
  
  const handleContinue = () => {
    localStorage.setItem('verityn_topics', JSON.stringify(selected));
    localStorage.setItem('verityn_onboarded', 'true');
    onComplete();
  };
  
  return (
    <div data-testid="onboarding-screen" className="min-h-screen flex flex-col px-6 pt-16 pb-32">
      <div className="animate-fade-in-up">
        <h1 className="font-serif text-3xl font-bold mb-2 text-white">Verityn</h1>
        <p className="text-zinc-400 text-base mb-1">Truth in motion.</p>
        <p className="text-zinc-500 text-sm mb-8">Select topics you care about</p>
      </div>
      
      <div className="flex flex-wrap gap-2.5 stagger-children">
        {topics.map((topic) => (
          <button
            key={topic}
            data-testid={`topic-${topic.toLowerCase()}`}
            onClick={() => toggleTopic(topic)}
            className={`px-5 py-3 rounded-full text-sm font-medium transition-all touch-feedback animate-fade-in-up ${
              selected.includes(topic)
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                : 'bg-zinc-900/80 text-zinc-300 border border-zinc-800 hover:border-zinc-600'
            }`}
          >
            {topic}
          </button>
        ))}
      </div>
      
      <div className="mt-auto">
        <button
          data-testid="continue-btn"
          onClick={handleContinue}
          disabled={selected.length === 0}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all touch-feedback ${
            selected.length > 0
              ? 'bg-white text-black hover:bg-zinc-200'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {selected.length > 0 ? `Continue with ${selected.length} topic${selected.length > 1 ? 's' : ''}` : 'Select topics to continue'}
        </button>
      </div>
    </div>
  );
};

// Main App
const AppContent = () => {
  const [isOnboarded, setIsOnboarded] = useState(() => localStorage.getItem('verityn_onboarded') === 'true');
  const [activeTab, setActiveTab] = useState('briefs');
  const [briefs, setBriefs] = useState(MOCK_BRIEFS);
  const [latestNews, setLatestNews] = useState(MOCK_LATEST);
  const [loading, setLoading] = useState(false);
  const [savedStories, setSavedStories] = useState(() => {
    const saved = localStorage.getItem('verityn_saved');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedStory, setSelectedStory] = useState(null);
  
  const savedIds = new Set(savedStories.map(s => s.url || s.id));
  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Get user's selected topics for personalized feed
      const userTopicsStr = localStorage.getItem('verityn_topics');
      const userTopics = userTopicsStr ? JSON.parse(userTopicsStr) : [];
      
      // Send user topics to backend for personalization
      const params = new URLSearchParams();
      if (userTopics.length > 0) {
        params.append('userTopics', userTopics.join(','));
      }
      
      const url = `${FIREBASE_ENDPOINT}${params.toString() ? '?' + params.toString() : ''}`;
      const response = await axios.get(url, { timeout: 15000 });
      const data = response.data;
      
      if (data.stories && data.stories.length > 0) {
        const formattedBriefs = data.stories.map((s, idx) => ({
          id: idx + 1,
          title: s.title,
          summary: s.summary || [],
          source: s.source || 'News',
          published: s.published,
          topic: s.topic || 'General',
          url: s.url,
          image: s.image || getCategoryImage(s.topic),
          timeline: s.timeline || [],
          importance: s.importance || 50,
          articleCount: s.articleCount || s.clusterArticles?.length || 3
        }));
        setBriefs(formattedBriefs);
      }
      
      if (data.feed && data.feed.length > 0) {
        const formattedLatest = data.feed.map((a, idx) => ({
          id: 100 + idx,
          title: a.title,
          source: a.source || 'News',
          published: a.published,
          topic: a.topic || 'General',
          url: a.url,
          image: a.image || getCategoryImage(a.topic)
        }));
        setLatestNews(formattedLatest);
      }
    } catch (error) {
      // Silent fail - use mock data
      console.log('Using local data');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (isOnboarded) {
      fetchData();
    }
  }, [isOnboarded, fetchData]);
  
  useEffect(() => {
    localStorage.setItem('verityn_saved', JSON.stringify(savedStories));
  }, [savedStories]);
  
  const handleSave = (story) => {
    const storyKey = story.url || story.id;
    if (savedIds.has(storyKey)) {
      setSavedStories(prev => prev.filter(s => (s.url || s.id) !== storyKey));
    } else {
      setSavedStories(prev => [...prev, story]);
      toast.success('Saved');
    }
  };
  
  const handleStoryClick = (story) => {
    setSelectedStory(story);
  };
  
  const handleBack = () => {
    setSelectedStory(null);
  };
  
  if (!isOnboarded) {
    return <OnboardingScreen onComplete={() => setIsOnboarded(true)} />;
  }
  
  if (selectedStory) {
    return (
      <StoryDetail 
        story={selectedStory} 
        onBack={handleBack}
        onSave={handleSave}
        isSaved={savedIds.has(selectedStory.url || selectedStory.id)}
      />
    );
  }
  
  return (
    <>
      {activeTab === 'briefs' && (
        <BriefsTab 
          briefs={briefs}
          loading={loading}
          onRefresh={fetchData}
          savedIds={savedIds}
          onSave={handleSave}
          onStoryClick={handleStoryClick}
        />
      )}
      {activeTab === 'latest' && (
        <LatestTab 
          articles={latestNews}
          loading={loading}
          onRefresh={fetchData}
          savedIds={savedIds}
          onSave={handleSave}
          onArticleClick={handleStoryClick}
        />
      )}
      {activeTab === 'saved' && (
        <SavedTab 
          savedStories={savedStories}
          onStoryClick={handleStoryClick}
          onRemove={handleSave}
        />
      )}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-black flex justify-center">
      <div className="w-full max-w-md min-h-screen bg-zinc-950 shadow-2xl relative overflow-hidden">
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </BrowserRouter>
        <Toaster 
          position="top-center" 
          theme="dark"
          toastOptions={{
            duration: 1500,
            style: {
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fafafa',
              fontSize: '13px',
              padding: '12px 16px',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
