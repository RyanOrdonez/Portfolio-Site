#!/bin/bash
# =============================================================================
# Create New Boilerplate Project Repositories on GitHub
#
# This script creates new GitHub repos from the boilerplate-projects/ folder
# and pushes the starter code to each.
#
# Prerequisites:
#   - GitHub CLI (gh) installed and authenticated
#   - Run: gh auth login
#
# Usage:
#   chmod +x create-new-repos.sh
#   ./create-new-repos.sh
# =============================================================================

set -e

GITHUB_USER="RyanOrdonez"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BOILERPLATE_DIR="$SCRIPT_DIR/boilerplate-projects"

echo "============================================"
echo "  New Repository Creator"
echo "  Creating repos for: $GITHUB_USER"
echo "============================================"
echo ""

# Map of folder names to GitHub repo names and descriptions
declare -A REPO_NAMES
declare -A REPO_DESCS

REPO_NAMES=(
    ["ml-model-api"]="sentiment-analysis-api"
    ["rag-chatbot"]="docuchat-rag"
    ["data-pipeline"]="weather-etl-pipeline"
    ["ai-agent"]="research-agent"
    ["ml-dashboard"]="stockscope-dashboard"
)

REPO_DESCS=(
    ["ml-model-api"]="Production sentiment analysis model served via FastAPI with Docker deployment"
    ["rag-chatbot"]="RAG-powered chatbot for answering questions over custom documents"
    ["data-pipeline"]="Automated ETL pipeline for weather data collection, transformation, and visualization"
    ["ai-agent"]="AI research agent that searches the web, summarizes papers, and answers questions"
    ["ml-dashboard"]="Interactive ML dashboard for stock market analysis and prediction"
)

for folder in "${!REPO_NAMES[@]}"; do
    repo_name="${REPO_NAMES[$folder]}"
    repo_desc="${REPO_DESCS[$folder]}"
    source_dir="$BOILERPLATE_DIR/$folder"

    if [ ! -d "$source_dir" ]; then
        echo "[SKIP] $folder not found in boilerplate-projects/"
        continue
    fi

    echo "--- Creating $repo_name ---"

    # Create the GitHub repo
    gh repo create "$repo_name" --public --description "$repo_desc" 2>/dev/null || echo "  Repo may already exist"

    # Initialize and push
    cd "$source_dir"
    git init
    git add .
    git commit -m "Initial project scaffolding with starter code and documentation"
    git branch -M main
    git remote add origin "https://github.com/$GITHUB_USER/$repo_name.git" 2>/dev/null || git remote set-url origin "https://github.com/$GITHUB_USER/$repo_name.git"
    git push -u origin main

    echo "  [OK] https://github.com/$GITHUB_USER/$repo_name"
    echo ""

    cd "$SCRIPT_DIR"
done

echo "============================================"
echo "  All repos created! Check your GitHub profile."
echo "============================================"
