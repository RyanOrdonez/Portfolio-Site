# Photo-to-Monet Style Transfer with GANs

**Generating Monet-style paintings from photographs using three generative adversarial network approaches: DCGAN, Neural Style Transfer, and CycleGAN.**

---

## Project Overview

This project explores the task of transforming ordinary photographs into paintings that resemble the style of Claude Monet, developed as part of the [Kaggle "I'm Something of a Painter Myself"](https://www.kaggle.com/competitions/gan-getting-started) competition. The challenge requires generating 7,038 Monet-style images from photographs using generative models, scored by Memorization-informed Frechet Inception Distance (MiFID) -- a metric that penalizes both low-quality outputs and memorization of training examples.

Three distinct generative approaches were implemented and compared, each representing a different paradigm in image generation. Neural Style Transfer, which optimizes individual images to match the style statistics of Monet paintings, achieved the best competition score (MiFID 53.14, ranking 20th). CycleGAN, which learns bidirectional mappings between the photo and Monet domains using unpaired data, placed 54th with a MiFID of 71.34. The baseline DCGAN, which generates images from random noise without conditioning on input photographs, served as a lower-bound reference.

This project provides a practical comparison of generative model architectures on a creative AI task, with insights into the tradeoffs between optimization-based and learning-based style transfer.

## Dataset

| Property | Value |
|---|---|
| Source | Kaggle Competition Dataset |
| Photographs | 7,038 images |
| Monet Paintings | 300 images |
| Image Dimensions | 256 x 256 pixels |
| Pairing | Unpaired (no photo-to-painting correspondences) |

## Methodology

### Approach 1: DCGAN (Baseline)

- Standard deep convolutional GAN generating images from random latent vectors
- Does not condition on input photographs
- Serves as a baseline for unconditional generation quality

### Approach 2: Neural Style Transfer

- Optimization-based method that iteratively updates a content image to match the style statistics of Monet paintings
- Uses a pretrained VGG network to extract content and style feature representations
- Balances content preservation and style matching through weighted loss functions
- Applied per-image, producing high-fidelity stylizations

### Approach 3: CycleGAN

- Learns bidirectional mappings: Photo-to-Monet and Monet-to-Photo
- Cycle-consistency loss ensures that translating an image to the other domain and back recovers the original
- Trains on unpaired data, making it suitable for this dataset where no ground-truth pairings exist
- Produces consistent style transfer across the full dataset in a single forward pass

## Results

| Approach | MiFID Score | Kaggle Rank | Notes |
|---|---|---|---|
| **Neural Style Transfer** | **53.14** | **20th** | Best score; per-image optimization |
| CycleGAN | 71.34 | 54th | Learned mapping; faster at inference |
| DCGAN | 312.97 | 122nd | Baseline; unconditional generation |

Lower MiFID indicates better performance. Neural Style Transfer's per-image optimization approach produced the highest-quality Monet stylizations, though at significantly higher computational cost compared to the single-pass CycleGAN.

## Key Visualizations

- **Generated Samples** -- Side-by-side comparisons of original photos and Monet-style outputs for each approach
- **Training Progression** -- Generator and discriminator loss curves for DCGAN and CycleGAN
- **Style Transfer Iterations** -- Progressive refinement of style transfer outputs over optimization steps
- **Quality Comparison Grid** -- Best and worst outputs from each method for qualitative evaluation

## Tech Stack

| Category | Tools |
|---|---|
| Language | Python |
| Deep Learning | TensorFlow, Keras |
| GAN Architectures | DCGAN, CycleGAN |
| Style Transfer | VGG-based Neural Style Transfer |
| Data Processing | NumPy, Pandas |
| Visualization | Matplotlib |
| Environment | Kaggle Notebooks (GPU) |

## How to Run

```bash
# Clone the repository
git clone https://github.com/<username>/MonetPaintings.git
cd MonetPaintings

# Install dependencies
pip install tensorflow numpy pandas matplotlib

# Download the dataset from Kaggle
kaggle competitions download -c gan-getting-started
unzip gan-getting-started.zip -d data/

# Run the notebooks
jupyter notebook
```

> **Note:** GAN training and Neural Style Transfer optimization require a GPU. Kaggle Notebooks or Google Colab with GPU runtime is recommended.

## Author

**Ryan** -- Data Science Portfolio Project
