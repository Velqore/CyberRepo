# 🚀 Kubernetes Deployment Guide: CyberRepos Hub

This repository contains an enterprise-ready, production-hardened Kubernetes setup for **CyberRepos Hub**.

---

## 📁 Architecture Overview

```
project/
├── Dockerfile                  # Multi-stage optimized Node.js LTS -> Nginx Alpine
├── nginx.conf                  # Security headers, Gzip, SPA fallback & /healthz probe
├── .dockerignore               # Minimal build context
├── k8s/                        # Native Kubernetes Manifests (Kustomize ready)
│   ├── 00-namespace.yaml       # cyberrepos-system namespace
│   ├── 01-configmap.yaml       # Environment config
│   ├── 02-secret.yaml          # Supabase credentials
│   ├── 03-deployment.yaml      # 3 Replicas, Anti-Affinity, Probes, SecurityContext
│   ├── 04-service.yaml         # ClusterIP service
│   ├── 05-ingress.yaml         # Ingress with TLS & rate limiting
│   ├── 06-hpa.yaml             # HorizontalPodAutoscaler (2-10 pods)
│   ├── 07-pdb.yaml             # PodDisruptionBudget (Zero-downtime upgrades)
│   └── kustomization.yaml      # 1-command apply
├── helm/cyber-repos/           # Complete Helm 3 chart
│   ├── Chart.yaml
│   ├── values.yaml
│   └── templates/
└── .github/workflows/
    └── deploy-k8s.yml          # Automated CI/CD build & rollout
```

---

## 🛠️ Step 1: Build the Container Image

Build the Docker image locally or push to your registry (e.g., Docker Hub, GitHub Container Registry `ghcr.io`, AWS ECR, or GCP Artifact Registry):

```bash
# Build Docker image
docker build \
  --build-arg VITE_SUPABASE_URL="https://debpapifbkxxvatbhyqx.supabase.co" \
  --build-arg VITE_SUPABASE_ANON_KEY="your-anon-key-here" \
  -t cyberrepos:latest .

# (Optional) Tag and push to remote registry:
docker tag cyberrepos:latest ghcr.io/<your-username>/cyberrepos:latest
docker push ghcr.io/<your-username>/cyberrepos:latest
```

---

## 🚢 Step 2: Deploy to Kubernetes

### Option A: Using Kustomize (Simplest & Direct)

Deploy all manifests in order with a single command:

```bash
# Apply entire stack
kubectl apply -k k8s/

# Verify rollout status
kubectl rollout status deployment/cyberrepos-frontend -n cyberrepos-system
```

---

### Option B: Using Helm (Recommended for Teams & Multi-Env)

```bash
# Install or Upgrade with Helm
helm upgrade --install cyberrepos ./helm/cyber-repos \
  --namespace cyberrepos-system \
  --create-namespace \
  --set image.repository=ghcr.io/<your-username>/cyberrepos \
  --set image.tag=latest

# Check status
helm status cyberrepos -n cyberrepos-system
```

---

## 🔍 Step 3: Verification & Accessing the App

### 1. Check Pods, Service, and HPA
```bash
# View running pods across worker nodes
kubectl get pods -n cyberrepos-system -o wide

# View services & endpoints
kubectl get svc -n cyberrepos-system

# View Horizontal Pod Autoscaler status
kubectl get hpa -n cyberrepos-system
```

### 2. Port-Forward for Local Testing
```bash
kubectl port-forward svc/cyberrepos-service 8080:80 -n cyberrepos-system
```
Open your browser at **`http://localhost:8080`** to view your application!

---

## 🛡️ Production Features Included

| Feature | Implementation | Benefit |
|---|---|---|
| **High Availability** | 3 Replicas + Pod Anti-Affinity | Zero single point of failure |
| **Zero Downtime** | RollingUpdate (`maxSurge: 1`, `maxUnavailable: 0`) + `PodDisruptionBudget` | Seamless updates & node drains |
| **Autoscaling** | `HorizontalPodAutoscaler` (2 to 10 pods) | Scales dynamically on CPU (75%) & RAM (80%) |
| **Container Hardening** | `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, `drop: [ALL]` | Enterprise CIS security benchmark compliance |
| **Health Monitoring** | Liveness, Readiness, and Startup Probes on `/healthz` | Automatic crash recovery & traffic gating |
| **Web Performance** | Nginx Gzip + 1-Year Immutable Static Asset Caching | Lightning fast page loads |
| **SSL / Ingress** | Nginx Ingress + Cert-Manager (`letsencrypt-prod`) | Automated HTTPS certificates |
