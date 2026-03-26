# NLP with Disaster Tweets

**Binary text classification of tweets as real disasters or irrelevant using deep learning and traditional NLP approaches.**

---

## Project Overview

This project tackles the [Kaggle "Natural Language Processing with Disaster Tweets"](https://www.kaggle.com/competitions/nlp-getting-started) competition, where the goal is to build a model that can distinguish tweets describing real disasters from those that are not. Despite the seemingly straightforward task, the problem is deceptively challenging -- words like "blazing," "crash," and "explosion" appear frequently in both disaster and non-disaster contexts, requiring models to capture nuanced semantic meaning rather than relying on keyword matching alone.

Four distinct architectures were implemented and compared: a Bidirectional LSTM with GloVe embeddings, a standard LSTM with GloVe, a Bidirectional GRU with GloVe, and a TF-IDF baseline with dense layers. Each model was evaluated on validation accuracy, AUC-ROC, and official Kaggle leaderboard score to provide a comprehensive performance comparison. The Bidirectional GRU achieved the best Kaggle score of 0.80631, securing rank 377 on the public leaderboard.

Extensive text preprocessing -- including tokenization, stopword removal, and lemmatization -- was applied alongside pretrained GloVe (100-dimensional) word embeddings to give the recurrent models a strong semantic foundation.

## Dataset

| Property | Value |
|---|---|
| Source | Kaggle Competition Dataset |
| Training Samples | 7,613 tweets |
| Test Samples | 3,263 tweets |
| Positive Class (Disaster) | ~43% |
| Class Balance | Slightly imbalanced toward non-disaster |
| Features | Tweet text, keyword (optional), location (optional) |

## Methodology

All models share a common preprocessing pipeline:

1. **Text Cleaning** -- URL removal, special character stripping, lowercasing
2. **Tokenization and Stopword Removal** -- NLTK-based pipeline
3. **Lemmatization** -- Reducing words to base forms for vocabulary normalization
4. **Embedding** -- GloVe 100d pretrained vectors (for deep learning models) or TF-IDF vectorization (for the baseline)

### Models Compared

| Model | Architecture | Embedding | Kaggle Score |
|---|---|---|---|
| BiLSTM | Bidirectional LSTM | GloVe 100d | 0.79374 |
| LSTM | Standard LSTM | GloVe 100d | 0.80355 |
| **BiGRU** | **Bidirectional GRU** | **GloVe 100d** | **0.80631** |
| TF-IDF + Dense | Fully connected network | TF-IDF | 0.80049 |

## Results

| Model | Val Accuracy | Val AUC-ROC | Kaggle Score | Kaggle Rank |
|---|---|---|---|---|
| BiLSTM + GloVe | 0.850 | 0.875 | 0.79374 | -- |
| LSTM + GloVe | -- | -- | 0.80355 | -- |
| **BiGRU + GloVe** | **--** | **--** | **0.80631** | **377** |
| TF-IDF + Dense | -- | -- | 0.80049 | -- |

**Best Kaggle Score: 0.80631 (Rank 377)** achieved by the Bidirectional GRU model.

An interesting finding is that the simpler GRU architecture outperformed the LSTM variants on the Kaggle leaderboard despite LSTMs having a more complex gating mechanism. This suggests that for short-text classification tasks, the lighter GRU parameterization may generalize better and is less prone to overfitting on limited training data.

## Key Visualizations

- **Word Clouds** -- Most frequent terms in disaster vs. non-disaster tweets, revealing vocabulary overlap challenges
- **Confusion Matrices** -- Per-model error analysis showing false positive and false negative distributions
- **Training Curves** -- Loss and accuracy over epochs for each model, illustrating convergence behavior
- **Model Comparison Charts** -- Side-by-side Kaggle score comparison across all four architectures

## Tech Stack

| Category | Tools |
|---|---|
| Language | Python |
| Deep Learning | TensorFlow, Keras |
| Embeddings | GloVe (100d pretrained) |
| NLP | NLTK |
| Data Processing | Pandas, NumPy |
| Visualization | Matplotlib, Seaborn |

## How to Run

```bash
# Clone the repository
git clone https://github.com/RyanOrdonez/NLPwithDisasterTweets.git
cd NLPwithDisasterTweets

# Install dependencies
pip install tensorflow nltk pandas numpy matplotlib seaborn

# Download GloVe embeddings (100d)
# Place glove.6B.100d.txt in the project root or data/ directory

# Download NLTK data
python -c "import nltk; nltk.download('stopwords'); nltk.download('wordnet')"

# Run the notebook
jupyter notebook
```

## Author

Ryan Ordonez -- MS in Data Science, University of Colorado Boulder
