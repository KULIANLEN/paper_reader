# Build Notes: arXiv 2605.26099

- Build directory: `/home/kulianlen/paper_reader/.paper-build/agent-2605-26099`
- Slug: `language-models-need-sleep`
- Paper: `Do Language Models Need Sleep? Offline Recurrence for Improved Online Inference`
- Authors: Sangyun Lee, Sean McLeish, Tom Goldstein, Giulia Fanti
- arXiv ID: `2605.26099v3`
- Source URL: <https://arxiv.org/abs/2605.26099>

## Generated Files

- `index.html`: Paper Atlas compatible Chinese reading page.
- `paper.record.json`: single-entry record compatible with `data/papers.json`.
- `README.md`: this extraction/build note.
- `assets/pages/page_001.png` through `assets/pages/page_015.png`: rendered PDF pages from the helper.
- `assets/figures/figure-1-sleep-architecture.png` through `assets/figures/figure-6-throughput.png`: local crops used by the page.

## Extraction Summary

- `arxiv_prepare.py` downloaded metadata and `paper.pdf`, extracted `paper_text.md`, and rendered 15 PDF pages.
- Text extraction succeeded.
- No appendix section was found in the downloaded v3 PDF; page 12 starts Broader Impact, acknowledgements, and references.
- The paper contains 6 numbered figures and no numbered tables.
- Algorithm 1 was recreated in readable HTML text.

## Figure and Table Coverage

- Figure 1: included as `assets/figures/figure-1-sleep-architecture.png`.
- Figure 2: included as `assets/figures/figure-2-cellular-automaton.png`.
- Figure 3: included as `assets/figures/figure-3-depo.png`.
- Figure 4: included as `assets/figures/figure-4-gsm-infinite.png`.
- Figure 5: included as `assets/figures/figure-5-sliding-window.png`.
- Figure 6: included as `assets/figures/figure-6-throughput.png`.
- Formal numbered tables: none in the paper. The page recreates experiment matrix and key result tables from the paper text and figure annotations.

## Limitations

- Automatic embedded-image extraction only produced `assets/figures/page_006_img_01.jpeg`, which is too small to use as a reliable standalone figure. The page instead uses crops from rendered PDF pages.
- Fine-grained curve values not explicitly stated in the text are not asserted as exact numbers. These need manual digitization or author code/data for exact CSV-level reproduction.
- No public code URL was found in the metadata or PDF text.
