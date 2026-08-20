<div align="center">

# ⚡ CyberRepo Hub (`CYBERREPO`)

### *The Multi-Ecosystem Developer Vault & Universal GitHub Intelligence Radar*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-cyan.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?logo=tailwindcss)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg?logo=docker)](Dockerfile)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Helm-326ce5.svg?logo=kubernetes)](helm/cyber-repos)

---

**[🌐 Live Demo](https://cyberrepos.vercel.app)** &nbsp;•&nbsp; **[👤 Creator Dashboard](https://github.com/Velqore)** &nbsp;•&nbsp; **[📄 Kubernetes Guide](KUBERNETES_DEPLOYMENT.md)**

</div>

---

## 🚀 Overview

**CyberRepo** is an ultra-modern, interactive 3D web platform engineered to discover, search, and analyze top-tier open-source repositories across multiple high-impact technical domains:

- 🤖 **AI & Autonomous Agents** (LLM Frameworks, RAG Engines, AI Agents, Neural Nets)
- 🛡️ **Cybersecurity & Offensive Systems** (Red Team, Pentesting, Malware Analysis, OSINT, Vulnerability Scanners)
- ⚡ **Full-Stack Web & API Architectures** (React, Next.js, FastAPI, Node.js, Microservices)
- ☁️ **DevOps, Cloud Native & Infrastructure** (Kubernetes, Helm, Terraform, CI/CD, Observability)
- ⚙️ **Systems, Kernel & Low-Level Engineering** (Rust, C/C++, WebAssembly, Embedded)

Powered by a dual-engine architecture: a curated ecosystem database backed by Supabase alongside a **Universal Live GitHub Radar** querying real-time worldwide repositories directly via the GitHub API.

---

## ✨ Key Features

- **🛸 Interactive 3D Holographic HUD & Code Core**: Features custom mouse-reactive 3D tilt controls, orbital rings, particle glow fields, and a 3D `< />` code emblem logo.
- **🌐 6 Multi-Ecosystem Tech Communities**: Switch seamlessly between Cybersecurity, AI/ML, Web, DevOps, and Systems filters.
- **📡 Universal GitHub Live Radar**: Perform real-time searches across 200M+ GitHub repositories with instant parameter filtering, topic tags, and star sort options.
- **👤 Creator Control Dashboard**: Dedicated profile showcase detailing author projects, offensive systems research, and developer telemetry (@Velqore).
- **💾 Saved Arsenal & Bookmark System**: Save and manage offline repository collections with instant localStorage persistence.
- **📊 Real-time Ecosystem Analytics**: Visual breakdown of repository distribution, star metrics, and language statistics.
- **🐳 Enterprise Production Ready**: Full Docker containerization (`Dockerfile` + `nginx.conf`), Kubernetes manifests (`/k8s`), and Helm chart configurations (`/helm`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | [React 18](https://react.dev/) + [TypeScript 5.5](https://www.typescriptlang.org/) |
| **Build Tooling** | [Vite 5](https://vitejs.dev/) |
| **Styling & 3D Optics** | [TailwindCSS 3.4](https://tailwindcss.com/) + Custom 3D CSS Preserves & Keyframes |
| **Iconography** | [Lucide React](https://lucide.dev/) |
| **Database & Auth** | [Supabase Database Engine](https://supabase.com/) |
| **Live Intelligence** | GitHub REST API (v3) with AbortController debounce |
| **Containerization** | Docker, Nginx Alpine, Kubernetes Kustomize, Helm v3 |

---

## 📦 Quick Start

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**

### 2. Installation

```bash
# Clone repository
git clone https://github.com/Velqore/CyberRepo.git
cd CyberRepo

# Install dependencies
npm install
```

### 3. Environment Setup (Optional)

Create a `.env` file in the root directory (refer to `.env.example`):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> *Note: If Supabase keys are omitted, CyberRepo seamlessly falls back to the rich offline curated repository dataset.*

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Deployment Options

### Docker Deployment

```bash
# Build Docker image
docker build -t cyberrepo:latest .

# Run container on port 80
docker run -d -p 80:80 --name cyberrepo cyberrepo:latest
```

### Kubernetes Deployment (Helm)

```bash
# Deploy using Helm
helm install cyber-repos ./helm/cyber-repos -n cyber-repos --create-namespace
```

Detailed Kubernetes & HPA scaling instructions can be found in [`KUBERNETES_DEPLOYMENT.md`](KUBERNETES_DEPLOYMENT.md).

---

## 📂 Project Structure

```
CyberRepo/
├── .github/              # CI/CD Workflows (K8s Deploy)
├── helm/                 # Helm Charts
├── k8s/                  # Kubernetes Manifests
├── src/
│   ├── components/       # 3D Cards, Logos, Creator Dashboard & Icons
│   │   ├── CyberRepoLogo.tsx  # 3D Holographic Code Emblem & Orbits
│   │   ├── CreatorDashboard.tsx
│   │   ├── Card3D.tsx
│   │   └── Icon3D.tsx
│   ├── lib/              # Supabase Client, GitHub API & Curated Datasets
│   ├── App.tsx           # Main Application Entry & State Control
│   ├── index.css         # 3D Perspective Utility Classes & Keyframes
│   └── main.tsx
├── Dockerfile            # Multi-stage Nginx Production Build
├── nginx.conf            # Optimized Nginx Gateway Configuration
├── vercel.json           # Vercel SPA Routing Configuration
└── README.md
```

---

## 👨‍💻 Author & Maintainer

Curated and built with ⚡ by **Velqore** (Ayush Tyagi).

- **GitHub**: [@Velqore](https://github.com/Velqore)
- **Role**: Code Ronin · Full Stack & Offensive Systems Architect

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — free for community use and open-source contribution.
