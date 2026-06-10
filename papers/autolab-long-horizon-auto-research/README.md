# AUTOLAB paper build

- Input: `https://arxiv.org/abs/2606.05080`
- arXiv ID: `2606.05080v1`
- Title: `AutoLab: Can Frontier Models Solve Long-Horizon Auto Research and Engineering Tasks?`
- Build mode: read-only Paper Atlas-compatible page build
- Build directory: `/home/kulianlen/paper_reader/.paper-build/agent-2606-05080`
- Slug: `autolab-long-horizon-auto-research`

## Generated files

- `index.html`: Chinese deep-reading Paper Atlas page with stable sections.
- `paper.record.json`: standalone Paper Atlas record object.
- `README.md`: extraction and validation notes.
- `assets/pages/page_001.png` ... `page_028.png`: rendered PDF pages from PyMuPDF.
- `assets/figures/*`: raw embedded images extracted by PyMuPDF.
- `assets/crops/*`: manually selected page crops for key figures/tables.
- Helper artifacts retained for audit: `metadata.json`, `metadata.md`, `paper.pdf`, `paper_text.md`, `assets_manifest.json`, `extraction_report.md`.

## Included key figures and tables

- Figure 1: AUTOLAB leaderboard and four category rose charts.
- Figure 2: task formulation and evaluation pipeline.
- Figure 3: task distribution across 36 tasks.
- Figure 4: `flash_attention` optimization trajectory case study.
- Figure 5: cost/resource utilization analysis.
- Figure 6: zero-score rollout failure mode distribution.
- Figures 7-8: harness ablation and score-cost trade-off.
- Figure 9: provider generation deltas.
- Table 1: main benchmark results.
- Tables 2-4: scoring anchors and gates.
- Table 5: model organizations and API providers.
- Table 8: across-trial stability metrics.

## Extraction notes

Text extraction succeeded for all 28 pages and Appendix sections A-C were inspected. Figures and tables are included as rendered PDF page crops, not original vector assets. Key numerical results from Table 1 were also recreated as HTML for readability. Some fine-grained per-task Table 6/7 values are summarized rather than fully recreated because the PDF tables are very wide; the page cites their role and includes the relevant result interpretation.

## Validation

Validation commands run successfully on 2026-06-10:

```bash
python /home/kulianlen/.codex/skills/arxiv-paper-html-reader/scripts/validate_html.py /home/kulianlen/paper_reader/.paper-build/agent-2606-05080/index.html --site-page
python -m json.tool /home/kulianlen/paper_reader/.paper-build/agent-2606-05080/paper.record.json
```

Additional checks:

- `index.html` contains all stable section IDs: `#overview`, `#motivation`, `#method`, `#experiments`, `#results`, `#figures`, `#reproduction`, `#critique`, `#takeaways`.
- All 13 local `<img>` references resolve to files under `assets/crops/`.
- Shared Paper Atlas references resolve from the build location: `../../assets/favicon.svg` and `../../assets/css/styles.css`.
