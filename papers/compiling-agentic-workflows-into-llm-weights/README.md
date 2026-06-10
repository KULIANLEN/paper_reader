# arXiv 2605.22502 build notes

Build directory: `/home/kulianlen/paper_reader/.paper-build/agent-2605-22502`

Generated files:

- `index.html`: Paper Atlas compatible Chinese reading page.
- `paper.record.json`: single-record object matching the `data/papers.json` paper contract.
- `assets/pages/page_001.png` ... `assets/pages/page_019.png`: rendered PDF pages.
- `assets/figures/*.png`: PDF page crops used by `index.html`.

Source:

- arXiv: `2605.22502`
- PDF: `https://arxiv.org/pdf/2605.22502.pdf`
- Title: `Compiling Agentic Workflows into LLM Weights: Near-Frontier Quality at Two Orders of Magnitude Less Cost`
- Authors: Simon Dennis, Rivaan Patil, Kevin Shabahang, Hao Guo

Extraction notes:

- Full PDF text extraction succeeded: 19 pages.
- Appendix was parsed and used: conversation examples, statistical details, GPT-4.1 judge replication, and procedure flowcharts.
- Automatic embedded-image extraction returned zero images, so all figures/tables referenced by the page are rendered PDF page crops.
- Key tables were also recreated as HTML tables from extracted text.
- Figure 2, Figure 3, and Figure 4 are dense flowchart page crops; node text and edge details are marked as requiring manual verification.
- The paper mentions full transcripts are available in a repository, but the PDF and arXiv metadata do not provide an explicit repository URL.

Figure/table coverage:

- Figure 1 architecture comparison: covered by `assets/figures/figure-1-architecture.png`.
- Tables 1-6: covered by HTML reconstructions and PDF crops.
- Table 10 GPT-4.1 judge replication: covered by HTML reconstruction and PDF crop.
- Figures 2-4 appendix flowcharts: covered by PDF crops with manual-check notes.
