"""
Sentiment Analysis Model

Trains and serves a TF-IDF + Logistic Regression sentiment classifier.
Uses a built-in labeled dataset for training, with support for loading
a pre-trained model from disk via joblib.
"""

import re
import os
import logging
from typing import Dict, List, Tuple

import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

logger = logging.getLogger(__name__)

# Built-in training data covering positive, negative, and neutral sentiments
TRAINING_DATA: List[Tuple[str, str]] = [
    # Positive
    ("This product is absolutely wonderful and I love it", "positive"),
    ("Great experience, highly recommend to everyone", "positive"),
    ("Excellent quality and fast shipping", "positive"),
    ("I'm very happy with this purchase", "positive"),
    ("Amazing service, will definitely come back", "positive"),
    ("Best thing I've ever bought, exceeded expectations", "positive"),
    ("Fantastic quality for the price, very impressed", "positive"),
    ("Really enjoyed using this, works perfectly", "positive"),
    ("Outstanding performance and beautiful design", "positive"),
    ("Love this so much, exactly what I needed", "positive"),
    ("Super helpful and friendly customer support", "positive"),
    ("This made my day, couldn't be happier", "positive"),
    ("Brilliant product, works like a charm", "positive"),
    ("Five stars, would buy again in a heartbeat", "positive"),
    ("The team did a phenomenal job on this project", "positive"),
    ("Incredibly well made and durable", "positive"),
    ("So glad I found this, it's a game changer", "positive"),
    ("Pleasantly surprised by the quality", "positive"),
    ("Everything about this experience was top notch", "positive"),
    ("Smooth transaction and the item is perfect", "positive"),
    # Negative
    ("This is terrible, complete waste of money", "negative"),
    ("Awful experience, would not recommend at all", "negative"),
    ("Very disappointed with the quality", "negative"),
    ("The worst product I have ever purchased", "negative"),
    ("Horrible customer service and slow delivery", "negative"),
    ("Broke after one day of use, total junk", "negative"),
    ("Don't buy this, it's a complete scam", "negative"),
    ("Extremely frustrating experience from start to finish", "negative"),
    ("Poor quality materials, feels very cheap", "negative"),
    ("Returned it immediately, not worth the price", "negative"),
    ("Hate this product, nothing works as advertised", "negative"),
    ("Regret buying this, huge waste of time", "negative"),
    ("Unacceptable quality, falling apart already", "negative"),
    ("Disgusting customer service, rude and unhelpful", "negative"),
    ("This is garbage, save your money", "negative"),
    ("Defective on arrival, very disappointing", "negative"),
    ("Misleading description, not what I expected at all", "negative"),
    ("Painful experience dealing with their support team", "negative"),
    ("Would give zero stars if I could", "negative"),
    ("Absolutely dreadful, the worst purchase I have made", "negative"),
    # Neutral
    ("The product arrived on time and works as described", "neutral"),
    ("It's okay, nothing special but gets the job done", "neutral"),
    ("Average quality for the price point", "neutral"),
    ("Received the item, it matches the description", "neutral"),
    ("Standard product, meets basic expectations", "neutral"),
    ("Not bad, not great, just average overall", "neutral"),
    ("Decent product for everyday use", "neutral"),
    ("Works fine, no complaints but nothing impressive", "neutral"),
    ("The package arrived and everything was included", "neutral"),
    ("It does what it says, neither more nor less", "neutral"),
    ("Fairly standard service, nothing to complain about", "neutral"),
    ("Adequate for my needs at this price", "neutral"),
    ("The item is functional and looks as pictured", "neutral"),
    ("Ordered on Monday, arrived Friday, seems fine", "neutral"),
    ("Middle of the road product, does the basics", "neutral"),
    ("Normal shipping time and packaging was fine", "neutral"),
    ("It works but I expected a bit more", "neutral"),
    ("Satisfactory purchase, no major issues", "neutral"),
    ("Plain and simple, it does what it should", "neutral"),
    ("Took a while to ship but the product is alright", "neutral"),
]


class SentimentModel:
    """
    Sentiment analysis model using TF-IDF vectorization and Logistic Regression.

    Supports two modes:
      1. Train from built-in dataset on startup (default)
      2. Load a pre-trained pipeline from disk via joblib
    """

    def __init__(self, model_path: str = None):
        self.model: Pipeline = None
        self.model_path = model_path
        self.is_loaded = False
        self.labels = ["positive", "negative", "neutral"]
        self.model_version = "1.0.0"
        self.training_samples = 0
        self._load_model()

    def _load_model(self) -> None:
        """Load a pre-trained model from disk, or train from built-in data."""
        if self.model_path and os.path.exists(self.model_path):
            try:
                self.model = joblib.load(self.model_path)
                self.is_loaded = True
                logger.info("Loaded pre-trained model from %s", self.model_path)
                return
            except Exception as e:
                logger.warning("Failed to load model from %s: %s", self.model_path, e)

        self._train_builtin()

    def _train_builtin(self) -> None:
        """Train a TF-IDF + Logistic Regression pipeline on built-in data."""
        texts = [t for t, _ in TRAINING_DATA]
        labels = [l for _, l in TRAINING_DATA]

        self.model = Pipeline([
            ("tfidf", TfidfVectorizer(
                max_features=5000,
                ngram_range=(1, 2),
                stop_words="english",
                min_df=1,
                sublinear_tf=True,
            )),
            ("clf", LogisticRegression(
                max_iter=1000,
                C=1.0,
                class_weight="balanced",
                solver="lbfgs",
                multi_class="multinomial",
            )),
        ])

        self.model.fit(texts, labels)
        self.training_samples = len(texts)
        self.is_loaded = True
        logger.info("Trained model on %d built-in samples", self.training_samples)

    def preprocess(self, text: str) -> str:
        """
        Clean and normalize input text before prediction.

        Steps:
          - Lowercase
          - Remove URLs
          - Remove special characters (keep letters, numbers, spaces)
          - Collapse whitespace
        """
        text = text.lower().strip()
        text = re.sub(r"https?://\S+|www\.\S+", "", text)
        text = re.sub(r"[^a-zA-Z0-9\s]", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        return text

    def predict(self, text: str) -> Dict[str, object]:
        """
        Run sentiment prediction on the input text.

        Returns dict with 'sentiment' label and 'confidence' score.
        """
        processed = self.preprocess(text)
        prediction = self.model.predict([processed])[0]
        probabilities = self.model.predict_proba([processed])[0]
        confidence = float(np.max(probabilities))

        return {
            "sentiment": prediction,
            "confidence": round(confidence, 4),
        }

    def predict_batch(self, texts: List[str]) -> List[Dict[str, object]]:
        """Run sentiment prediction on multiple texts."""
        processed = [self.preprocess(t) for t in texts]
        predictions = self.model.predict(processed)
        probabilities = self.model.predict_proba(processed)

        return [
            {
                "sentiment": pred,
                "confidence": round(float(np.max(prob)), 4),
            }
            for pred, prob in zip(predictions, probabilities)
        ]

    def get_info(self) -> Dict[str, object]:
        """Return model metadata."""
        return {
            "model_type": "TF-IDF + Logistic Regression",
            "version": self.model_version,
            "labels": self.labels,
            "training_samples": self.training_samples,
            "is_loaded": self.is_loaded,
            "features": self.model.named_steps["tfidf"].max_features
            if self.is_loaded else None,
        }

    def save(self, path: str) -> None:
        """Save the trained model pipeline to disk."""
        joblib.dump(self.model, path)
        logger.info("Model saved to %s", path)
