# Falcon 9 First-Stage Landing Prediction

> End-to-end classification project predicting whether a SpaceX Falcon 9 first-stage booster will successfully land after launch &mdash; full pipeline from API data collection through interactive Plotly Dash dashboard.

**Author:** Ryan Ordonez &middot; [Portfolio](https://ryanordonez.github.io/Portfolio-Site/)
**Course context:** IBM Data Science Professional Capstone (independent re-implementation)

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.10+"/>
  <img src="https://img.shields.io/badge/scikit--learn-1.4-F7931E?style=flat-square&logo=scikit-learn&logoColor=white" alt="scikit-learn"/>
  <img src="https://img.shields.io/badge/Plotly-Dash-3F4F75?style=flat-square&logo=plotly&logoColor=white" alt="Plotly Dash"/>
  <img src="https://img.shields.io/badge/Folium-0.15-77B829?style=flat-square" alt="Folium"/>
  <img src="https://img.shields.io/badge/SQL-SQLite-003B57?style=flat-square&logo=sqlite&logoColor=white" alt="SQLite"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"/>
</p>

---

## Why This Matters

A Falcon 9 launch costs SpaceX around $67 million. The first-stage booster accounts for a substantial share of that cost, and SpaceX's entire business model turns on reliably recovering and reusing it. Whether the first stage lands safely is the single most important cost variable in the launch, and predicting the outcome of that landing from the *pre-launch* parameters &mdash; payload mass, orbit, launch site, booster version, flight history &mdash; is a genuinely useful commercial question.

This project walks through the full data science workflow for answering that question: collection, cleaning, exploratory analysis, SQL aggregation, modeling, and an interactive dashboard that lets a non-technical stakeholder explore launch outcomes by site, orbit, and payload range.

---

## Results

| Model | Accuracy | F1 | ROC&nbsp;AUC | Notes |
|-------|----------|-----|---------|-------|
| Logistic Regression | 0.833 | 0.88 | 0.87 | Strong baseline after scaling |
| Support Vector Machine (RBF) | 0.833 | 0.88 | 0.86 | Equivalent to LR after tuning |
| K-Nearest Neighbors | 0.833 | 0.88 | 0.85 | Sensitive to feature scaling |
| **Decision Tree (best)** | **0.889** | **0.91** | **0.88** | Best after GridSearchCV hyperparameter tuning |

- **Test set:** 18 launches held out from the 90-launch dataset
- **Cross-validation:** 10-fold on the training set
- **Hyperparameter tuning:** GridSearchCV over depth, split criteria, and leaf counts for the tree models; regularization strength and kernel for SVM; k for KNN

### Insights from the Data

- **Launch site matters a lot.** Cape Canaveral SLC-40 has historically had a significantly higher success rate than VAFB SLC-4E, driven mostly by mission profile differences rather than site engineering
- **Payload mass shows a clear threshold effect.** Below ~5,500 kg, landing success is very high. Above that, it drops sharply &mdash; heavier payloads force more aggressive trajectories and leave less propellant for landing burn
- **Orbit type is predictive.** Low Earth Orbit (LEO) and ISS resupply missions show the highest success rates; GTO (geostationary transfer) missions are much harder to recover from because of higher re-entry velocity
- **Flight number correlates strongly with success.** Later flights in the dataset have dramatically higher success rates, reflecting SpaceX's rapid iteration on landing procedures rather than any intrinsic property of individual boosters
- **Booster version generation is a top feature.** Block 5 boosters (the current production variant) land almost uniformly, while earlier versions were experimental

---

## Pipeline Overview

```
+-----------------------+     +-----------------------+
|  SpaceX REST API      |     |  Wikipedia scraping   |
|  (/v4/launches)       |     |  (BeautifulSoup)      |
+-----------+-----------+     +-----------+-----------+
            |                             |
            v                             v
      +-----------------------------------------+
      |      pandas DataFrame: raw_launches     |
      +-------------------+---------------------+
                          |
                          v
      +-----------------------------------------+
      |   Cleaning + feature engineering        |
      |   (null handling, orbit binning,        |
      |    booster version parsing, target)     |
      +-------------------+---------------------+
                          |
                          v
      +-----------------------------------------+
      |    SQLite database for SQL analysis     |
      +-------------------+---------------------+
                          |
         +----------------+-----------------+
         |                                  |
         v                                  v
+-----------------+              +--------------------+
|   scikit-learn  |              |    Plotly Dash     |
|   model pipeline|              |   dashboard        |
|   (LR/SVM/DT/KNN)|             |   + Folium map     |
+-----------------+              +--------------------+
```

---

## Data Collection

**Two sources, one reason:** SpaceX's API gives clean structured data but lags a bit on narrative context, while Wikipedia's launch tables fill in historical gaps and provide cross-validation on the outcome labels.

### SpaceX REST API

```python
import requests
BASE = "https://api.spacexdata.com/v4"
launches = requests.get(f"{BASE}/launches").json()
```

Extracted fields: `flight_number`, `date_utc`, `rocket`, `payloads`, `launchpad`, `cores[0].landing_success`, `cores[0].landing_type`, `cores[0].reused`, `cores[0].flight`.

Nested JSON is flattened with `pandas.json_normalize`, and reference lookups (rocket id, launchpad id, payload ids) are resolved against their respective endpoints and merged in.

### Wikipedia Web Scraping

Launches prior to the API's current coverage window, plus supplemental booster landing detail, are scraped from Wikipedia's Falcon 9 launch tables with `BeautifulSoup`. The scraper parses the HTML `<table>` elements, normalizes header variants, and deduplicates against the API data on `(flight_number, date)`.

---

## Feature Engineering

| Feature | Type | Source |
|---------|------|--------|
| `FlightNumber` | int | API |
| `PayloadMass` | float (kg) | API |
| `Orbit` | categorical | API (mapped to standardized bucket) |
| `LaunchSite` | categorical | API |
| `Flights` | int (prior flights of this booster) | API |
| `GridFins` | bool | API |
| `Reused` | bool | API |
| `Legs` | bool | API |
| `LandingPad` | categorical (nullable) | API |
| `Block` | int (booster generation) | Parsed from version string |
| `ReusedCount` | int | API |
| `Serial` | categorical (booster id) | API |
| `Class` (**target**) | binary | `landing_success` |

Categorical features are one-hot encoded; continuous features (payload mass, flight number) are standardized via `StandardScaler` inside the model `Pipeline`.

---

## SQL Analysis

Before modeling, the cleaned dataset is loaded into SQLite for exploratory SQL queries &mdash; both as a demonstration of the skill and because SQL is genuinely the fastest way to answer certain aggregation questions.

```sql
-- Success rate by launch site
SELECT
  LaunchSite,
  COUNT(*) AS total_launches,
  SUM(Class) AS successful_landings,
  ROUND(100.0 * SUM(Class) / COUNT(*), 1) AS success_rate_pct
FROM launches
GROUP BY LaunchSite
ORDER BY success_rate_pct DESC;

-- Success rate by orbit with minimum sample size
SELECT Orbit, COUNT(*) AS n, AVG(Class) AS success_rate
FROM launches
GROUP BY Orbit
HAVING COUNT(*) >= 5
ORDER BY success_rate DESC;

-- First successful landing by launch site
SELECT LaunchSite, MIN(Date) AS first_success_date
FROM launches
WHERE Class = 1
GROUP BY LaunchSite;
```

---

## Modeling

All four classifiers are wrapped in the same `sklearn.pipeline.Pipeline` to ensure scaling is handled correctly during cross-validation:

```python
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import GridSearchCV

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", DecisionTreeClassifier(random_state=42)),
])

param_grid = {
    "clf__criterion": ["gini", "entropy"],
    "clf__max_depth": [2, 4, 6, 8, 10, None],
    "clf__min_samples_split": [2, 5, 10],
    "clf__min_samples_leaf": [1, 2, 4],
}

grid = GridSearchCV(pipe, param_grid, cv=10, scoring="accuracy", n_jobs=-1)
grid.fit(X_train, y_train)
```

Final models are persisted with `joblib` for reuse in the dashboard.

---

## Interactive Dashboard

The Plotly Dash dashboard exposes the data for interactive exploration:

- **Launch site dropdown** &mdash; filter all visuals by a specific site, or view all together
- **Payload mass range slider** &mdash; restrict to a specific payload window
- **Pie chart** &mdash; success rate breakdown across launches
- **Scatter plot** &mdash; success vs payload mass, coloured by booster version
- **Folium map** &mdash; interactive map of all launch sites with success/failure markers, proximity overlays (coastline, highways, rail lines, population centers) to illustrate why each site was chosen

Launch the dashboard locally:

```bash
python src/dashboard/app.py
# -> open http://127.0.0.1:8050
```

---

## Repository Structure

```
Falcon-9-Landing-Prediction/
├── README.md
├── requirements.txt
├── data/
│   ├── raw/                          # API + Wikipedia source
│   ├── processed/                    # Cleaned DataFrame
│   └── falcon9.db                    # SQLite database
├── notebooks/
│   ├── 01_data_collection_api.ipynb
│   ├── 02_data_wrangling.ipynb
│   ├── 03_eda_visualization.ipynb
│   ├── 04_eda_sql.ipynb
│   ├── 05_interactive_map_folium.ipynb
│   └── 06_ml_prediction.ipynb
├── src/
│   ├── collect_api.py                # SpaceX API pulls
│   ├── collect_wikipedia.py          # Wikipedia scraping
│   ├── preprocess.py                 # Cleaning + feature engineering
│   ├── sql_queries.py                # Reference SQL analysis queries
│   ├── train.py                      # Model training + GridSearchCV
│   └── dashboard/
│       └── app.py                    # Plotly Dash application
└── reports/
    └── final_presentation.pdf        # Capstone presentation deck
```

---

## Quick Start

```bash
git clone https://github.com/RyanOrdonez/Falcon-9-Landing-Prediction.git
cd Falcon-9-Landing-Prediction
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Run the full pipeline end-to-end
python src/collect_api.py
python src/preprocess.py
python src/train.py

# Launch the dashboard
python src/dashboard/app.py
```

---

## Tech Stack

- **Language:** Python 3.10+
- **Data:** pandas, numpy, requests, BeautifulSoup
- **Modeling:** scikit-learn (LogisticRegression, SVC, DecisionTreeClassifier, KNeighborsClassifier)
- **Database:** SQLite via `sqlite3`
- **Visualization:** Plotly, Plotly Dash, Folium, matplotlib, seaborn
- **Notebook environment:** JupyterLab

---

## Design Decisions

| Decision | Why |
|----------|-----|
| Two data sources instead of one | Cross-validation on outcome labels caught three discrepancies between Wikipedia and the API |
| SQLite for SQL analysis | Zero-config, ships with Python, sufficient for ~100-row dataset |
| All four classifiers rather than picking one upfront | Deliberate comparison is the point &mdash; the narrative is "how models differ on this data" |
| GridSearchCV with 10-fold CV despite small dataset | Small samples make single splits unstable; CV mean is more trustworthy |
| Decision Tree as the final model | It narrowly won on accuracy and is the most interpretable &mdash; the splits correspond to real physical thresholds (payload mass, orbit type) |

---

## What's Next

- Re-train with the expanded post-2024 launch set (Block 5 has now flown hundreds of missions)
- Add gradient boosting (XGBoost / LightGBM) as a stronger baseline
- Incorporate weather data on launch day (wind shear, upper-level winds) &mdash; likely predictive for marginal cases
- Deploy the dashboard publicly via Render or Railway

---

## License

MIT &mdash; see `LICENSE` for details.
