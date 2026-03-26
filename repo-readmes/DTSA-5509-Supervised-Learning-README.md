# Fantasy Football Points Predictor

**Predicting fantasy football scoring using multi-season NFL offensive statistics and supervised machine learning.**

---

## Project Overview

This project builds a predictive model for fantasy football points using real NFL offensive statistics spanning the 2019-2023 seasons. Fantasy football is a multi-billion dollar industry where accurate player projections provide a significant competitive edge, making this a practical application of regression modeling with clear real-world value.

Two modeling approaches were implemented and compared: Ordinary Least Squares (OLS) Regression for interpretability and baseline performance, and Random Forest Regression for capturing non-linear relationships between player statistics and fantasy output. The best model achieves an MSE of 0.937 and RMSE of 0.968, indicating predictions that are on average less than one fantasy point away from the actual score -- a strong result given the inherent variance in weekly NFL performance.

Feature engineering focused on extracting meaningful predictive signals from raw box-score statistics across multiple seasons, with careful attention to train-test splitting that respects the temporal nature of the data.

## Dataset

| Property | Value |
|---|---|
| Source | Kaggle + fantasydata.com |
| Seasons Covered | 2019, 2020, 2021, 2022, 2023 |
| Scope | NFL offensive player statistics |
| Features | Passing, rushing, receiving yards, touchdowns, turnovers, etc. |
| Target Variable | Fantasy football points scored |

## Methodology

### Preprocessing

1. **Data Collection** -- Multi-source aggregation of NFL stats across 4+ seasons
2. **Feature Selection** -- Offensive statistics most correlated with fantasy output
3. **Train-Test Split** -- Temporal awareness to prevent data leakage

### Models

| Model | Description |
|---|---|
| OLS Regression | Linear baseline with statistical diagnostics via Statsmodels |
| Random Forest | Ensemble of decision trees capturing non-linear feature interactions |

## Results

| Metric | Best Score |
|---|---|
| **MSE** | **0.937** |
| **RMSE** | **0.968** |
| **MAE** | **0.556** |

The sub-1.0 RMSE indicates that the model's predictions are, on average, within one fantasy point of the actual value. The MAE of 0.556 further confirms tight prediction accuracy, with the median error being just over half a point.

### Feature Importance

Key predictive features align with fantasy scoring intuition: touchdowns, total yards, and reception counts carry the highest importance weights in the Random Forest model, while turnovers contribute negatively as expected.

## Key Visualizations

- **Actual vs. Predicted Scatter Plots** -- Model prediction accuracy visualization
- **Residual Analysis** -- Distribution and patterns of prediction errors
- **Feature Importance Rankings** -- Most predictive statistics for fantasy scoring
- **Correlation Heatmaps** -- Relationships between offensive statistics
- **Season-over-Season Trends** -- Statistical patterns across the multi-year dataset

## Tech Stack

| Category | Tools |
|---|---|
| Language | Python |
| Machine Learning | Scikit-learn (Random Forest, metrics) |
| Statistical Modeling | Statsmodels (OLS Regression) |
| Data Processing | Pandas, NumPy |
| Visualization | Matplotlib, Seaborn |

## How to Run

```bash
# Clone the repository
git clone https://github.com/RyanOrdonez/DTSA-5509-Supervised-Learning.git
cd DTSA-5509-Supervised-Learning

# Install dependencies
pip install scikit-learn statsmodels pandas numpy matplotlib seaborn

# Run the notebook
jupyter notebook
```

## Author

Ryan Ordonez -- MS in Data Science, University of Colorado Boulder
