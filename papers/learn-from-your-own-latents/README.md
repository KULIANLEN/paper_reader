# arXiv 2605.27734 build notes

- Build directory: `/home/kulianlen/paper_reader/.paper-build/agent-2605-27734`
- Slug used in record: `learn-from-your-own-latents`
- Paper: `Learn from your own latents and not from tokens: A sample-complexity theory`
- Authors: Daniel J. Korchinski, Alessandro Favero, Matthieu Wyart
- arXiv: `2605.27734v1`
- Date read: `2026-06-10`

## Generated deliverables

- `index.html`: Paper Atlas-compatible Chinese deep-reading page with stable sections.
- `paper.record.json`: single homepage-record object matching the Paper Atlas paper entry shape.
- `assets/crops/*.png`: manual crops from rendered PDF pages for Algorithm 1, Figures 1-14, and Table 1.

## Helper artifacts kept for audit

- `metadata.json`, `metadata.md`: arXiv API metadata.
- `paper.pdf`: downloaded PDF.
- `paper_text.md`: PyMuPDF text extraction.
- `assets/pages/page_001.png` through `page_028.png`: rendered PDF pages.
- `assets_manifest.json`, `extraction_report.md`: extraction report from the skill helper.

## Extraction notes

- PyMuPDF text extraction succeeded for all 28 pages.
- PyMuPDF did not extract standalone figure images because the paper figures appear to be vector-rendered in the PDF.
- Figure and table assets were therefore produced by manual crop coordinates from rendered page PNGs.
- Crops preserve the original visual evidence, but exact numeric values in plots should be checked against the PDF when used quantitatively.
- No official code URL was visible in the arXiv metadata/page during this build.

## Key included visual assets

- `algorithm-01-ilc.png`
- `figure-01-sample-complexity.png`
- `figure-02-ilc-graphical.png`
- `figure-03-ilc-slc-scaling.png`
- `figure-04-data2vec-rhm.png`
- `figure-05-data2vec-synonyms.png`
- `figure-06-ssl-architectures.png`
- `figure-07-slc-module.png`
- `figure-08-multiple-predictions.png`
- `figure-09-local-learning.png`
- `figure-10-layerwise-training.png`
- `figure-11-token-ssl-collapse-fail.png`
- `figure-12-depth-independent.png`
- `figure-13-data2vec-latent-traces.png`
- `figure-14-offline-data2vec.png`
- `table-01-data2vec-hyperparameters.png`
