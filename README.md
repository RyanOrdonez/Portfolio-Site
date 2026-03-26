# GitHub Portfolio Cleanup & Project Scaffolding

This repository contains everything needed to clean up and professionalize Ryan Ordonez's GitHub portfolio for data science job applications.

## What's Inside

### `repo-readmes/`
Professional README files for all 22 existing repositories. Each README is written to showcase the project effectively to hiring managers and recruiters.

**How to apply:** Run the `update-repos.sh` script (see instructions below), or manually copy each `<RepoName>-README.md` file into the corresponding repo as `README.md`.

| README File | Target Repo | Status |
|-------------|-------------|--------|
| `NLPwithDisasterTweets-README.md` | NLPwithDisasterTweets | Polished |
| `HistopathologicCancerDetection-README.md` | HistopathologicCancerDetection | Polished |
| `MonetPaintings-README.md` | MonetPaintings | Polished |
| `RottenTomatoesPredictor-README.md` | RottenTomatoesPredictor | Polished |
| `DTSA5510_Week4_NewsClassification-README.md` | DTSA5510_Week4_NewsClassification | Polished |
| `Final_Project_DTSA5510-README.md` | Final_Project_DTSA5510 | Polished |
| `DTSA-5509-Supervised-Learning-README.md` | DTSA-5509-...-Final-Project | Polished |
| `spacey-capstone-README.md` | spacey-capstone | Polished |
| `MaevieProjectManager-README.md` | MaevieProjectManager | Polished (fixed inconsistencies) |
| `Applied-Data-Science-Capstone-README.md` | Applied-Data-Science-Capstone | Has TODOs |
| `FinalProject-README.md` | FinalProject | Polished |
| `MachineLearning-AI-README.md` | MachineLearning-AI | Course collection |
| `DataScience-Foundations-README.md` | DataScience-Foundations | Course collection |
| `Algorithms-DataStructures-README.md` | Algorithms-DataStructures | Course collection |
| `Databases-SQL-README.md` | Databases-SQL | Course collection |
| `Software-Architecture-README.md` | Software-Architecture | Course collection |
| `Professional-Skills-README.md` | Professional-Skills | Course collection |
| `Capstone-README.md` | Capstone | Points to spacey-capstone |
| `DTSA5510_Week4_MovieRatingsNMF-README.md` | DTSA5510_Week4_MovieRatingsNMF | Has TODOs |
| `DataVisualizationFinalProject-README.md` | DataVisualizationFinalProject | Has TODOs |
| `EducationalAI-README.md` | EducationalAI | Planned project |
| `ai_disruption-README.md` | ai_disruption | Planned project |

### `boilerplate-projects/`
Five new project scaffolds designed to fill portfolio gaps and demonstrate production-ready skills:

| Project | Folder | Description |
|---------|--------|-------------|
| **Sentiment Analysis API** | `ml-model-api/` | FastAPI + Docker ML model deployment |
| **DocuChat RAG** | `rag-chatbot/` | Streamlit RAG chatbot over custom documents |
| **WeatherETL Pipeline** | `data-pipeline/` | Automated ETL with dashboard visualization |
| **ResearchAgent** | `ai-agent/` | AI agent with web search and paper summarization |
| **StockScope Dashboard** | `ml-dashboard/` | Interactive Streamlit stock analysis dashboard |

**How to use:** Run the `create-new-repos.sh` script to create these as new GitHub repos, or manually create repos and push each folder.

### Scripts

- **`update-repos.sh`** -- Clones all existing repos, copies the new READMEs, commits, and pushes
- **`create-new-repos.sh`** -- Creates new GitHub repos from the boilerplate projects (requires `gh` CLI)

## Quick Start

```bash
# 1. Clone this repo
git clone https://github.com/RyanOrdonez/Claude-Clode-Start.git
cd Claude-Clode-Start

# 2. Update all existing repo READMEs
chmod +x update-repos.sh
./update-repos.sh

# 3. Create new boilerplate repos
chmod +x create-new-repos.sh
./create-new-repos.sh
```

## Recommended Repo Renames

For consistency, consider renaming these repos on GitHub (Settings > General > Repository name):

| Current Name | Suggested Name |
|---|---|
| `DTSA5510_Week4_NewsClassification` | `bbc-news-classifier` |
| `Final_Project_DTSA5510` | `stock-portfolio-diversification` |
| `DTSA-5509-Introduction-to-Machine-Learning-Supervised-Learning-Final-Project` | `fantasy-football-predictor` |
| `DTSA5510_Week4_MovieRatingsNMF` | `movie-recommender-nmf` |

## Repos to Archive

These repos don't add value to your portfolio and should be archived (Settings > Danger Zone > Archive):

- **MyFirstRepo** -- Contains hello world and basic algorithm exercises
