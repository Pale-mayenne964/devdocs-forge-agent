---
id: video-intake-guard
title: Video Intake Guard
sidebar_position: 7
description: How the Video Intake Guard validates video URLs before generation.
---

# Video Intake Guard

The Video Intake Guard runs automatically when you pass `--url` to the `generate` command. It validates the video URL, classifies whether it's a technical tutorial, and confirms you've provided your own transcript.

:::warning URL-only generation is blocked
A YouTube URL alone is not enough. You must always provide your own transcript file with `--file`.
DevDocs Forge Agent never scrapes transcripts, downloads captions, or downloads videos.
:::

## Why it exists

DevDocs Forge Agent is designed for processing **content you own or have permission to use**. The Video Intake Guard helps enforce this by:

* Verifying the URL points to a real, supported video
* Checking that the video looks like a technical tutorial (not a music video, vlog, etc.)
* Requiring that you supply your own transcript — no scraping allowed

## What the guard never does

* Scrapes YouTube transcripts or caption tracks
* Downloads video files or audio
* Accesses YouTube captions API
* Auto-fetches transcript text from any URL
* Generates docs from a URL alone without a user-provided file

## The three checks

### 1. URL validation

Only these domains are accepted:

* `youtube.com` — `youtube.com/watch?v=VIDEO_ID`
* `youtu.be` — `youtu.be/VIDEO_ID`
* `vimeo.com` — `vimeo.com/NUMERIC_ID`

Malformed URLs, unsupported platforms, and YouTube channel URLs (without a video ID) are rejected immediately.

### 2. Tech video classification (0–100 score)

The classifier scores the video based on metadata signals:

| Signal                                                        | Points |
| ------------------------------------------------------------- | -----: |
| Title has a strong tech keyword (angular, docker, typescript) |    +30 |
| Description mentions technical terms                          |    +20 |
| Tags contain programming terms                                |    +15 |
| Category is Science & Technology / Education / Howto & Style  |    +20 |
| Duration > 3 minutes                                          |    +10 |
| Title contains blocked keyword (song, vlog, gaming)           |    −30 |
| Category is Music / Entertainment / Sports / Gaming           |    −20 |

**Thresholds:**

* Score ≥ 60 → **High confidence** — allowed
* Score 35–59 → **Medium confidence** — allowed with warning
* Score < 35 → **Low confidence** — blocked (unless `--force`)

:::note Optional YouTube API key
Full metadata (title, description, tags, category, duration) requires `YOUTUBE_API_KEY` in your `.env`. Without it, classification uses URL and filename heuristics only and typically gives a low-confidence score.
:::

### 3. Transcript requirement

You must always provide `--file` with your own transcript. URL-only generation is blocked:

```bash title="Blocked — no transcript provided"
# This fails by design
npm run generate -- --url "https://www.youtube.com/watch?v=W6NZfCO5SIk"
```

```bash title="Correct — transcript provided"
npm run generate -- \
  --url "https://www.youtube.com/watch?v=W6NZfCO5SIk" \
  --file input/my-transcript.md \
  --type docusaurus
```

## Test the guard with a real URL

### Step 1 — Inspect a video URL

Check how a video URL would be classified without providing a transcript:

```bash title="Inspect a video URL"
npm run devdocs-forge-agent -- inspect-url "https://www.youtube.com/watch?v=W6NZfCO5SIk"
```

### Step 2 — Validate URL and transcript together

Run all intake checks on a URL + transcript pair:

```bash title="Validate URL and transcript"
npm run devdocs-forge-agent -- validate-source \
  --url "https://www.youtube.com/watch?v=W6NZfCO5SIk" \
  --file input/my-transcript.md
```

Expected output:

```txt
devdocs-forge-agent validate-source
──────────────────────────────────────
  OK   URL is valid (youtube)
  OK   Tech classification: 75/100   high confidence
  OK   Transcript: input/my-transcript.md   842 words

  ✓ Source is valid. Ready to generate.
```

### Step 3 — Generate docs safely

```bash title="Generate docs with Video Intake Guard"
npm run generate -- \
  --url "https://www.youtube.com/watch?v=W6NZfCO5SIk" \
  --file input/my-transcript.md \
  --type docusaurus
```

## `--force` flag

Bypass low-confidence classification if you own the content:

```bash title="Force bypass low-confidence classification"
npm run generate -- \
  --url "https://www.youtube.com/watch?v=W6NZfCO5SIk" \
  --file input/my-transcript.md \
  --force
```

Using `--force` appends a warning to `metadata.json` and `review-checklist.md` so you have a record of the bypass.

## Configuration

Customize classification in `config/devdocs-forge-agent.yml`:

```yaml title="config/devdocs-forge-agent.yml"
video_intake:
  enabled: true
  min_tech_confidence_score: 60   # lower to be more permissive
  min_transcript_words: 150
  technical_keywords:
    - your-framework
    - your-library
  blocked_keywords:
    - song
    - vlog
```
