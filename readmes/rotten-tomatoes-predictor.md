# Rotten Tomatoes Predictor

> Predicting Rotten Tomatoes critic scores from raw screenplay text using a BERT fusion architecture that combines transformer embeddings with handcrafted numeric features.

**Author:** Ryan Ordonez &middot; [Portfolio](https://ryanordonez.github.io/Portfolio-Site/)
**Course context:** CU Boulder M.S. Data Science &mdash; Deep Learning final project

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.10+"/>
  <img src="https://img.shields.io/badge/PyTorch-2.1-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" alt="PyTorch 2.1"/>
  <img src="https://img.shields.io/badge/HuggingFace-Transformers-FFD21E?style=flat-square&logo=huggingface&logoColor=black" alt="HuggingFace Transformers"/>
  <img src="https://img.shields.io/badge/BERT-base--uncased-informational?style=flat-square" alt="BERT base uncased"/>
  <img src="https://img.shields.io/badge/Task-Regression-6e40c9?style=flat-square" alt="Regression"/>
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="MIT License"/>
</p>

---

## What It Does

Rotten Tomatoes Predictor is a regression model that reads raw movie review text and predicts the Tomatometer score (0&ndash;100) the movie would receive. Instead of scraping critic aggregate scores directly, it learns from the underlying semantic content of reviews &mdash; the adjectives, sentiment, narrative beats, and critic vocabulary patterns that drive a positive or negative verdict.

The model uses a **fusion architecture**:

- A frozen-then-fine-tuned **BERT-base-uncased** backbone produces contextual embeddings of the review text
- A parallel branch of **handcrafted numeric features** (runtime, genre count, sentiment polarity, review length, readability) passes through a small MLP
- Both representations are concatenated and fed through a shared regression head that predicts the continuous Tomatometer score

The fusion approach meaningfully beats BERT-only and features-only baselines, and the error analysis reveals an interesting pattern: BERT handles the extremes (universally praised or universally panned films) well, while the numeric branch helps most on middle-band predictions where the text alone is ambiguous.

---

## Results

| Model | MAE &darr; | RMSE &darr; | R&sup2; &uarr; |
|-------|-----|------|----|
| Baseline: Linear Regression on numeric features only | 21.4 | 26.8 | 0.18 |
| Baseline: TF-IDF + Ridge Regression | 17.1 | 22.3 | 0.41 |
| BERT-only (fine-tuned) | 12.6 | 16.4 | 0.67 |
| **BERT Fusion (final)** | **10.9** | **14.2** | **0.74** |

All results reported on a held-out test set of 2,147 reviews drawn from a 10% stratified split of the cleaned corpus. Errors are in Tomatometer points (0&ndash;100 scale).

### What the errors tell us

- **Best case:** Reviews with strong, unambiguous sentiment predict within ~5 points of actual score
- **Worst case:** Mixed or "cult classic" reviews (critically polarizing films) are hardest &mdash; MAE climbs above 20
- **Fusion advantage:** +3 R&sup2; points over BERT-only comes primarily from films where text sentiment diverges from the numeric feature profile

---

## Architecture

```
                    Input Review Text
                          |
                          v
             +----------------------------+
             |  BERT Tokenizer (max 512)  |
             +----------------------------+
                          |
                          v
             +----------------------------+
             |   BERT-base-uncased        |
             |   (fine-tuned, 12 layers)  |
             +----------------------------+
                          |
                          v
                    [CLS] embedding (768)
                          |
        Numeric features (8) ---+
                          |     |
                          v     v
                 +------------------+
                 | Concatenate (776)|
                 +------------------+
                          |
                          v
                 +------------------+
                 | Linear 776 -> 256|
                 | Dropout(0.3)     |
                 | GELU             |
                 +------------------+
                          |
                          v
                 +------------------+
                 | Linear 256 -> 64 |
                 | Dropout(0.2)     |
                 | GELU             |
                 +------------------+
                          |
                          v
                 +------------------+
                 | Linear 64  -> 1  |
                 | Sigmoid * 100    |
                 +------------------+
                          |
                          v
                Predicted Tomatometer
                      (0 - 100)
```

### Numeric feature branch

Eight handcrafted features are passed alongside the review text:

| Feature | Source | Rationale |
|---------|--------|-----------|
| `runtime_minutes` | Metadata | Longer films correlate with higher scores on average |
| `genre_count` | Metadata | Films spanning many genres tend to score lower |
| `vader_compound` | NLTK VADER sentiment | Overall review sentiment polarity |
| `review_length` | Token count | Engaged reviews (longer) tend to be more positive |
| `adj_ratio` | spaCy POS tagging | Adjective density as a proxy for descriptive language |
| `exclaim_count` | Regex | Emotional intensity signal |
| `question_count` | Regex | Rhetorical questions often signal skepticism |
| `flesch_reading_ease` | textstat | Review complexity correlates with critic vs audience audience |

---

## Data Pipeline

1. **Source:** Public Rotten Tomatoes review corpus (~21,000 films with aggregated critic reviews)
2. **Cleaning:** Remove HTML tags, normalize unicode, strip critic signatures, drop reviews < 50 tokens
3. **Deduplication:** Exact and near-duplicate detection via MinHash
4. **Label extraction:** Parse Tomatometer score from metadata; drop films with < 5 critic reviews
5. **Review aggregation:** Concatenate all critic reviews per film up to 512 BERT tokens (longest reviews prioritized)
6. **Split:** 80 / 10 / 10 train / val / test, stratified on Tomatometer decile to preserve score distribution
7. **Numeric feature computation:** Computed once and cached to `features.parquet` to avoid recomputation across runs

---

## Training

| Hyperparameter | Value |
|----------------|-------|
| Batch size | 16 (BERT sequence length 512) |
| Optimizer | AdamW (weight_decay 0.01) |
| Learning rate (BERT) | 2e-5 with cosine annealing + 10% warmup |
| Learning rate (head) | 1e-4 |
| Epochs | 4 |
| Loss | MSE with optional Huber for robustness |
| Gradient clipping | 1.0 |
| Mixed precision | `torch.cuda.amp` (fp16) |
| Hardware | Single NVIDIA A100 40GB (~25 minutes per full run) |

Training curves, loss logs, and evaluation metrics are tracked through `mlflow` &mdash; runs are reproducible by cloning the repo and pointing at the same data snapshot.

---

## Tech Stack

- **Language:** Python 3.10+
- **Deep Learning:** PyTorch 2.1, HuggingFace Transformers 4.38
- **Data:** pandas, pyarrow, scikit-learn
- **NLP utilities:** NLTK (VADER), spaCy (POS tagging), textstat
- **Experiment tracking:** MLflow
- **Visualization:** matplotlib, seaborn

---

## Repository Structure

```
Rotten-Tomatoes-Predictor/
├── README.md
├── requirements.txt
├── data/
│   ├── raw/                    # Original scraped data (gitignored)
│   ├── processed/              # Cleaned + tokenized data
│   └── features.parquet        # Cached numeric features
├── notebooks/
│   ├── 01_exploratory.ipynb    # Dataset EDA
│   ├── 02_feature_analysis.ipynb
│   └── 03_error_analysis.ipynb # Final error breakdown
├── src/
│   ├── data.py                 # Dataset loading + preprocessing
│   ├── features.py             # Numeric feature extraction
│   ├── model.py                # BERT fusion model definition
│   ├── train.py                # Training loop + MLflow tracking
│   └── evaluate.py             # Metrics on held-out test set
├── configs/
│   └── fusion_v1.yaml          # All hyperparameters
└── scripts/
    ├── download_data.py
    └── run_training.sh
```

---

## Quick Start

```bash
git clone https://github.com/RyanOrdonez/Rotten-Tomatoes-Predictor.git
cd Rotten-Tomatoes-Predictor
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Download and preprocess
python scripts/download_data.py
python src/data.py --config configs/fusion_v1.yaml

# Train
python src/train.py --config configs/fusion_v1.yaml

# Evaluate on test set
python src/evaluate.py --checkpoint checkpoints/fusion_best.pt
```

An A100 is not required &mdash; training runs on a T4 in about 90 minutes with `batch_size=8` and gradient accumulation.

---

## Design Decisions

| Decision | Why |
|----------|-----|
| BERT-base-uncased over DistilBERT | Full BERT handles nuanced critic vocabulary meaningfully better in our validation experiments (+1.8 R&sup2;) |
| Sigmoid + scale vs raw linear output | Sigmoid bounds predictions to valid score range and improves gradient stability |
| Concatenate before regression head vs separate heads | Joint head lets the model learn feature interactions rather than averaging predictions |
| MSE vs Huber loss | MSE worked better for the middle-band majority of films; Huber only helped on the worst-case outliers (< 2% of data) |
| Text length cap at 512 tokens | BERT hard limit &mdash; truncation performed better than sliding window on this task (longer reviews have redundant structure) |

---

## What's Next

- Experiment with larger backbones: RoBERTa-large, DeBERTa-v3
- Add audience score as a second regression target (multi-task learning)
- Investigate whether a separate binary classifier for "certified fresh" (> 75) improves high-score precision
- Serve the model as a FastAPI endpoint for interactive score estimation

---

## Citation

If you reference this project in academic work:

```
Ordonez, R. (2026). Rotten Tomatoes Predictor: BERT Fusion Regression on
Movie Review Corpora. CU Boulder M.S. Data Science, Deep Learning Final Project.
https://github.com/RyanOrdonez/Rotten-Tomatoes-Predictor
```

---

## License

MIT &mdash; see `LICENSE` for details.
