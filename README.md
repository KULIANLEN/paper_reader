# Paper Atlas · arXiv 论文阅读站

这是一个为 GitHub Pages 设计的静态论文阅读主页模板。它的核心目标是：

- 把每篇论文的深度阅读页面保存为 `papers/<slug>/index.html`。
- 把论文元信息写入 `data/papers.json`。
- 首页自动生成搜索、分类、标签云、论文名称索引和阅读状态统计。
- 后续可以让 Codex Skill 自动增量添加论文页面并更新 JSON。

## 目录结构

```text
.
├── index.html                     # 主页：论文库、分类、标签、索引
├── assets/
│   ├── css/styles.css             # 全站样式，主页和论文页共用
│   └── js/app.js                  # 读取 data/papers.json 并渲染主页
├── data/
│   ├── papers.json                # 论文索引数据，后续自动增量维护
│   └── papers.schema.json         # JSON 字段规范
├── papers/
│   └── _sample-paper/index.html   # 示例论文页，可删除
├── templates/
│   └── paper-page-template.html   # 后续 Skill 可参考的论文页模板
├── scripts/
│   └── add_paper.py               # 可选：命令行添加/更新论文索引
└── .nojekyll                      # 避免 GitHub Pages 的 Jekyll 处理静态文件
```

## 本地预览

由于主页使用 `fetch('data/papers.json')`，建议用本地 HTTP 服务预览，不要直接双击打开：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 添加一篇论文

最小流程：

1. 生成论文页：

```text
papers/<slug>/index.html
```

2. 更新 `data/papers.json`：

```json
{
  "id": "2501.00001",
  "slug": "short-paper-slug",
  "title": "Paper Title",
  "titleZh": "中文标题或一句话翻译",
  "authors": ["Author A", "Author B"],
  "year": 2026,
  "venue": "arXiv",
  "category": "Agent / RLVR",
  "tags": ["reasoning", "agent", "rlvr"],
  "status": "精读",
  "priority": 4,
  "readingDate": "2026-06-07",
  "updatedAt": "2026-06-07",
  "summary": "用 2-4 句话概括这篇论文解决的问题、核心方法和最重要结论。",
  "takeaways": ["关键 insight 1", "关键 insight 2"],
  "arxivId": "2501.00001",
  "paperUrl": "https://arxiv.org/abs/2501.00001",
  "pdfUrl": "https://arxiv.org/pdf/2501.00001",
  "pageUrl": "papers/short-paper-slug/index.html",
  "codeUrl": "",
  "repro": {
    "available": true,
    "level": "medium",
    "notes": "是否包含 dataset、hyperparameters、prompts、training details 等复现信息。"
  }
}
```

也可以使用脚本：

```bash
python scripts/add_paper.py \
  --id 2501.00001 \
  --title "Paper Title" \
  --title-zh "中文标题" \
  --authors "Author A, Author B" \
  --year 2026 \
  --category "Agent / RLVR" \
  --tag reasoning \
  --tag agent \
  --tag rlvr \
  --status 精读 \
  --priority 4 \
  --summary "2-4 句话总结论文。" \
  --arxiv-id 2501.00001 \
  --paper-url "https://arxiv.org/abs/2501.00001" \
  --pdf-url "https://arxiv.org/pdf/2501.00001" \
  --slug short-paper-slug \
  --repro \
  --repro-level medium
```

## 推荐分类

后续不必固定，但建议保持粒度稳定，例如：

- `Agent / Tool Use`
- `RLVR / Self-Evolution`
- `Reasoning`
- `Post-training / Alignment`
- `Evaluation / Benchmark`
- `Long Context / Memory`
- `Systems / Inference`
- `Multimodal`
- `Survey / Position`

## 推荐标签规范

建议使用英文短标签，便于搜索和跨论文聚合：

```text
agent, reasoning, rlvr, grpo, replay, diversity, tool-use, planning,
math-reasoning, benchmark, evaluation, long-context, kv-cache, moe,
mamba, linear-attention, multimodal, post-training, preference-optimization
```

## 部署到 GitHub Pages

把这个目录的内容放在仓库根目录，或者放在 `docs/` 目录。然后在 GitHub 仓库 Settings → Pages 中选择对应 branch 和目录。

如果后续使用 GitHub Actions 自动生成页面，可以把生成后的静态文件发布到 Pages。当前模板本身不需要构建步骤。

## 和后续 Codex Skill 的接口

未来 Skill 只需要做两件事：

1. 生成或更新 `papers/<slug>/index.html`。
2. 追加或更新 `data/papers.json` 中对应的 paper object。

主页会自动处理：

- 总论文数统计
- 分类计数
- 标签云计数
- 搜索
- 按状态筛选
- 按分类筛选
- 多标签交集筛选
- 论文名称索引
- 最近更新排序
