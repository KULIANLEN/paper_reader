# Paper Build Notes

Paper: `Scaling Laws for Agent Harnesses via Effective Feedback Compute`

arXiv: `2605.29682`

Build date: `2026-06-10`

Mode: read-only Paper Atlas page build. Nothing was installed into `papers/`, `data/papers.json`, the git index, or any remote.

## Files

- `index.html`: Paper Atlas-compatible Chinese deep-reading page.
- `paper.record.json`: homepage-index-compatible record for optional later publishing.
- `paper.pdf`: downloaded arXiv PDF.
- `paper_text.md`: extracted full text from the PDF.
- `metadata.json` / `metadata.md`: arXiv metadata from the helper script.
- `extraction_report.md`: helper extraction report.
- `assets/pages/page_001.png` ... `page_024.png`: rendered PDF pages.
- `assets/figures/figure-01-controlled-scaling.png` ... `figure-11-prospective.png`: local crops from rendered pages.

## Extraction Summary

- Metadata download: OK.
- PDF download: OK.
- Text extraction: OK.
- Rendered pages: 24 pages.
- Standalone figure extraction: 0 images from the helper, so figure assets were created by cropping rendered PDF pages.
- Appendix inspected: Appendix B-D were present and used for task details, EFC factor measurement, and harness details.

## Figure/Table Coverage

Included cropped visual assets for Figure 1 through Figure 11:

- Figure 1: controlled scaling comparison on synthetic tasks.
- Figure 2: matched-budget feedback-quality control.
- Figure 3: trace-time Estimated-EFC on held-out tasks.
- Figure 4: executable code tasks.
- Figure 5: harness factors and raw-to-EFC conversion.
- Figure 6: module ablations.
- Figure 7: task demand normalization.
- Figure 8: task-demand calibration on mixed held-out tasks.
- Figure 9: unseen task/harness/model/configuration splits.
- Figure 10: mixed real traces and slice-specific harness efficiency.
- Figure 11: prospective holdout prediction.

The PDF contains no standalone numbered tables. Key numerical comparisons were recreated as HTML tables in `index.html` from the paper text and figure captions.

## Limitations

- Figure crops are derived from page renders, not from original embedded vector figures. Crop boundaries were visually inspected but should be treated as derived assets.
- The PDF does not provide a code repository, exact prompts, budget sweep grid, random seeds, estimator training hyperparameters, or full task ID lists.
- The models named in the paper are taken from the PDF text. Exact API settings and decoding parameters were not specified.
- The page marks reproducibility as low because the conceptual framework is clear but exact numerical reproduction is under-specified.
