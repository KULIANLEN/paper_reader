# LEAP paper build notes

- Paper: LEAP: Supercharging LLMs for Formal Mathematics with Agentic Frameworks
- arXiv: 2606.03303v2
- Build directory: `.paper-build/agent-2606-03303`
- Slug used in `paper.record.json`: `leap-agentic-formal-mathematics`
- Mode: read-only Paper Atlas page build. No files were intentionally written to `papers/`, `data/papers.json`, git index, or remote.

## Extraction

- Metadata source: arXiv API.
- PDF source: `https://arxiv.org/pdf/2606.03303.pdf`.
- PDF parsing: PyMuPDF via the skill helper extraction function.
- Parsed pages: 24.
- Extracted embedded images: 23.
- Rendered page images: `assets/pages/page_001.png` through `assets/pages/page_024.png`.
- Figure crops created:
  - `assets/crops/figure_1_leap_workflow.png`
  - `assets/crops/figure_2_putnam_a6_dag.png`
  - `assets/crops/figure_3_unproductive_decomposition.png`

## Included in `index.html`

- Stable Paper Atlas sections: `#overview`, `#motivation`, `#method`, `#experiments`, `#results`, `#figures`, `#reproduction`, `#critique`, `#takeaways`.
- Recreated HTML tables for Tables 1-6.
- Local cropped images for Figures 1-3.
- Appendix notes covering the Knuth directed Cayley graph subproblem, Erdős Problem 457, and proof-context artifacts.
- Reviewer critique and research takeaways for agent, RLVR, replay, diversity, evaluation, and questioner-solver style workflows.

## Limitations

- PDF text extraction preserved content well enough for reading, but table layout had to be reconstructed manually from text and page screenshots.
- The paper does not fully disclose prompts, decoding parameters, exact hardware, LEAP timeout budget, reviewer prompt, or branch-priority policy.
- Research-level case studies are summarized from the paper; the Knuth result is a verified key subproblem rather than a complete formalization of the full open problem.
- The main text describes Erdős Problem 457 as a triangle-free graph density problem, while Appendix B's Lean statement is a prime-divisibility condition. The page follows Appendix B for reproducibility because it contains the formal statement.

## Validation

Validation commands run:

```bash
python /home/kulianlen/.codex/skills/arxiv-paper-html-reader/scripts/validate_html.py .paper-build/agent-2606-03303/index.html --site-page
python -m json.tool .paper-build/agent-2606-03303/paper.record.json >/tmp/agent-2606-03303-record.json
```

Results:

- HTML validation: passed all required Paper Atlas site-page checks.
- MathJax counts: 17 inline math spans, 3 block math spans.
- JSON validation: passed.
