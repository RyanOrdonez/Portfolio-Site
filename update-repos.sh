#!/bin/bash
# =============================================================================
# GitHub Repository README Update Script
# Run this from the directory containing this script (Claude-Clode-Start/)
#
# Prerequisites:
#   - Git installed and configured
#   - GitHub CLI (gh) installed and authenticated, OR git credentials configured
#   - Clone this repo first: git clone https://github.com/RyanOrdonez/Claude-Clode-Start.git
#
# Usage:
#   chmod +x update-repos.sh
#   ./update-repos.sh
# =============================================================================

set -e

GITHUB_USER="RyanOrdonez"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
README_DIR="$SCRIPT_DIR/repo-readmes"
WORK_DIR="/tmp/github-readme-updates"

echo "============================================"
echo "  GitHub Repository README Updater"
echo "  Updating repos for: $GITHUB_USER"
echo "============================================"
echo ""

# Create working directory
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"

# Map of README files to their target repos
declare -A REPO_MAP
REPO_MAP=(
    ["NLPwithDisasterTweets-README.md"]="NLPwithDisasterTweets"
    ["HistopathologicCancerDetection-README.md"]="HistopathologicCancerDetection"
    ["MonetPaintings-README.md"]="MonetPaintings"
    ["RottenTomatoesPredictor-README.md"]="RottenTomatoesPredictor"
    ["DTSA5510_Week4_NewsClassification-README.md"]="DTSA5510_Week4_NewsClassification"
    ["Final_Project_DTSA5510-README.md"]="Final_Project_DTSA5510"
    ["DTSA-5509-Supervised-Learning-README.md"]="DTSA-5509-Introduction-to-Machine-Learning-Supervised-Learning-Final-Project"
    ["spacey-capstone-README.md"]="spacey-capstone"
    ["MaevieProjectManager-README.md"]="MaevieProjectManager"
    ["Applied-Data-Science-Capstone-README.md"]="Applied-Data-Science-Capstone"
    ["FinalProject-README.md"]="FinalProject"
    ["MachineLearning-AI-README.md"]="MachineLearning-AI"
    ["DataScience-Foundations-README.md"]="DataScience-Foundations"
    ["Algorithms-DataStructures-README.md"]="Algorithms-DataStructures"
    ["Databases-SQL-README.md"]="Databases-SQL"
    ["Software-Architecture-README.md"]="Software-Architecture"
    ["Professional-Skills-README.md"]="Professional-Skills"
    ["Capstone-README.md"]="Capstone"
    ["DTSA5510_Week4_MovieRatingsNMF-README.md"]="DTSA5510_Week4_MovieRatingsNMF"
    ["DataVisualizationFinalProject-README.md"]="DataVisualizationFinalProject"
    ["EducationalAI-README.md"]="EducationalAI"
    ["ai_disruption-README.md"]="ai_disruption"
)

SUCCESS=0
FAILED=0

for readme_file in "${!REPO_MAP[@]}"; do
    repo="${REPO_MAP[$readme_file]}"
    readme_path="$README_DIR/$readme_file"

    if [ ! -f "$readme_path" ]; then
        echo "[SKIP] $readme_file not found"
        continue
    fi

    echo "--- Updating $repo ---"

    # Clone if not already cloned
    if [ ! -d "$WORK_DIR/$repo" ]; then
        git clone "https://github.com/$GITHUB_USER/$repo.git" "$WORK_DIR/$repo" 2>/dev/null
    fi

    # Copy README and push
    cp "$readme_path" "$WORK_DIR/$repo/README.md"
    cd "$WORK_DIR/$repo"

    if git diff --quiet README.md 2>/dev/null; then
        echo "  [NO CHANGE] README already up to date"
    else
        git add README.md
        git commit -m "Update README with professional project documentation" 2>/dev/null
        if git push origin main 2>/dev/null; then
            echo "  [OK] Updated successfully"
            ((SUCCESS++))
        else
            echo "  [FAIL] Push failed - check authentication"
            ((FAILED++))
        fi
    fi

    cd "$WORK_DIR"
    echo ""
done

echo "============================================"
echo "  Done! $SUCCESS updated, $FAILED failed"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Archive MyFirstRepo (Settings > Danger Zone > Archive)"
echo "  2. Review each README on GitHub to make sure it looks good"
echo "  3. Consider renaming repos for consistency (see recommendations below)"
echo ""
echo "Recommended repo renames (do manually on GitHub):"
echo "  DTSA5510_Week4_NewsClassification -> bbc-news-classifier"
echo "  Final_Project_DTSA5510 -> stock-portfolio-diversification"
echo "  DTSA-5509-Introduction-to-Machine-Learning-Supervised-Learning-Final-Project -> fantasy-football-predictor"
echo "  DTSA5510_Week4_MovieRatingsNMF -> movie-recommender-nmf"
