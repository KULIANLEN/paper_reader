# Harness-1 build notes

- Paper: Harness-1: Reinforcement Learning for Search Agents with State-Externalizing Harnesses
- arXiv: 2606.02373v1
- Build mode: read-only page build mode
- Build date: 2026-06-10
- Build dir: `/home/kulianlen/paper_reader/.paper-build/agent-2606-02373`
- Slug: `agent-2606-02373`

## Generated files

- `index.html`: Paper Atlas-compatible Chinese deep-reading page.
- `paper.record.json`: single Paper Atlas paper record.
- `README.md`: this extraction and validation note.
- `assets/pages/page_001.png` to `assets/pages/page_063.png`: rendered PDF pages from `arxiv_prepare.py`.
- `assets/crops/*.png`: manually selected PDF page crops for key figures and tables.
- Helper outputs in this isolated build dir: `metadata.json`, `metadata.md`, `paper.pdf`, `paper_text.md`, `assets_manifest.json`, `extraction_report.md`.

No files were intentionally written to `papers/`, `data/papers.json`, the git index, or any publish target.

## Extraction

- Metadata and PDF were downloaded with `arxiv_prepare.py`.
- PyMuPDF extraction succeeded.
- Extracted text pages: 63.
- Rendered pages: 63.
- Automatically extracted embedded images: 12.
- Because many figures/tables are better represented in page renderings than in standalone image extraction, the page uses cropped page images under `assets/crops/`.

## Key figures and tables included

- Figure 1: average search performance across eight benchmarks.
- Figure 2: Harness-1 architecture and training pipeline.
- Table 2: search quality across benchmarks.
- Figure 3: source-family vs held-out transfer recall gains.
- Table 3: inference-time component ablation on BrowseComp+.
- Figure 4: training-data scale.
- Figure 5: RL training dynamics with and without tool-diversity reward.
- Table 5: reward hyperparameters.
- Table 6: SFT/RL/environment/retrieval/evaluation hyperparameters.
- Table 7: benchmark statistics.
- Figure 6: modular RAG answer accuracy.
- Figure 7: same GPT-5.4 under different harnesses.

## Validation

- `python /home/kulianlen/.codex/skills/arxiv-paper-html-reader/scripts/validate_html.py /home/kulianlen/paper_reader/.paper-build/agent-2606-02373/index.html --site-page`: passed.
- `python -m json.tool /home/kulianlen/paper_reader/.paper-build/agent-2606-02373/paper.record.json`: passed.
- Local HTML image reference check: passed, 12 image references found and all exist.
- Validator warning: `需人工核对` appears intentionally in the HTML to mark unverified external release/dependency details.

## Limitations

- GitHub repository content, model weights, external retrieval services, Tinker training environment, and Baseten-hosted reranker availability were not verified.
- HTML explanations are grounded in the extracted PDF text and page crops; any release-status claim is phrased as the paper's statement or explicitly marked for manual verification.
- PDF text extraction reordered some table text around Table 2, so the page includes both a recreated curated-recall table and the original table crop for audit.
