# Daily Portfolio Automation Log

Automated daily improvements to Ryan Ordonez's portfolio and GitHub presence.

---

## Backlog (Prioritized)

### Portfolio Site Enhancements
- [x] Create dedicated Projects page with expanded detail
- [x] Create dedicated Skills page with proficiency levels and project links
- [ ] Create dedicated About page with full career timeline
- [ ] Add blog search and tag filtering
- [ ] Add RSS feed for blog
- [ ] Add project screenshots/demo GIFs to project cards
- [ ] Add dark/light theme toggle
- [ ] Add page transition animations

### Repo Improvements
- [ ] Kaggle-Challenges: Add visual README with badges, results table, architecture diagrams
- [ ] Prop-Trading-Dashboard: Add screenshots, demo GIF, detailed setup instructions
- [ ] Rotten-Tomatoes-Predictor: Add model architecture diagram, results visualization
- [ ] CU-Boulder-MSDS: Organize coursework by semester, add course descriptions
- [ ] RyanOrdonez profile README: Add GitHub stats, recent blog posts, featured projects

### New Project Ideas
- [ ] Sentiment Analysis API (FastAPI + HuggingFace, deployed)
- [ ] Real-time Stock Dashboard (Streamlit + yfinance)
- [ ] AI-Powered Resume Screener (RAG pipeline)
- [ ] Data Engineering Pipeline (Airflow + dbt + Snowflake)

### Blog Topics Queue
- [ ] RAG architectures and when to use them
- [ ] Building production ML pipelines with MLflow
- [ ] Fine-tuning open source LLMs on custom data
- [ ] The data scientist's guide to prompt engineering
- [x] GPU costs in 2026: cloud vs on-prem analysis
- [ ] Vector databases compared: Pinecone vs Weaviate vs Chroma

---

## Completed Work

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
