# Daily Portfolio Automation Log

Automated daily improvements to Ryan Ordonez's portfolio and GitHub presence.

---

## How This Works

**Each day, the scheduled agent does TWO things:**

1. **Project Action** — Real engineering work that produces GitHub commits. Priority order:
   - Fix issues or improve existing repos (READMEs, code quality, features)
   - Build new projects (scaffold, implement, deploy)
   - Update portfolio site only when new project work needs to be displayed

2. **Blog Post** — Research trending AI/data science news THAT MORNING, then write a post on the most relevant topic. No pre-planned topics — always current.

---

## Backlog (Prioritized)

### P0 — Immediate Impact (Recruiters See These First)
- [ ] RyanOrdonez profile README: GitHub stats, featured projects, recent blog posts, skills badges
- [ ] Kaggle-Challenges: Visual README with badges, results table, per-challenge methodology
- [ ] Prop-Trading-Dashboard: README overhaul with architecture diagram, setup instructions, feature overview

### P1 — Repo Quality (Make Existing Work Shine)
- [ ] Rotten-Tomatoes-Predictor: README with BERT architecture diagram, training results, evaluation metrics
- [ ] Falcon-9-Landing-Prediction: README with methodology, results, Plotly dashboard description
- [ ] Histopathologic-Cancer-Detection: README with CNN architecture, data pipeline, results
- [ ] NLP-Disaster-Tweets: README with BiGRU/BiLSTM approach, preprocessing, results
- [ ] Monet-Style-Transfer: README with GAN comparison (DCGAN vs CycleGAN vs NST), sample outputs
- [ ] CU-Boulder-MSDS: Organize by semester, add course descriptions and key project links
- [ ] Maevie-Project-Manager: README with features, tech stack, setup guide

### P2 — New Projects (Show Range and Depth)
- [ ] Sentiment Analysis API — FastAPI + HuggingFace, containerized, deployed (2-day build)
- [ ] FIRE Simulator — Publish existing fire-simulator as standalone repo with polished README
- [ ] Real-time Stock Dashboard — Streamlit + yfinance (2-day build)
- [ ] AI-Powered Resume Screener — RAG pipeline with vector search (3-day build)
- [ ] Data Engineering Pipeline — Airflow + dbt + Snowflake (3-day build)

### P3 — Portfolio Site (Display Layer — Update When Projects Change)
- [x] Create dedicated Projects page with expanded detail
- [x] Create dedicated Skills page with proficiency levels and project links
- [x] Create dedicated About page with full career timeline
- [x] Add blog search and tag filtering
- [x] Add RSS feed for blog
- [x] Add dark/light theme toggle
- [x] Add page transition animations
- [ ] Add project screenshots/demo GIFs to project cards
- [ ] Add new projects to projects page as they're built
- [ ] Update skills page when new tech is used

### Blog
- Topics are NOT pre-planned
- Each morning the agent searches for trending AI/data science/ML news
- Blog post is written on the most relevant, timely topic found that day
- Tone: professional but accessible, practical takeaways for data scientists

---

## Schedule: Days 10–19

### Day 10
**Project:** Create RyanOrdonez profile README (`RyanOrdonez/RyanOrdonez` repo)
- Hero section, GitHub stats widgets, skills badges grid
- Featured projects with descriptions and links
- Recent blog posts list, education, contact
**Blog:** Research trending AI news that morning, write post on most relevant topic

### Day 11
**Project:** Kaggle-Challenges README overhaul
- Read current repo, understand structure
- Add badges, results table (challenge | score | rank), methodology per challenge
- Architecture/approach descriptions for each competition
**Blog:** Research trending AI news that morning, write post on most relevant topic

### Day 12
**Project:** Prop-Trading-Dashboard README overhaul
- Architecture diagram (TypeScript/React/Electron/SQLite flow)
- Feature list, tech stack badges, setup instructions
- Usage guide, screenshot descriptions
**Blog:** Research trending AI news that morning, write post on most relevant topic

### Day 13
**Project:** Publish FIRE Simulator as standalone repo
- Create `RyanOrdonez/FIRE-Simulator` repo
- Polished README: Monte Carlo methodology, feature list, architecture, tech stack
- Add to portfolio site projects page
**Blog:** Research trending AI news that morning, write post on most relevant topic

### Day 14
**Project:** Rotten-Tomatoes-Predictor README + Falcon-9 README
- BERT architecture description, training pipeline, evaluation metrics
- Falcon-9: methodology, classification results, Plotly dashboard description
**Blog:** Research trending AI news that morning, write post on most relevant topic

### Day 15
**Project:** Sentiment Analysis API — Day 1 (scaffold + core)
- Create `RyanOrdonez/Sentiment-Analysis-API` repo
- FastAPI project structure, endpoints, HuggingFace model integration
- README with API design, Dockerfile, requirements.txt
**Blog:** Research trending AI news that morning, write post on most relevant topic

### Day 16
**Project:** Sentiment Analysis API — Day 2 (tests + deploy config)
- Add tests, error handling, model caching, rate limiting
- Deployment config (Railway/Render/Docker)
- Update portfolio site with new project
**Blog:** Research trending AI news that morning, write post on most relevant topic

### Day 17
**Project:** Batch README updates — Histopathologic + NLP-Disaster-Tweets + Monet
- Consistent format: badges, methodology, results, tech stack, setup
- Each gets proper project structure documentation
**Blog:** Research trending AI news that morning, write post on most relevant topic

### Day 18
**Project:** CU-Boulder-MSDS organization + Maevie-Project-Manager README
- CU-Boulder: organize by semester, add course descriptions, link key projects
- Maevie: features, tech stack, architecture, setup guide
**Blog:** Research trending AI news that morning, write post on most relevant topic

### Day 19
**Project:** Real-time Stock Dashboard — Day 1 (scaffold + core)
- Create `RyanOrdonez/Stock-Dashboard` repo
- Streamlit app, yfinance data pipeline, core visualizations
- README with features, architecture, tech stack
- Update portfolio site with new project
**Blog:** Research trending AI news that morning, write post on most relevant topic

---

## Completed Work

### Day 9 — April 3, 2026
**Portfolio Action:** Added Page Transition Animations (Option D)
- Added CSS `@keyframes` animations: `pageEnter`, `fadeInUp`, `fadeInLeft`, `fadeInScale` in `docs/assets/css/style.css`
- Main content container (`<main>`) animates in on every page load with a 0.5s fade-in + slide-up
- Added `.slide-in-left` and `.scale-in` CSS classes as scroll-triggered animation variants
- Added `.stagger-in` class for staggered child element animations with incremental delays (0.06s per item, up to 10 children)
- Applied stagger-in to: projects grid and skills grid on `index.html`, blog posts container on `blog.html`, project details on `projects.html`, skills detail on `skills.html`, career timeline on `about.html`
- Enhanced hover animations: blog cards lift 3px, project cards lift 2px with box-shadow, skill categories lift 2px with shadow
- Added animated underline on blog card "Read more" links using `::after` pseudo-element
- Updated `main.js` IntersectionObserver to support new animation classes (`.slide-in-left`, `.scale-in`, `.stagger-in`)
- Added `@media (prefers-reduced-motion: reduce)` query to disable all animations for accessibility
- All animations are CSS-only with JS IntersectionObserver triggers — no dependencies

**Blog:** "The Data Scientist's Guide to Prompt Engineering in 2026"
- Topic: Comprehensive practical guide to prompt engineering for data scientists (from blog topics queue)
- Covers: Five core techniques that matter in production — structured outputs with JSON Schema, chain-of-thought with explicit reasoning steps, dynamic few-shot example selection via vector search, system prompt engineering for agents, retrieval-grounded prompts for RAG
- DSPy framework deep dive: signatures, modules, MIPROv2/COPRO/GEPA optimizers, treating prompts as optimizable programs
- Common data scientist mistakes: over-prompting, ignoring model-specific strengths, not evaluating prompts systematically, prompt-stuffing vs architecture, context window mismanagement
- Practical 2026 toolkit: DSPy for optimization, MLflow GenAI eval, Prompt Registry, Pydantic + instructor for structured outputs
- Forward-looking: convergence of prompt optimization and fine-tuning, prompt gradients research
- Key insight: invest in evaluation/optimization infrastructure, not memorizing prompt patterns

### Day 8 — April 2, 2026
**Portfolio Action:** Added Dark/Light Theme Toggle (Option D)
- Added light theme CSS custom properties in `docs/assets/css/style.css` using `[data-theme="light"]` selector
- Light theme overrides all core colors: backgrounds (#f5f5f5/#ffffff), text (#1a1a1a/#555555), borders (#e0e0e0), accent adjusted for contrast
- Added theme toggle button to sidebar nav in `docs/assets/js/nav.js` with sun/moon icons (SVG)
- Added mobile theme toggle button next to hamburger menu
- Theme toggle CSS in `style.css`: `.theme-toggle`, `.mobile-theme-toggle` with icon show/hide logic
- Light theme overrides for mobile nav, scrollbars, and selection color
- Theme preference persisted via `localStorage` — survives page navigation and sessions
- Added inline flash-prevention `<script>` to `<head>` of all HTML pages (index, about, projects, skills, blog, all 8 blog posts) to prevent FOUC on page load
- Label dynamically updates: shows "Light Mode" in dark theme, "Dark Mode" in light theme

**Blog:** "Building Production ML Pipelines with MLflow 3.0: What Actually Changed"
- Topic: Practical guide to MLflow 3.0 for production ML pipelines (from blog topics queue)
- Covers: LoggedModel as a first-class entity replacing run-centric architecture
- MLflow 3.0 tracing with auto-instrumentation for 20+ GenAI frameworks (OpenAI, LangChain, etc.)
- GenAI evaluation suite with LLM-as-judge scoring and custom `@scorer` decorator
- Prompt Registry for versioned prompt management and optimization
- Deployment Jobs for CI/CD-style model validation before production
- What's still missing: data versioning (DVC), feature stores (Feast), orchestration (Dagster/Airflow)
- Practical 2026 MLOps stack recommendation (MLflow + DVC + Dagster + Feast + Evidently + vLLM)
- Migration advice from MLflow 2.x to 3.x with breaking changes overview
- Key insight: GenAI and traditional ML toolchains are converging in MLflow 3.0

### Day 7 — April 1, 2026
**Portfolio Action:** Added RSS Feed for Blog (Option D)
- Created `docs/feed.xml` with full RSS 2.0 feed including Atom self-link and all 7 blog posts
- Added RSS autodiscovery `<link>` tag to `docs/blog.html` `<head>` for browser/reader detection
- Added visible RSS feed button with icon below blog subtitle on `docs/blog.html`
- Styled `.blog-rss-link` in `docs/assets/css/blog.css` with accent color border, hover fill, and icon
- Updated `README.md` structure to include `feed.xml` and mention RSS in Blog description

**Blog:** "Vector Databases Compared: Pinecone vs Weaviate vs Chroma vs Qdrant in 2026"
- Topic: Practical comparison of six major vector databases for RAG and semantic search
- Covers: Pinecone (managed serverless), Weaviate (hybrid search leader), Chroma (lightweight prototyping), Qdrant (Rust performance + filtering), Milvus (billion-vector enterprise), pgvector (PostgreSQL extension)
- Strengths and weaknesses analysis for each database
- Decision framework: prototype (Chroma) → small-scale/Postgres (pgvector) → hybrid search (Weaviate) → filtered performance (Qdrant) → zero ops (Pinecone) → massive scale (Milvus)
- Integration ecosystem overview: LangChain, LlamaIndex, embedding model compatibility
- Practical recommendation stack for new RAG projects in 2026
- Key insight: for most applications under 5M vectors, chunking and embedding quality matter more than database choice

### Day 6 — March 31, 2026
**Portfolio Action:** Added Blog Search and Tag Filtering (Option D)
- Added search input with magnifying glass icon to `docs/blog.html` for real-time text filtering across post titles and excerpts
- Added tag filter buttons (All, Machine Learning, AI Engineering, MLOps, AI Industry, AI Regulation, AI Trends) for one-click category filtering
- Each blog card now has a `data-tags` attribute for JavaScript-based filtering
- Search and tag filters work together — users can combine text search with tag selection
- "No results" message displays when no posts match the current filters
- Updated `docs/assets/css/blog.css` with styles for search input, filter buttons, active states, focus ring, and responsive breakpoints
- All filtering logic runs client-side with vanilla JavaScript (no dependencies)

**Blog:** "Fine-Tuning Open Source LLMs on Custom Data: A 2026 Practical Guide"
- Topic: Comprehensive practical guide to fine-tuning open source LLMs with LoRA and QLoRA
- Covers: When to fine-tune vs RAG vs prompting decision framework
- Model landscape: Llama 3.2 8B, Mistral 7B v0.3, Qwen 2.5 7B, Gemma 2 9B comparison
- LoRA vs QLoRA tradeoffs — QLoRA as the 2026 default (1-2% quality gap, massive VRAM savings)
- Hyperparameter guide: r=16, alpha=32, all-linear targets, cosine LR, 1-3 epochs
- Data preparation: quality over quantity (200 curated > 2,000 noisy), chat template formatting
- 2026 software stack: HuggingFace + Unsloth + TRL + vLLM
- RAG + fine-tuning hybrid pattern for production systems
- Common pitfalls: wrong chat templates, catastrophic forgetting, skipping evaluation
- Step-by-step workflow from baseline to deployment

### Day 5 — March 30, 2026
**Portfolio Action:** Created Dedicated About Page (Option D)
- Created `docs/about.html` with full career timeline, education cards, and "How I Work" values section
- Created `docs/assets/css/about.css` with vertical timeline layout, education cards, and values grid
- Career timeline covers: M.S. Data Science (2026), CU Boulder graduate research (2024-2026), U.S. Embassy Baghdad diplomatic security (2020-2024), B.S. Business Management Portland State (2017), U.S. Army infantry & operations (2004-2020)
- Education section with detailed cards for M.S. and B.S. degrees
- "How I Work" section with 4 value cards: Rigorous Validation, Clear Communication, Structured Planning, End-to-End Ownership
- Added "View Full Career Timeline" CTA on homepage about section
- Updated sidebar navigation on blog.html and index.html to link About to dedicated page
- Updated hero "About Me" button to link to new about.html

**Blog:** "RAG Architectures in 2026: A Practical Guide to Retrieval-Augmented Generation"
- Topic: Comprehensive breakdown of RAG architecture patterns and when to use them
- Covers: Naive RAG vs Advanced RAG vs Agentic RAG vs GraphRAG architecture spectrum
- RAG vs fine-tuning vs long context windows decision framework
- 2026 best practice: hybrid systems combining all three approaches
- Key insight: Put volatile knowledge in retrieval, put stable behavior in weights
- Practical 5-step decision framework for data scientists

### Day 4 — March 29, 2026
**Portfolio Action:** Enhanced Portfolio Site (Option D)
- Created dedicated Skills page (`docs/skills.html`) with proficiency levels, progress bars, and project links
- Created `docs/assets/css/skills.css` with responsive skill cards, legend, and proficiency indicators
- Skills organized into 6 categories: Languages, ML & Deep Learning, Statistics & Analysis, Data Engineering, Visualization & Reporting, Tools & Platforms
- Each skill shows proficiency level (Advanced/Proficient/Familiar) with visual bar and links to projects where used
- Updated sidebar navigation across all pages (index, projects, blog, all blog posts) to link Skills tab to new dedicated page
- Added "View All Skills in Detail" CTA on homepage skills section

**Blog:** "GPU Costs in 2026: A Data Scientist's Guide to Cloud vs. On-Prem"
- Topic: Practical breakdown of GPU compute costs for data scientists
- Covers: B200 vs H100 pricing trends, cloud vs on-prem breakeven analysis, marketplace savings (40-60% vs hyperscalers), fine-tuning with LoRA/QLoRA ($50-$500), local hardware recommendations
- Key insight: Where you buy matters as much as what you buy — B200 spot at $2.25/hr vs $14.25/hr on-demand
- Practical takeaways for personal projects and team budgeting

### Day 3 — March 28, 2026
**Portfolio Action:** Enhanced Portfolio Site (Option D)
- Created dedicated Projects page (`docs/projects.html`) with expanded project cards
- Each project now shows: overview, methodology, key results (metric cards), and full tech stack
- Created `docs/assets/css/projects.css` with responsive metric cards and detail layout
- Added "View All Projects in Detail" CTA on homepage
- Updated sidebar and mobile nav to link Projects tab to new dedicated page

**Blog:** "The Claude Mythos Leak: What a Misconfigured CMS Tells Us About the Next Wave of AI"
- Topic: Anthropic's accidental leak of Claude Mythos model details (breaking news, March 27)
- Covers: leaked capabilities, cybersecurity implications, March 2026 frontier model compression, open-source gap narrowing
- Takeaways for data scientists: model tier shifts, security literacy, model-agnostic architecture

### Day 2 — March 27, 2026
- Created Kaggle-Challenges repo with organized challenge structure
- Created CU-Boulder-MSDS repo with coursework organization
- Published blog post: "The AI Accountability Act: What Data Scientists Need to Know"
- Set up sentiment-analysis-api in Work-In-Progress

### Day 1 — March 26, 2026
- Built Portfolio-Site from scratch (HTML/CSS/JS, dark theme, responsive)
- Deployed to GitHub Pages
- Created Prop-Trading-Dashboard repo
- Published first blog post: "The Rise of Agentic AI"
- Set up daily automation infrastructure
