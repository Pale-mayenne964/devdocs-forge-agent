---
id: quick-start
title: Quick Start
sidebar_position: 2
description: Generate your first doc in under 5 minutes.
---

# Quick Start

Generate your first doc in under 5 minutes. No API key needed.

## Prerequisites

- Node.js 18 or later
- npm 9 or later
- Git

```bash title="Check prerequisites"
node --version   # v18.x.x or higher
npm --version    # v9.x.x or higher
git --version
```

## 1. Clone and install

```bash title="Install DevDocs Forge Agent"
git clone https://github.com/AnkitParekh007/devdocs-forge-agent.git
cd devdocs-forge-agent
npm install
```

## 2. Configure environment

```bash title="Create local environment file"
cp .env.example .env
```

The default configuration uses **mock mode** — no API key required.

```env title=".env"
DEVDOCS_PROVIDER=mock
```

## 3. Run the demo

```bash title="Run the local demo"
npm run demo
```

This single command:

1. Runs `doctor` to validate your setup
2. Copies example transcripts to `input/`
3. Generates a Docusaurus page from the Angular Signals tutorial
4. Runs `verify` to validate the output

## 4. View the output

Generated files appear in `output/angular-signals-tutorial-{date}/`.

```txt title="Generated output"
output/angular-signals-tutorial-2026-05-13/
├── index.md
├── metadata.json
├── review-checklist.md
├── source-summary.md
└── docs/
    └── angular-signals-tutorial.md
```

| File | Purpose |
| ---- | ------- |
| `index.md` | Main generated documentation |
| `metadata.json` | Provider, model, timestamp, and warnings |
| `review-checklist.md` | Human review checklist before publishing |
| `source-summary.md` | Source stats and attribution summary |
| `docs/angular-signals-tutorial.md` | Docusaurus-ready page with frontmatter |

## 5. Generate from your own transcript

Drop your transcript into `input/` and run:

```bash title="Generate Docusaurus docs"
npm run generate -- --file input/my-tutorial.md --type docusaurus
```

Choose a different output mode:

```bash title="Generate different output types"
npm run generate -- --file input/my-tutorial.md --type blog
npm run generate -- --file input/my-tutorial.md --type faq
npm run generate -- --file input/my-tutorial.md --type readme
```

## Switch to a real AI provider

Edit `.env`:

```env title=".env"
DEVDOCS_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
```

Then run:

```bash title="Generate with configured provider"
npm run generate -- --file input/my-tutorial.md --type docusaurus
```

See [Providers](/docs/providers) for Anthropic and Gemini setup.

:::tip Mock mode first
Always test with mock mode before spending API credits. Mock mode generates the full file structure with placeholder content so you can verify the workflow works.
:::

## Next steps

- [Installation](/docs/installation) — full setup options
- [Modes](/docs/modes) — all 11 output modes explained
- [CLI Commands](/docs/cli-commands) — full command reference
- [Providers](/docs/providers) — switch to a real AI provider
