# Histopathologic Cancer Detection

**Binary image classification to detect metastatic tumor tissue in histopathologic image patches using convolutional neural networks.**

---

## Project Overview

This project addresses the [Kaggle Histopathologic Cancer Detection](https://www.kaggle.com/competitions/histopathologic-cancer-detection) challenge, where the objective is to identify metastatic cancer in small 96x96 pixel patches extracted from larger digital pathology scans. Accurate automated detection of metastatic tissue is a critical step toward scalable cancer diagnostics, and this competition provides a rigorous benchmark for evaluating image classification approaches on medical imaging data.

A custom CNN architecture was designed and systematically tuned through a structured hyperparameter search. Rather than relying on pretrained models, this project explores the impact of pooling strategies (AveragePooling vs. MaxPooling), regularization strength (L2), and dropout rates on classification performance. An ensemble approach using multiple random seeds was also investigated to improve prediction stability.

The final model achieves 84.8% validation accuracy with a carefully balanced architecture that prioritizes generalization over training set memorization -- a critical consideration in medical imaging where overfitting to artifacts is a known risk.

## Dataset

| Property | Value |
|---|---|
| Source | Kaggle Competition (PatchCamelyon variant) |
| Total Labeled Images | 220,025 |
| Non-Tumor (Negative) | 130,908 (59.5%) |
| Tumor (Positive) | 89,117 (40.5%) |
| Image Dimensions | 96 x 96 pixels, RGB |
| Label Criteria | Tumor tissue present in center 32x32 region |

## Methodology

### Architecture

The CNN follows a progressive filter-expansion design with regularization at every stage:

```
Input (96x96x3)
  -> Conv2D(32) + BatchNorm + AveragePooling + Dropout
  -> Conv2D(64) + BatchNorm + AveragePooling + Dropout
  -> Conv2D(128) + BatchNorm + AveragePooling + Dropout
  -> Flatten -> Dense -> Output (sigmoid)
```

### Hyperparameter Search

| Parameter | Values Tested | Best |
|---|---|---|
| Pooling Type | AveragePooling, MaxPooling | **AveragePooling** |
| L2 Regularization | 0.001, 0.0001, 0.00001 | **0.0001** |
| Dropout Rate | 0.3, 0.5, 0.7 | **0.5** |
| Ensemble Seeds | 3 random seeds | Attempted |

**Key finding:** AveragePooling consistently outperformed MaxPooling, likely because averaging preserves more spatial information across the subtle textural patterns that differentiate tumor from healthy tissue.

### Training Pipeline

1. **Data Augmentation** -- ImageDataGenerator with rotation, flipping, and zoom
2. **Training** -- Adam optimizer with learning rate scheduling
3. **Evaluation** -- AUC-ROC as primary metric (competition standard)
4. **Ensemble** -- Averaged predictions from 3 independently seeded models

## Results

| Configuration | Val Accuracy | Kaggle Public | Kaggle Private |
|---|---|---|---|
| MaxPooling baseline | -- | -- | -- |
| **AveragePooling + L2(0.0001) + Dropout(0.5)** | **84.8%** | **0.7961** | **0.7494** |
| Ensemble (3 seeds) | -- | -- | -- |

| Metric | Score |
|---|---|
| Best Validation Accuracy | 84.8% |
| Kaggle Public Leaderboard | 0.7961 |
| Kaggle Private Leaderboard | 0.7494 |

## Key Visualizations

- **Training and Validation Curves** -- Loss and accuracy over epochs showing convergence and overfitting diagnostics
- **Hyperparameter Comparison Plots** -- Performance across pooling types, L2 values, and dropout rates
- **Sample Predictions** -- Correctly and incorrectly classified image patches with labels
- **Class Distribution** -- Dataset balance visualization

## Tech Stack

| Category | Tools |
|---|---|
| Language | Python |
| Deep Learning | TensorFlow, Keras |
| Data Augmentation | ImageDataGenerator |
| Data Processing | NumPy, Pandas |
| Visualization | Matplotlib |

## How to Run

```bash
# Clone the repository
git clone https://github.com/RyanOrdonez/HistopathologicCancerDetection.git
cd HistopathologicCancerDetection

# Install dependencies
pip install tensorflow numpy pandas matplotlib

# Download the dataset from Kaggle
kaggle competitions download -c histopathologic-cancer-detection
unzip histopathologic-cancer-detection.zip -d data/

# Run the notebook
jupyter notebook
```

> **Note:** Training on the full 220K image dataset requires a GPU. A Kaggle notebook environment or Google Colab with GPU runtime is recommended.

## Author

Ryan Ordonez -- MS in Data Science, University of Colorado Boulder
