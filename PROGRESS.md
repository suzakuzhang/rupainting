# 入画 / Into the Painting — 进度状态

> 本文件是跨会话续接的总入口。任何新会话开始时先读它。
> 最后更新：2026-04-28

---

## 项目定位

第三个"符号解释系统"service（前两个：tarot, zhouyi）。
**核心命题**：从"神谕式接口"到"导览式接口"的转向。
**底座**：何慕文《如何读中国画》方法论 + 八大山人册页作为初始画库。
**底线**：不预言、不算命、不替观看者下情绪判断。所有解读必须落到画面证据。

详细愿景见：`docs/methodology.md`
跨会话研究 arc 记忆：`~/.claude/projects/-home-shumin-projects/memory/project_symbolic_systems_arc.md`

---

## 技术栈

- Next.js 14 + React 18 + TypeScript（沿用 zhouyi 架构）
- DeepSeek（主解读）+ Gemini（导览者多轮对话）
- 鉴权层从 zhouyi 移植（session token + 邀请码）
- 部署：render.yaml（节点环境）

源参考：
- `/home/shumin/projects/tarot_local_test/` — Python/Flask 版兄弟项目
- `/home/shumin/projects/zhouyi/` — Next.js 版兄弟项目（直接克隆改造）

---

## 资产清单（断点续存）

### 已完成产物
| 产物 | 路径 | 状态 |
|---|---|---|
| 方法论文档 v1 | `docs/methodology.md` | ✅ 完成（含 36 镜头、七层结构、四模式、术语小词典、文人画 vs 宫廷画对比） |
| 八大山人画库 metadata | `data/paintings_data.json` | ✅ 14 幅详细 + 11 幅骨架 |
| 八大山人图版 | `public/paintings/bada/raw/page-NNN-NNN.jpg` | ✅ 50 张 300dpi JPEG |
| 源 PDF | `/home/shumin/projects/symbolic system/arts symbiotic system/` | ✅ 何慕文 188p + 八大 51p |

### 进行中
（无 — MVP 端到端已通）

### 已完成的产物（更新于 MVP v0.1）
| 产物 | 路径 | 状态 |
|---|---|---|
| 项目骨架 | `/home/shumin/projects/rupainting/` | ✅ Next.js 14 + React 18 + TS，build 通过 18 个路由 |
| 入画 system prompt | `src/lib/llm/prompts.ts` | ✅ 七层 + 四模式 + 方法论嵌入 + 边界规则 |
| 画廊页面 | `src/app/gallery/page.tsx` | ✅ 列表 + 搜索 + 主题筛选 |
| 画作详情页 | `src/app/painting/[id]/page.tsx` | ✅ 图 + 模式选择 + 问题输入 + 解读面板 + 导览者对话 |
| InterpretationPanel | `src/components/InterpretationPanel.tsx` | ✅ 七层渲染 / 漫游三段 / 笔记 Markdown |
| ModeSelector | `src/components/ModeSelector.tsx` | ✅ 四模式选择 |
| 导览者多轮对话 | `src/lib/spirit/*` + `src/components/SpiritPanel.tsx` | ✅ 改造自 zhouyi 卦灵，扮演"画中旁观者/古代文人观画者" |
| 鉴权层 | `src/lib/access/session.ts` + admin pages | ✅ 沿用 zhouyi，hexagramName → subjectName |
| 研究记录 | `src/lib/research/store.ts` | ✅ ResearchInterpretationRecord，记录 paintingId/mode/prompt/result |
| API: paintings | `src/app/api/paintings/route.ts` + `[id]/route.ts` | ✅ 列表 + 搜索 + 详情 |
| API: interpret | `src/app/api/interpret/route.ts` | ✅ 接收 paintingId+mode+question，返回 JSON |
| API: spirit | `src/app/api/spirit/{start,chat,end}/route.ts` | ✅ 改造为 viewId+paintingId 上下文 |

### 部署待办（启动前）
- 在 Render（或本地 .env）配置 `DEEPSEEK_API_KEY`、`GEMINI_API_KEY`、`PILOT_ADMIN_CODE`、`PILOT_ADMIN_BIRTH_DATE`
- 当前 `npx next dev -p 10010` 起来后 / /gallery /painting/bada-001 /api/paintings 全部 200 OK；接口在无 key 时优雅返回 502

### v2 待完成
| 任务 | 优先级 |
|---|---|
| 11 个骨架画作 → 详细描述（`paintings_data.json` 中 `skeleton_paintings_to_add_later`） | 中 |
| 多模态识图（用户上传画作） | 低 |
| 学怎么看 / 画中漫游 独立入口（首页已有 placeholder） | 中 |
| 画面局部 zoom + 题跋/印章高亮（v1 只是普通 img 标签） | 中 |
| 何慕文 PDF 中其他 35 幅画作（不在八大山人画库内的）选择性引入 | 低 |

---

## 关键设计决策

1. **栈选 Next.js**（不是 Flask）— 画作 zoom、题跋局部高亮、漫游模式视觉路径标注 React 更友好。
2. **MVP 不做多模态识图**——内置画库 + 用户文字描述。多模态留 v2。
3. **画库初始来源 = 八大山人册页**——一个画家的完整谱系比跨画家精选更聚合。
4. **方法论与画库分离**——`methodology.md` 是 system prompt 灵魂，`paintings_data.json` 是 user prompt 锚点。
5. **七层输出固定**——第一眼/观看路线/笔墨与空间/题跋印章/象征语境/情绪/继续追问。每次解读都按这个骨架。
6. **四种模式**：初见 / 深读 / 画中漫游 / 研究笔记。

---

## 何时回到 Hearn PDF

只在以下情况回去再读：
- 需要补充某个特定主题（例如"避世玄想"章节具体怎么展开）
- 需要确认某个史料断点
- 需要给"研究笔记"模式的 system prompt 增加权威表述

否则不必再读——`docs/methodology.md` 已经把核心方法论提炼出来。

---

## 下一步行动

1. rsync zhouyi → rupainting（排除 node_modules/.next）
2. 恢复 docs/、data/、public/ 三个已建目录
3. package.json + render.yaml 改名
4. 删除卦爻相关：`src/lib/casting/`、`src/lib/data/hexagrams.ts/trigrams.ts`、`src/app/api/cast/`、`src/app/cast/`、`src/app/hexagrams/`、`src/components/HexagramSymbol.tsx, LineInput.tsx, TextLayerLabel.tsx`
5. 新建：`src/data/paintings_data.json`（搬运）、`src/lib/data/paintings.ts`（loader）、`src/lib/llm/prompts.ts`（重写）
6. 新页面：`src/app/page.tsx`（首页，三入口）、`src/app/gallery/page.tsx`、`src/app/painting/[id]/page.tsx`、`src/app/api/interpret/route.ts`（重写）
