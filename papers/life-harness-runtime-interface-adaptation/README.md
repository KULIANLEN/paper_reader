# Build Notes for arXiv 2605.22166

- Paper: **Adapting the Interface, Not the Model: Runtime Harness Adaptation for Deterministic LLM Agents**
- arXiv ID: `2605.22166v2`
- Build directory: `/home/kulianlen/paper_reader/.paper-build/agent-2605-22166`
- Intended slug: `life-harness-runtime-interface-adaptation`
- Mode: build-only. No files outside this directory were intentionally modified, and no publish/commit/push step was run.

## Source Extraction

The workspace was prepared with:

```bash
python /home/kulianlen/.codex/skills/arxiv-paper-html-reader/scripts/arxiv_prepare.py --input https://arxiv.org/abs/2605.22166 --out . --render-pages
```

Extraction summary:

- PDF pages: 18
- Text extraction: OK
- Rendered pages: `assets/pages/page_001.png` through `assets/pages/page_018.png`
- Raw extracted image count: 6
- Full text file: `paper_text.md`
- Appendix coverage: Appendix A, B, and C are included in the same 18-page PDF and were read.

## Figure and Table Coverage

Page-level crops were generated under `assets/figures/` because many paper figures/tables are PDF vector content rather than standalone embedded images.

- Figure 1: `figure-01-overview.png`; high-resolution extracted result inset also saved as `figure-01-result-distribution-extracted.png`.
- Figure 2: `figure-02-agent-runtime-vs-interface.png`.
- Figure 3: `figure-03-failure-diagnosis.png`.
- Figure 4: `figure-04-life-harness-framework.png`.
- Algorithm 1: `algorithm-01-life-harness-loop.png`.
- Table 1: `table-01-main-results.png`, with HTML table recreated in `index.html`.
- Figure 5: `figure-05-model-benchmark-heatmap.png`.
- Figure 6: `figure-06-evolution-dynamics.png`.
- Figure 7: `figure-07-prompt-evolving-comparison.png`.
- Table 2: `table-02-layer-ablation.png`, with HTML table recreated in `index.html`.
- Figure 8: `figure-08-training-vs-harness.png`.
- Table 3: `table-03-dataset-statistics.png`, with HTML table recreated in `index.html`.
- Table 4: `table-04-eval-config.png`, with HTML table recreated in `index.html`.
- Table 5: `table-05-tau-harness-inventory.png`; summarized in the reproduction section because the original table is dense.
- Table 6: `table-06-agentbench-alfworld-webshop-inventory.png`; summarized in the reproduction section.
- Table 7: `table-07-agentbench-os-dbbench-inventory.png`; summarized in the reproduction section.
- Table 8: `table-08-full-results.png`; referenced as full-results evidence and summarized in the results section.

## Limitations

- Raw PDF image extraction reported page metadata that did not reliably identify all figure placements. The page-render crops were therefore used as the grounded figure/table references.
- Long appendix Tables 5-8 contain very small text in the original PDF. They are included as original crops, but exact cell-level reading may require manual zoom or checking the PDF/source repository.
- The paper states code is available at `https://github.com/Tianshi-Xu/Life-Harness`, but the PDF itself does not include raw trajectory logs, every Codex iteration, hardware cost, or exact deployed model/API versions. Those details are marked as requiring manual or repository-level verification in `index.html`.
