# ☕ SpringMaster: 14-Week Spring Boot to Microservices Study Tracker

> **A high-impact, gamified study platform designed to take you from core Java to job-ready distributed systems and microservices architect in 3 months (~14 weeks, ~30 hrs/week).**
> **Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS. 100% ready for Vercel deployment.**

---

## 🚀 Key Features

### 1. 🎯 Adaptive Quiz Arena After Every Topic
- **Automated Difficulty Progression**:
  - Starts at your preferred difficulty (`Easy` 🟢, `Medium` 🟡, `Hard` 🔴, `Architect` 🟣).
  - **Adaptive Auto-Scale Engine**: Answering 2 consecutive questions correctly automatically scales difficulty to the next tier!
  - **Manual Tier Switcher**: Override and jump between Easy, Medium, Hard, or Architect difficulty anytime.
- **Detailed Instant Feedback**:
  - Comprehensive explanation for the correct answer.
  - Granular breakdown explaining why incorrect choices fail.
  - Code snippets and architectural gotchas.

### 2. 🏆 Milestones & Rewards System
- **10 Major Milestones**:
  - Highlights **Week 6 / Phases 0–4 Gateway Milestone**: The critical threshold where you qualify to apply for **Junior Backend Roles**!
  - **12 Unlockable Badges** (Java Craftsman, Bean Master, ORM Whisperer, Security Sentinel, Kafka Wrangler, Distributed Sage, etc.).
  - **XP & Level Progression** (Level 1: Novice Java Developer $\rightarrow$ Level 10: Distributed Systems Architect) with confetti celebrations!

### 3. ⏱ 3-Month Schedule Pacing & Pomodoro Focus Timer
- **Pacing Metrics**:
  - Weekday target: **3 hours / day**
  - Weekend target: **6–7 hours / day**
  - Total: **~28–30 hours / week** (~390 total hours over 90 days)
- **Built-in 25-minute Pomodoro Timer** with 1-click session logging and XP rewards.
- **Dynamic 14-Week Calendar Table** showing deliverables and target dates calculated from your start date.

### 4. 📚 11 Full Phases & Topic Deep-Dives
- Covers the complete study guide:
  - **Phase 0**: Java, SQL, Git, HTTP Foundations
  - **Phase 1**: Spring Core, Boot, MVC, REST APIs
  - **Phase 2**: Data Access (JPA, Hibernate, N+1 fix, @Transactional)
  - **Phase 3**: Spring Security 6, JWT, BCrypt, RBAC
  - **Phase 4**: Testing (JUnit 5, Mockito, Testcontainers), AOP, CI/CD
  - **Phase 5**: Caching & Messaging (Redis & Kafka)
  - **Phase 6**: Microservices & Spring Cloud (Gateway, Eureka, Resilience4j, Zipkin)
  - **Phase 7**: Docker, Compose, Kubernetes (Minikube)
  - **Phase 8**: Distributed-Systems Patterns (SAGA, Outbox, Idempotency, Rate Limiting)
  - **Phase 9**: Reactive Programming (WebFlux, Reactor, R2DBC, SSE)
  - **Phase 10**: Spring AI, RAG, PGVector, Model Context Protocol (MCP)
- Direct **YouTube Search Links** for every topic and phase overview.
- **Fast-Track Focus** callouts to prioritize high-yield concepts if time-pressed.
- **Personal Notes** editor per topic, saved automatically to browser local storage.

### 5. 🛠 Capstone Project Architect
- Blueprint of the multi-phase **Payments & E-Commerce Platform** demonstrating how a monolith evolves into an enterprise microservices mesh across Phases 1 to 10.

### 6. 📋 Job-Readiness Checklist & Resume Builder
- Interactive checklist covering every essential interview competency.
- Pre-formulated, battle-tested **Resume Bullet Points** with 1-click copy to clipboard.

---

## 🌐 Deploying to Vercel

This project is built using standard Next.js App Router and runs statically without external server dependencies.

### Option A: Push to GitHub & Connect to Vercel
1. Initialize a git repository and commit:
   ```bash
   git add .
   git commit -m "feat: complete spring boot to microservices tracker"
   ```
2. Push to your GitHub / GitLab / Bitbucket repository.
3. Go to [Vercel](https://vercel.com/new).
4. Select your repository and click **Deploy**.
5. Vercel automatically detects Next.js and builds the project in seconds.

### Option B: Deploy via Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 💻 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Production build check**:
   ```bash
   npm run build
   ```

---

## 💾 Data Persistence & Backup
- All state (completed topics, quiz scores, XP, level, study logs, notes) is stored in the browser's `localStorage`.
- Use the **Export (JSON)** button in the top navigation bar to download a JSON backup file anytime, or the **Import** button to restore your progress across different devices.
