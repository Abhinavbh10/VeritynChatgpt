import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Newspaper, Bookmark, Clock, ChevronLeft, ExternalLink, Sparkles, RefreshCw, Check } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import '@/App.css';

// Firebase endpoint
const FIREBASE_ENDPOINT = 'https://us-central1-verityn-news-app.cloudfunctions.net/generateNow';

// Category images from design guidelines
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

// Mock data for initial display
const MOCK_STORIES = [
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
    timeline: [
      { time: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), title: 'Sam Altman confirms GPT-5 deployment timeline', source: 'Reuters', url: '#' },
      { time: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), title: 'OpenAI begins enterprise rollout of new model', source: 'Bloomberg', url: '#' },
      { time: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), title: 'Initial benchmark results show 40% improvement', source: 'The Verge', url: '#' },
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
    timeline: [
      { time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), title: 'Powell speaks at Jackson Hole symposium', source: 'CNBC', url: '#' },
      { time: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), title: 'Inflation data comes in below expectations', source: 'WSJ', url: '#' },
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
    timeline: [
      { time: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), title: 'Starship successfully lands after orbital insertion', source: 'Space.com', url: '#' },
      { time: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), title: 'Super Heavy booster achieves controlled landing', source: 'Reuters', url: '#' },
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
    timeline: [
      { time: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), title: 'China and US announce joint climate initiative', source: 'NYT', url: '#' },
      { time: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), title: 'Draft agreement circulated among delegates', source: 'BBC', url: '#' },
    ]
  },
];

// Utility functions
const timeAgo = (dateString) => {
  if (!dateString) return 'Recently';
  const diff = Date.now() - new Date(dateString).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Just now';
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
    <div className="skeleton h-80 rounded-3xl" />
    <div className="flex gap-3 overflow-hidden">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="skeleton h-10 w-24 rounded-full flex-shrink-0" />
      ))}
    </div>
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-4">
        <div className="skeleton w-28 h-20 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
    ))}
  </div>
);

const BottomNav = ({ activeTab, onTabChange }) => (
  <nav 
    data-testid="bottom-navigation"
    className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md glass-heavy border-t border-white/5"
    style={{ zIndex: 9999 }}
  >
    <div className="flex items-center justify-around h-20 pb-4">
      <button
        data-testid="nav-home-btn"
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center gap-1 px-8 py-3 transition-all touch-feedback ${
          activeTab === 'home' ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'
        }`}
        aria-label="Home feed"
      >
        <Newspaper size={24} />
        <span className="text-xs font-medium">Feed</span>
      </button>
      <button
        data-testid="nav-saved-btn"
        onClick={() => onTabChange('saved')}
        className={`flex flex-col items-center gap-1 px-8 py-3 transition-all touch-feedback ${
          activeTab === 'saved' ? 'text-blue-500 scale-110' : 'text-zinc-500 hover:text-zinc-300'
        }`}
        aria-label="Saved articles"
      >
        <Bookmark size={24} />
        <span className="text-xs font-medium">Saved</span>
      </button>
    </div>
  </nav>
);

const CategoryPills = ({ categories, activeCategory, onSelect }) => (
  <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5 py-3">
    {categories.map((cat, idx) => (
      <button
        key={cat}
        data-testid={`category-${cat.toLowerCase()}`}
        onClick={() => onSelect(cat)}
        className={`category-pill px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all touch-feedback animate-fade-in ${
          activeCategory === cat
            ? 'active'
            : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
        }`}
        style={{ animationDelay: `${idx * 50}ms` }}
      >
        {cat}
      </button>
    ))}
  </div>
);

const TopStoryCard = ({ story, onSave, isSaved, onClick }) => (
  <div
    data-testid="top-story-card"
    className="relative mx-5 rounded-3xl overflow-hidden story-card cursor-pointer touch-feedback"
    onClick={onClick}
  >
    <div className="aspect-[4/5] relative">
      <img
        src={story.image || getCategoryImage(story.topic)}
        alt={story.title}
        className="absolute inset-0 w-full h-full object-cover story-image transition-transform duration-700"
        loading="eager"
      />
      <div className="absolute inset-0 card-gradient" />
      
      {/* AI Badge */}
      <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm">
        <Sparkles size={12} className="text-blue-400" />
        <span className="text-[10px] font-semibold text-blue-300 uppercase tracking-wider">AI Summary</span>
      </div>
      
      {/* Save button */}
      <button
        data-testid="save-top-story-btn"
        onClick={(e) => { e.stopPropagation(); onSave(story); }}
        className={`absolute top-4 right-4 p-2.5 rounded-full transition-all touch-feedback ${
          isSaved 
            ? 'bg-blue-500 text-white' 
            : 'bg-black/40 backdrop-blur-sm text-white hover:bg-black/60'
        }`}
        aria-label={isSaved ? 'Saved' : 'Save article'}
      >
        {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
      </button>
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{story.topic}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs text-zinc-500">{story.source}</span>
        </div>
        
        <h2 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white">
          {story.title}
        </h2>
        
        {story.summary && (
          <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3">
            {Array.isArray(story.summary) ? story.summary[0] : story.summary}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-zinc-500 text-xs">
          <Clock size={12} />
          <span>{timeAgo(story.published)}</span>
        </div>
      </div>
    </div>
  </div>
);

const StoryListItem = ({ story, onSave, isSaved, onClick, index }) => (
  <div
    data-testid={`story-item-${index}`}
    className="flex gap-4 mx-5 py-3 cursor-pointer touch-feedback animate-fade-in-up"
    style={{ animationDelay: `${index * 80}ms` }}
    onClick={onClick}
  >
    <div className="relative w-28 h-20 rounded-xl overflow-hidden flex-shrink-0">
      <img
        src={story.image || getCategoryImage(story.topic)}
        alt={story.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
    
    <div className="flex-1 min-w-0 flex flex-col justify-center">
      <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider mb-1">
        {story.topic}
      </span>
      <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 mb-1.5">
        {story.title}
      </h3>
      <div className="flex items-center gap-2 text-zinc-500 text-xs">
        <span>{story.source}</span>
        <span>•</span>
        <span>{timeAgo(story.published)}</span>
      </div>
    </div>
    
    <button
      data-testid={`save-story-${index}-btn`}
      onClick={(e) => { e.stopPropagation(); onSave(story); }}
      className={`self-center p-2 rounded-full transition-all ${
        isSaved ? 'text-blue-500' : 'text-zinc-600 hover:text-zinc-400'
      }`}
      aria-label={isSaved ? 'Saved' : 'Save article'}
    >
      {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
    </button>
  </div>
);

// Pages
const OnboardingScreen = ({ onComplete }) => {
  const [selected, setSelected] = useState([]);
  const topics = ['AI', 'Technology', 'Business', 'Science', 'Geopolitics', 'Energy', 'Climate', 'Sports'];
  
  const toggleTopic = (topic) => {
    setSelected(prev => 
      prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
    );
  };
  
  const handleContinue = () => {
    localStorage.setItem('verityn_topics', JSON.stringify(selected));
    localStorage.setItem('verityn_onboarded', 'true');
    onComplete();
  };
  
  return (
    <div data-testid="onboarding-screen" className="min-h-screen flex flex-col px-6 pt-20 pb-32">
      <div className="animate-fade-in-up">
        <h1 className="font-serif text-4xl font-bold mb-3 text-white">Verityn</h1>
        <p className="text-zinc-400 text-lg mb-2">Truth in motion.</p>
        <p className="text-zinc-500 mb-10">Choose topics that matter to you</p>
      </div>
      
      <div className="flex flex-wrap gap-3 stagger-children">
        {topics.map((topic) => (
          <button
            key={topic}
            data-testid={`topic-${topic.toLowerCase()}`}
            onClick={() => toggleTopic(topic)}
            className={`px-6 py-3.5 rounded-full text-sm font-medium transition-all touch-feedback animate-fade-in-up ${
              selected.includes(topic)
                ? 'bg-white text-black shadow-[0_0_25px_rgba(255,255,255,0.25)]'
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
          className={`w-full py-4 rounded-2xl text-base font-semibold transition-all touch-feedback ${
            selected.length > 0
              ? 'bg-white text-black hover:bg-zinc-200 animate-pulse-glow'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {selected.length > 0 ? `Continue with ${selected.length} topics` : 'Select at least one topic'}
        </button>
      </div>
    </div>
  );
};

const HomeFeed = ({ stories, loading, onRefresh, savedIds, onSave, onStoryClick }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'AI', 'Technology', 'Business', 'Science', 'Climate'];
  
  const filteredStories = activeCategory === 'All' 
    ? stories 
    : stories.filter(s => s.topic?.toLowerCase() === activeCategory.toLowerCase());
  
  const topStory = filteredStories[0];
  const otherStories = filteredStories.slice(1);
  
  return (
    <div data-testid="home-feed" className="pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 glass-heavy pt-safe">
        <div className="flex items-center justify-between px-5 py-4">
          <h1 className="font-serif text-2xl font-bold text-white">Verityn</h1>
          <button
            data-testid="refresh-btn"
            onClick={onRefresh}
            disabled={loading}
            className="p-2 rounded-full text-zinc-400 hover:text-white transition-colors touch-feedback"
            aria-label="Refresh feed"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <CategoryPills 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelect={setActiveCategory} 
        />
      </div>
      
      {loading && stories.length === 0 ? (
        <LoadingSkeleton />
      ) : (
        <div className="space-y-6 mt-4">
          {topStory && (
            <TopStoryCard 
              story={topStory} 
              onSave={onSave}
              isSaved={savedIds.has(topStory.url || topStory.id)}
              onClick={() => onStoryClick(topStory)}
            />
          )}
          
          <div className="divide-y divide-zinc-900">
            {otherStories.map((story, idx) => (
              <StoryListItem
                key={story.id || story.url || idx}
                story={story}
                index={idx}
                onSave={onSave}
                isSaved={savedIds.has(story.url || story.id)}
                onClick={() => onStoryClick(story)}
              />
            ))}
          </div>
          
          {filteredStories.length === 0 && !loading && (
            <div className="text-center py-16 px-6">
              <p className="text-zinc-500">No stories found for this category</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StoryDetail = ({ story, onBack, onSave, isSaved }) => {
  if (!story) return null;
  
  return (
    <div data-testid="story-detail" className="min-h-screen pb-24 animate-fade-in">
      {/* Hero image */}
      <div className="relative h-72">
        <img
          src={story.image || getCategoryImage(story.topic)}
          alt={story.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient" />
        
        {/* Back button */}
        <button
          data-testid="back-btn"
          onClick={onBack}
          className="absolute top-4 left-4 p-2.5 rounded-full bg-black/40 backdrop-blur-sm text-white touch-feedback pt-safe"
          aria-label="Go back"
        >
          <ChevronLeft size={22} />
        </button>
        
        {/* Save button */}
        <button
          data-testid="detail-save-btn"
          onClick={() => onSave(story)}
          className={`absolute top-4 right-4 p-2.5 rounded-full transition-all touch-feedback pt-safe ${
            isSaved 
              ? 'bg-blue-500 text-white' 
              : 'bg-black/40 backdrop-blur-sm text-white'
          }`}
          aria-label={isSaved ? 'Saved' : 'Save article'}
        >
          {isSaved ? <Check size={20} /> : <Bookmark size={20} />}
        </button>
      </div>
      
      {/* Content */}
      <div className="px-5 -mt-20 relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">{story.topic}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs text-zinc-500">{story.source}</span>
          <span className="text-zinc-600">•</span>
          <span className="text-xs text-zinc-500">{timeAgo(story.published)}</span>
        </div>
        
        <h1 className="font-serif text-2xl md:text-3xl font-bold leading-tight text-white mb-6">
          {story.title}
        </h1>
        
        {/* AI Summary card */}
        {story.summary && (
          <div data-testid="ai-summary-card" className="bg-zinc-900/80 p-5 rounded-2xl border border-white/10 backdrop-blur-md mb-8 relative overflow-hidden">
            <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-blue-500/10 rounded border border-blue-500/20">
              <Sparkles size={10} className="text-blue-400" />
              <span className="text-[9px] font-bold text-blue-400 uppercase">AI Summary</span>
            </div>
            <div className="space-y-3 pr-20">
              {(Array.isArray(story.summary) ? story.summary : [story.summary]).map((sentence, idx) => (
                <p key={idx} className="text-zinc-300 leading-relaxed">
                  {sentence}
                </p>
              ))}
            </div>
          </div>
        )}
        
        {/* Timeline */}
        {story.timeline && story.timeline.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-6">Timeline</h3>
            <div className="relative pl-8 border-l-2 border-zinc-800 ml-2 space-y-6">
              {story.timeline.map((event, idx) => (
                <div key={idx} className="relative animate-slide-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-zinc-950" />
                  <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                    <p className="text-xs text-zinc-500 mb-1.5 flex items-center gap-1.5">
                      <Clock size={10} />
                      {timeAgo(event.time)}
                    </p>
                    <p className="text-sm text-white font-medium mb-1">{event.title}</p>
                    <p className="text-xs text-zinc-500">{event.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Read original */}
        {story.url && (
          <a
            href={story.url}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="read-original-link"
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-medium transition-all hover:bg-zinc-800 touch-feedback"
          >
            Read Original Article
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
};

const SavedScreen = ({ savedStories, onStoryClick, onRemove }) => (
  <div data-testid="saved-screen" className="min-h-screen pb-28">
    <div className="sticky top-0 z-40 glass-heavy px-5 py-5 pt-12">
      <h1 className="font-serif text-2xl font-bold text-white">Saved</h1>
      <p className="text-sm text-zinc-500 mt-1">{savedStories.length} article{savedStories.length !== 1 ? 's' : ''}</p>
    </div>
    
    {savedStories.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
          <Bookmark size={28} className="text-zinc-600" />
        </div>
        <p className="text-zinc-400 mb-2">No saved articles yet</p>
        <p className="text-zinc-600 text-sm">Tap the bookmark icon to save stories for later</p>
      </div>
    ) : (
      <div className="divide-y divide-zinc-900 mt-4">
        {savedStories.map((story, idx) => (
          <StoryListItem
            key={story.url || story.id || idx}
            story={story}
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

// Main App
const AppContent = () => {
  const [isOnboarded, setIsOnboarded] = useState(() => localStorage.getItem('verityn_onboarded') === 'true');
  const [activeTab, setActiveTab] = useState('home');
  const [stories, setStories] = useState(MOCK_STORIES);
  const [loading, setLoading] = useState(false);
  const [savedStories, setSavedStories] = useState(() => {
    const saved = localStorage.getItem('verityn_saved');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedStory, setSelectedStory] = useState(null);
  
  const savedIds = new Set(savedStories.map(s => s.url || s.id));
  
  const fetchStories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(FIREBASE_ENDPOINT, { timeout: 30000 });
      const data = response.data;
      
      if (data.stories && data.stories.length > 0) {
        const formattedStories = data.stories.map((s, idx) => ({
          id: idx + 1,
          title: s.title,
          summary: s.summary || [],
          source: s.source || 'News',
          published: s.published,
          topic: s.topic || 'General',
          url: s.url,
          image: s.image || getCategoryImage(s.topic),
          timeline: s.timeline || [],
          importance: s.importance || 50
        }));
        setStories(formattedStories);
        toast.success('Feed updated');
      }
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      toast.error('Using cached stories');
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (isOnboarded) {
      fetchStories();
    }
  }, [isOnboarded, fetchStories]);
  
  useEffect(() => {
    localStorage.setItem('verityn_saved', JSON.stringify(savedStories));
  }, [savedStories]);
  
  const handleSave = (story) => {
    const storyKey = story.url || story.id;
    if (savedIds.has(storyKey)) {
      setSavedStories(prev => prev.filter(s => (s.url || s.id) !== storyKey));
      toast('Removed from saved');
    } else {
      setSavedStories(prev => [...prev, story]);
      toast.success('Saved for later');
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
      {activeTab === 'home' && (
        <HomeFeed 
          stories={stories}
          loading={loading}
          onRefresh={fetchStories}
          savedIds={savedIds}
          onSave={handleSave}
          onStoryClick={handleStoryClick}
        />
      )}
      {activeTab === 'saved' && (
        <SavedScreen 
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
            style: {
              background: '#18181b',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#fafafa',
            },
          }}
        />
      </div>
    </div>
  );
}

export default App;
