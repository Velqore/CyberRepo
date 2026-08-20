<div align="center">

<!-- Animated Header Banner SVG -->
<svg viewBox="0 0 800 200" width="100%" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06080d" />
      <stop offset="50%" stop-color="#0b101d" />
      <stop offset="100%" stop-color="#06080d" />
    </linearGradient>

    <!-- Neon Text Gradient -->
    <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#22d3ee">
        <animate attributeName="stop-color" values="#22d3ee;#a855f7;#38bdf8;#22d3ee" dur="6s" repeatCount="indefinite" />
      </stop>
      <stop offset="50%" stop-color="#a855f7">
        <animate attributeName="stop-color" values="#a855f7;#38bdf8;#22d3ee;#a855f7" dur="6s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="#38bdf8">
        <animate attributeName="stop-color" values="#38bdf8;#22d3ee;#a855f7;#38bdf8" dur="6s" repeatCount="indefinite" />
      </stop>
    </linearGradient>

    <!-- Grid Pattern -->
    <pattern id="cyberGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(34, 211, 238, 0.07)" stroke-width="1" />
    </pattern>

    <!-- Glow Filter -->
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  </defs>

  <!-- Card Frame -->
  <rect width="800" height="200" rx="16" fill="url(#bgGrad)" stroke="rgba(34,211,238,0.3)" stroke-width="1.5" />
  <rect width="800" height="200" rx="16" fill="url(#cyberGrid)" />

  <!-- Animated Scan Line -->
  <line x1="0" y1="0" x2="800" y2="0" stroke="rgba(34, 211, 238, 0.5)" stroke-width="2">
    <animate attributeName="y1" values="0;200;0" dur="4s" repeatCount="indefinite" />
    <animate attributeName="y2" values="0;200;0" dur="4s" repeatCount="indefinite" />
    <animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" />
  </line>

  <!-- HUD Corner Accents -->
  <path d="M 12 28 L 12 12 L 28 12" fill="none" stroke="#22d3ee" stroke-width="2.5" />
  <path d="M 788 28 L 788 12 L 772 12" fill="none" stroke="#22d3ee" stroke-width="2.5" />
  <path d="M 12 172 L 12 188 L 28 188" fill="none" stroke="#a855f7" stroke-width="2.5" />
  <path d="M 788 172 L 788 188 L 772 188" fill="none" stroke="#a855f7" stroke-width="2.5" />

  <!-- Animated Logo Emblem in Banner -->
  <g transform="translate(110, 100)">
    <!-- Rotating Ring -->
    <circle r="36" fill="none" stroke="rgba(34, 211, 238, 0.4)" stroke-width="1.5" stroke-dasharray="8 6">
      <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="12s" repeatCount="indefinite" />
    </circle>
    <!-- Code Bracket Frame -->
    <rect x="-20" y="-20" width="40" height="40" rx="8" fill="#0f172a" stroke="url(#textGrad)" stroke-width="2" filter="url(#neonGlow)" />
    <text x="-12" y="6" font-family="monospace" font-weight="bold" font-size="16" fill="#22d3ee">&lt;/&gt;</text>
  </g>

  <!-- Title Text -->
  <text x="490" y="92" text-anchor="middle" font-family="'Orbitron', 'Space Grotesk', system-ui, sans-serif" font-weight="900" font-size="42" fill="url(#textGrad)" filter="url(#neonGlow)" letter-spacing="4">
    CYBERREPO
  </text>

  <!-- Subtitle Tagline -->
  <text x="490" y="126" text-anchor="middle" font-family="monospace" font-size="13" fill="#a1a1aa" letter-spacing="4">
    MULTI-ECOSYSTEM DEVELOPER VAULT &amp; RADAR
  </text>

  <!-- Status Telemetry Badge -->
  <rect x="360" y="145" width="260" height="24" rx="12" fill="rgba(34, 211, 238, 0.1)" stroke="rgba(34, 211, 238, 0.3)" stroke-width="1" />
  <circle cx="376" cy="157" r="4" fill="#10b981">
    <animate attributeName="opacity" values="1;0.2;1" dur="1.5s" repeatCount="indefinite" />
  </circle>
  <text x="495" y="161" text-anchor="middle" font-family="monospace" font-size="10" font-weight="bold" fill="#34d399" letter-spacing="2">
    SYSTEM_STATUS: ONLINE ✦ v2.0
  </text>
</svg>

<br/>

<!-- Animated Typing Banner -->
<a href="https://cyberrepos.vercel.app">
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&size=16&duration=2800&pause=1000&color=22D3EE&center=true&vCenter=true&width=650&height=40&lines=FIND+✦+FORK+✦+LEARN+✦+BUILD;Cybersecurity+%26+Red+Team+Arsenal;AI+%26+Autonomous+Agents+Vault;Full-Stack+Web+%26+DevOps+Radar" alt="Typing SVG" />
</a>

<br/>

<!-- Neon Badges -->
<p align="center">
  <a href="https://cyberrepos.vercel.app"><img src="https://img.shields.io/badge/LIVE_RADAR-ONLINE-06b6d4?style=for-the-badge&logo=radar&logoColor=white" alt="Live Radar"></a>
  <a href="https://github.com/Velqore/CyberRepo"><img src="https://img.shields.io/badge/BUILD-PASSING-10b981?style=for-the-badge&logo=githubactions&logoColor=white" alt="Build Status"></a>
  <a href="#-tech-stack"><img src="https://img.shields.io/badge/STACK-REACT_18_%7C_TS_5.5-8b5cf6?style=for-the-badge&logo=react&logoColor=white" alt="Tech Stack"></a>
  <a href="Dockerfile"><img src="https://img.shields.io/badge/CONTAINER-DOCKER_READY-0284c7?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Ready"></a>
  <a href="KUBERNETES_DEPLOYMENT.md"><img src="https://img.shields.io/badge/K8S-HELM_CHART-326ce5?style=for-the-badge&logo=kubernetes&logoColor=white" alt="Kubernetes Ready"></a>
</p>

<!-- Cyber Control Panel Navigation Buttons -->
<p align="center">
  <a href="https://cyberrepos.vercel.app">
    <img src="https://img.shields.io/badge/🌐_LAUNCH_LIVE_HUB-0f172a?style=for-the-badge&logo=vercel&logoColor=22d3ee&labelColor=06080d" alt="Launch Live Hub" />
  </a>
  &nbsp;
  <a href="https://github.com/Velqore">
    <img src="https://img.shields.io/badge/👤_CREATOR_DASHBOARD-0f172a?style=for-the-badge&logo=github&logoColor=a78bfa&labelColor=06080d" alt="Creator Profile" />
  </a>
  &nbsp;
  <a href="KUBERNETES_DEPLOYMENT.md">
    <img src="https://img.shields.io/badge/📑_K8S_DEPLOY_GUIDE-0f172a?style=for-the-badge&logo=kubernetes&logoColor=34d399&labelColor=06080d" alt="Deployment Guide" />
  </a>
</p>

</div>

---

## ─── ⚡ CYBER TELEMETRY DASHBOARD ───

```ascii
┌─────────────────────────────────────────────────────────────────────────────┐
│  [✦] CORE ENGINE  : DUAL-RADAR (CURATED VAULT + LIVE GITHUB REST v3)        │
│  [✦] ECOSYSTEMS   : AI/ML ✦ CYBERSECURITY ✦ WEB ✦ DEVOPS ✦ SYSTEMS          │
│  [✦] 3D OPTICS    : MOUSE-TILT HUD ✦ 3D CODE EMBLEM ✦ PARALLAX CANVAS       │
│  [✦] AUTHOR       : VELQORE (AYUSH TYAGI) — CODE RONIN & SYSTEMS ARCHITECT  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 System Overview

**CyberRepo** is a high-performance, 3D web platform built to aggregate, search, and monitor top open-source security tools, AI frameworks, web technologies, and systems repos in real-time.

```
                  ┌─────────────────────────────────────┐
                  │       CYBERREPO HUD ENGINE          │
                  └──────────────────┬──────────────────┘
                                     │
             ┌───────────────────────┴───────────────────────┐
             ▼                                               ▼
  ┌───────────────────────┐                       ┌───────────────────────┐
  │   CURATED DATABASE    │                       │  UNIVERSAL LIVE RADAR │
  │  (Supabase + Cache)   │                       │ (GitHub API Realtime) │
  └───────────────────────┘                       └───────────────────────┘
```

---

## ✨ Core Modules & Features

<details open>
<summary><b>🤖 1. Multi-Ecosystem Tech Vaults (Click to expand)</b></summary>
<br/>

Discover specialized repositories organized into 6 distinct tech domains:

- **🛡️ Cybersecurity & Red Team**: Exploitation frameworks, reverse engineering, malware analysis, OSINT, wireless tools, C2 infrastructure.
- **🤖 AI & Autonomous Agents**: Large Language Models, RAG frameworks, autonomous multi-agent networks, prompt engineering suites.
- **⚡ Full-Stack Web & APIs**: React, Next.js, FastAPI, Node.js, GraphQL, high-throughput microservices.
- **☁️ DevOps & Cloud Native**: Kubernetes operators, Helm charts, Terraform blueprints, CI/CD runners, Prometheus/Grafana stacks.
- **⚙️ Systems & Low-Level**: Rust memory-safe engines, C/C++ kernel modules, WebAssembly runtimes, Linux eBPF telemetry.

</details>

<details>
<summary><b>📡 2. Universal Live GitHub Radar (Click to expand)</b></summary>
<br/>

- Real-time global GitHub search querying 200M+ repositories.
- Instant topic tagging, language filters, and star sorting algorithms.
- Smart `AbortController` debouncing for lag-free typing interaction.

</details>

<details>
<summary><b>🛸 3. Interactive 3D Optics & Holographic HUD (Click to expand)</b></summary>
<br/>

- **Mouse-Reactive 3D Tilt**: Parallax response tilting up to ±18° based on cursor coordinates.
- **Orbital Ring Mechanics**: Dual nested orbital rings spinning in counter-rotation.
- **3D `< />` Code Emblem**: High-contrast cyan & purple 3D microchip code bracket mark.
- **Particle Dynamics**: 24 animated orbital particle sparkles breathing around the core.

</details>

<details>
<summary><b>👤 4. Creator Control Dashboard (Click to expand)</b></summary>
<br/>

- Integrated dashboard showcasing offensive systems research, developer telemetry, and key repositories by author **@Velqore**.

</details>

---

## 🛠️ Tech Stack & Architecture

```
  FRONTEND   : React 18 ✦ TypeScript 5.5 ✦ Vite 5
  STYLING    : TailwindCSS 3.4 ✦ Custom 3D CSS Preserves & Keyframes
  ICONOGRAPHY: Lucide React Icons
  DATA ENGINE: Supabase Cloud Database ✦ GitHub REST API v3
  CONTAINER  : Docker ✦ Nginx Alpine ✦ Kubernetes ✦ Helm v3
```

---

## 📦 Quick Start Guide

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/Velqore/CyberRepo.git
cd CyberRepo

# Install dependencies
npm install
```

### 2. Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Docker & Kubernetes Deployments

### Docker Quickstart

```bash
# Build production container image
docker build -t cyberrepo:latest .

# Run container on port 80
docker run -d -p 80:80 --name cyberrepo cyberrepo:latest
```

### Kubernetes (Helm Chart)

```bash
# Deploy with Helm
helm install cyber-repos ./helm/cyber-repos -n cyber-repos --create-namespace
```

> *For complete Kubernetes HPA, Ingress, and TLS configuration, see [`KUBERNETES_DEPLOYMENT.md`](KUBERNETES_DEPLOYMENT.md).*

---

## 📂 Project Architecture Map

```
CyberRepo/
├── 📁 .github/              # Automated CI/CD Workflows (Kubernetes Deploy)
├── 📁 helm/                 # Production Helm Charts
├── 📁 k8s/                  # Kubernetes Kustomize Manifests
├── 📁 src/
│   ├── 📁 components/       # 3D Cards, Logos, Creator Dashboard & Icons
│   │   ├── ⚡ CyberRepoLogo.tsx  # 3D Holographic Code Emblem & Orbits
│   │   ├── 👤 CreatorDashboard.tsx
│   │   ├── 🎴 Card3D.tsx
│   │   └── 🎨 Icon3D.tsx
│   ├── 📁 lib/              # Supabase Client, GitHub API & Curated Datasets
│   ├── 📄 App.tsx           # Main Application Entry & State Control
│   ├── 🎨 index.css         # 3D Perspective Utilities & Keyframe Animations
│   └── 📄 main.tsx
├── 🐳 Dockerfile            # Multi-stage Nginx Production Container
├── ⚙️ nginx.conf            # Optimized Gateway Configuration
├── ⚡ vercel.json           # Vercel SPA Routing Rules
└── 📄 README.md
```

---

## 👨‍💻 Author & Maintainer

<div align="center">

| Author | Profile | Role |
|---|---|---|
| **Velqore** (Ayush Tyagi) | [@Velqore](https://github.com/Velqore) | Full Stack & Offensive Systems Architect |

<br/>

Designed & Built with ⚡ by [**Velqore**](https://github.com/Velqore)

</div>

---

<div align="center">

### 📜 License

Distributed under the **MIT License**. See `LICENSE` for more details.

**[⬆ Back to Top](#-cyberrepo-hub-cyberrepo)**

</div>
