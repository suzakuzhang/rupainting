# Rupainting / Into the Painting

> A system that reads a painting *with* you. It does not tell you what the painting depicts; it shows you how the painter observed the world, how brush and ink carry spirit, and how colophons and seals record centuries of looking.

A research prototype for **AI-mediated interpretation of Chinese painting**.

**Live demo:** https://rupainting.onrender.com *(interface in Chinese)*

> *Read in another language: [中文 README](./README.zh.md)*

---

## Position

Rupainting is the painting member of a family of prototypes on AI-mediated interpretation:

| Project | Interface form | User's stance |
|---|---|---|
| [`tarot_local_test`](https://github.com/suzakuzhang/tarot_local_test) | card symbol → situational reading | authority ceded to the AI |
| [`zhouyi`](https://github.com/suzakuzhang/zhouyi) | hexagram text → structural reading | authority ceded to the AI |
| **`rupainting`** | visual anchor → art-historical frame → viewing experience | AI as a **training companion for looking** |
| [`anagnosis`](https://github.com/suzakuzhang/anagnosis) | Western Old-Master counterpart | AI as a companion for looking |

**Core move:** a shift from an *oracular* interface to a *guiding* one.

**Hard line:** no prophecy, no fortune-telling, no emotional verdicts imposed on the viewer. Every output must land on visual evidence — brush and ink, composition, negative space, seals, colophons. *The painting does not predict you; it trains how you see.*

**Methodological base:** Maxwell K. Hearn, *How to Read Chinese Paintings* (The Metropolitan Museum of Art).
**Visual anchor corpus:** album leaves by Bada Shanren (a Ming-loyalist painter of the early Qing).

## Output structure

**Seven layers** (the fixed skeleton of every reading):

1. **First sight** — describe the immediate impression before explaining anything.
2. **Viewing path** — how the eye should travel across the picture.
3. **Brush, ink, and space** — brushwork, ink method, negative space, composition.
4. **Colophons and seals** — the textual layer, collection history, the history of looking.
5. **Symbolic context** — the cultural semantics of motifs and the painter's situation.
6. **Emotion** — not imposed; only possible emotional anchors are named.
7. **Going further** — three directions worth pursuing.

**Four modes:** *First Encounter* (gallery-docent, warm, jargon-light) · *Close Reading* (scholarly, citing painting theory and historical sources) · *Roam* (second-person, entering the pictorial space) · *Research Notes* (savable Markdown for writing).

## Tech stack

- **Next.js 14** (App Router) + React 18 + TypeScript
- **Tailwind CSS**
- **DeepSeek** — primary interpretation model (returns the seven-layer structure as JSON)
- **Gemini** — the "guide" multi-turn dialogue (playing an observer within the painting / a literatus viewer)
- Session-token + invite-code access layer (ported from `zhouyi`)
- Deployment: **Render** (`render.yaml`)

## Data flow

```
user picks a mode + asks a question on /painting/[id]
   → POST /api/interpret { paintingId, mode, question }
   → load painting metadata + image path
   → inject seven-layer + four-mode + boundary-rule system prompt (src/lib/llm/prompts.ts)
   → DeepSeek returns seven-layer JSON
   → record ResearchInterpretationRecord
   → InterpretationPanel renders the seven layers
   → (optional) follow-up → guide dialogue: /api/spirit/start → /chat → /end  (Gemini)
```

## Project structure

```
rupainting/
├── data/paintings_data.json     # painting metadata
├── public/paintings/bada/raw/   # Bada Shanren plates (300 dpi)
├── docs/methodology.md          # methodology memo (the soul of the system prompt)
├── render.yaml
└── src/
    ├── app/        # home, gallery, painting/[id], admin, api/*
    ├── components/ # InterpretationPanel, ModeSelector, SpiritPanel
    ├── lib/        # llm (deepseek+gemini+prompts), spirit, access, data, research
    └── types/painting.ts
```

## Local development

Requires Node 18+.

```bash
npm install
npm run dev -- -p 10010
# open http://localhost:10010
```

Environment variables (read from the environment, never committed):

```bash
DEEPSEEK_API_KEY=...
GEMINI_API_KEY=...
PILOT_ADMIN_CODE=...
PILOT_ADMIN_BIRTH_DATE=...
```

Without API keys the endpoints return a graceful 502 and the frontend stays up. `access_data.json` / `spirit_data.json` are runtime-local and gitignored.

## Design decisions

1. **Next.js over Flask** — painting zoom, colophon highlighting, and roam-mode path annotation are friendlier in React.
2. **No multimodal image recognition in the MVP** — a built-in corpus plus the user's textual description; multimodal input is left to v2.
3. **A single painter as the seed corpus** — one painter's complete lineage is more coherent than a cross-painter sampler.
4. **Methodology separated from corpus** — `docs/methodology.md` is the soul of the system prompt; `data/paintings_data.json` is the user-prompt anchor.
5. **Fixed seven-layer output** — every reading follows the same skeleton, enabling cross-comparison of research records.
6. **DeepSeek + Gemini** — DeepSeek for structured reading, Gemini for in-character dialogue.

## Reference

- Maxwell K. Hearn, *How to Read Chinese Paintings* (The Metropolitan Museum of Art).
- Sibling projects: [`tarot_local_test`](https://github.com/suzakuzhang/tarot_local_test), [`zhouyi`](https://github.com/suzakuzhang/zhouyi), [`anagnosis`](https://github.com/suzakuzhang/anagnosis).

## Author

Created by Shumin Zhang, as part of a research program on how AI systems mediate symbolic and visual interpretation. For citation or reuse, please credit the original repository and author.
