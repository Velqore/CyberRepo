import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category, Repository } from '@/lib/supabase';
import { formatStars, getLanguageColor } from '@/lib/format';
import {
  searchGitHubRepos,
  fetchGitHubRepoDetails,
  type GitHubSearchResult,
  type TechCommunity,
} from '@/lib/github';
import {
  FALLBACK_CATEGORIES,
  FALLBACK_REPOSITORIES,
  TECH_COMMUNITIES,
  type TechCommunityMeta,
} from '@/lib/curatedData';
import { CreatorDashboard } from '@/components/CreatorDashboard';
import { Card3D } from '@/components/Card3D';
import { Icon3D } from '@/components/Icon3D';
import { CyberRepoLogoAnimation } from '@/components/CyberRepoLogo';

import {
  Search,
  Star,
  Github,
  ExternalLink,
  Shield,
  Menu,
  X,
  TrendingUp,
  Code2,
  Filter,
  LayoutGrid,
  Bomb,
  Bug,
  Cloud,
  Eye,
  Fish,
  Flag,
  Globe,
  GraduationCap,
  KeyRound,
  Lock,
  Network,
  Sword,
  Wifi,
  Folder,
  Loader2,
  Database,
  Zap,
  Cpu,
  Terminal,
  Bookmark,
  BookmarkCheck,
  GitFork,
  AlertCircle,
  Calendar,
  BarChart3,
  Tag,
  ChevronRight,
  ChevronLeft,
  Award,
  Copy,
  Check,
  Radio,
  Sparkles,
  Layers,
  Compass,
  UserCheck,
  Brain,
  Rocket,
  Bot,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type SortOption = 'stars' | 'gems' | 'name' | 'category';
type SearchMode = 'curated' | 'github';
type ActiveView = 'browse' | 'creator' | 'favorites' | 'stats';

const iconMap: Record<string, LucideIcon> = {
  Bomb,
  Bug,
  Cloud,
  Eye,
  Fish,
  Flag,
  Globe,
  GraduationCap,
  KeyRound,
  Lock,
  Network,
  Search,
  Shield,
  Sword,
  Wifi,
  Folder,
  Cpu,
  Database,
  Zap,
  Brain,
  Layers,
  Rocket,
  Bot,
  Sparkles,
  Compass,
  Radio,
};

const colorClasses: Record<string, { badge: string; glow: string; border: string; text: string; bg: string }> = {
  red: { badge: 'bg-red-500/10 text-red-400 border-red-500/30', glow: 'shadow-[0_0_15px_rgba(239,68,68,0.2)]', border: 'border-red-500/30', text: 'text-red-400', bg: 'bg-red-500/20' },
  orange: { badge: 'bg-orange-500/10 text-orange-400 border-orange-500/30', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.2)]', border: 'border-orange-500/30', text: 'text-orange-400', bg: 'bg-orange-500/20' },
  amber: { badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30', glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]', border: 'border-amber-500/30', text: 'text-amber-400', bg: 'bg-amber-500/20' },
  yellow: { badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.2)]', border: 'border-yellow-500/30', text: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  rose: { badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30', glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]', border: 'border-rose-500/30', text: 'text-rose-400', bg: 'bg-rose-500/20' },
  cyan: { badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30', glow: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]', border: 'border-cyan-500/30', text: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  blue: { badge: 'bg-blue-500/10 text-blue-400 border-blue-500/30', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.2)]', border: 'border-blue-500/30', text: 'text-blue-400', bg: 'bg-blue-500/20' },
  purple: { badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.2)]', border: 'border-purple-500/30', text: 'text-purple-400', bg: 'bg-purple-500/20' },
  green: { badge: 'bg-green-500/10 text-green-400 border-green-500/30', glow: 'shadow-[0_0_15px_rgba(34,197,94,0.2)]', border: 'border-green-500/30', text: 'text-green-400', bg: 'bg-green-500/20' },
  pink: { badge: 'bg-pink-500/10 text-pink-400 border-pink-500/30', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.2)]', border: 'border-pink-500/30', text: 'text-pink-400', bg: 'bg-pink-500/20' },
  sky: { badge: 'bg-sky-500/10 text-sky-400 border-sky-500/30', glow: 'shadow-[0_0_15px_rgba(14,165,233,0.2)]', border: 'border-sky-500/30', text: 'text-sky-400', bg: 'bg-sky-500/20' },
  emerald: { badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', glow: 'shadow-[0_0_15px_rgba(16,185,129,0.2)]', border: 'border-emerald-500/30', text: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  indigo: { badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', glow: 'shadow-[0_0_15px_rgba(99,102,241,0.2)]', border: 'border-indigo-500/30', text: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  teal: { badge: 'bg-teal-500/10 text-teal-400 border-teal-500/30', glow: 'shadow-[0_0_15px_rgba(20,184,166,0.2)]', border: 'border-teal-500/30', text: 'text-teal-400', bg: 'bg-teal-500/20' },
};

function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem('cyberrepo_bookmarks');
      return new Set(stored ? JSON.parse(stored) : ['repo-velqore-1', 'repo-velqore-2']);
    } catch {
      return new Set(['repo-velqore-1', 'repo-velqore-2']);
    }
  });

  const toggle = useCallback((repoId: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(repoId)) next.delete(repoId);
      else next.add(repoId);
      localStorage.setItem('cyberrepo_bookmarks', JSON.stringify([...next]));
      return next;
    });
  }, []);

  return { bookmarks, toggle };
}

interface ModalRepo {
  id: string;
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  topics: string[];
  categoryName: string;
  categoryColor: string;
  forks?: number;
  watchers?: number;
  openIssues?: number;
  license?: string | null;
  updatedAt?: string;
  homepage?: string | null;
  ownerAvatar?: string | null;
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [repositories, setRepositories] = useState<Repository[]>(FALLBACK_REPOSITORIES);
  const [loading, setLoading] = useState(false);

  // Multi-Community State
  const [activeCommunity, setActiveCommunity] = useState<string>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('stars');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchMode, setSearchMode] = useState<SearchMode>('curated');
  const [activeView, setActiveView] = useState<ActiveView>('browse');
  const [activeTopics, setActiveTopics] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // GitHub live radar community filter
  const [githubCommunity, setGithubCommunity] = useState<TechCommunity>('all');

  // Pagination states
  const [page, setPage] = useState(1);
  const [githubPage, setGithubPage] = useState(1);
  const PAGE_SIZE = 12;

  // GitHub live search state
  const [githubResults, setGithubResults] = useState<GitHubSearchResult[]>([]);
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Modal state
  const [modalRepo, setModalRepo] = useState<ModalRepo | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const { bookmarks, toggle: toggleBookmark } = useBookmarks();

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [catRes, repoRes] = await Promise.all([
          supabase.from('categories').select('*').order('sort_order'),
          supabase.from('repositories').select('*').order('stars', { ascending: false }),
        ]);

        if (catRes.data && catRes.data.length > 0) {
          const mergedCategories = [...catRes.data];
          const existingSlugs = new Set(catRes.data.map((c: Category) => c.slug));
          for (const fallbackCat of FALLBACK_CATEGORIES) {
            if (!existingSlugs.has(fallbackCat.slug)) {
              mergedCategories.push(fallbackCat);
            }
          }
          setCategories(mergedCategories);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }

        if (repoRes.data && repoRes.data.length > 0) {
          const mergedRepos = [...repoRes.data];
          const existingNames = new Set(repoRes.data.map((r: Repository) => r.full_name.toLowerCase()));
          for (const fallbackRepo of FALLBACK_REPOSITORIES) {
            if (!existingNames.has(fallbackRepo.full_name.toLowerCase())) {
              mergedRepos.push(fallbackRepo);
            }
          }
          setRepositories(mergedRepos);
        } else {
          setRepositories(FALLBACK_REPOSITORIES);
        }
      } catch {
        // Safe fallback already loaded
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Universal Debounced GitHub search
  useEffect(() => {
    if (searchMode !== 'github') return;
    if (!searchQuery.trim()) {
      setGithubResults([]);
      setGithubError(null);
      return;
    }
    const timer = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setGithubLoading(true);
      setGithubError(null);
      try {
        const results = await searchGitHubRepos(searchQuery, githubCommunity, controller.signal);
        setGithubResults(results);
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        setGithubError(err instanceof Error ? err.message : 'Search failed');
        setGithubResults([]);
      } finally {
        setGithubLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, searchMode, githubCommunity]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (modalRepo) {
          setModalRepo(null);
          return;
        }
        setSearchQuery('');
      }
      if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        document.getElementById('main-search')?.focus();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalRepo]);

  // Active Community object
  const activeCommunityObj = useMemo(() => {
    return TECH_COMMUNITIES.find((c) => c.id === activeCommunity) ?? TECH_COMMUNITIES[0];
  }, [activeCommunity]);

  // Active Community matching category IDs (by ID or Slug)
  const activeCommunityCategoryIds = useMemo(() => {
    if (activeCommunity === 'all') return new Set<string>();
    const comm = activeCommunityObj;
    const slugs = new Set(comm.categorySlugs || []);
    const directIds = new Set(comm.categoryIds || []);

    const matchingIds = new Set<string>();
    for (const cat of categories) {
      if (directIds.has(cat.id) || slugs.has(cat.slug)) {
        matchingIds.add(cat.id);
      }
    }
    for (const id of directIds) matchingIds.add(id);
    return matchingIds;
  }, [activeCommunity, activeCommunityObj, categories]);

  // Categories filtered by active community
  const communityCategories = useMemo(() => {
    if (activeCommunity === 'all') {
      return categories;
    }
    return categories.filter((c) => activeCommunityCategoryIds.has(c.id) || activeCommunityObj.categorySlugs?.includes(c.slug));
  }, [categories, activeCommunity, activeCommunityObj, activeCommunityCategoryIds]);

  const repoCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of repositories) {
      counts[r.category_id] = (counts[r.category_id] ?? 0) + 1;
      const cat = categories.find((c) => c.id === r.category_id);
      if (cat) {
        counts[cat.slug] = (counts[cat.slug] ?? 0) + 1;
      }
    }
    return counts;
  }, [repositories, categories]);

  // Unique topics across curated repositories
  const allTopics = useMemo(() => {
    const topicCount: Record<string, number> = {};
    for (const r of repositories) {
      for (const t of r.topics ?? []) {
        topicCount[t] = (topicCount[t] ?? 0) + 1;
      }
    }
    return Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24)
      .map(([t]) => t);
  }, [repositories]);

  const filteredRepos = useMemo(() => {
    let result = repositories;

    // Filter by community first
    if (activeCommunity !== 'all') {
      result = result.filter((r) => {
        if (activeCommunityCategoryIds.has(r.category_id)) return true;
        const cat = categories.find((c) => c.id === r.category_id);
        if (cat && activeCommunityObj.categorySlugs?.includes(cat.slug)) return true;
        return false;
      });
    }

    // Filter by specific sub-category
    if (activeCategory !== 'all') {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) result = result.filter((r) => r.category_id === cat.id);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.full_name.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q) ||
          r.topics?.some((t) => t.toLowerCase().includes(q)) ||
          r.language?.toLowerCase().includes(q)
      );
    }
    if (activeTopics.size > 0) {
      result = result.filter((r) => r.topics?.some((t) => activeTopics.has(t)));
    }
    const sorted = [...result];
    if (sortBy === 'stars') sorted.sort((a, b) => b.stars - a.stars);
    else if (sortBy === 'gems') {
      sorted.sort((a, b) => {
        const isGemA = a.topics?.includes('gem') || (a.stars <= 5000 && a.stars >= 100) ? 1 : 0;
        const isGemB = b.topics?.includes('gem') || (b.stars <= 5000 && b.stars >= 100) ? 1 : 0;
        if (isGemA !== isGemB) return isGemB - isGemA;
        return a.stars - b.stars;
      });
    }
    else if (sortBy === 'name') sorted.sort((a, b) => a.full_name.localeCompare(b.full_name));
    else {
      sorted.sort((a, b) => {
        const catA = categories.find((c) => c.id === a.category_id)?.sort_order ?? 0;
        const catB = categories.find((c) => c.id === b.category_id)?.sort_order ?? 0;
        if (catA !== catB) return catA - catB;
        return b.stars - a.stars;
      });
    }
    return sorted;
  }, [repositories, categories, activeCommunity, activeCommunityObj, activeCommunityCategoryIds, activeCategory, searchQuery, sortBy, activeTopics]);

  useEffect(() => {
    setPage(1);
  }, [activeCommunity, activeCategory, searchQuery, sortBy, activeTopics, searchMode]);
  useEffect(() => {
    setGithubPage(1);
  }, [githubResults]);

  const totalPages = Math.max(1, Math.ceil(filteredRepos.length / PAGE_SIZE));
  const pagedRepos = filteredRepos.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const githubTotalPages = Math.max(1, Math.ceil(githubResults.length / PAGE_SIZE));
  const pagedGithubResults = githubResults.slice((githubPage - 1) * PAGE_SIZE, githubPage * PAGE_SIZE);

  const bookmarkedRepos = useMemo(
    () => repositories.filter((r) => bookmarks.has(r.id)),
    [repositories, bookmarks]
  );

  const totalRepos = repositories.length;
  const activeCatObj = categories.find((c) => c.slug === activeCategory);

  const openModal = useCallback(async (repo: ModalRepo) => {
    setModalRepo(repo);
    setModalLoading(true);
    const details = await fetchGitHubRepoDetails(repo.name);
    if (details) {
      setModalRepo((prev) =>
        prev
          ? {
              ...prev,
              forks: details.forks_count,
              watchers: details.watchers_count,
              openIssues: details.open_issues_count,
              license: details.license?.name ?? null,
              updatedAt: details.updated_at,
              homepage: details.homepage,
              ownerAvatar: details.owner?.avatar_url ?? null,
            }
          : prev
      );
    }
    setModalLoading(false);
  }, []);

  const handleQuickSearch = (term: string, mode: SearchMode = 'github') => {
    setSearchMode(mode);
    setSearchQuery(term);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080d] flex items-center justify-center relative overflow-hidden font-sans">
        <div className="flex flex-col items-center gap-5 z-10">
          <Icon3D icon={Shield} color="cyan" size="xl" />
          <div className="text-center">
            <h3 className="text-sm font-bold text-white tracking-widest uppercase font-mono">
              INITIALIZING ECOSYSTEM RADAR
            </h3>
            <p className="text-cyan-400/60 text-xs mt-1 font-mono">Loading developer communities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#06080d] text-zinc-100 overflow-x-hidden font-sans relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 3D Cinematic interactive canvas background */}
      <CinematicBackground />

      {/* Cyber Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[120] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-950/95 border border-cyan-500/50 shadow-[0_0_25px_rgba(34,211,238,0.35)] backdrop-blur-xl animate-fade-up text-xs font-mono text-cyan-300">
          <Check className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Detail Modal */}
      {modalRepo && (
        <RepoModal
          repo={modalRepo}
          loading={modalLoading}
          isBookmarked={bookmarks.has(modalRepo.id)}
          onBookmark={() => toggleBookmark(modalRepo.id)}
          onClose={() => setModalRepo(null)}
          onToast={showToast}
        />
      )}

      {/* Top Cyber Telemetry Status Bar */}
      <div className="relative z-50 border-b border-white/[0.06] bg-[#06080d]/90 backdrop-blur-md text-[11px] font-mono text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              GLOBAL RADAR
            </span>
            <span className="text-zinc-700 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-zinc-400">
              COMMUNITIES: <span className="text-zinc-200">{TECH_COMMUNITIES.length} ECOSYSTEMS</span>
            </span>
            <span className="text-zinc-700 hidden md:inline">|</span>
            <span className="hidden md:inline text-zinc-400">
              CREATOR: <span className="text-cyan-300 font-bold">@Velqore (Ayush Tyagi)</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1 text-cyan-400/80">
              <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
              LIVE TELEMETRY
            </span>
            <span className="hidden md:inline text-zinc-600">SEC_LEVEL: 0xALPHA</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#06080d]/80 backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 -ml-2 text-zinc-400 hover:text-cyan-400 transition-colors"
                aria-label="Toggle Category Navigation"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Animated CyberRepo Logo */}
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => {
                  setActiveView('browse');
                  setActiveCommunity('all');
                  setActiveCategory('all');
                }}
              >
                <CyberRepoLogoAnimation size="header" />
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-3">
              <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-zinc-950/80 border border-zinc-800/90 backdrop-blur-md shadow-inner">
                {[
                  { id: 'browse' as ActiveView, label: 'Ecosystems', icon: Compass, count: totalRepos },
                  {
                    id: 'creator' as ActiveView,
                    label: 'Creator Dashboard',
                    icon: UserCheck,
                    badge: 'VELQORE',
                  },
                  {
                    id: 'favorites' as ActiveView,
                    label: 'Saved',
                    icon: Bookmark,
                    count: bookmarks.size,
                  },
                  { id: 'stats' as ActiveView, label: 'Analytics', icon: BarChart3 },
                ].map(({ id, label, icon: Icon, count, badge }) => (
                  <button
                    key={id}
                    onClick={() => setActiveView(id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeView === id
                        ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{label}</span>
                    {count !== undefined && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                          activeView === id ? 'bg-cyan-500/30 text-cyan-200' : 'bg-zinc-800 text-zinc-400'
                        }`}
                      >
                        {count}
                      </span>
                    )}
                    {badge && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 border border-purple-500/40 animate-pulse">
                        {badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              <button
                onClick={() => setActiveView('creator')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-850 text-xs font-medium text-zinc-200 transition-all border border-zinc-800 hover:border-cyan-500/40 shadow-sm"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden border border-cyan-400/60">
                  <img
                    src="https://avatars.githubusercontent.com/u/102029388?v=4"
                    alt="Velqore"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-mono text-cyan-300 font-bold hidden sm:inline">Velqore</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav tabs */}
      <div className="md:hidden relative z-30 flex items-center gap-1 p-2 border-b border-zinc-850 bg-[#06080d]/90 backdrop-blur-xl">
        {[
          { id: 'browse' as ActiveView, label: 'Ecosystems', icon: Compass },
          { id: 'creator' as ActiveView, label: 'Creator', icon: UserCheck },
          { id: 'favorites' as ActiveView, label: `Saved (${bookmarks.size})`, icon: Bookmark },
          { id: 'stats' as ActiveView, label: 'Analytics', icon: BarChart3 },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveView(id)}
            className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeView === id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {activeView === 'creator' ? (
        <CreatorDashboard onToast={showToast} />
      ) : activeView === 'stats' ? (
        <StatsDashboard repositories={repositories} categories={categories} />
      ) : activeView === 'favorites' ? (
        <FavoritesView
          repos={bookmarkedRepos}
          categories={categories}
          bookmarks={bookmarks}
          onToggleBookmark={toggleBookmark}
          onOpenModal={openModal}
          onToast={showToast}
        />
      ) : (
        <>
          {/* Cinematic 3D Hero Section */}
          <HeroSection
            totalRepos={totalRepos}
            categoriesCount={categories.length}
            onOpenCreator={() => setActiveView('creator')}
          />

          {/* ──────────────── Multi-Community Ecosystem Tabs ──────────────── */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
            <div className="p-4 rounded-2xl dark-minimal-panel border border-cyan-500/20 cyber-hud-corner shadow-lg">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-zinc-300">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>SELECT TECH ECOSYSTEM COMMUNITY:</span>
                </div>
                <span className="text-[11px] font-mono text-zinc-500 hidden sm:inline">
                  {activeCommunityObj.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {TECH_COMMUNITIES.map((comm) => {
                  const Icon = iconMap[comm.icon] ?? Compass;
                  const isActive = activeCommunity === comm.id;
                  return (
                    <button
                      key={comm.id}
                      onClick={() => {
                        setActiveCommunity(comm.id);
                        setActiveCategory('all');
                        if (searchMode === 'github') {
                          setGithubCommunity(
                            comm.id === 'cybersecurity'
                              ? 'cybersecurity'
                              : comm.id === 'ai-ml'
                              ? 'ai'
                              : comm.id === 'web-fullstack'
                              ? 'web'
                              : comm.id === 'devops-cloud'
                              ? 'devops'
                              : comm.id === 'mobile-systems'
                              ? 'mobile'
                              : 'all'
                          );
                        }
                      }}
                      className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all relative overflow-hidden group ${
                        isActive
                          ? 'bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-transparent border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.25)]'
                          : 'bg-zinc-950/60 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 hover:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-zinc-400 group-hover:text-cyan-300'}`} />
                        {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                      </div>
                      <span className="text-xs font-bold font-display leading-tight truncate w-full">
                        {comm.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Active Community Spotlight Banner */}
              {activeCommunity !== 'all' && (
                <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/40 p-3 rounded-xl border border-cyan-500/15">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                      {(() => {
                        const CommIcon = iconMap[activeCommunityObj.icon] ?? Compass;
                        return <CommIcon className="w-5 h-5" />;
                      })()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white font-display">{activeCommunityObj.name}</h4>
                        <span className="px-2 py-0.2 rounded-full text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                          {filteredRepos.length} Curated Repos
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400 font-sans mt-0.5 line-clamp-1">
                        {activeCommunityObj.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveCommunity('all');
                      setActiveCategory('all');
                      if (searchMode === 'github') setGithubCommunity('all');
                    }}
                    className="self-start sm:self-auto px-3 py-1 rounded-lg text-xs font-mono text-zinc-400 hover:text-cyan-300 hover:bg-zinc-900 border border-zinc-800 transition-all shrink-0"
                  >
                    ✕ View All Ecosystems
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ──────────────── Search Controls Bar ──────────────── */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-5">
            <div className="p-4 rounded-2xl dark-minimal-panel shadow-[0_10px_35px_rgba(0,0,0,0.6)] border border-cyan-500/20 cyber-hud-corner">
              <div className="flex flex-col gap-3">
                {/* Search mode toggle buttons & Quick Presets */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800/90 w-fit">
                    <button
                      onClick={() => setSearchMode('curated')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        searchMode === 'curated'
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Database className="w-3.5 h-3.5 text-cyan-400" />
                      Curated Stack ({filteredRepos.length})
                    </button>
                    <button
                      onClick={() => setSearchMode('github')}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        searchMode === 'github'
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      GitHub Live Radar (Universal Search)
                    </button>
                  </div>

                  {searchMode === 'github' && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-mono text-zinc-400">FILTER:</span>
                      {[
                        { id: 'all' as TechCommunity, label: 'All Repos' },
                        { id: 'ai' as TechCommunity, label: 'AI/ML' },
                        { id: 'web' as TechCommunity, label: 'Web/React' },
                        { id: 'cybersecurity' as TechCommunity, label: 'Security' },
                        { id: 'devops' as TechCommunity, label: 'DevOps' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setGithubCommunity(f.id)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all border ${
                            githubCommunity === f.id
                              ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Main Search Input */}
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/70 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    id="main-search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      searchMode === 'curated'
                        ? 'Filter curated repositories... (e.g. react, phantomtrace, langchain, pytorch, metasploit, ghidra)'
                        : 'Search any project globally on GitHub... (e.g. react, nextjs, langchain, pytorch, django, rust, velqore, linux)'
                    }
                    className="w-full bg-zinc-950/90 border border-zinc-800 rounded-xl pl-12 pr-12 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-500/20 transition-all font-sans shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  {searchMode === 'github' && githubLoading && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400 animate-spin" />
                  )}
                </div>

                {/* Quick 1-Click Search Presets */}
                <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono text-zinc-400">
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> TRY SEARCH:
                  </span>
                  {['react', 'langchain', 'pytorch', 'researchmind-ai', 'phantomtrace', 'next.js', 'fastapi', 'kubernetes', 'ghidra'].map(
                    (kw) => (
                      <button
                        key={kw}
                        onClick={() => handleQuickSearch(kw, 'github')}
                        className="px-2 py-0.5 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 hover:border-cyan-500/40 transition-all"
                      >
                        {kw}
                      </button>
                    )
                  )}
                </div>

                {searchMode === 'github' && githubError && (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{githubError} — displaying cached global match index.</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Topic filter pills for curated mode */}
          {searchMode === 'curated' && (
            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono font-semibold flex-shrink-0">
                  <Tag className="w-3.5 h-3.5 text-cyan-400" /> TAGS:
                </span>
                {allTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => {
                      setActiveTopics((prev) => {
                        const next = new Set(prev);
                        if (next.has(topic)) next.delete(topic);
                        else next.add(topic);
                        return next;
                      });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all border ${
                      activeTopics.has(topic)
                        ? 'bg-cyan-500/20 text-cyan-200 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                        : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:border-cyan-500/40 hover:text-zinc-200 hover:bg-zinc-850'
                    }`}
                  >
                    #{topic}
                  </button>
                ))}
                {activeTopics.size > 0 && (
                  <button
                    onClick={() => setActiveTopics(new Set())}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold text-red-400 border border-red-500/40 bg-red-500/10 hover:bg-red-500/20 transition-all flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Reset Filter
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Main Grid Content */}
          <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-6 lg:gap-8 pb-16">
            {/* Sidebar Categories */}
            {searchMode === 'curated' && (
              <aside
                className={`${sidebarOpen ? 'fixed inset-0 z-50 lg:static lg:z-auto' : 'hidden lg:block'} lg:w-64 lg:flex-shrink-0`}
              >
                {sidebarOpen && (
                  <div
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                  />
                )}
                <div
                  className={`${
                    sidebarOpen
                      ? 'fixed left-0 top-16 bottom-0 w-72 overflow-y-auto bg-[#06080d] border-r border-zinc-800 p-4'
                      : ''
                  } lg:static lg:w-full lg:p-0`}
                >
                  <div className="lg:sticky lg:top-24 space-y-1">
                    <div className="flex items-center justify-between mb-3 px-2">
                      <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" /> CATEGORIES
                      </h3>
                      <Filter className="w-3.5 h-3.5 text-zinc-500" />
                    </div>

                    <CategoryButton
                      active={activeCategory === 'all'}
                      onClick={() => {
                        setActiveCategory('all');
                        setSidebarOpen(false);
                      }}
                      icon={<LayoutGrid className="w-4 h-4" />}
                      label={`All in ${activeCommunityObj.name}`}
                      count={filteredRepos.length}
                    />

                    <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent my-2.5" />

                    {communityCategories.map((cat) => {
                      const Icon = iconMap[cat.icon] ?? Folder;
                      return (
                        <CategoryButton
                          key={cat.id}
                          active={activeCategory === cat.slug}
                          onClick={() => {
                            setActiveCategory(cat.slug);
                            setSidebarOpen(false);
                          }}
                          icon={<Icon className="w-4 h-4" />}
                          label={cat.name}
                          count={repoCountByCategory[cat.id] ?? repoCountByCategory[cat.slug] ?? 0}
                          color={cat.color}
                        />
                      );
                    })}
                  </div>
                </div>
              </aside>
            )}

            {/* Repositories Main List */}
            <main className="flex-1 min-w-0">
              {searchMode === 'curated' ? (
                <>
                  {/* Results Sub-bar with pagination indicator */}
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-3 p-3 rounded-xl dark-minimal-panel border border-zinc-800">
                    <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
                      <span className="text-zinc-400">ECOSYSTEM:</span>
                      <span className="text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                        {activeCommunityObj.name}
                      </span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-zinc-300">{filteredRepos.length} REPOSITORIES</span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-cyan-400/90 font-bold">
                        TAB {page} OF {totalPages}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-zinc-400 hidden sm:inline">SORT BY:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
                      >
                        <option value="stars">★ Most Starred</option>
                        <option value="gems">💎 Hidden & Underrated Gems</option>
                        <option value="name">A-Z Name</option>
                        <option value="category">Category</option>
                      </select>
                    </div>
                  </div>

                  {activeCatObj?.description && (
                    <div className="mb-5 p-4 rounded-xl dark-minimal-panel border border-cyan-500/15">
                      <p className="text-xs text-zinc-300 leading-relaxed font-mono">{activeCatObj.description}</p>
                    </div>
                  )}

                  {filteredRepos.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {pagedRepos.map((repo, i) => {
                          const cat = categories.find((c) => c.id === repo.category_id);
                          return (
                            <RepoCard3D
                              key={repo.id}
                              index={i}
                              repoId={repo.id}
                              name={repo.full_name}
                              description={repo.description}
                              url={repo.url}
                              stars={repo.stars}
                              language={repo.language}
                              topics={repo.topics}
                              categoryName={cat?.name ?? 'General'}
                              categoryColor={cat?.color ?? 'blue'}
                              isBookmarked={bookmarks.has(repo.id)}
                              onBookmark={() => toggleBookmark(repo.id)}
                              onToast={showToast}
                              onOpenModal={() =>
                                openModal({
                                  id: repo.id,
                                  name: repo.full_name,
                                  description: repo.description,
                                  url: repo.url,
                                  stars: repo.stars,
                                  language: repo.language,
                                  topics: repo.topics ?? [],
                                  categoryName: cat?.name ?? 'General',
                                  categoryColor: cat?.color ?? 'blue',
                                })
                              }
                            />
                          );
                        })}
                      </div>

                      {/* Pagination Tab Bars (Tab 1, 2, 3, 4...) */}
                      {totalPages > 1 && (
                        <Pagination
                          current={page}
                          total={totalPages}
                          onChange={(p) => {
                            setPage(p);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              ) : (
                <>
                  {/* GitHub live search results */}
                  <div className="flex items-center justify-between mb-5 p-3 rounded-xl dark-minimal-panel border border-zinc-800">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
                      <span className="text-cyan-300 font-bold">GITHUB LIVE SEARCH RADAR</span>
                      <span className="text-zinc-600">|</span>
                      <span className="text-zinc-300">
                        {githubLoading
                          ? 'Executing live GitHub query...'
                          : `${githubResults.length} projects discovered`}
                      </span>
                    </div>
                  </div>

                  {!searchQuery.trim() ? (
                    <GitHubPromptState onQuickSearch={(t) => handleQuickSearch(t, 'github')} />
                  ) : githubLoading && githubResults.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-3">
                      <Loader2 className="w-9 h-9 text-cyan-400 animate-spin" />
                      <span className="text-xs font-mono text-zinc-400">
                        Querying GitHub REST & GraphQL APIs across worldwide repositories...
                      </span>
                    </div>
                  ) : githubResults.length === 0 && !githubError ? (
                    <EmptyState />
                  ) : (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {pagedGithubResults.map((repo, i) => (
                          <RepoCard3D
                            key={repo.id}
                            index={i}
                            repoId={String(repo.id)}
                            name={repo.full_name}
                            description={repo.description}
                            url={repo.html_url}
                            stars={repo.stargazers_count}
                            language={repo.language}
                            topics={repo.topics ?? []}
                            categoryName="Live GitHub"
                            categoryColor="cyan"
                            isBookmarked={bookmarks.has(String(repo.id))}
                            onBookmark={() => toggleBookmark(String(repo.id))}
                            onToast={showToast}
                            onOpenModal={() =>
                              openModal({
                                id: String(repo.id),
                                name: repo.full_name,
                                description: repo.description,
                                url: repo.html_url,
                                stars: repo.stargazers_count,
                                language: repo.language,
                                topics: repo.topics ?? [],
                                categoryName: 'GitHub Live',
                                categoryColor: 'cyan',
                                forks: repo.forks_count,
                                watchers: repo.watchers_count,
                                openIssues: repo.open_issues_count,
                                license: repo.license?.name ?? null,
                                updatedAt: repo.updated_at,
                                homepage: repo.homepage,
                                ownerAvatar: repo.owner?.avatar_url ?? null,
                              })
                            }
                          />
                        ))}
                      </div>

                      {githubTotalPages > 1 && (
                        <Pagination
                          current={githubPage}
                          total={githubTotalPages}
                          onChange={(p) => {
                            setGithubPage(p);
                            window.scrollTo({ top: 400, behavior: 'smooth' });
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              )}
            </main>
          </div>

          {/* Footer */}
          <footer className="relative z-20 border-t border-white/[0.08] bg-[#05070c] mt-12 py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <Icon3D icon={Shield} color="cyan" size="sm" />
                  <div>
                    <p className="text-sm font-bold text-white font-display">CyberRepo Hub 3D</p>
                    <p className="text-[11px] text-zinc-500 font-mono">
                      Curated by <a href="https://github.com/Velqore" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">@Velqore</a> · Multi-Ecosystem Intelligence Portal
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-5 text-xs text-zinc-400 font-mono">
                  <span>{totalRepos} AUDITED REPOS</span>
                  <span className="text-zinc-700">|</span>
                  <span>{TECH_COMMUNITIES.length} TECH COMMUNITIES</span>
                  <span className="text-zinc-700">|</span>
                  <span className="text-cyan-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> 3D CINEMATIC PERSPECTIVE
                  </span>
                </div>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}

// ─── 3D Interactive Canvas Background ─────────────────────────────────────────
function CinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = Math.min(Math.floor(window.innerWidth / 22), 60);
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; alpha: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.45 + 0.15,
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(34, 211, 238, ${p1.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(34, 211, 238, ${0.1 * (1 - dist / 125)})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }

        const mdx = p1.x - mouseX;
        const mdy = p1.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 170) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 * (1 - mdist / 170)})`;
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Dark Minimal Ambient Canvas */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06080d] via-[#090d16] to-[#06080d]" />

      {/* Interactive Laser Vector Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 opacity-45" />

      {/* Chromatic Neon Orbs */}
      <div className="absolute top-[8%] left-[10%] w-[450px] h-[450px] rounded-full bg-cyan-500/10 blur-[130px] animate-float-orb" />
      <div
        className="absolute top-[35%] right-[8%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[120px] animate-float-orb"
        style={{ animationDelay: '6s' }}
      />
      <div
        className="absolute bottom-[15%] left-[30%] w-[360px] h-[360px] rounded-full bg-emerald-500/10 blur-[110px] animate-float-orb"
        style={{ animationDelay: '12s' }}
      />

      {/* 3D Perspective Grid Floor */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(34,211,238,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.7) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            transform: 'perspective(450px) rotateX(65deg) scale(2.2)',
            transformOrigin: 'center bottom',
            maskImage: 'linear-gradient(to top, black 0%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 80%)',
          }}
        />
      </div>

      {/* Laser Scan Line */}
      <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-scan-line shadow-[0_0_12px_rgba(34,211,238,0.8)]" />
    </div>
  );
}

// ─── 3D Cinematic Hero Section ────────────────────────────────────────────────
function HeroSection({
  totalRepos,
  categoriesCount,
  onOpenCreator,
}: {
  totalRepos: number;
  categoriesCount: number;
  onOpenCreator: () => void;
}) {
  return (
    <section className="relative z-10 overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium mb-5 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>MULTI-COMMUNITY ARSENAL</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">UNIVERSAL GITHUB RADAR</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] font-display mb-6">
              The Multi-Ecosystem{' '}
              <span className="hologram-gradient-text drop-shadow-[0_0_25px_rgba(34,211,238,0.4)]">
                Developer Vault
              </span>{' '}
              & Intelligence Radar
            </h2>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed max-w-2xl font-sans mb-8">
              Explore curated top-tier repositories and live GitHub radar searches across <strong>AI & Agents</strong>, <strong>Cybersecurity & Red Team</strong>, <strong>Full Stack Web</strong>, <strong>DevOps & Cloud</strong>, and <strong>Systems Engineering</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-300 mb-6">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl dark-minimal-panel border border-zinc-800">
                <Code2 className="w-4 h-4 text-cyan-400" />
                <span>6 Major Tech Communities</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl dark-minimal-panel border border-zinc-800">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Universal GitHub Live Radar</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl dark-minimal-panel border border-zinc-800">
                <Shield className="w-4 h-4 text-indigo-400" />
                <span>100% Open Source</span>
              </div>
            </div>

            {/* Direct Creator Callout */}
            <div className="p-3.5 rounded-2xl dark-minimal-panel border border-cyan-500/25 flex items-center justify-between gap-4 max-w-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-cyan-400/60 flex-shrink-0">
                  <img
                    src="https://avatars.githubusercontent.com/u/102029388?v=4"
                    alt="Velqore"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <span>Curated & Maintained by Velqore</span>
                    <span className="text-[10px] text-cyan-400 font-bold px-1.5 py-0.2 rounded bg-cyan-500/15">
                      ROOT
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 font-mono truncate">
                    Code Ronin · Full Stack & Offensive Systems Architect
                  </p>
                </div>
              </div>

              <button
                onClick={onOpenCreator}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-bold text-xs hover:brightness-110 shadow-md transition-all flex-shrink-0"
              >
                <span>CREATOR DASHBOARD</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Hero Right: Animated CyberRepo Logo */}
          <div className="lg:col-span-5 flex justify-center items-center perspective-1000">
            <CyberRepoLogoAnimation size="hero" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 3D Hologram Interactive Component ────────────────────────────────────────
function HologramCore3D() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -dy * 15, y: dx * 15 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-72 h-72 sm:w-80 sm:h-80 preserve-3d cursor-pointer"
      style={{
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
      }}
    >
      {/* Outer Glow Halo */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-2xl animate-pulse" />

      {/* Radar Ring 1 */}
      <div className="absolute inset-2 rounded-full border border-cyan-500/30 animate-radar-sweep border-dashed" />

      {/* Radar Ring 2 */}
      <div
        className="absolute inset-8 rounded-full border border-blue-500/30 animate-spin"
        style={{ animationDuration: '24s' }}
      />

      {/* 3D Glass Cyber Shield Hologram */}
      <div
        className="absolute inset-14 rounded-3xl dark-minimal-panel border border-cyan-400/40 flex flex-col items-center justify-center p-4 shadow-[0_0_35px_rgba(34,211,238,0.3)] backdrop-blur-2xl"
        style={{ transform: 'translateZ(45px)' }}
      >
        <div className="relative">
          <Icon3D icon={Shield} color="cyan" size="lg" />
        </div>
        <div className="text-center mt-3">
          <p className="text-xs font-bold text-white font-mono tracking-wider">ECOSYSTEM.3D</p>
          <p className="text-[10px] text-cyan-400 font-mono mt-0.5">STATUS: MULTI-DOMAIN</p>
        </div>
      </div>

      {/* Floating 3D HUD Tags */}
      <div
        className="absolute top-4 left-0 px-2.5 py-1 rounded-lg bg-zinc-950/90 border border-cyan-500/40 text-[10px] font-mono text-cyan-300 shadow-lg backdrop-blur-md"
        style={{ transform: 'translateZ(65px)' }}
      >
        [ AI_AGENTS ]
      </div>

      <div
        className="absolute bottom-6 right-0 px-2.5 py-1 rounded-lg bg-zinc-950/90 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 shadow-lg backdrop-blur-md"
        style={{ transform: 'translateZ(75px)' }}
      >
        [ CYBER_SECURITY ]
      </div>

      <div
        className="absolute bottom-2 left-6 px-2.5 py-1 rounded-lg bg-zinc-950/90 border border-purple-500/40 text-[10px] font-mono text-purple-300 shadow-lg backdrop-blur-md"
        style={{ transform: 'translateZ(55px)' }}
      >
        [ WEB_DEVOPS ]
      </div>
    </div>
  );
}

// ─── 3D Holographic Repo Card ─────────────────────────────────────────────────
function RepoCard3D({
  index,
  name,
  description,
  url,
  stars,
  language,
  topics,
  categoryName,
  categoryColor,
  isBookmarked,
  onBookmark,
  onOpenModal,
  onToast,
}: {
  index: number;
  repoId: string;
  name: string;
  description: string | null;
  url: string;
  stars: number;
  language: string | null;
  topics: string[];
  categoryName: string;
  categoryColor: string;
  isBookmarked: boolean;
  onBookmark: () => void;
  onOpenModal: () => void;
  onToast: (msg: string) => void;
}) {
  const colorSpec = colorClasses[categoryColor] ?? colorClasses['blue'];

  const handleCopyClone = (e: React.MouseEvent) => {
    e.stopPropagation();
    const cloneCmd = `git clone ${url}.git`;
    navigator.clipboard.writeText(cloneCmd);
    onToast(`Copied clone command to clipboard: ${name}`);
  };

  const getCategoryIcon = (catName: string) => {
    const c = catName.toLowerCase();
    if (c.includes('pentest') || c.includes('offensive')) return Sword;
    if (c.includes('osint') || c.includes('recon')) return Eye;
    if (c.includes('malware') || c.includes('forensics')) return Bug;
    if (c.includes('reverse') || c.includes('compiler') || c.includes('systems')) return Cpu;
    if (c.includes('web') || c.includes('frontend')) return Globe;
    if (c.includes('llm') || c.includes('ai') || c.includes('learning')) return Brain;
    if (c.includes('cloud') || c.includes('devops')) return Cloud;
    if (c.includes('mobile') || c.includes('network') || c.includes('wifi')) return Wifi;
    if (c.includes('crypto')) return Lock;
    return Shield;
  };

  const IconComponent = getCategoryIcon(categoryName);

  return (
    <div style={{ animation: `fade-up 0.4s ease-out ${Math.min(index * 0.03, 0.6)}s both` }}>
      <Card3D
        maxTilt={10}
        depth={20}
        onClick={onOpenModal}
        className="dark-minimal-panel p-5 border border-zinc-800/90 hover:border-cyan-500/40 cursor-pointer flex flex-col justify-between h-full"
      >
        <div>
          {/* Top Bar */}
          <div className="flex items-start justify-between gap-2 mb-3.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Icon3D icon={IconComponent} color="cyan" size="sm" />
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase border ${colorSpec.badge}`}
              >
                {categoryName}
              </span>
              {(topics?.includes('gem') || (stars <= 3500 && stars > 0)) && (
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/35 shadow-[0_0_8px_rgba(245,158,11,0.2)]">
                  💎 GEM
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyClone}
                className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800 border border-zinc-800 transition-all"
                title="Copy git clone command"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmark();
                }}
                className={`p-1.5 rounded-lg border transition-all ${
                  isBookmarked
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-cyan-300'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Bookmark repository'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-3.5 h-3.5" />
                ) : (
                  <Bookmark className="w-3.5 h-3.5" />
                )}
              </button>

              <div className="flex items-center gap-1 text-xs font-mono text-amber-400 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{formatStars(stars)}</span>
              </div>
            </div>
          </div>

          {/* Repository Title */}
          <div className="flex items-center gap-2 mb-2">
            <Github className="w-4 h-4 text-cyan-400/80 flex-shrink-0" />
            <h3 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-sm font-display leading-tight truncate">
              {name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4 font-sans">
            {description ?? 'No description provided by author.'}
          </p>
        </div>

        {/* Bottom Meta */}
        <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono pt-2 border-t border-zinc-850">
          {language && (
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLanguageColor(language) }} />
              <span className="text-[11px] text-zinc-300">{language}</span>
            </div>
          )}
          {topics && topics.length > 0 && (
            <div className="flex items-center gap-1 overflow-hidden">
              {topics.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 text-[9px] font-mono truncate"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-1 ml-auto text-cyan-400 font-mono text-[10px] group-hover:translate-x-0.5 transition-transform">
            <span>EXPLORE</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </Card3D>
    </div>
  );
}

// ─── Futuristic Pagination Tab Bar (Tab 1, 2, 3...) ───────────────────────────
function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (page: number) => void;
}) {
  function getPages(): (number | '...')[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const pages: (number | '...')[] = [];
    const left = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);
    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < total - 1) pages.push('...');
    pages.push(total);
    return pages;
  }

  const pages = getPages();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 p-4 rounded-2xl dark-minimal-panel border border-cyan-500/20">
      <div className="text-xs font-mono text-zinc-400">
        PAGE TAB <span className="text-cyan-400 font-bold">{current}</span> OF{' '}
        <span className="text-zinc-200">{total}</span>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        <button
          onClick={() => onChange(current - 1)}
          disabled={current === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-cyan-300 hover:border-cyan-500/40 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>PREV</span>
        </button>

        <div className="flex items-center gap-1">
          {pages.map((p, idx) =>
            p === '...' ? (
              <span key={`ellipsis-${idx}`} className="px-2 py-1 text-zinc-600 text-xs font-mono select-none">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onChange(p as number)}
                className={`min-w-[36px] h-9 px-2.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  current === p
                    ? 'bg-gradient-to-r from-cyan-500/30 to-blue-600/30 text-cyan-200 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.35)]'
                    : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-cyan-500/30 hover:bg-zinc-850'
                }`}
              >
                TAB {p}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onChange(current + 1)}
          disabled={current === total}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-cyan-300 hover:border-cyan-500/40 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span>NEXT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Category Button ──────────────────────────────────────────────────────────
function CategoryButton({
  active,
  onClick,
  icon,
  label,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count: number;
  color?: string;
}) {
  const colorSpec = color ? colorClasses[color] : null;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
        active
          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-200 border border-cyan-500/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent'
      }`}
    >
      <span className={active ? 'text-cyan-400' : colorSpec ? colorSpec.text : 'text-zinc-400'}>
        {icon}
      </span>
      <span className="flex-1 text-left truncate font-sans">{label}</span>
      <span
        className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
          active ? 'bg-cyan-500/30 text-cyan-200' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ─── Repo Detail Modal ────────────────────────────────────────────────────────
function RepoModal({
  repo,
  loading,
  isBookmarked,
  onBookmark,
  onClose,
  onToast,
}: {
  repo: ModalRepo;
  loading: boolean;
  isBookmarked: boolean;
  onBookmark: () => void;
  onClose: () => void;
  onToast: (msg: string) => void;
}) {
  const colorSpec = colorClasses[repo.categoryColor] ?? colorClasses['blue'];

  const copyClone = () => {
    navigator.clipboard.writeText(`git clone ${repo.url}.git`);
    onToast(`Clone command copied!`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090e1a] border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] animate-modal-in">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-6 bg-[#090e1a]/95 backdrop-blur-md border-b border-zinc-800">
          <div className="flex items-start gap-3.5 min-w-0">
            {repo.ownerAvatar ? (
              <img
                src={repo.ownerAvatar}
                alt=""
                className="w-12 h-12 rounded-2xl border border-cyan-500/30 flex-shrink-0 shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Github className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${colorSpec.badge}`}
                >
                  {repo.categoryName}
                </span>
                {repo.license && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {repo.license}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white font-display leading-tight truncate">
                {repo.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onBookmark}
              className={`p-2.5 rounded-xl border transition-all ${
                isBookmarked
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:text-cyan-300'
              }`}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark repository'}
            >
              {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <p className="text-zinc-300 leading-relaxed text-sm">
            {repo.description ?? 'No description available.'}
          </p>

          {/* Stats matrix */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
              <span className="text-xs font-mono text-zinc-500">Fetching extended GitHub metadata...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ModalStatCard icon={Star} label="STARS" value={formatStars(repo.stars)} color="amber" />
              <ModalStatCard
                icon={GitFork}
                label="FORKS"
                value={repo.forks != null ? formatStars(repo.forks) : '—'}
                color="cyan"
              />
              <ModalStatCard
                icon={Eye}
                label="WATCHERS"
                value={repo.watchers != null ? formatStars(repo.watchers) : '—'}
                color="blue"
              />
              <ModalStatCard
                icon={AlertCircle}
                label="OPEN ISSUES"
                value={repo.openIssues != null ? String(repo.openIssues) : '—'}
                color="orange"
              />
            </div>
          )}

          {/* Language & Timestamp */}
          <div className="flex flex-wrap gap-4 text-xs font-mono text-zinc-400">
            {repo.language && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                />
                <span>PRIMARY: {repo.language}</span>
              </div>
            )}
            {repo.updatedAt && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                <span>UPDATED: {new Date(repo.updatedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Topics tag cluster */}
          {repo.topics.length > 0 && (
            <div>
              <p className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2.5">
                ASSOCIATED TAGS
              </p>
              <div className="flex flex-wrap gap-1.5">
                {repo.topics.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-900 text-cyan-300 border border-zinc-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Clone box */}
          <div className="p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
            <div className="font-mono text-xs text-zinc-400 truncate flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span className="truncate">git clone {repo.url}.git</span>
            </div>
            <button
              onClick={copyClone}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold hover:bg-cyan-500/30 transition-all flex-shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>COPY</span>
            </button>
          </div>

          {/* Action links */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-zinc-900 border border-zinc-700 text-xs font-mono font-bold text-zinc-200 hover:border-cyan-400 transition-all"
              >
                <Globe className="w-4 h-4 text-cyan-400" />
                PROJECT HOMEPAGE
              </a>
            )}
            <a
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 text-xs font-mono font-extrabold hover:brightness-110 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
            >
              <Github className="w-4 h-4" />
              VIEW ON GITHUB
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalStatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    orange: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
  };
  return (
    <div className={`flex flex-col items-center gap-1 p-3 rounded-2xl border ${colorMap[color] ?? 'border-zinc-800'}`}>
      <Icon className="w-4 h-4" />
      <span className="text-base font-bold text-white font-mono">{value}</span>
      <span className="text-[10px] font-mono text-zinc-400">{label}</span>
    </div>
  );
}

// ─── Stats Dashboard View ─────────────────────────────────────────────────────
function StatsDashboard({
  repositories,
  categories,
}: {
  repositories: Repository[];
  categories: Category[];
}) {
  const totalStars = useMemo(() => repositories.reduce((s, r) => s + r.stars, 0), [repositories]);

  const langDist = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of repositories) {
      if (r.language) counts[r.language] = (counts[r.language] ?? 0) + 1;
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [repositories]);

  const maxLangCount = langDist[0]?.[1] ?? 1;

  const catDist = useMemo(() => {
    return categories
      .map((cat) => ({
        cat,
        count: repositories.filter((r) => r.category_id === cat.id).length,
      }))
      .sort((a, b) => b.count - a.count);
  }, [repositories, categories]);

  const maxCatCount = catDist[0]?.count ?? 1;

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
          <span>GLOBAL ECOSYSTEM TELEMETRY & ANALYTICS</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white font-display">Directory Intelligence & Metrics</h2>
        <p className="text-zinc-400 text-sm mt-1">Real-time analytical breakdown across audited multi-ecosystem repositories</p>
      </div>

      {/* Top Counter Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Audited Repos', value: repositories.length, icon: Database, color: 'cyan' },
          { label: 'Cumulative Stars', value: totalStars, icon: Star, color: 'amber' },
          { label: 'Domain Disciplines', value: categories.length, icon: LayoutGrid, color: 'purple' },
          { label: 'Languages Active', value: langDist.length, icon: Code2, color: 'green' },
        ].map(({ label, value, icon: Icon, color }) => (
          <AnimatedCounter key={label} label={label} value={value} icon={Icon} color={color} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Language Distribution */}
        <div className="rounded-3xl dark-minimal-panel p-6 border border-cyan-500/20">
          <h3 className="text-sm font-bold text-white font-display mb-5 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Top Primary Programming Languages
          </h3>
          <div className="space-y-3">
            {langDist.map(([lang, count]) => (
              <div key={lang} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-28 flex-shrink-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getLanguageColor(lang) }}
                  />
                  <span className="text-xs font-mono text-zinc-300 truncate">{lang}</span>
                </div>
                <div className="flex-1 bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                  <div
                    className="h-full rounded-full transition-all duration-1000 shadow-sm"
                    style={{
                      width: `${(count / maxLangCount) * 100}%`,
                      backgroundColor: getLanguageColor(lang),
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-zinc-400 w-8 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="rounded-3xl dark-minimal-panel p-6 border border-cyan-500/20">
          <h3 className="text-sm font-bold text-white font-display mb-5 flex items-center gap-2">
            <LayoutGrid className="w-4 h-4 text-cyan-400" />
            Repositories by Category
          </h3>
          <div className="space-y-3">
            {catDist.map(({ cat, count }) => {
              const colorSpec = colorClasses[cat.color] ?? colorClasses['blue'];
              return (
                <div key={cat.id} className="flex items-center gap-3">
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${colorSpec.badge} w-36 truncate text-center`}
                  >
                    {cat.name}
                  </span>
                  <div className="flex-1 bg-zinc-950 rounded-full h-2.5 overflow-hidden border border-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                      style={{ width: `${(count / maxCatCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-mono text-zinc-400 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top 10 Starred Repos */}
      <div className="rounded-3xl dark-minimal-panel p-6 border border-cyan-500/20">
        <h3 className="text-sm font-bold text-white font-display mb-5 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Top 10 Most Starred Open-Source Projects
        </h3>
        <div className="space-y-2">
          {[...repositories]
            .sort((a, b) => b.stars - a.stars)
            .slice(0, 10)
            .map((repo, i) => {
              const cat = categories.find((c) => c.id === repo.category_id);
              const colorSpec = colorClasses[cat?.color ?? 'blue'];
              return (
                <a
                  key={repo.id}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3.5 rounded-2xl hover:bg-zinc-900 transition-all group border border-transparent hover:border-cyan-500/30"
                >
                  <span className="text-sm font-mono font-bold text-zinc-500 w-6 text-center flex-shrink-0">
                    #{i + 1}
                  </span>
                  <span
                    className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${colorSpec.badge} hidden sm:block`}
                  >
                    {cat?.name ?? 'General'}
                  </span>
                  <span className="flex-1 text-sm font-bold text-zinc-200 group-hover:text-cyan-300 transition-colors truncate font-display">
                    {repo.full_name}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {formatStars(repo.stars)}
                  </div>
                  <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
                </a>
              );
            })}
        </div>
      </div>
    </div>
  );
}

function AnimatedCounter({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}) {
  const [display, setDisplay] = useState(0);
  const colorMap: Record<string, string> = {
    cyan: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    green: 'text-green-400 bg-green-500/10 border-green-500/30',
  };

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const step = 16;
    const increment = value / (duration / step);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else setDisplay(Math.floor(start));
    }, step);
    return () => clearInterval(timer);
  }, [value]);

  return (
    <div className={`rounded-3xl border p-5 dark-minimal-panel ${colorMap[color] ?? 'border-zinc-800'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="text-3xl font-extrabold text-white mb-1 font-display tracking-tight">
        {display >= 1000 ? `${(display / 1000).toFixed(1)}k` : display}
      </div>
      <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{label}</div>
    </div>
  );
}

// ─── Favorites View ───────────────────────────────────────────────────────────
function FavoritesView({
  repos,
  categories,
  bookmarks,
  onToggleBookmark,
  onOpenModal,
  onToast,
}: {
  repos: Repository[];
  categories: Category[];
  bookmarks: Set<string>;
  onToggleBookmark: (id: string) => void;
  onOpenModal: (repo: ModalRepo) => void;
  onToast: (msg: string) => void;
}) {
  if (repos.length === 0) {
    return (
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 flex flex-col items-center text-center">
        <Icon3D icon={Bookmark} color="cyan" size="xl" />
        <h2 className="text-2xl font-bold text-white font-display mb-2 mt-5">No Saved Repositories</h2>
        <p className="text-zinc-400 max-w-md text-sm leading-relaxed">
          Bookmark any repository from the directory grid by clicking the bookmark icon on its card.
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl dark-minimal-panel border border-cyan-500/20">
        <BookmarkCheck className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white font-display">Personal Saved Arsenal</h2>
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
          {repos.length} REPOSITORIES
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {repos.map((repo, i) => {
          const cat = categories.find((c) => c.id === repo.category_id);
          return (
            <RepoCard3D
              key={repo.id}
              index={i}
              repoId={repo.id}
              name={repo.full_name}
              description={repo.description}
              url={repo.url}
              stars={repo.stars}
              language={repo.language}
              topics={repo.topics}
              categoryName={cat?.name ?? 'General'}
              categoryColor={cat?.color ?? 'blue'}
              isBookmarked={bookmarks.has(repo.id)}
              onBookmark={() => onToggleBookmark(repo.id)}
              onToast={onToast}
              onOpenModal={() =>
                onOpenModal({
                  id: repo.id,
                  name: repo.full_name,
                  description: repo.description,
                  url: repo.url,
                  stars: repo.stars,
                  language: repo.language,
                  topics: repo.topics ?? [],
                  categoryName: cat?.name ?? 'General',
                  categoryColor: cat?.color ?? 'blue',
                })
              }
            />
          );
        })}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 text-zinc-500 shadow-md">
        <Search className="w-7 h-7" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1 font-display">No Repositories Discovered</h3>
      <p className="text-xs text-zinc-400 font-mono">Adjust your keywords, tag filters, or select a different ecosystem.</p>
    </div>
  );
}

function GitHubPromptState({ onQuickSearch }: { onQuickSearch: (t: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center p-8 rounded-3xl dark-minimal-panel border border-cyan-500/20 max-w-xl mx-auto">
      <Icon3D icon={Zap} color="cyan" size="lg" />
      <h3 className="text-xl font-bold text-white mb-2 font-display mt-4">Universal GitHub Live Radar</h3>
      <p className="text-xs text-zinc-400 font-mono leading-relaxed mb-6">
        Search any repository or framework across worldwide GitHub repositories in real-time.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {['react', 'langchain', 'pytorch', 'researchmind-ai', 'phantomtrace', 'next.js', 'fastapi', 'kubernetes'].map((q) => (
          <button
            key={q}
            onClick={() => onQuickSearch(q)}
            className="px-3 py-1 rounded-lg bg-zinc-900 hover:bg-cyan-500/20 text-xs font-mono text-cyan-300 border border-zinc-800 hover:border-cyan-400 transition-all shadow-sm"
          >
            🔎 {q}
          </button>
        ))}
      </div>
    </div>
  );
}
