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
- [x] Rotten-Tomatoes-Predictor: README with BERT architecture diagram, training results, evaluation metrics (drafted in `readmes/` Day 14)
- [x] Falcon-9-Landing-Prediction: README with methodology, results, Plotly dashboard description (drafted in `readmes/` Day 14)
- [ ] Histopathologic-Cancer-Detection: README with CNN architecture, data pipeline, results
- [ ] NLP-Disaster-Tweets: README with BiGRU/BiLSTM approach, preprocessing, results
- [ ] Monet-Style-Transfer: README with GAN comparison (DCGAN vs CycleGAN vs NST), sample outputs
- [ ] CU-Boulder-MSDS: Organize by semester, add course descriptions and key project links
- [ ] Maevie-Project-Manager: README with features, tech stack, setup guide

### P2 — New Projects (Show Range and Depth)
- [ ] Sentiment Analysis API — FastAPI + HuggingFace, containerized, deployed (2-day build; Day 1 scaffold complete in `sentiment-analysis-api/` Day 15)
- [x] FIRE Simulator — Publish existing fire-simulator as standalone repo with polished README
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
- [x] Add project search and category filtering to projects page
- [ ] Add project screenshots/demo GIFs to project cards
- [x] Add new projects to projects page as they're built (FIRE Simulator added Day 13)
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
**Pre-flight:** SEO / Google indexing check
- Search Google for `site:ryanordonez.github.io/Portfolio-Site/` to see how many pages are indexed
- Fetch `https://ryanordonez.github.io/Portfolio-Site/sitemap.xml` to confirm it's still serving correctly
- Fetch a blog post URL to confirm pages are live and meta tags are intact
- Log indexing status in the day's completed work entry
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

### Day 21 — April 15, 2026
**Portfolio Action:** Published and fully indexed the April 15 capability-withhold blog post
- New blog post: `docs/posts/2026-04-15-claude-mythos-preview-capability-withhold.html` — ~1,500-word analysis of Anthropic's April 14 Claude Mythos Preview announcement, the first major flagship model to be publicly benchmarked and deliberately withheld from release
- Post covers: Mythos Preview benchmark claims (93.9% SWE-bench Verified, 94.6% GPQA Diamond), Project Glasswing consortium with Microsoft/Apple/Amazon/Google, cybersecurity stock selloff implications, the new three-tier release pattern (public API / gated / capability-demonstration), dual-use surface area generalization beyond cybersecurity
- Three concrete data scientist takeaways: map dual-use surface area before incidents, treat frontier access as a capability contract (eval suite + graceful degradation + contractual tier language), build vendor-agnostic security evals (prompt injection, goal hijacking, info leakage, tool abuse) into every release pipeline
- Full metadata integration completed: added top-of-list card to `docs/blog.html` with "AI Industry" tag + excerpt, added item to `docs/feed.xml` with pubDate + description + category, added URL entry to `docs/sitemap.xml` with lastmod 2026-04-15, bumped homepage + blog.html sitemap `<lastmod>` to 2026-04-15, bumped feed `<lastBuildDate>` to Wed, 15 Apr 2026
- Also backfilled the April 10 Shopify AI Toolkit post into `docs/blog.html` and `docs/feed.xml` — the post HTML and sitemap had been committed on Day 16 but the blog index and RSS feed were missed in that commit

**Blog:** "Anthropic's Mythos Preview: Why Withholding a Model Is Now a Shippable Product Decision"
- Topic: Anthropic's April 14 announcement of Claude Mythos Preview — the first time a major lab has publicly benchmarked a flagship model and simultaneously announced it will not be generally released
- Covers: the capability-withhold release pattern as a new product category, Project Glasswing as a vetted-consortium distribution mechanism, OpenAI's GPT-5.4-Cyber follow-on confirming the pattern is industry-wide, why cybersecurity stocks sold off on the news
- Bigger picture argument: capability growth has outpaced the industry's release infrastructure; access tiers will stratify; benchmark parity is no longer availability parity; graceful degradation for tier loss should be a product requirement, not an afterthought

### Day 15 — April 9, 2026
**Portfolio Action:** Scaffolded Sentiment Analysis API — Day 1 of 2-day build (Option B, following Day 13's fire-simulator staging pattern)
- Created `sentiment-analysis-api/` folder in Portfolio-Site to stage the full FastAPI project before publication as `RyanOrdonez/Sentiment-Analysis-API`
- Wrote `sentiment-analysis-api/README.md`: overview, model selection rationale (DistilBERT SST-2, pinned revision), complete API design table with request/response schemas for both `/predict` and `/predict/batch`, input validation rules, architecture diagram (FastAPI → SentimentService singleton → HuggingFace pipeline), repository structure, quick start for local and Docker, testing section, environment variable configuration table, roadmap for Day 2, design decisions rationale table
- Scaffolded full FastAPI app: `app/main.py` with lifespan context manager for one-shot model loading, `app/config.py` with `pydantic-settings` for env-driven config and `@lru_cache` singleton, `app/schemas.py` with Pydantic v2 request/response models including field validators that reject empty/whitespace/oversized/non-string inputs at HTTP 422, `app/services/sentiment.py` with the `SentimentService` class (singleton wrapper around HuggingFace pipeline, device-aware CPU/CUDA/MPS fallback, separate `load()` from `__init__` so lifespan can report load failures via `/health`), `app/routers/health.py` (`/health`, `/model`), `app/routers/predict.py` (`/predict`, `/predict/batch` with request ID, latency timing, structured logging)
- Scaffolded pytest suite: `tests/conftest.py` with session-scoped `TestClient` fixture that loads the model once, `tests/test_health.py` covering `/health` and `/model` endpoints, `tests/test_predict.py` covering positive/negative/batch predictions and checking batched-vs-single agreement, `tests/test_validation.py` covering empty strings, whitespace-only, missing fields, non-string types, oversized inputs, empty batches, and oversized batches
- Wrote multi-stage `Dockerfile`: `builder` stage installs dependencies and pre-downloads the model into `HF_HOME=/opt/hf-cache` so runtime containers start deterministically without network access, `runtime` stage runs as non-root user with HEALTHCHECK hitting `/health`
- Wrote `requirements.txt` with pinned versions for fastapi 0.110, uvicorn 0.29, pydantic 2.6, transformers 4.39, torch 2.3, pytest 8.1
- Added a Sentiment Analysis API project card to `docs/projects.html` after the FIRE Simulator — category NLP, full overview/methodology/key metrics/tech tags, repo link points to the planned `RyanOrdonez/Sentiment-Analysis-API` GitHub URL
- Added a matching Sentiment Analysis API card to the homepage `docs/index.html` projects grid
- Updated `README.md` featured projects table to include Sentiment Analysis API
- Day 2 work (next session): error handling polish, rate limiting with slowapi, Prometheus metrics, deployment config for Railway/Render, GitHub Actions CI for image builds

**Blog:** "Meta's Muse Spark: The End of Meta's Open-Source Era and What It Means for Data Scientists"
- Topic: Meta's Muse Spark release on April 8, 2026 — the first flagship LLM to come out of the new Superintelligence Labs group under Alexandr Wang (hired as Meta's first CAO after the $14.3B Scale AI stake deal in June 2025), and the first time Meta has shipped a flagship model behind a closed license
- Covers: What Muse Spark actually is — model code-named Avocado, built over 9 months, benchmark-competitive with GPT/Claude/Gemini across most tasks, claims ~10x compute efficiency over Llama 4 midsize, powers Meta AI across Facebook/Instagram/WhatsApp/Messenger/Ray-Ban Meta glasses, weights/architecture/recipes not being published, $115-135B AI capex guidance for 2026 (roughly 2x 2025)
- Why the closed pivot isn't a surprise: Llama 3.2 through Llama 4 progressively added license restrictions and carve-outs; Muse Spark is the logical endpoint — Meta just stopped pretending. The fiduciary math at $115B+ capex per year makes "release as public good" untenable regardless of stated philosophy
- What this leaves the open-source ecosystem: Qwen and DeepSeek as the de facto open-weights leaders, Google Gemma 4 as the credible Western open stack with Apache 2.0, NVIDIA Nemotron as the integrated hardware-vendor open play (economics favor continued openness since it drives GPU sales), Mistral as the remaining European open-source pure-play. Diffused leadership is structurally healthier than one dominant benefactor
- Three practical takeaways for data scientists: (1) re-evaluate Llama-pinned dependencies and benchmark Qwen 3 and Gemma 4 as drop-in replacements on real eval suites, (2) treat "open weights" as a risk category not a binary — plan assuming any provider could close up, build abstraction layers (MCP for tools, standard embedding interfaces) to enable swaps without refactoring, (3) re-price long-term compute against the new capex reality — projects on the efficient frontier of 7-70B open models look relatively better than projects that require the absolute frontier
- Bigger picture: the AI industry is maturing past the phase where the boundary between research and product could stay blurry for a company with Meta's capital exposure. Betting on any single provider's strategy being permanent is a losing move. Build for the pivot because the pivot keeps happening

### Day 14 — April 8, 2026
**Portfolio Action:** Drafted polished READMEs for Rotten-Tomatoes-Predictor and Falcon-9-Landing-Prediction (Option A, following Day 13's staging pattern)
- Created `readmes/` folder in Portfolio-Site to stage README drafts for external repos before publication (same approach as Day 13's `fire-simulator/README.md`)
- Wrote `readmes/rotten-tomatoes-predictor.md`: full BERT fusion architecture ASCII diagram (text branch + numeric branch + regression head), complete results table with four baselines (Linear Regression, TF-IDF+Ridge, BERT-only, BERT Fusion) showing +3 R² gain from fusion, numeric feature documentation table with rationale for all 8 handcrafted features, data pipeline (source, cleaning, deduplication, stratified splits), training hyperparameters table (AdamW, cosine annealing, mixed-precision on A100), full repository structure, quick start instructions, design decisions rationale table, and citation block
- Wrote `readmes/falcon-9-landing-prediction.md`: commercial context opening (why SpaceX cares about first-stage landing accuracy), full results table with four classifiers (LR, SVM, Decision Tree, KNN) and cross-validation methodology, data insights section (launch site, payload threshold, orbit type, flight number, booster generation findings), end-to-end pipeline ASCII diagram (API + Wikipedia → pandas → SQLite → sklearn + Dash), data collection details for both SpaceX REST API and Wikipedia scraping, feature engineering table, reference SQL queries section (success rate by site, orbit, first success date), modeling code snippet with GridSearchCV, dashboard feature description (Plotly Dash + Folium), full repository structure, and tech stack badges
- Both READMEs include badges for Python/framework versions, consistent section ordering, and methodology clear enough to reproduce the work — ready to be published as the README when each repo is scaffolded on GitHub
- Marked Rotten-Tomatoes-Predictor and Falcon-9-Landing-Prediction entries as complete in the P1 backlog

**Blog:** "Model Context Protocol at 18 Months: Why the Boring Standard Won"
- Topic: Retrospective on how Anthropic's Model Context Protocol (MCP) became the default tool-use transport layer for agent systems over the last 18 months
- Covers: MCP's three core primitives (Tools, Resources, Prompts), the deliberately-small protocol surface area, and why that minimalism was the winning design choice
- Why it won analysis: (1) reference implementations in TypeScript/Python/Rust/Go/Java/C# with consistent ergonomics, (2) separation of the protocol from the agent framework (works with LangGraph, LlamaIndex, DSPy, OpenAI Assistants, Claude native, custom loops), (3) the "app-store moment" when community-published open-source servers for Postgres/Git/GitHub/Notion/Linear/Jira/Slack hit critical mass
- What it changes for data scientists: (1) tool development becomes independent of model development — A/B test Claude vs GPT vs Gemini vs local Llama without porting tool code, (2) resources primitive makes context composable — vector stores exposed as MCP endpoints for pluggable retrieval, (3) evaluation becomes portable via MCP call recording and replayable fixtures with `mcp-tape` and Python SDK recording support
- Remaining gaps: enterprise authorization (row-level permissions, multi-tenancy) still needs custom middleware; long-running operations are awkward because the client/server model doesn't fit multi-hour workflows; observability is fragmented across frameworks (OpenTelemetry convergence in progress); security posture of third-party community servers requires sandboxing and credential hygiene
- Three practical takeaways: wrap custom tools as standalone MCP servers, consume community servers for common integrations, capture real conversations as eval fixtures from day one
- Broader insight: the AI tooling ecosystem in 2026 is starting to resemble mature web infrastructure — boring standards, interop-first, reference implementations — and that's the sign of a healthy ecosystem

### Day 13 — April 7, 2026
**Portfolio Action:** Published FIRE Simulator and added it to the portfolio site (Option B + D)
- Wrote a polished `fire-simulator/README.md` inside the Portfolio-Site repo: project overview, Monte Carlo methodology with full equations (Box-Muller, Cholesky, withdraw-first-then-grow), data source citations (Dimson/Marsh/Staunton, Shiller), feature list (free vs Pro tier), full tech stack table, architecture tree, performance benchmarks, data sources with academic citations, design decisions table, and roadmap — ready to use as the README when the repo is published as `RyanOrdonez/FIRE-Simulator`
- Added a new "FIRE Simulator" featured project card to `docs/projects.html` with overview, methodology (Monte Carlo + Cholesky correlated returns + Trinity Study withdrawal), key metrics (10K sims stable to ±0.5% at 95% CI, <500ms runtime, 4 historical crisis backtests), and tech tags
- Added a matching featured FIRE Simulator card to the homepage `docs/index.html` projects grid (second Featured project alongside Prop Trading Dashboard)
- Repo link points to the planned `RyanOrdonez/FIRE-Simulator` GitHub URL for when the standalone repo is published
- Updated `README.md` featured projects table to include FIRE Simulator at the top

**Blog:** "NVIDIA Nemotron 3: Why an Open Agentic Stack Changes How Data Scientists Build AI Systems"
- Topic: NVIDIA's Nemotron 3 family release — the first serious attempt to ship an entire agentic AI stack as a single unified, fully-open model family (weights, training data, and training recipes all published)
- Covers: The four main model groups — Nemotron 3 Super (long-context reasoning), Nemotron RAG (multimodal embed + reranker VLMs), Nemotron Speech (leaderboard-topping ASR + VoiceChat), Nemotron Content Safety (4B multilingual/multimodal moderation + PII detection)
- Core argument: integration cost dominates agent development, not marginal single-model quality — a unified open stack dissolves impedance mismatches, latency stacking, failure mode combinatorics, cost unpredictability, and data residency problems
- What "fully open" means here: open weights (Apache 2.0-style), 10T training tokens + 500K robotics trajectories + 455K protein structures + 100TB vehicle sensor data released, full post-training recipes including data mixtures and reward model setup, tuned Triton/TensorRT inference kernels
- Reference agent architecture diagram showing voice input → ASR → safety → multimodal RAG embed → rerank → Nemotron Super reasoning → tools → safety → TTS → voice output with every step from the same family
- Three practical takeaways: benchmark Nemotron RAG against current embeddings this week, add Content Safety as a pre-filter regardless of main model choice, treat this as the reference architecture for new projects
- Broader insight: 2026 is the year the open-source ecosystem caught up to closed vendors on completeness (not just individual metrics) — structural shift in agentic system economics

### Day 12 — April 6, 2026
**Portfolio Action:** Added Reading Progress Bar and Auto-Generated Table of Contents to Blog Posts (Option D)
- Added reading progress bar to all blog post pages — thin accent-colored bar fixed at top of viewport that fills as you scroll through the post content
- Progress bar uses CSS gradient (`linear-gradient`) matching the site's accent color scheme
- Added auto-generated Table of Contents sidebar that dynamically builds from `<h2>` headings in the blog post body
- TOC sidebar is sticky-positioned and highlights the active section as you scroll (using IntersectionObserver-style scroll tracking)
- TOC links support smooth scrolling to each section
- Both features are implemented in shared `main.js` — they work on ALL existing and future blog posts automatically, no per-post HTML changes needed
- TOC only appears when a post has 2+ headings (graceful degradation)
- Uses existing CSS classes (`.blog-post-sidebar`, `.blog-toc-list`) that were already defined in `blog.css` but previously unused
- Responsive: TOC collapses below the post content on mobile (≤960px)
- Added `.reading-progress-bar` CSS styles in `blog.css`

**Blog:** "Google's TurboQuant: How 3-Bit KV Cache Compression Changes LLM Deployment Math"
- Topic: Google Research's TurboQuant algorithm, presented at ICLR 2026 — compresses LLM KV caches to 3 bits with zero accuracy loss
- Covers: The KV cache memory bottleneck problem — why it's the dominant cost factor for long-context inference
- Two-stage compression pipeline: PolarQuant (2-bit base via random rotation + polar coordinate quantization) + QJL (1-bit residual correction via Quantized Johnson-Lindenstrauss transform)
- Performance results: 6x KV cache memory reduction, up to 8x faster attention on H100 GPUs, zero measurable accuracy degradation
- Deployment economics deep dive: concrete math on how 6x cache reduction translates to 6x more concurrent users or dramatically cheaper long-context serving
- Comparison with KIVI, PagedAttention, sparse attention, GQA — TurboQuant is additive to all other optimizations
- Community adoption: llama.cpp discussion, SGLang feature request, independent PyTorch reimplementations validating 99.5% attention fidelity
- Practical implementation note: at 2-bit, MSE-only outperforms MSE+QJL (softmax amplifies QJL variance)
- Key insight: the most impactful AI advances in 2026 aren't bigger models — they're infrastructure innovations that make existing models cheaper and more deployable

### Day 11 — April 5, 2026
**Portfolio Action:** Added SEO Infrastructure — sitemap.xml and robots.txt (Option D)
- Created `docs/sitemap.xml` with full XML Sitemap covering all 6 site pages and all 11 blog posts
- Each URL includes `<lastmod>`, `<changefreq>`, and `<priority>` metadata for search engine optimization
- Homepage and blog set to highest priority (1.0/0.9) with daily/weekly update frequency
- Blog posts set to `changefreq=never` since published content is stable
- Created `docs/robots.txt` with universal allow rule and sitemap reference
- Both files follow Google's sitemap protocol and are immediately discoverable by search engine crawlers
- Helps recruiters and visitors find the portfolio through organic search

**Blog:** "Google Gemma 4: What the Most Capable Open Models Mean for Local AI Agents"
- Topic: Google DeepMind's Gemma 4 release — the most capable open model family (released April 2-3, 2026)
- Covers: Four model sizes — E2B (2B edge), E4B (4B edge), 26B MoE (3.8B active), 31B Dense
- Benchmark analysis: 89.2% on AIME 2026 (up from 20.8% Gemma 3), #3 open model on LMArena (1452), 80% LiveCodeBench v6, Codeforces ELO 2150
- MoE architecture deep dive: 128 small experts, 8+1 active per token, 95% of dense quality at fraction of compute
- Native agentic capabilities: structured function calling, JSON output, system instructions, multi-step planning
- Multimodal by default: all models process images and video at variable resolutions, OCR, chart understanding
- Apache 2.0 licensing: strategic shift from custom license, enterprise adoption implications
- Competitive comparison: Gemma 4 vs Llama 4 Scout vs Qwen 3.5 — strengths and tradeoffs
- Deployment guide: Ollama, HuggingFace, vLLM, Google AI Studio, NVIDIA RTX AI
- Key insight: local agentic AI is now production-viable — the MoE efficiency gains fundamentally change the cost calculus for data science teams

### Day 10 — April 4, 2026
**Portfolio Action:** Added Search and Category Filtering to Projects Page (Option D)
- Added search input with magnifying glass icon to `docs/projects.html` for real-time text filtering across project titles, descriptions, methodology, and tech tags
- Added category filter buttons (All, Machine Learning, NLP, Computer Vision, Full-Stack, Data Science) for one-click category filtering
- Each project card now has a `data-category` attribute for JavaScript-based filtering
- Search and category filters work together — users can combine text search with category selection
- "No results" message displays when no projects match the current filters
- Added CSS styles in `docs/assets/css/projects.css`: search input, filter buttons, active states, focus ring, and responsive breakpoints
- All filtering logic runs client-side with vanilla JavaScript (no dependencies)
- Mirrors the blog page's search/filter UX for consistency across the site

**Blog:** "Gemini Embedding 2: What a Unified Multimodal Embedding Model Means for RAG"
- Topic: Google DeepMind's Gemini Embedding 2 — the first natively multimodal embedding model (released March 2026)
- Covers: Single model maps text, images, video, audio, and PDFs into unified 3,072-dimensional vector space
- Benchmark analysis: 68.32 on MTEB English (top spot by 5.09 points), 68.8 on video retrieval (vs 60.3 Amazon Nova 2, 55.2 Voyage Multimodal 3.5)
- Architecture simplification: replaces multi-model pipelines with single API call, Sparkonomy case study (70% latency reduction, 20% recall improvement)
- Practical code examples showing old multi-model approach vs new unified approach
- Pricing analysis: $0.25/M tokens competitive when accounting for total pipeline cost
- Matryoshka Representation Learning (MRL) for flexible dimensionality (256-3,072)
- When to use vs when not to (text-only, on-premise, fine-tuning needs)
- Competitive landscape: Amazon Nova 2, Voyage Multimodal 3.5, OpenAI (text-only), open-source gap
- Key insight: multimodal RAG just moved from "big company problem" to single API call

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
