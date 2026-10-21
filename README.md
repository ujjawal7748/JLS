# ☕ SpringRoadmap • 90-Day Spring Boot to Microservices Tracker

> **A personal study tracker and structured learning workspace to prepare for backend software engineer roles in 3 months (~14 weeks, ~28–30 hours/week).**
> **Built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS. Deploys cleanly to Vercel with zero server setup.**

---

## 🧭 Navigation & Layout

- **Collapsible Sidebar**: Compact left navigation bar with 1-click collapse/expand toggle, active route highlighting, and quick level/streak tracker.
- **Minimal Topbar**: Clean, uncluttered header displaying active section breadcrumbs, study pace status, and JSON export/import buttons.

---

## 🛠 Features

### 1. 🌲 Concept Learning Hub (`Topic > Subtopic > Sub-subtopic`)
- **3-Level Hierarchical Tree**:
  - **Topic**: Phase / major domain (e.g., *Spring Core*, *JPA & Hibernate*, *Distributed Systems*).
  - **Subtopic**: Specific competency area (e.g., *Inversion of Control*, *Fetching Strategies*).
  - **Sub-subtopic**: Leaf concept with in-depth notes, copyable code, and official docs (e.g., *Constructor vs Field Injection*, *Solving N+1 with JOIN FETCH*).
- **"More Detailed" On-Demand Engine (Gemini API)**:
  - Generates deep architectural explanations and concrete real-life enterprise production scenarios & runnable Java 21 / Spring Boot 3 code.
  - Interactive **Regenerate Explanation** (refreshes mental models) and **Regenerate Real-Life Examples** (generates fresh enterprise industry scenarios).
- **In-Depth Conceptual Notes**: Plain-language mechanics explaining why things work the way they do under the hood.
- **Copyable Java / Spring Snippets**: Real production-grade patterns with syntax formatting.
- **Key Takeaways & Interview Gotchas**: Critical warnings and edge cases asked in tech interviews.
- **Curated Video Recommendations**: Search query paired with specific top creators (*Amigoscode*, *Dan Vega*, *Telusko*, *Bouali Ali*, *Vlad Mihalcea*, *Hussein Nasser*, *Confluent Developer*, *ByteByteGo*).
- **Official Documentation**: Direct references to Oracle Java APIs, Spring.io guides, and PostgreSQL docs.
- **Continuous Reading Flow**: Sequential `Previous` / `Next` subtopic buttons.

### 2. 🎯 Adaptive Quiz Arena After Every Topic
- **4 Difficulty Tiers**: `Easy` 🟢, `Medium` 🟡, `Hard` 🔴, and `Architect` 🟣.
- **Adaptive Auto-Scaling**: Answering 2 questions correctly automatically steps you up to the next tier.
- **Instant In-Depth Explanations**: Detailed breakdown of why the right answer is correct and why each incorrect option fails.
- **Manual Tier Toggle**: Switch difficulty manually at any time.

### 3. 🏆 Milestones & Rewards
- **10 Core Milestones**:
  - Highlights **Week 6 Gateway**: When you are ready to begin applying for **Junior Backend Roles**!
- **12 Unlockable Badges** (e.g. *Java Craftsman*, *Bean Master*, *ORM Whisperer*, *Security Sentinel*, *Kafka Wrangler*, *Distributed Sage*).
- **Developer Leveling System** with XP, daily streaks, and celebration confetti.

### 4. ⏱ 3-Month Study Pacing & Pomodoro Focus Timer
- **Pacing Metrics**: Weekday target **3 hrs/day** • Weekend target **6–7 hrs/day** (~28–30 hrs/week).
- **Countdown Tracker**: Real-time progress bar from Day 1 to Day 90 based on your start date.
- **Integrated 25-Minute Pomodoro Clock**: Built-in timer with 1-click study hours logging.
- **14-Week Calendar Table**: Detailed roadmap with weekly deliverables.

### 5. 🏗 Capstone Platform Architecture & Interview Tools
- **Distributed Payments Blueprint**: Shows how an e-commerce platform evolves from a monolith to a distributed microservices mesh across Phases 1 to 10.
- **Interview Q&A Flashcards**: Key interview questions with model answers and mastery tracking.
- **Job-Readiness Checklist & Resume Bullets**: Checklist of core skills and copyable bullet points for your resume.

---

## 🚀 Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Verify production build**:
   ```bash
   npm run build
   ```

---

## 🌐 Deploy to Vercel

### Option 1: Via GitHub (Recommended)
1. Commit and push your code to GitHub:
   ```bash
   git add .
   git commit -m "feat: complete spring boot study tracker"
   git push origin main
   ```
2. Go to [Vercel](https://vercel.com/new).
3. Import your GitHub repository and click **Deploy**. Next.js will build and deploy automatically.

### Option 2: Deploy with Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 💾 Data Persistence & Backup
- All progress, quiz scores, custom notes, and study logs are saved automatically in your browser's `localStorage`.
- Use the **Download / Export (JSON)** button in the top bar to back up your data or move it between machines.
