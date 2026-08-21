import React, { useState } from 'react';
import {
  Terminal,
  Copy,
  Check,
  X,
  Server,
  Database,
  ExternalLink,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  Radio,
  FileJson,
  Zap,
} from 'lucide-react';

interface ApiModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRepoName?: string;
}

type LangTab = 'curl' | 'js' | 'python' | 'url';

export function ApiModal({ isOpen, onClose, initialRepoName }: ApiModalProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<number>(0);
  const [selectedLang, setSelectedLang] = useState<LangTab>('curl');
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const domain = typeof window !== 'undefined' ? window.location.origin : 'https://velqore.github.io/CyberRepo';

  const endpoints = [
    {
      id: 'repos',
      name: 'Curated Repositories & Detail Cards',
      url: '/api/v1/repos.json',
      method: 'GET',
      badge: 'CORE REPOSITORIES',
      desc: 'Complete portfolio metadata including stars, categories, tags, descriptions, forks, and author details.',
      sampleFilter: initialRepoName || 'cyber-matrix-osint',
    },
    {
      id: 'categories',
      name: 'Ecosystem Categories & Taxonomy',
      url: '/api/v1/categories.json',
      method: 'GET',
      badge: 'TAXONOMY',
      desc: 'All security and engineering domain categories with icons, color schemes, and descriptions.',
      sampleFilter: 'penetration-testing',
    },
    {
      id: 'communities',
      name: 'Tech Communities & Ecosystems',
      url: '/api/v1/communities.json',
      method: 'GET',
      badge: 'COMMUNITIES',
      desc: 'Multi-discipline community metadata (Cybersecurity, Forensics, AI/ML, Web Fullstack, DevOps, Mobile & Systems).',
      sampleFilter: 'forensics',
    },
  ];

  const currentEp = endpoints[selectedEndpoint];
  const fullUrl = `${domain}${currentEp.url}`;

  const getCodeSnippet = (lang: LangTab) => {
    switch (lang) {
      case 'curl':
        return `# Fetch ${currentEp.name}
curl -X GET "${fullUrl}" \\
  -H "Accept: application/json"`;

      case 'js':
        return `// Fetch ${currentEp.name} in JavaScript/TypeScript
async function fetchCyberData() {
  const response = await fetch("${fullUrl}");
  if (!response.ok) throw new Error("API request failed");
  const { metadata, data } = await response.json();
  console.log("Total entries:", metadata.count);
  console.log("Payload:", data);
  return data;
}

fetchCyberData();`;

      case 'python':
        return `# Fetch ${currentEp.name} with Python
import requests

url = "${fullUrl}"
response = requests.get(url)
if response.status_code == 200:
    payload = response.json()
    print(f"Total count: {payload['metadata']['count']}")
    for item in payload['data'][:5]:
        print(item.get('name') or item.get('id'))
else:
    print("Failed to fetch:", response.status_code)`;

      case 'url':
        return fullUrl;
    }
  };

  const currentCode = getCodeSnippet(selectedLang);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/85 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />

      {/* Cyber API Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-3xl bg-[#090e1a] border border-cyan-500/40 shadow-[0_0_60px_rgba(34,211,238,0.25)] flex flex-col z-10 animate-modal-in">
        {/* Top Glow bar */}
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 animate-pulse" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/90 bg-zinc-950/60 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white font-display tracking-wide">
                  CyberRepo Developer REST API
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 animate-pulse">
                  v1.0 LIVE
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">
                Open telemetry & structured JSON access for developers & AI agents
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-mono font-bold text-zinc-300 hover:text-cyan-300 transition-all shadow-sm"
              title="Open Raw JSON Endpoint"
            >
              <FileJson className="w-3.5 h-3.5 text-cyan-400" />
              <span>RAW JSON</span>
              <ExternalLink className="w-3 h-3 text-zinc-500" />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors border border-transparent hover:border-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Cyber Status Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-zinc-900/60 to-purple-950/30 border border-cyan-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex-shrink-0 mt-0.5 sm:mt-0">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div className="text-xs">
                <div className="font-mono font-bold text-emerald-300 flex items-center gap-2">
                  <span>PUBLIC CORS-ENABLED ACCESS</span>
                  <span className="text-[10px] text-zinc-400">• NO API KEY REQUIRED</span>
                </div>
                <p className="text-zinc-400 mt-0.5">
                  Fetch real-time metadata, repositories, and curated detail cards directly in any frontend, backend, automation script, or LLM agent.
                </p>
              </div>
            </div>
          </div>

          {/* Endpoint Selection Tabs */}
          <div>
            <label className="block text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. SELECT API ENDPOINT</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {endpoints.map((ep, idx) => {
                const isSelected = selectedEndpoint === idx;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(idx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                      isSelected
                        ? 'bg-gradient-to-b from-cyan-500/20 to-blue-600/10 border-cyan-400 text-white shadow-[0_0_20px_rgba(34,211,238,0.2)]'
                        : 'bg-zinc-950/80 border-zinc-800/90 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
                    )}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                        {ep.badge}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">
                        {ep.method}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold font-sans text-zinc-100 mb-1 group-hover:text-cyan-300 transition-colors">
                      {ep.name}
                    </h4>
                    <p className="text-[11px] font-mono text-zinc-500 truncate">
                      {ep.url}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Code Console & Snippet Viewer */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. REQUEST CODE SNIPPETS</span>
              </label>

              {/* Language Tabs */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800">
                {[
                  { id: 'curl' as LangTab, label: 'cURL' },
                  { id: 'js' as LangTab, label: 'JavaScript' },
                  { id: 'python' as LangTab, label: 'Python' },
                  { id: 'url' as LangTab, label: 'Direct URL' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedLang(t.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-all ${
                      selectedLang === t.id
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Box */}
            <div className="relative rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-2xl overflow-hidden group">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-850 bg-zinc-900/60 font-mono text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-zinc-600">|</span>
                  <span className="text-[11px] text-cyan-400 font-bold">{currentEp.url}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-mono font-semibold text-zinc-200 hover:text-cyan-300 border border-zinc-700 transition-all shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">COPIED</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>COPY CODE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Code Contents */}
              <pre className="p-4 text-xs font-mono text-cyan-300/90 overflow-x-auto whitespace-pre leading-relaxed selection:bg-cyan-500/30 selection:text-white">
                <code>{currentCode}</code>
              </pre>
            </div>
          </div>

          {/* Quick Endpoint Info & Response Schema Preview */}
          <div className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 text-xs font-mono text-zinc-400 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-bold flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                ENDPOINT METADATA & SCHEMA
              </span>
              <span className="text-zinc-500">CONTENT-TYPE: application/json</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-normal">
              {currentEp.desc}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={fullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-bold text-xs font-mono transition-all"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>TRY REQUEST IN BROWSER</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
