# Harness Updating Is Not Harness Benefit build notes

- arXiv ID: 2605.30621
- Slug: `harness-updating-not-harness-benefit`
- Mode: read-only Paper Atlas page build
- Build directory: `.paper-build/agent-2605-30621`
- Generated page: `index.html`
- Record: `paper.record.json`

## Extraction

The paper was downloaded with the skill helper:

```bash
python /home/kulianlen/.codex/skills/arxiv-paper-html-reader/scripts/arxiv_prepare.py --input https://arxiv.org/abs/2605.30621 --out .paper-build/agent-2605-30621 --render-pages
```

Extraction status:

- PDF text extraction: OK
- Pages: 24
- Extracted embedded image objects: 33
- Rendered page images: 24

## Included assets

The PDF embedded images were split into many small low-level image objects, so the reading page uses page-render crops under `assets/crops/` for figure/table navigation. Key numeric results were manually reconstructed in HTML tables from the extracted text and page renders.

Key crops:

- `assets/crops/figure-1-overview.png`
- `assets/crops/figure-2-findings.png`
- `assets/crops/figure-3-update-capability.png`
- `assets/crops/figure-4-case-study.png`
- `assets/crops/figure-5-mcp-post-evolution.png`
- `assets/crops/figure-6-swe-benefit.png`
- `assets/crops/figure-7-failure-modes.png`
- `assets/crops/figure-9-benefit-mcp-sb.png`
- `assets/crops/table-1-benefit.png`
- `assets/crops/table-2-slr-hfr-lpr.png`
- `assets/crops/table-3-adherence.png`
- `assets/crops/table-4-dataset-stats.png`
- `assets/crops/table-7-agent-matrix.png`

## Limitations

- Figure/table crops are raster crops from rendered PDF pages, not original vector assets.
- Some crops include adjacent caption or page text because the source PDF layout is dense.
- The arXiv metadata comment says "24 pages, 9 figures, 12 tables", while extracted text contains prompt-template tables numbered through Table 14. The HTML focuses on the core paper figures/tables needed for interpretation and reproduction.
- Exact reproduction needs the public code repository plus model API snapshots, task order, evolution budget, MCP service state, and benchmark runner settings.
