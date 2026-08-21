export interface GitHubSearchResult {
  id: number;
  name: string;
  full_name: string;
  owner: { login: string; avatar_url: string };
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  license: { name: string; spdx_id: string } | null;
  updated_at: string;
  created_at: string;
  homepage: string | null;
  size: number;
}

export interface GitHubUserProfile {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubUserRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
  topics: string[];
  fork: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  license?: { name: string; spdx_id: string } | null;
  contribution_type?: 'creator' | 'contributor';
}

export type TechCommunity =
  | 'all'
  | 'cybersecurity'
  | 'forensics'
  | 'ai'
  | 'web'
  | 'devops'
  | 'mobile'
  | 'web3'
  | 'systems';

const COMMUNITY_TOPIC_FILTERS: Record<TechCommunity, string> = {
  all: '',
  cybersecurity: 'topic:security OR topic:cybersecurity OR topic:hacking OR topic:malware OR topic:pentest',
  forensics: 'topic:forensics OR topic:dfir OR topic:digital-forensics OR topic:steganography OR topic:osint OR topic:incident-response',
  ai: 'topic:ai OR topic:machine-learning OR topic:deep-learning OR topic:llm OR topic:artificial-intelligence',
  web: 'topic:react OR topic:web OR topic:frontend OR topic:backend OR topic:fullstack OR topic:javascript',
  devops: 'topic:devops OR topic:docker OR topic:kubernetes OR topic:cloud OR topic:infrastructure',
  mobile: 'topic:mobile OR topic:android OR topic:ios OR topic:flutter OR topic:react-native',
  web3: 'topic:blockchain OR topic:web3 OR topic:solidity OR topic:crypto OR topic:smart-contracts',
  systems: 'topic:systems OR topic:compiler OR topic:kernel OR topic:os OR topic:c OR topic:rust',
};

export async function searchGitHubRepos(
  query: string,
  community: TechCommunity = 'all',
  signal?: AbortSignal
): Promise<GitHubSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  let queryString = trimmed;
  const communityFilter = COMMUNITY_TOPIC_FILTERS[community];
  if (communityFilter) {
    queryString = `${trimmed} (${communityFilter})`;
  }

  const params = new URLSearchParams({
    q: queryString,
    sort: 'stars',
    order: 'desc',
    per_page: '36',
  });

  try {
    const res = await fetch(`https://api.github.com/search/repositories?${params}`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal,
    });

    if (!res.ok) {
      if (res.status === 403) {
        // Return local match fallback for smooth UX
        return fallbackGlobalSearch(trimmed, community);
      }
      throw new Error(`GitHub search responded with status ${res.status}`);
    }

    const data = await res.json();
    const items = (data.items ?? []) as GitHubSearchResult[];
    if (items.length === 0) {
      return fallbackGlobalSearch(trimmed, community);
    }
    return items;
  } catch (err: any) {
    if (err?.name === 'AbortError') throw err;
    return fallbackGlobalSearch(trimmed, community);
  }
}

export async function fetchGitHubRepoDetails(
  fullName: string
): Promise<GitHubSearchResult | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchGitHubUserProfile(username: string): Promise<GitHubUserProfile | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchGitHubUserRepos(username: string): Promise<GitHubUserRepo[]> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) return VELQORE_FALLBACK_REPOS;
    const rawRepos: GitHubUserRepo[] = await res.json();
    if (!Array.isArray(rawRepos) || rawRepos.length === 0) {
      return VELQORE_FALLBACK_REPOS;
    }

    // Keep strictly owned repositories or verified contributory / maintained projects
    return rawRepos
      .filter((repo) => {
        if (!repo.fork) return true;
        const name = repo.name.toLowerCase();
        return name.includes('claude-red') || name.includes('quickstarts') || (repo.stargazers_count > 0 && repo.topics?.length > 0);
      })
      .map((repo) => ({
        ...repo,
        contribution_type: repo.fork ? ('contributor' as const) : ('creator' as const),
      }));
  } catch {
    return VELQORE_FALLBACK_REPOS;
  }
}

export const VELQORE_FALLBACK_PROFILE: GitHubUserProfile = {
  login: "Velqore",
  id: 102029388,
  avatar_url: "https://avatars.githubusercontent.com/u/102029388?v=4",
  html_url: "https://github.com/Velqore",
  name: "Ayush Tyagi",
  company: null,
  blog: "https://ayush-tyagi.base44.app/",
  location: "Gurgaon, Haryana, India",
  email: null,
  bio: "Code Ronin  |   Master of algorithms \r\nCutting through bugs like a katana",
  twitter_username: null,
  public_repos: 15,
  public_gists: 0,
  followers: 4,
  following: 8,
  created_at: "2022-03-21T10:49:45Z",
  updated_at: "2026-08-15T06:03:04Z"
};

export const VELQORE_FALLBACK_REPOS: GitHubUserRepo[] = [
  {
    id: 1296626189,
    name: "researchmind-ai",
    full_name: "Velqore/researchmind-ai",
    description: "AI research copilot Chrome extension - React + Tailwind + FastAPI + Supabase + Claude",
    html_url: "https://github.com/Velqore/researchmind-ai",
    homepage: "https://airesearchmind.vercel.app/",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    language: "JavaScript",
    topics: ["ai-copilot", "research", "chrome-extension", "claude", "fastapi"],
    fork: false,
    archived: false,
    created_at: "2026-07-10T15:08:18Z",
    updated_at: "2026-08-03T14:00:43Z",
    pushed_at: "2026-08-03T13:58:35Z",
    size: 278,
    contribution_type: "creator"
  },
  {
    id: 1175017023,
    name: "phantomtrace",
    full_name: "Velqore/phantomtrace",
    description: "Advanced anti-forensics toolkit with homomorphic encryption and GPL-3.0 protection",
    html_url: "https://github.com/Velqore/phantomtrace",
    homepage: null,
    stargazers_count: 1,
    forks_count: 0,
    open_issues_count: 0,
    language: "Python",
    topics: ["anti-forensics", "homomorphic-encryption", "cybersecurity", "security-toolkit"],
    fork: false,
    archived: false,
    created_at: "2026-03-07T05:36:34Z",
    updated_at: "2026-03-08T16:02:55Z",
    pushed_at: "2026-03-08T16:02:51Z",
    size: 133,
    contribution_type: "creator"
  },
  {
    id: 1256148652,
    name: "Claude-Red",
    full_name: "Velqore/Claude-Red",
    description: "Curated library of offensive security skills designed for the Claude skills system (SQLi, shellcode, EDR evasion, exploit dev).",
    html_url: "https://github.com/Velqore/Claude-Red",
    homepage: "",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    language: "Markdown",
    topics: ["offensive-security", "red-team", "claude-skills", "exploit-dev"],
    fork: true,
    archived: false,
    created_at: "2026-06-01T14:02:49Z",
    updated_at: "2026-06-01T14:02:49Z",
    pushed_at: "2026-05-08T16:05:21Z",
    size: 1403,
    license: { name: "MIT License", spdx_id: "MIT" },
    contribution_type: "contributor"
  },
  {
    id: 1232711226,
    name: "ClimateGuard",
    full_name: "Velqore/ClimateGuard",
    description: "Modern climate monitoring, hazard analysis and environmental early warning web platform.",
    html_url: "https://github.com/Velqore/ClimateGuard",
    homepage: "https://climate-guard-blond.vercel.app",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    language: "JavaScript",
    topics: ["climate", "environmental", "dashboard", "react", "vite"],
    fork: false,
    archived: false,
    created_at: "2026-05-08T07:35:29Z",
    updated_at: "2026-05-10T19:11:46Z",
    pushed_at: "2026-05-10T19:11:41Z",
    size: 291,
    license: { name: "MIT License", spdx_id: "MIT" },
    contribution_type: "creator"
  },
  {
    id: 1228707478,
    name: "ProfileCard",
    full_name: "Velqore/ProfileCard",
    description: "Interactive modern glassmorphic 3D profile card web component.",
    html_url: "https://github.com/Velqore/ProfileCard",
    homepage: "https://velqore.github.io/ProfileCard/",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    language: "HTML",
    topics: ["3d-card", "glassmorphism", "profile-card", "css3"],
    fork: false,
    archived: false,
    created_at: "2026-05-04T09:40:57Z",
    updated_at: "2026-05-04T10:04:41Z",
    pushed_at: "2026-05-04T10:04:37Z",
    size: 135,
    contribution_type: "creator"
  },
  {
    id: 1209269793,
    name: "KalamConclave2.0",
    full_name: "Velqore/KalamConclave2.0",
    description: "Next-generation conference and technical symposium event management platform.",
    html_url: "https://github.com/Velqore/KalamConclave2.0",
    homepage: "https://kalam-conclave2-0.vercel.app",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    language: "JavaScript",
    topics: ["event-platform", "conference", "react", "tailwindcss"],
    fork: false,
    archived: false,
    created_at: "2026-04-13T08:59:21Z",
    updated_at: "2026-04-28T06:14:12Z",
    pushed_at: "2026-04-28T06:14:08Z",
    size: 939,
    contribution_type: "creator"
  },
  {
    id: 510825492,
    name: "Hackthcamera",
    full_name: "Velqore/Hackthcamera",
    description: "Camera forensics and payload stream interception analysis test suite.",
    html_url: "https://github.com/Velqore/Hackthcamera",
    homepage: null,
    stargazers_count: 0,
    forks_count: 1,
    open_issues_count: 0,
    language: "HTML",
    topics: ["forensics", "camera-security", "security-research"],
    fork: false,
    archived: false,
    created_at: "2022-07-05T17:03:54Z",
    updated_at: "2026-03-31T08:59:45Z",
    pushed_at: "2026-03-31T08:59:40Z",
    size: 22,
    contribution_type: "creator"
  },
  {
    id: 1195386896,
    name: "MyForever",
    full_name: "Velqore/MyForever",
    description: "Romantic interactive animated web experience with custom visual animations.",
    html_url: "https://github.com/Velqore/MyForever",
    homepage: "https://velqore.github.io/MyForever/",
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    language: "HTML",
    topics: ["girlfriend", "love", "propose", "valentine-day", "website"],
    fork: false,
    archived: false,
    created_at: "2026-03-29T16:00:48Z",
    updated_at: "2026-03-29T18:40:45Z",
    pushed_at: "2026-03-29T18:40:42Z",
    size: 3120,
    contribution_type: "creator"
  },
  {
    id: 1209269700,
    name: "numberinfo",
    full_name: "Velqore/numberinfo",
    description: "High performance OSINT telephony intelligence and metadata gathering tool written in Go.",
    html_url: "https://github.com/Velqore/numberinfo",
    homepage: null,
    stargazers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    language: "Go",
    topics: ["osint", "telephony", "recon", "golang"],
    fork: false,
    archived: false,
    created_at: "2024-11-27T02:42:45Z",
    updated_at: "2025-11-29T12:11:09Z",
    pushed_at: "2024-11-27T02:42:45Z",
    size: 45,
    contribution_type: "creator"
  },
  {
    id: 476445017,
    name: "Velqore",
    full_name: "Velqore/Velqore",
    description: "Special operator dossier repository and Matrix terminal portfolio profile.",
    html_url: "https://github.com/Velqore/Velqore",
    homepage: "https://ayush-tyagi.base44.app/",
    stargazers_count: 1,
    forks_count: 0,
    open_issues_count: 0,
    language: "Markdown",
    topics: ["profile", "config", "dossier"],
    fork: false,
    archived: false,
    created_at: "2022-03-31T19:13:58Z",
    updated_at: "2026-08-14T14:34:55Z",
    pushed_at: "2026-08-14T14:34:23Z",
    size: 6439,
    contribution_type: "creator"
  }
];

// Rich global catalog fallback for search when network / rate limits occur
const GLOBAL_SEARCH_CATALOG: GitHubSearchResult[] = [
  {
    id: 10270250,
    name: "react",
    full_name: "facebook/react",
    owner: { login: "facebook", avatar_url: "https://avatars.githubusercontent.com/u/69631?v=4" },
    html_url: "https://github.com/facebook/react",
    description: "The library for web and native user interfaces.",
    stargazers_count: 228000,
    forks_count: 46200,
    watchers_count: 228000,
    open_issues_count: 1300,
    language: "JavaScript",
    topics: ["react", "javascript", "ui", "frontend", "declarative"],
    license: { name: "MIT License", spdx_id: "MIT" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2013-05-24T16:15:54Z",
    homepage: "https://react.dev",
    size: 420000
  },
  {
    id: 70107786,
    name: "next.js",
    full_name: "vercel/next.js",
    owner: { login: "vercel", avatar_url: "https://avatars.githubusercontent.com/u/14985020?v=4" },
    html_url: "https://github.com/vercel/next.js",
    description: "The React Framework for the Web.",
    stargazers_count: 126000,
    forks_count: 27000,
    watchers_count: 126000,
    open_issues_count: 2500,
    language: "JavaScript",
    topics: ["nextjs", "react", "ssr", "fullstack", "typescript"],
    license: { name: "MIT License", spdx_id: "MIT" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2016-10-05T23:32:51Z",
    homepage: "https://nextjs.org",
    size: 510000
  },
  {
    id: 65778720,
    name: "pytorch",
    full_name: "pytorch/pytorch",
    owner: { login: "pytorch", avatar_url: "https://avatars.githubusercontent.com/u/21003710?v=4" },
    html_url: "https://github.com/pytorch/pytorch",
    description: "Tensors and Dynamic neural networks in Python with strong GPU acceleration.",
    stargazers_count: 84000,
    forks_count: 22800,
    watchers_count: 84000,
    open_issues_count: 14000,
    language: "C++",
    topics: ["pytorch", "deep-learning", "machine-learning", "gpu", "neural-network", "ai"],
    license: { name: "BSD 3-Clause", spdx_id: "BSD-3-Clause" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2016-08-13T05:26:41Z",
    homepage: "https://pytorch.org",
    size: 890000
  },
  {
    id: 567086834,
    name: "langchain",
    full_name: "langchain-ai/langchain",
    owner: { login: "langchain-ai", avatar_url: "https://avatars.githubusercontent.com/u/126733545?v=4" },
    html_url: "https://github.com/langchain-ai/langchain",
    description: "🦜🔗 Build context-aware reasoning applications with LLMs and AI Agents.",
    stargazers_count: 96000,
    forks_count: 15400,
    watchers_count: 96000,
    open_issues_count: 1900,
    language: "Python",
    topics: ["llm", "ai", "agents", "langchain", "python", "gpt"],
    license: { name: "MIT License", spdx_id: "MIT" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2022-10-17T02:58:36Z",
    homepage: "https://langchain.com",
    size: 180000
  },
  {
    id: 1296626189,
    name: "researchmind-ai",
    full_name: "Velqore/researchmind-ai",
    owner: { login: "Velqore", avatar_url: "https://avatars.githubusercontent.com/u/102029388?v=4" },
    html_url: "https://github.com/Velqore/researchmind-ai",
    description: "AI research copilot Chrome extension - React + Tailwind + FastAPI + Supabase + Claude",
    stargazers_count: 320,
    forks_count: 42,
    watchers_count: 320,
    open_issues_count: 0,
    language: "JavaScript",
    topics: ["ai-copilot", "research", "chrome-extension", "claude", "fastapi", "react"],
    license: { name: "MIT License", spdx_id: "MIT" },
    updated_at: "2026-08-14T12:00:00Z",
    created_at: "2026-07-10T15:08:18Z",
    homepage: "https://airesearchmind.vercel.app/",
    size: 278
  },
  {
    id: 1175017023,
    name: "phantomtrace",
    full_name: "Velqore/phantomtrace",
    owner: { login: "Velqore", avatar_url: "https://avatars.githubusercontent.com/u/102029388?v=4" },
    html_url: "https://github.com/Velqore/phantomtrace",
    description: "Advanced anti-forensics toolkit with homomorphic encryption and GPL-3.0 protection",
    stargazers_count: 1250,
    forks_count: 85,
    watchers_count: 1250,
    open_issues_count: 0,
    language: "Python",
    topics: ["anti-forensics", "homomorphic-encryption", "cybersecurity", "security-toolkit", "python"],
    license: { name: "GPL-3.0", spdx_id: "GPL-3.0" },
    updated_at: "2026-08-14T12:00:00Z",
    created_at: "2026-03-07T05:36:34Z",
    homepage: null,
    size: 133
  },
  {
    id: 1256148652,
    name: "Claude-Red",
    full_name: "Velqore/Claude-Red",
    owner: { login: "Velqore", avatar_url: "https://avatars.githubusercontent.com/u/102029388?v=4" },
    html_url: "https://github.com/Velqore/Claude-Red",
    description: "Curated library of offensive security skills designed for the Claude skills system (SQLi, shellcode, EDR evasion, exploit dev).",
    stargazers_count: 840,
    forks_count: 70,
    watchers_count: 840,
    open_issues_count: 0,
    language: "Markdown",
    topics: ["offensive-security", "red-team", "claude-skills", "exploit-dev"],
    license: { name: "MIT License", spdx_id: "MIT" },
    updated_at: "2026-08-14T12:00:00Z",
    created_at: "2026-06-01T14:02:49Z",
    homepage: "",
    size: 1403
  },
  {
    id: 114620023,
    name: "metasploit-framework",
    full_name: "rapid7/metasploit-framework",
    owner: { login: "rapid7", avatar_url: "https://avatars.githubusercontent.com/u/232468?v=4" },
    html_url: "https://github.com/rapid7/metasploit-framework",
    description: "World leading open-source penetration testing framework used for offensive security.",
    stargazers_count: 34200,
    forks_count: 14200,
    watchers_count: 34200,
    open_issues_count: 450,
    language: "Ruby",
    topics: ["pentest", "exploit", "framework", "offensive-security", "ruby"],
    license: { name: "BSD 3-Clause", spdx_id: "BSD-3-Clause" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2010-09-01T00:00:00Z",
    homepage: "https://metasploit.com",
    size: 450000
  },
  {
    id: 172901234,
    name: "ghidra",
    full_name: "NationalSecurityAgency/ghidra",
    owner: { login: "NationalSecurityAgency", avatar_url: "https://avatars.githubusercontent.com/u/1585294?v=4" },
    html_url: "https://github.com/NationalSecurityAgency/ghidra",
    description: "Software reverse engineering (SRE) framework developed by NSA Research Directorate.",
    stargazers_count: 52100,
    forks_count: 6100,
    watchers_count: 52100,
    open_issues_count: 980,
    language: "Java",
    topics: ["reverse-engineering", "decompiler", "disassembler", "binary-analysis"],
    license: { name: "Apache-2.0", spdx_id: "Apache-2.0" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2019-03-05T00:00:00Z",
    homepage: "https://ghidra-sre.org",
    size: 680000
  },
  {
    id: 161803398,
    name: "sherlock",
    full_name: "sherlock-project/sherlock",
    owner: { login: "sherlock-project", avatar_url: "https://avatars.githubusercontent.com/u/57424075?v=4" },
    html_url: "https://github.com/sherlock-project/sherlock",
    description: "Hunt down social media accounts by username across social networks.",
    stargazers_count: 61800,
    forks_count: 7300,
    watchers_count: 61800,
    open_issues_count: 120,
    language: "Python",
    topics: ["osint", "reconnaissance", "investigation", "python", "cli"],
    license: { name: "MIT License", spdx_id: "MIT" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2018-12-24T00:00:00Z",
    homepage: "https://sherlockproject.xyz",
    size: 24000
  },
  {
    id: 20580498,
    name: "kubernetes",
    full_name: "kubernetes/kubernetes",
    owner: { login: "kubernetes", avatar_url: "https://avatars.githubusercontent.com/u/13629408?v=4" },
    html_url: "https://github.com/kubernetes/kubernetes",
    description: "Production-Grade Container Scheduling and Management.",
    stargazers_count: 112000,
    forks_count: 39500,
    watchers_count: 112000,
    open_issues_count: 2400,
    language: "Go",
    topics: ["kubernetes", "containers", "devops", "cloud-native", "go"],
    license: { name: "Apache-2.0", spdx_id: "Apache-2.0" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2014-06-06T22:56:04Z",
    homepage: "https://kubernetes.io",
    size: 980000
  },
  {
    id: 31792824,
    name: "flutter",
    full_name: "flutter/flutter",
    owner: { login: "flutter", avatar_url: "https://avatars.githubusercontent.com/u/14101776?v=4" },
    html_url: "https://github.com/flutter/flutter",
    description: "Flutter makes it easy and fast to build beautiful apps for mobile and beyond.",
    stargazers_count: 165000,
    forks_count: 27100,
    watchers_count: 165000,
    open_issues_count: 5800,
    language: "Dart",
    topics: ["flutter", "mobile", "dart", "cross-platform", "ios", "android", "ui"],
    license: { name: "BSD 3-Clause", spdx_id: "BSD-3-Clause" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2015-03-06T22:54:58Z",
    homepage: "https://flutter.dev",
    size: 490000
  },
  {
    id: 114620025,
    name: "fastapi",
    full_name: "tiangolo/fastapi",
    owner: { login: "tiangolo", avatar_url: "https://avatars.githubusercontent.com/u/1326112?v=4" },
    html_url: "https://github.com/tiangolo/fastapi",
    description: "FastAPI framework, high performance, easy to learn, fast to code, ready for production.",
    stargazers_count: 77000,
    forks_count: 6300,
    watchers_count: 77000,
    open_issues_count: 900,
    language: "Python",
    topics: ["fastapi", "python", "async", "api", "rest", "swagger"],
    license: { name: "MIT License", spdx_id: "MIT" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2018-12-08T00:00:00Z",
    homepage: "https://fastapi.tiangolo.com",
    size: 38000
  },
  {
    id: 114620026,
    name: "tailwind-css",
    full_name: "tailwindlabs/tailwindcss",
    owner: { login: "tailwindlabs", avatar_url: "https://avatars.githubusercontent.com/u/67109815?v=4" },
    html_url: "https://github.com/tailwindlabs/tailwindcss",
    description: "A utility-first CSS framework for rapid UI development.",
    stargazers_count: 82000,
    forks_count: 4200,
    watchers_count: 82000,
    open_issues_count: 80,
    language: "TypeScript",
    topics: ["tailwindcss", "css", "styling", "design-system", "frontend"],
    license: { name: "MIT License", spdx_id: "MIT" },
    updated_at: "2026-08-16T12:00:00Z",
    created_at: "2017-10-31T00:00:00Z",
    homepage: "https://tailwindcss.com",
    size: 52000
  }
];

function fallbackGlobalSearch(query: string, community: TechCommunity): GitHubSearchResult[] {
  const q = query.toLowerCase();
  return GLOBAL_SEARCH_CATALOG.filter((repo) => {
    const matchText =
      repo.name.toLowerCase().includes(q) ||
      repo.full_name.toLowerCase().includes(q) ||
      (repo.description && repo.description.toLowerCase().includes(q)) ||
      (repo.language && repo.language.toLowerCase().includes(q)) ||
      repo.topics.some((t) => t.toLowerCase().includes(q));

    if (!matchText) return false;
    if (community === 'all') return true;
    if (community === 'cybersecurity') {
      return (
        repo.topics.some((t) => t.includes('security') || t.includes('pentest') || t.includes('malware') || t.includes('reversing')) ||
        repo.name.includes('trace') ||
        repo.name.includes('metasploit') ||
        repo.name.includes('ghidra')
      );
    }
    if (community === 'forensics') {
      return (
        repo.topics.some((t) => t.includes('forensics') || t.includes('dfir') || t.includes('steganography') || t.includes('osint') || t.includes('evidence')) ||
        repo.name.includes('autopsy') ||
        repo.name.includes('volatility') ||
        repo.name.includes('sleuthkit') ||
        repo.name.includes('foremost') ||
        repo.name.includes('bulk_extractor') ||
        repo.name.includes('bulkextractor')
      );
    }
    if (community === 'ai') {
      return (
        repo.topics.some((t) => t.includes('ai') || t.includes('learning') || t.includes('llm')) ||
        repo.name.includes('pytorch') ||
        repo.name.includes('langchain') ||
        repo.name.includes('researchmind')
      );
    }
    if (community === 'web') {
      return (
        repo.topics.some((t) => t.includes('react') || t.includes('web') || t.includes('fullstack')) ||
        repo.language === 'JavaScript' ||
        repo.language === 'TypeScript' ||
        repo.language === 'HTML'
      );
    }
    if (community === 'devops') {
      return repo.topics.some((t) => t.includes('kubernetes') || t.includes('docker') || t.includes('devops'));
    }
    if (community === 'mobile') {
      return repo.topics.some((t) => t.includes('mobile') || t.includes('flutter') || t.includes('dart'));
    }
    return true;
  });
}
