import { useState, useEffect, useMemo } from 'react';
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  Terminal,
  Shield,
  Code2,
  Sparkles,
  MapPin,
  Globe,
  RefreshCw,
  Search,
  Check,
  Copy,
  Layers,
  Zap,
  Lock,
  Cpu,
  Brain,
  Rocket,
  Flame,
  Radio,
  Bookmark,
  Share2,
} from 'lucide-react';
import {
  fetchGitHubUserProfile,
  fetchGitHubUserRepos,
  VELQORE_FALLBACK_PROFILE,
  VELQORE_FALLBACK_REPOS,
  type GitHubUserProfile,
  type GitHubUserRepo,
} from '@/lib/github';
import { formatStars, getLanguageColor } from '@/lib/format';
import { Card3D } from '@/components/Card3D';
import { Icon3D } from '@/components/Icon3D';
import { CyberRepoCodeCore } from '@/components/CyberRepoLogo';

interface CreatorDashboardProps {
  onToast: (msg: string) => void;
}

type RepoCategory = 'all' | 'ai' | 'security' | 'web' | 'bots';
type OwnershipFilter = 'all' | 'creator' | 'contributor';

export function CreatorDashboard({ onToast }: CreatorDashboardProps) {
  const [profile, setProfile] = useState<GitHubUserProfile>(VELQORE_FALLBACK_PROFILE);
  const [repos, setRepos] = useState<GitHubUserRepo[]>(VELQORE_FALLBACK_REPOS);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<RepoCategory>('all');
  const [selectedOwnership, setSelectedOwnership] = useState<OwnershipFilter>('all');
  const [sortBy, setSortBy] = useState<'stars' | 'updated' | 'name'>('updated');

  // Terminal simulator state
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string | React.ReactNode }>>([
    {
      cmd: 'whoami',
      output: 'Velqore :: Code Ronin & Security Architect [Root Privileges Granted]',
    },
    {
      cmd: 'cat mission.txt',
      output: 'Break it. Fix it. Own it. Cutting through bugs like a katana.',
    },
  ]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userRes, reposRes] = await Promise.all([
        fetchGitHubUserProfile('Velqore'),
        fetchGitHubUserRepos('Velqore'),
      ]);

      if (userRes) {
        setProfile(userRes);
        setIsLive(true);
      }
      if (reposRes && reposRes.length > 0) {
        setRepos(reposRes);
        setIsLive(true);
      }
    } catch {
      // Fallbacks already initialized
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalStars = useMemo(() => {
    return repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  }, [repos]);

  const totalForks = useMemo(() => {
    return repos.reduce((acc, r) => acc + (r.forks_count || 0), 0);
  }, [repos]);

  const languageStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const r of repos) {
      if (r.language) {
        counts[r.language] = (counts[r.language] || 0) + 1;
      }
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [repos]);

  const categorizedRepos = useMemo(() => {
    return repos.filter((r) => {
      // Ownership filter
      const type = r.contribution_type ?? (r.fork ? 'contributor' : 'creator');
      if (selectedOwnership !== 'all' && type !== selectedOwnership) {
        return false;
      }

      const name = r.name.toLowerCase();
      const desc = (r.description || '').toLowerCase();
      const topics = (r.topics || []).map((t) => t.toLowerCase());

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'ai') {
        return (
          name.includes('ai') ||
          name.includes('research') ||
          desc.includes('ai') ||
          desc.includes('claude') ||
          topics.some((t) => t.includes('ai'))
        );
      }
      if (selectedCategory === 'security') {
        return (
          name.includes('trace') ||
          name.includes('hack') ||
          name.includes('claude-red') ||
          name.includes('numberinfo') ||
          desc.includes('forensics') ||
          desc.includes('security') ||
          desc.includes('offensive') ||
          topics.some((t) => t.includes('security') || t.includes('forensics') || t.includes('osint'))
        );
      }
      if (selectedCategory === 'web') {
        return (
          name.includes('climate') ||
          name.includes('profile') ||
          name.includes('kalam') ||
          name.includes('forever') ||
          name.includes('crush') ||
          Boolean(r.homepage)
        );
      }
      if (selectedCategory === 'bots') {
        return (
          name.includes('md') ||
          name.includes('prince') ||
          name.includes('anya') ||
          name.includes('lord') ||
          desc.includes('bot') ||
          topics.some((t) => t.includes('bot'))
        );
      }
      return true;
    });
  }, [repos, selectedOwnership, selectedCategory]);

  const filteredRepos = useMemo(() => {
    let result = categorizedRepos;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.language && r.language.toLowerCase().includes(q)) ||
          (r.topics && r.topics.some((t) => t.toLowerCase().includes(q)))
      );
    }

    const sorted = [...result];
    if (sortBy === 'stars') {
      sorted.sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortBy === 'name') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      sorted.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    }
    return sorted;
  }, [categorizedRepos, searchQuery, sortBy]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    let output: string | React.ReactNode = '';

    switch (cmd) {
      case 'help':
        output = 'Available commands: whoami, bio, skills, repos, contact, clearance, matrix, clear';
        break;
      case 'whoami':
        output = `Operator: ${profile.name || 'Velqore'} (@${profile.login}) | Location: ${profile.location || 'Gurgaon'}`;
        break;
      case 'bio':
        output = profile.bio || 'Code Ronin | Master of algorithms';
        break;
      case 'skills':
        output = 'Offensive Security, Anti-Forensics, AI Copilots, Chrome Extensions, React, FastAPI, Supabase, Go, Node.js';
        break;
      case 'repos':
        output = `Tracking ${repos.length} public modules: ${repos.map((r) => r.name).join(', ')}`;
        break;
      case 'contact':
        output = `GitHub: ${profile.html_url} | Portfolio: ${profile.blog || 'https://ayush-tyagi.base44.app/'}`;
        break;
      case 'clearance':
        output = 'STATUS: ROOT // CLEARANCE: 0xALPHA // MODE: OFFENSIVE';
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      case 'matrix':
        output = 'WAKE UP, NEO... THE MATRIX HAS YOU. FOLLOW THE WHITE RABBIT. 🐇';
        break;
      default:
        output = `Command not recognized: "${cmd}". Type "help" for a list of directives.`;
    }

    setTerminalHistory((prev) => [...prev, { cmd: terminalInput, output }]);
    setTerminalInput('');
  };

  const copyClone = (url: string, name: string) => {
    navigator.clipboard.writeText(`git clone ${url}.git`);
    onToast(`Copied clone command for ${name}`);
  };

  const copyProfileLink = () => {
    navigator.clipboard.writeText('https://github.com/Velqore');
    onToast('Copied Velqore GitHub URL to clipboard');
  };

  return (
    <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* ──────────────── Top Telemetry Status Header ──────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl dark-minimal-panel border border-cyan-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.6)] cyber-hud-corner">
        <div className="flex items-center gap-3">
          <CyberRepoCodeCore size={36} />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white font-display tracking-tight flex items-center gap-2">
                CREATOR DOSSIER <span className="text-cyan-400">:: VELQORE</span>
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {isLive ? 'LIVE GITHUB LINKED' : 'CACHED PROFILE'}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              OFFENSIVE SECURITY ARCHITECT · FULL STACK BUILDER · AI SYSTEMS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-xs font-mono text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all shadow-sm disabled:opacity-50"
            title="Refresh live GitHub data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>SYNC GITHUB</span>
          </button>

          <button
            onClick={copyProfileLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-xs font-mono text-zinc-300 border border-zinc-700/60 hover:border-zinc-500 transition-all"
            title="Share Profile Link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>SHARE</span>
          </button>

          <a
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-black text-xs hover:brightness-110 shadow-[0_0_15px_rgba(34,211,238,0.35)] transition-all"
          >
            <Github className="w-4 h-4" />
            <span>GITHUB @VELQORE</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ──────────────── 3D Hero Profile & Dossier Matrix ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: 3D Holographic Identity Card */}
        <div className="lg:col-span-5">
          <Card3D maxTilt={8} depth={25} className="dark-minimal-panel p-6 border border-cyan-500/25">
            <div className="flex flex-col items-center text-center">
              {/* 3D Glowing Avatar */}
              <div className="relative mb-5 group">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-purple-600 opacity-60 blur-lg group-hover:opacity-100 transition-opacity animate-pulse" />
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border-2 border-cyan-400/60 bg-zinc-950 shadow-[0_0_25px_rgba(34,211,238,0.4)]">
                  <img
                    src={profile.avatar_url}
                    alt={profile.login}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-zinc-950 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
              </div>

              {/* Name & Handle */}
              <h3 className="text-2xl font-black text-white font-display tracking-tight flex items-center gap-2 justify-center">
                {profile.name || 'Ayush Tyagi'}
                <span className="text-sm font-mono text-cyan-400 font-bold px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30">
                  @{profile.login}
                </span>
              </h3>

              {/* Bio & Motto */}
              <div className="mt-3 p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 w-full text-left font-mono text-xs text-zinc-300 leading-relaxed shadow-inner">
                <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>OPERATOR MOTTO</span>
                </div>
                <p className="text-zinc-200 italic whitespace-pre-line">
                  {profile.bio || 'Code Ronin | Master of algorithms \nCutting through bugs like a katana'}
                </p>
              </div>

              {/* Location & Links */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-zinc-400 w-full">
                {profile.location && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>{profile.followers} Followers · {profile.following} Following</span>
                </div>
              </div>

              {/* Verified Portfolio Action */}
              {profile.blog && (
                <a
                  href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-850 hover:from-cyan-950/40 hover:to-blue-950/40 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold hover:border-cyan-400 transition-all shadow-md group"
                >
                  <Globe className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  <span>EXPLORE LIVE PORTFOLIO</span>
                  <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                </a>
              )}
            </div>
          </Card3D>
        </div>

        {/* Right: Key Telemetry Metrics & Interactive Cyber Terminal */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top 4 Metrics Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'PUBLIC REPOSITORIES', value: repos.length, icon: Code2, color: 'cyan' as const },
              { label: 'AGGREGATED STARS', value: totalStars, icon: Star, color: 'amber' as const },
              { label: 'MODULE FORKS', value: totalForks, icon: GitFork, color: 'purple' as const },
              { label: 'PRIMARY DISCIPLINES', value: 5, icon: Zap, color: 'emerald' as const },
            ].map(({ label, value, icon, color }) => (
              <Card3D key={label} maxTilt={6} depth={15} className="dark-minimal-panel p-4 border border-zinc-800/90 text-center">
                <div className="flex justify-center mb-2">
                  <Icon3D icon={icon} color={color} size="sm" />
                </div>
                <div className="text-2xl font-black text-white font-display tracking-tight">{value}</div>
                <div className="text-[10px] font-mono text-zinc-400 mt-0.5 uppercase tracking-wider">{label}</div>
              </Card3D>
            ))}
          </div>

          {/* Interactive Cyber Terminal Simulator */}
          <div className="rounded-2xl dark-minimal-panel border border-cyan-500/25 overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.7)]">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950/90 border-b border-zinc-800 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 text-zinc-300 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  operator@velqore-terminal:~$
                </span>
              </div>
              <span className="text-[10px] text-cyan-400/80 font-mono">TYPE 'help' FOR CMDS</span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 bg-[#05070d]/95 font-mono text-xs text-zinc-200 h-52 overflow-y-auto space-y-2.5 scrollbar-thin">
              <div className="text-zinc-500 select-none pb-1 border-b border-zinc-900">
                [SYSTEM ACTIVE] Velqore Operator Matrix v2.6 -- Node: /dev/cyber
              </div>

              {terminalHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 font-semibold">
                    <span>❯</span>
                    <span className="text-zinc-100">{item.cmd}</span>
                  </div>
                  <div className="text-zinc-300 pl-4 border-l border-cyan-500/30 py-0.5">
                    {item.output}
                  </div>
                </div>
              ))}

              {/* Terminal Active Input Line */}
              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 pt-1">
                <span className="text-emerald-400 font-bold">❯</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="enter directive (e.g. skills, repos, bio, clearance)..."
                  className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder-zinc-600 font-mono text-xs focus:ring-0"
                />
                <span className="w-2 h-4 bg-cyan-400 animate-terminal-blink inline-block" />
              </form>
            </div>
          </div>

          {/* Languages & Core Stacks Badges */}
          <div className="p-4 rounded-2xl dark-minimal-panel border border-zinc-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-300">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">ACTIVE LANGUAGES:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {languageStats.map(([lang, count]) => (
                <div
                  key={lang}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs font-mono text-zinc-300 shadow-sm"
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getLanguageColor(lang) }} />
                  <span>{lang}</span>
                  <span className="text-[10px] text-zinc-500">({count})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ──────────────── Creator's Arsenal Section ──────────────── */}
      <div className="space-y-6 pt-4">
        {/* Section Title & Primary Ownership Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-2xl dark-minimal-panel border border-cyan-500/20 cyber-hud-corner">
          <div>
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold mb-1">
              <Rocket className="w-3.5 h-3.5" />
              <span>MODULE REPOSITORY ARSENAL</span>
            </div>
            <h3 className="text-xl font-black text-white font-display">
              Projects & Engineering Toolkits ({filteredRepos.length})
            </h3>
          </div>

          {/* Ownership Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
            {[
              { id: 'all' as OwnershipFilter, label: 'All Works', count: repos.length },
              {
                id: 'creator' as OwnershipFilter,
                label: 'Original Creations',
                icon: Sparkles,
                count: repos.filter((r) => (r.contribution_type ?? (r.fork ? 'contributor' : 'creator')) === 'creator').length,
              },
              {
                id: 'contributor' as OwnershipFilter,
                label: 'Contributory & Maintained',
                icon: Zap,
                count: repos.filter((r) => (r.contribution_type ?? (r.fork ? 'contributor' : 'creator')) === 'contributor').length,
              },
            ].map(({ id, label, icon: Icon, count }) => (
              <button
                key={id}
                onClick={() => setSelectedOwnership(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  selectedOwnership === id
                    ? 'bg-gradient-to-r from-cyan-500/25 to-blue-600/25 text-cyan-300 border border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{label}</span>
                {count !== undefined && <span className="text-[10px] text-zinc-500">({count})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Category Filters & Search/Sort */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 p-3 rounded-2xl bg-zinc-950/60 border border-zinc-850">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all' as RepoCategory, label: 'All Disciplines' },
              { id: 'ai' as RepoCategory, label: 'AI & Research', icon: Brain },
              { id: 'security' as RepoCategory, label: 'Offensive & Forensics', icon: Lock },
              { id: 'web' as RepoCategory, label: 'Web Platforms', icon: Globe },
              { id: 'bots' as RepoCategory, label: 'Bots & Automation', icon: Cpu },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setSelectedCategory(id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                  selectedCategory === id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80 border border-transparent'
                }`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Search & Sort Subbar */}
          <div className="flex items-center gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-400/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter repositories..."
                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-lg pl-8 pr-3 py-1 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-cyan-400/60 font-mono"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1 text-xs text-zinc-200 focus:outline-none focus:border-cyan-400 font-mono cursor-pointer"
              >
                <option value="updated">⏱ Updated</option>
                <option value="stars">★ Stars</option>
                <option value="name">A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3D Repositories Grid */}
        {filteredRepos.length === 0 ? (
          <div className="p-12 rounded-3xl dark-minimal-panel border border-zinc-800 text-center">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-500">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white font-display">No Modules Found</h4>
            <p className="text-xs font-mono text-zinc-400 mt-1">Try resetting the category filter or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRepos.map((repo) => {
              const isSecurity =
                repo.name.toLowerCase().includes('trace') ||
                repo.name.toLowerCase().includes('hack') ||
                repo.name.toLowerCase().includes('red');
              const isAI = repo.name.toLowerCase().includes('ai') || repo.name.toLowerCase().includes('research');
              const isContributor = (repo.contribution_type ?? (repo.fork ? 'contributor' : 'creator')) === 'contributor';

              return (
                <Card3D
                  key={repo.id}
                  maxTilt={10}
                  depth={20}
                  className="dark-minimal-panel p-5 border border-zinc-800/90 hover:border-cyan-500/40 flex flex-col justify-between group"
                >
                  {/* Top Row: Icon + Badges + Clone */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Icon3D
                        icon={isSecurity ? Lock : isAI ? Brain : Code2}
                        color={isSecurity ? 'rose' : isAI ? 'purple' : 'cyan'}
                        size="sm"
                      />

                      <div className="flex flex-wrap items-center gap-1.5 justify-end">
                        {/* Ownership Badge */}
                        {isContributor ? (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5 text-purple-400" />
                            <span>CONTRIBUTOR</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-cyan-400" />
                            <span>ORIGINAL AUTHOR</span>
                          </span>
                        )}

                        {repo.homepage && (
                          <a
                            href={repo.homepage}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-0.5 rounded-md text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 hover:bg-emerald-500/20 transition-all shadow-sm"
                            title="Open live deployment"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>LIVE</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}

                        <button
                          onClick={() => copyClone(repo.html_url, repo.name)}
                          className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-cyan-300 hover:bg-zinc-800 border border-zinc-800 transition-all"
                          title="Copy git clone command"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Repository Name */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <h4 className="font-bold text-white group-hover:text-cyan-300 transition-colors text-base font-display leading-tight truncate">
                        {repo.name}
                      </h4>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-zinc-400 leading-relaxed font-sans line-clamp-3 mb-4">
                      {repo.description || 'Custom module developed by Velqore.'}
                    </p>
                  </div>

                  {/* Bottom Meta & Action Links */}
                  <div className="pt-3 border-t border-zinc-850 space-y-3">
                    {/* Tags & Language */}
                    <div className="flex items-center justify-between gap-2 text-xs font-mono">
                      {repo.language ? (
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getLanguageColor(repo.language) }}
                          />
                          <span className="text-zinc-300 text-[11px]">{repo.language}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-500 font-mono">Config/Docs</span>
                      )}

                      <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                        {repo.stargazers_count > 0 && (
                          <span className="flex items-center gap-1 text-amber-400 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            {repo.stargazers_count}
                          </span>
                        )}
                        {repo.forks_count > 0 && (
                          <span className="flex items-center gap-1 text-cyan-400">
                            <GitFork className="w-3 h-3" />
                            {repo.forks_count}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {repo.homepage && (
                        <a
                          href={repo.homepage}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold transition-all shadow-sm"
                        >
                          <Globe className="w-3.5 h-3.5" />
                          <span>LAUNCH DEMO</span>
                        </a>
                      )}

                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-cyan-400 text-zinc-200 text-xs font-mono font-semibold transition-all group-hover:text-cyan-300"
                      >
                        <Github className="w-3.5 h-3.5 text-cyan-400" />
                        <span>SOURCE</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </a>
                    </div>
                  </div>
                </Card3D>
              );
            })}
          </div>
        )}
      </div>

      {/* ──────────────── Operator Security Dossier & Directives ──────────────── */}
      <div className="p-6 rounded-3xl dark-minimal-panel border border-cyan-500/20 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>VELQORE OPERATOR MANIFEST</span>
        </div>
        <h4 className="text-xl font-bold text-white font-display">Specialized Cyber & Engineering Directives</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs font-mono mb-2">
              <Lock className="w-4 h-4" />
              <span>OFFENSIVE SECURITY & C2</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Expert methodologies in SQLi, shellcode crafting, EDR evasion, and modular anti-forensics with homomorphic encryption.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs font-mono mb-2">
              <Brain className="w-4 h-4" />
              <span>AI COPILOTS & RESEARCH</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Autonomous AI research assistants, Chrome Copilot extensions powered by FastAPI, Supabase, and Claude models.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs font-mono mb-2">
              <Globe className="w-4 h-4" />
              <span>HIGH-PERFORMANCE WEB</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans">
              Engineered platforms including ClimateGuard, Kalam Conclave 2.0, and 3D glassmorphic interactive interfaces.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
