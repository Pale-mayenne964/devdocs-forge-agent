---
id: roadmap
title: Roadmap
sidebar_position: 13
description: What's done, what's next, and what's planned for devdocs-forge-agent.
---

# Roadmap

## Done (v0.1.1 — current)

- [x] Core generation pipeline (TypeScript, ESM, Commander)
- [x] Mock, OpenAI, Anthropic, Gemini providers
- [x] 11 output modes: docusaurus, blog, docs, gitbook, readme, faq, troubleshooting, lesson, social, changelog, seo
- [x] Video Intake Guard — URL validation, tech classification, transcript requirement
- [x] Transcript Intake Agent — clipboard, stdin paste, file import (.md/.txt/.vtt/.srt), stubs for OAuth + local media
- [x] `inspect-url` and `validate-source` CLI commands
- [x] `transcript` command with 5 subcommands
- [x] `--url` and `--force` flags on generate
- [x] `npm run demo` one-command demo in mock mode
- [x] `npm run batch` for directory-level processing
- [x] `npm run verify` output validation
- [x] `npm run doctor` setup diagnostics
- [x] Profile customization (`modes/_profile.md`)
- [x] Zod config schema with `video_intake` and `transcript_intake` sections
- [x] 82-test Vitest suite (Node 22/24, Ubuntu + macOS)

## In progress / good first issues

- [ ] **`npm run preview`** — local browser preview of generated docs (planned — previous PR closed, open for contribution)
- [ ] **Ollama provider** — local LLM support ([#1](https://github.com/AnkitParekh007/devdocs-forge-agent/issues/1))
- [ ] **OpenRouter provider** — access to 200+ models ([#2](https://github.com/AnkitParekh007/devdocs-forge-agent/issues/2))
- [ ] **Mermaid diagram mode** — architecture diagrams from transcripts ([#3](https://github.com/AnkitParekh007/devdocs-forge-agent/issues/3))
- [ ] **Better Docusaurus frontmatter** — smarter tag and sidebar_label extraction ([#4](https://github.com/AnkitParekh007/devdocs-forge-agent/issues/4))

## Planned (v0.2.0)

- [ ] Vimeo metadata provider
- [ ] `--watch` mode — regenerate on file change
- [ ] Multi-file merging — combine several transcripts into one doc
- [ ] Output diffing — show what changed between two generation runs
- [ ] Prompt library — community-contributed mode prompts

## Ideas / RFC

These are not committed but worth exploring:

- **GitHub Action** — run generate in CI when a transcript file is pushed
- **VS Code extension** — generate docs from the editor command palette
- **Docusaurus plugin** — auto-build from a `transcripts/` folder at build time
- **Interactive mode** — guided prompt to select mode, provider, and output format

## Not planned

These are explicitly out of scope:

- YouTube transcript scraping or downloading
- Automatic publishing to Docusaurus / GitBook / Notion
- Hosted service or SaaS version
- GUI / desktop app

---

Want to contribute to any of these? See [Contributing](contributing.md) or open an issue.
