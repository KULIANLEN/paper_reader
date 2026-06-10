# AutoScientists build notes

Build directory: `/home/kulianlen/paper_reader/.paper-build/agent-2605-28655`

Slug: `autoscientists-self-organizing-agent-teams`

Paper: **AutoScientists: Self-Organizing Agent Teams for Long-Running Scientific Experimentation**

Authors: Shanghua Gao, Ada Fang, Marinka Zitnik

arXiv ID: `2605.28655v1`

## Generated files

- `index.html`
- `paper.record.json`
- `README.md`
- `metadata.json`, `metadata.md`, `paper.pdf`, `paper_text.md`, `assets_manifest.json`, `extraction_report.md`
- `assets/pages/page_001.png` ... `assets/pages/page_039.png`
- `assets/figures/page_002_img_01.png`
- `assets/figures/page_005_img_01.png`
- `assets/figures/page_006_img_01.png`
- `assets/figures/page_009_img_01.png`
- `assets/figures/page_035_img_01.png`
- `assets/figures/page_036_img_01.png`

## Validation results

Command:

```bash
python /home/kulianlen/.codex/skills/arxiv-paper-html-reader/scripts/validate_html.py index.html --site-page
```

Result:

- All required validator checks passed: MathJax, Motivation, Method, Formula, Experiments, Results, Reviewer critique, Reproduction, Paper Atlas stylesheet, Back to homepage, stable overview section, stable takeaways section.
- `inline_math_count=62`
- `block_math_count=12`
- Warning: `需人工核对` appears intentionally for unreliable figure extraction notes.

JSON validation:

```bash
python -m json.tool paper.record.json
```

Result: valid JSON.

Image reference check:

- `image_refs 8`
- `missing []`

## Figure and table coverage

- Figure 1: covered with page-level screenshot `assets/pages/page_002.png`; full automatic figure crop was not reliable, marked `需人工核对`.
- Figure 2: covered with extracted image `assets/figures/page_005_img_01.png`.
- Figure 3: covered with extracted image `assets/figures/page_006_img_01.png`.
- Figure 4: covered with page-level screenshot `assets/pages/page_008.png`; separate crop was not reliable, marked `需人工核对`.
- Figure 5: covered with extracted image `assets/figures/page_009_img_01.png`.
- Figure S8: covered with extracted image `assets/figures/page_035_img_01.png`; the figure legend says `SciPex` while the caption/context describes AutoScientists, marked `需人工核对`.
- Figure S9: covered with extracted image `assets/figures/page_036_img_01.png`.
- Algorithms 1-3: covered with page-level screenshot `assets/pages/page_019.png` and textual explanation.
- Table 1, Table 2, Table 3, Table S2, Table S3, Table S4, Table S9: recreated or condensed as HTML tables in `index.html`.
- Table S6, Table S7, Table S8: summarized in text; full S7/S8 are too long for the page and were not fully reproduced.

## Extraction limitations

- PyMuPDF extracted text from all 39 pages and 6 embedded images, but not every figure was available as a clean standalone crop.
- Main text and appendix were inspected, including Appendix A, B, E, F, G.
- Exact reproduction still depends on the released AutoScientists code, Claude Code / Claude Sonnet 4.6 behavior, benchmark repo versions, hidden leaderboard/evaluator access, and H100 compute.
