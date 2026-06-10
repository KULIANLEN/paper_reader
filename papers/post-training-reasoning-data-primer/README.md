# Build Notes: arXiv 2606.02113

Build directory: `/home/kulianlen/paper_reader/.paper-build/agent-2606-02113`

## Paper

- Title: A Primer in Post-Training Reasoning Data: What We Know About How It Works
- Authors: Yaoming Li, Guangxiang Zhao, Qilong Shi, Lin Sun, Xiangzheng Zhang, Tong Yang
- arXiv: 2606.02113v1
- Published: 2026-06-01
- PDF pages: 22
- Project repository: https://github.com/RenBing-Sumeru/Awesome-LLM-Reasoning-Data

## Extraction

`arxiv_prepare.py` downloaded metadata and the PDF, extracted text with PyMuPDF, rendered all 22 pages, and extracted 18 embedded images.

Generated extraction artifacts:

- `metadata.json`, `metadata.md`
- `paper.pdf`
- `paper_text.md`
- `assets_manifest.json`
- `extraction_report.md`
- `assets/pages/page_001.png` through `assets/pages/page_022.png`
- `assets/figures/...`

## Figure Map Used By `index.html`

- `assets/figures/page_003_img_01.png`: Figure 1, beyond prompt-response pairs.
- `assets/figures/page_003_img_02.png`: Figure 2, verifier-anchored taxonomy.
- `assets/figures/page_003_img_03.png`: Figure 3, where supervision enters the trajectory.
- `assets/figures/page_004_img_01.png`: Figure 4, quality support matrix.
- `assets/figures/page_004_img_02.png`: Figure 5, common quality traps.
- `assets/figures/page_006_img_01.png`: Figure 6, verifier families and failure surfaces.
- `assets/figures/page_007_img_01.png`: Figure 7, asymptote-efficiency decomposition.
- `assets/figures/page_008_img_01.png`: Figure 8, small-pool versus large-pool coverage.
- `assets/figures/page_018_img_01.png`: Figure A1, cross-cutting axes.
- `assets/figures/page_019_img_01.png`: Figure A2, construction stack.
- `assets/figures/page_020_img_01.png`: Figure A3, trace authorship.
- `assets/figures/page_020_img_02.png`: Figure A4, self-play relocates curation.
- `assets/figures/page_020_img_03.png`: Figure A5, ceiling versus efficiency.
- `assets/figures/page_020_img_04.png`: Figure A6, release timeline as scaling object.

## Tables Recreated In HTML

- Table 1: counterintuitive lessons for reasoning-data attribution.
- Table 2: construction as an attribution ledger.
- Table 3: scaling attribution ledger.
- Table A1: inclusion lens for the primer.
- Table A3: agent trajectory audit fields.

Table A2 and Table A4 are long bibliographic/source-placement tables. The page summarizes their purpose and preserves the source-placement logic, but does not reproduce every citation row.

## Limitations

- This paper is a survey/primer, not an empirical training paper. It does not provide a single reproducible training recipe, baseline matrix, hyperparameter table, or new benchmark score.
- The authors state that the synthesis is question-driven rather than a formal meta-analysis.
- Closed pipelines, proprietary data mixtures, undocumented release practices, verifier versions, compute budgets, inference budgets, and contamination audits are often unavailable in the surveyed public evidence.
- Extracted page/table text was manually checked against the PDF text where used, but the page should still be treated as a reading artifact rather than an official reproduction of the paper.
