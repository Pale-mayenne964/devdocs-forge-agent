---
id: cli-commands
title: CLI Commands
sidebar_position: 3
description: Full reference for all devdocs-forge-agent CLI commands.
---

# CLI Commands

## `npm run doctor`

Validates your setup. Run this first whenever something isn't working.

```bash title="Validate setup"
npm run doctor
```

Checks: Node.js version, `package.json`, config file, `.env`, provider, API keys,
`YOUTUBE_API_KEY`, and required directories.

---

## `npm run init`

Creates missing files and directories. Safe to run multiple times — never overwrites existing files.

```bash title="Initialize local files"
npm run init
```

Creates: `config/devdocs-forge-agent.yml`, `input/`, `output/`, `modes/_profile.md`

---

## `npm run examples`

Copies example transcripts from `examples/transcripts/` to `input/`.

```bash title="Copy example transcripts"
npm run examples
```

---

## `npm run demo`

One-command demo. Runs in mock mode regardless of your `.env` setting.

```bash title="Run the demo"
npm run demo
```

```txt title="Demo pipeline"
doctor → examples → generate (Angular Signals tutorial, docusaurus) → verify
```

---

## `npm run generate`

Generates documentation from a transcript file.

```bash title="Generate documentation"
npm run generate -- --file input/my-tutorial.md --type docusaurus
```

### Flags

| Flag                 | Required | Description                                        |
| -------------------- | -------: | -------------------------------------------------- |
| `--file <path>`      |      Yes | Path to transcript file                            |
| `--type <mode>`      |       No | Output mode, default from config                   |
| `--url <url>`        |       No | Video URL; runs intake guard and stores source URL |
| `--source-url <url>` |       No | Static source URL for attribution                  |
| `--force`            |       No | Bypass low-confidence classification               |

### With Video Intake Guard

```bash title="Generate with Video Intake Guard"
npm run generate -- \
  --url "https://youtube.com/watch?v=..." \
  --file input/my-tutorial.md \
  --type docusaurus
```

### URL-only generation is blocked

```bash title="Blocked — URL-only generation"
npm run generate -- --url "https://youtube.com/watch?v=..."
```

This fails by design because DevDocs Forge Agent does not scrape transcripts.
Provide `--file input/my-transcript.md` along with the URL.

### All output modes

```bash title="All output modes"
npm run generate -- --file input/tutorial.md --type blog
npm run generate -- --file input/tutorial.md --type faq
npm run generate -- --file input/tutorial.md --type readme
npm run generate -- --file input/tutorial.md --type troubleshooting
npm run generate -- --file input/tutorial.md --type lesson
npm run generate -- --file input/tutorial.md --type social
npm run generate -- --file input/tutorial.md --type changelog
npm run generate -- --file input/tutorial.md --type seo
npm run generate -- --file input/tutorial.md --type gitbook
```

See [Modes](/docs/modes) for a full description of each output type.

---

## `npm run batch`

Processes all `.md` and `.txt` files in a directory.

```bash title="Batch generation"
npm run batch -- --dir input/
npm run batch -- --dir input/ --type blog
```

---

## `npm run verify`

Validates generated documentation for common quality issues.

```bash title="Verify generated docs"
npm run verify
npm run verify -- --dir output/my-doc-2026-05-13/
```

---

## `npm run providers`

Lists available providers and shows which is currently active.

```bash title="List providers"
npm run providers
```

---

## `npm run devdocs-forge-agent -- inspect-url`

Inspects and classifies a video URL. No transcript required.

```bash title="Inspect a video URL"
npm run devdocs-forge-agent -- inspect-url "https://youtube.com/watch?v=..."
```

---

## `npm run devdocs-forge-agent -- validate-source`

Validates a video URL and a local transcript file together before generation.

```bash title="Validate source URL and transcript"
npm run devdocs-forge-agent -- validate-source \
  --url "https://youtube.com/watch?v=..." \
  --file input/my-transcript.md
```

---

## `npm test`

Runs the Vitest test suite (54 tests).

```bash title="Run tests"
npm test
```

---

## `npm run build`

Compiles TypeScript to `dist/`. Required for production use of the global `devdocs-forge-agent` binary.

```bash title="Build CLI"
npm run build
```

---

## Input file format

Transcript files are plain Markdown or plain text. Add YAML frontmatter to include a source URL for attribution:

```markdown title="input/my-tutorial.md"
---
source_url: https://example.com/original-tutorial
---

# Tutorial Title

Content goes here...
```

:::info No scraping
DevDocs Forge Agent does not scrape YouTube, download captions, or access any video
platform API for content. You always provide your own transcript file via `--file`.
:::
