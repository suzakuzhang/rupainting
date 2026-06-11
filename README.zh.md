# 入画 / Into the Painting

> 一个陪你读画的系统。它不告诉你画的是什么，它带你看见画家如何观察世界、
> 笔墨如何承载精神、题跋印章如何记录千百年的观看史。

研究原型（research prototype），私有部署，仅作 PhD 申请方向 portfolio 展示。

---

## 项目定位

**符号解释系统三部曲**的第三个 service：

| 项目 | 接口形态 | 用户姿态 |
|---|---|---|
| `tarot_local_test` | 牌面符号 → 情境解释 | 把解释权让渡给 AI |
| `zhouyi` | 卦爻文本 → 结构解释 | 把解释权让渡给 AI |
| **`rupainting`** | 视觉锚点 → 艺术史框架 → 观看经验 | 把 AI 当作观看训练伙伴 |

**核心命题**：从"神谕式接口"到"导览式接口"的转向。

**底线**：不预言、不算命、不替观看者下情绪判断。所有输出必须落到画面证据上（笔墨、构图、留白、印章、题跋）。"画不是预言你，而是训练你如何观看。"

**方法论底座**：何慕文《如何读中国画 · 大都会艺术博物馆藏中国书画精品导览》  
**画作锚点**：八大山人册页（明末清初遗民艺术家）

---

## 输出结构

### 七层（每次解读固定骨架）

1. **第一眼** — 不解释，先描述画面给的直接感受
2. **观看路线** — 视线应该如何在画面中游走
3. **笔墨与空间** — 笔法、墨法、留白、构图
4. **题跋印章** — 文本层、收藏史、观看史
5. **象征语境** — 物象的文化语义、画家的处境
6. **情绪** — 不强加，只指认可能的情绪锚点
7. **继续追问** — 三个可深入的方向

### 四模式

| 模式 | 风格 |
|---|---|
| **初见** | 美术馆导览员，亲切，不堆术语 |
| **深读** | 博雅的学术细读，引用画论与史料 |
| **画中漫游** | 第二人称引导，进入画面空间 |
| **研究笔记** | 可保存的 Markdown，给写文章用 |

---

## 技术栈

- **Next.js 14** + React 18 + TypeScript（App Router）
- **Tailwind CSS 4** for styling
- **DeepSeek**（主解读模型，按七层骨架返回 JSON）
- **Gemini**（"导览者"多轮对话——扮演画中旁观者 / 古代文人观画者）
- 鉴权层：session token + 邀请码（移植自 zhouyi）
- 部署：**Render**（节点环境，`render.yaml` 自动识别）

---

## 目录结构

```
rupainting/
├── data/paintings_data.json     # 画库 metadata（14 详细 + 11 骨架）
├── public/paintings/bada/raw/   # 八大山人 50 张 300dpi 图版
├── docs/methodology.md          # 方法论文档（system prompt 灵魂）
├── render.yaml                  # Render 部署配置
└── src/
    ├── app/
    │   ├── page.tsx             # 首页（三入口 + 四模式说明）
    │   ├── gallery/             # 画廊（列表 + 搜索 + 主题筛选）
    │   ├── painting/[id]/       # 画作详情（图 + 模式选择 + 解读 + 导览者对话）
    │   ├── admin/               # 管理后台（邀请码 / 用量 / 研究记录导出）
    │   └── api/
    │       ├── paintings/       # 列表 + 详情
    │       ├── interpret/       # 解读：paintingId + mode + question → 七层 JSON
    │       ├── spirit/          # 导览者多轮：start / chat / end
    │       ├── access/          # 邀请码鉴权
    │       └── admin/           # 管理接口（含 research-export）
    ├── components/
    │   ├── InterpretationPanel  # 七层渲染 / 漫游三段 / 笔记 Markdown
    │   ├── ModeSelector         # 四模式选择
    │   └── SpiritPanel          # 导览者对话 UI
    ├── lib/
    │   ├── llm/                 # deepseek + gemini 封装 + prompts.ts（七层 + 四模式 + 边界规则）
    │   ├── spirit/              # 导览者会话 + prompt
    │   ├── access/              # session + roles
    │   ├── data/paintings.ts    # 画库 loader
    │   └── research/store.ts    # ResearchInterpretationRecord
    └── types/painting.ts
```

---

## 数据流

```
用户在 /painting/[id] 选模式 + 输入问题
        │
        ▼
POST /api/interpret  { paintingId, mode, question }
        │
        ▼
1. 加载画作 metadata + 图版路径
2. 注入七层 + 四模式 + 边界规则 system prompt（src/lib/llm/prompts.ts）
3. DeepSeek 生成 JSON（七层结构）
4. 写入 ResearchInterpretationRecord
        │
        ▼
InterpretationPanel 按七层渲染
        │
        ▼
（可选）继续追问 → 进入导览者多轮对话
        │
        ▼
POST /api/spirit/start → /api/spirit/chat → /api/spirit/end
        │（Gemini 扮演画中旁观者 / 古代文人观画者）
        ▼
SpiritPanel 渲染对话气泡
```

---

## 本地开发

需要 Node 18+ 和以下环境变量：

```bash
DEEPSEEK_API_KEY=...
GEMINI_API_KEY=...
PILOT_ADMIN_CODE=...           # 管理员邀请码
PILOT_ADMIN_BIRTH_DATE=...     # 管理员鉴权用生日
```

启动：

```bash
npm install
npm run dev -- -p 10010
# 打开 http://localhost:10010
```

无 API key 时接口会优雅返回 502，前端不会崩。

主要路由：

- `/` — 首页
- `/gallery` — 画廊
- `/painting/bada-001` — 画作详情
- `/admin` — 管理后台
- `/api/paintings` — 画库 API

---

## 部署

GitHub: `suzakuzhang/rupainting`（私有）→ Render web service。

`render.yaml` 已配置好 build / start / runtime；在 Render 控制台 New Web Service → 接 repo → 自动识别 → 填上述四个 env vars 即可。

**不挂 Render Disk**：因不公开试运行，`access_data.json` / `spirit_data.json` 重新部署清空可接受。如未来转向 pilot user，再加 Disk + 邀请码恢复机制（参考 zhouyi 实现）。

---

## 设计决策

1. **栈选 Next.js**（不是 Flask）——画作 zoom、题跋局部高亮、漫游模式视觉路径标注 React 更友好。
2. **MVP 不做多模态识图**——内置画库 + 用户文字描述。多模态留 v2。
3. **画库初始来源 = 八大山人册页**——一个画家的完整谱系比跨画家精选更聚合。
4. **方法论与画库分离**——`docs/methodology.md` 是 system prompt 灵魂，`data/paintings_data.json` 是 user prompt 锚点。
5. **七层输出固定**——每次解读都按这个骨架，便于研究记录的横向对比。
6. **DeepSeek + Gemini 双模型**——DeepSeek 给结构化解读，Gemini 给角色化对话。

---

## 路线图（v2）

- [ ] 11 个骨架画作补足详细描述
- [ ] 多模态识图（用户上传画作）
- [ ] "学怎么看" / "画中漫游" 独立入口
- [ ] 画面局部 zoom + 题跋/印章高亮
- [ ] 何慕文 PDF 中其他 35 幅画作选择性引入

---

## 参考

- 何慕文（Maxwell K. Hearn），《如何读中国画 · 大都会艺术博物馆藏中国书画精品导览》
- 兄弟项目：[`tarot_local_test`](../tarot_local_test/)、[`zhouyi`](../zhouyi/)
- 跨会话进度：见 `PROGRESS.md`
