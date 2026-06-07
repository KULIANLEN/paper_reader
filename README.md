# Paper Reading Atlas

这是一个用于 GitHub Pages 的静态论文阅读站点骨架。它的设计目标是：

- 首页采用“模块分页式”结构，不把所有内容堆在一个超长滚动页里；
- 每篇论文是一个独立 HTML 页面，放在 `papers/<slug>/index.html`；
- `data/papers.json` 是唯一的数据入口，后续自动化流程只需要追加或更新这里；
- 不依赖构建工具，不依赖数据库，可以直接部署到 GitHub Pages。

## 推荐目录结构

```text
.
├── index.html
├── .nojekyll
├── assets/
│   ├── css/styles.css
│   └── js/app.js
├── data/
│   ├── papers.json
│   ├── paper.schema.json
│   └── site.json
├── papers/
│   └── <slug>/index.html
├── templates/
│   └── paper-page-template.html
└── tools/
    └── upsert_paper_manifest.py
```

## 首页模块分页设计

当前首页被拆成 6 个模块页：

- `总览`：只放站点说明、统计卡片、最近更新和快捷入口；
- `论文库`：搜索、筛选、排序和论文卡片，卡片区每页显示 6 篇；
- `分类`：按 `category` 自动聚合论文，适合查看研究方向结构；
- `标签`：按 `tags` 自动聚合论文，适合围绕方法、任务、数据集、训练范式检索；
- `索引`：按英文标题首字母生成 A-Z 索引；
- `同步`：展示后续 Codex Skill / GitHub Pages 自动同步约定。

URL 会保存当前模块、页码和筛选条件，例如：

```text
/?category=Agents+%26+Tool+Use&page=2#library
```

## 本地预览

不要直接双击 `index.html`，因为浏览器在 `file://` 下通常不允许读取 `data/papers.json`。建议在仓库根目录运行：

```bash
python -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```

## 新增一篇论文

推荐每篇论文放在：

```text
papers/<slug>/index.html
```

然后向 `data/papers.json` 的 `papers` 数组追加：

```json
{
  "id": "2501-xxxxx",
  "slug": "paper-short-name",
  "title": "Paper English Title",
  "title_zh": "论文中文标题",
  "authors": ["Author A", "Author B"],
  "year": 2026,
  "venue": "arXiv",
  "arxiv": "2501.xxxxx",
  "html": "papers/paper-short-name/index.html",
  "pdf": "https://arxiv.org/pdf/2501.xxxxx",
  "repo": "",
  "category": "Agents & Tool Use",
  "tags": ["Agent", "Reasoning", "Tool Use"],
  "status": "已精读",
  "difficulty": "中高",
  "read_time": "45 min",
  "created_at": "2026-06-07",
  "updated_at": "2026-06-07",
  "summary": "一句话说明这篇论文解决什么问题、核心方法是什么、为什么值得读。",
  "insights": ["对自己项目最有用的一点", "值得复现或做 ablation 的一点"]
}
```

## 使用脚本追加或更新论文记录

准备一个单篇论文 JSON，例如 `new_paper.json`，然后运行：

```bash
python tools/upsert_paper_manifest.py --record new_paper.json --manifest data/papers.json
```

脚本会根据 `id` 或 `slug` 更新已有记录，否则追加新记录。

## GitHub Pages 部署建议

最简单的方式：

1. 创建一个仓库，例如 `paper-reading-atlas`；
2. 把这些文件放到仓库根目录；
3. Settings → Pages；
4. Source 选择 `Deploy from a branch`；
5. Branch 选择 `main`，目录选择 `/root`；
6. 访问 GitHub Pages 地址。

如果你用的是 `username.github.io` 这种用户主页仓库，也可以直接放在根目录。所有链接都使用相对路径，因此也适合项目页面。

## 后续自动化对接思路

现阶段不需要修改 Skill。后续 Skill 只需要在完成论文阅读页生成后额外做三件事：

1. 将生成的 `index.html` 写入 `papers/<slug>/index.html`；
2. 根据论文 metadata 生成一条 JSON 记录；
3. 调用 `tools/upsert_paper_manifest.py` 更新 `data/papers.json`，再由 Git 同步到 GitHub Pages。

## 模块分页版首页

首页已经改为模块切换结构：`#overview`、`#library`、`#categories`、`#tags`、`#index`、`#workflow`。论文库内部支持分页，默认每页展示 6 篇；后续自动化追加论文时仍只需要维护 `papers/<slug>/index.html` 和 `data/papers.json`，不需要手动修改首页。
