# Build Notes: arXiv 2605.30785

- Mode: read-only Paper Atlas page build.
- Build directory: `/home/kulianlen/paper_reader/.paper-build/agent-2605-30785`
- Paper: `Learning Agent-Compatible Context Management for Long-Horizon Tasks`
- arXiv: `2605.30785v1`
- Source PDF: `https://arxiv.org/pdf/2605.30785.pdf`
- Generated page: `index.html`
- Record: `paper.record.json`

## Extraction

- Used `arxiv_prepare.py --render-pages`.
- PDF text extraction succeeded.
- PDF length: 24 pages.
- Rendered page images are in `assets/pages/`.
- Embedded image extraction produced only five small page-1 image elements, so the HTML uses page-render crops in `assets/crops/` for key figures and tables.

## Included Crops

- `assets/crops/figure1_overview.png`
- `assets/crops/table1_browsecomp_mean3.png`
- `assets/crops/figures2_3_outcomes_context.png`
- `assets/crops/table2_mcpwiki_mean3.png`
- `assets/crops/figure4_browsecomp_transfer.png`
- `assets/crops/table3_browsecomp_pass3.png`
- `assets/crops/figure5_mcpwiki_transfer.png`
- `assets/crops/table5_process_reward_ablation.png`
- `assets/crops/table6_mcpwiki_dimensions.png`

## Validation

- `validate_html.py index.html --site-page`: passed.
- `python -m json.tool paper.record.json`: passed.
- HTML image reference check: 9 image refs, all found.
- `papers/` and `data/` diff check: no changes.
- Git index check: no staged changes.

## Limitations

- Figures/tables are cropped from rendered PDF pages, not extracted from original vector sources.
- The author code/data URL is recorded from Appendix E, but this build did not clone or execute the repository.
- Claims about model versions, judge models, datasets, and prompts are grounded in the PDF text and appendix only.
