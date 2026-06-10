# SkillOpt Paper Atlas Build

- Paper: SkillOpt: Executive Strategy for Self-Evolving Agent Skills
- arXiv ID: 2605.23904
- Version inspected: v2, submitted 2026-05-22, revised 2026-05-25
- Build directory: `/home/kulianlen/paper_reader/.paper-build/agent-2605-23904`
- Slug used in record: `skillopt-self-evolving-agent-skills`

## Generated Files

- `index.html`: Paper Atlas compatible Chinese reading page with MathJax and stable section IDs.
- `paper.record.json`: Single-record object matching the `data/papers.json` entry contract.
- `README.md`: Extraction and validation notes.
- `assets/pages/page_001.png` to `assets/pages/page_027.png`: rendered PDF pages from the downloaded paper.
- `assets/extracted/figure_1.png`, `figure_2.png`, `figure_3.png`, `figure_4.png`: figure crops used by the page.
- `assets/extracted/table_1.png`, `table_2_3.png`, `table_4.png`, `table_5_6.png`: table crops used by the page.

## Extraction Notes

The helper script downloaded `paper.pdf`, extracted `paper_text.md`, rendered all 27 PDF pages, and extracted two embedded image objects from page 2. Most figures and tables were not independently exposed as embedded PDF image objects, so the page uses PDF-rendered crops under `assets/extracted/`.

Figure/table coverage:

- Figure 1: covered by `assets/extracted/figure_1.png`; source page 2; crop boundary需人工核对.
- Figure 2: covered by `assets/extracted/figure_2.png`; source page 4.
- Figure 3: covered by `assets/extracted/figure_3.png`; source page 12.
- Figure 4: covered by `assets/extracted/figure_4.png`; source page 15.
- Table 1: covered by `assets/extracted/table_1.png`; core GPT-5.5 and harness numbers recreated in HTML; small subscripts in full screenshot需人工核对.
- Table 2 and Table 3: covered by `assets/extracted/table_2_3.png`; component ablation values recreated in HTML.
- Table 4: covered by `assets/extracted/table_4.png`; representative transfer rows recreated in HTML.
- Table 5 and Table 6: covered by `assets/extracted/table_5_6.png`; Table 6 values recreated in HTML.

## Limitations

- Full paper and Appendix A-C were inspected from `paper_text.md`; no separate supplementary PDF was found.
- The PDF text extraction is reliable for the main formulas, tables, algorithm, and appendix prompt contracts, but final numeric verification should compare against the original PDF for Table 1 small green/red subscripts.
- The page references shared site assets via `../../assets/...` as required for Paper Atlas site placement. From the build directory alone, those shared paths are expected to resolve only after publishing under `papers/<slug>/`.
- No files outside this build directory were modified, and no commit or push was performed.

## Validation Commands

Run from the repository root or build directory:

```bash
python /home/kulianlen/.codex/skills/arxiv-paper-html-reader/scripts/validate_html.py /home/kulianlen/paper_reader/.paper-build/agent-2605-23904/index.html --site-page
python -m json.tool /home/kulianlen/paper_reader/.paper-build/agent-2605-23904/paper.record.json
```
