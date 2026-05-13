# Transcript Intake

devdocs-forge-agent requires a user-provided transcript before generating documentation.
It **never** scrapes transcripts from YouTube, Vimeo, or any other platform.

## Why you must provide your own transcript

- Respects content creators' rights
- Prevents automated plagiarism pipelines
- Ensures you have permission to use the content
- Works with any video platform or format

---

## Methods

### 1. Clipboard

Copy the transcript text to your clipboard, then run:

```bash
devdocs-forge-agent transcript clipboard --out input/transcript.md

# With source URL for attribution:
devdocs-forge-agent transcript clipboard \
  --url "https://youtube.com/watch?v=..." \
  --out input/transcript.md
```

**Works on:** macOS (pbpaste), Windows (PowerShell), Linux (requires xclip or xsel).

### 2. Paste (stdin)

Paste multi-line transcript text directly into the terminal. End with `:::end` on its own line:

```bash
devdocs-forge-agent transcript paste --out input/transcript.md
```

```
Paste your transcript below. When done, type :::end on a new line and press Enter.

Welcome to this tutorial on Angular Signals...
...
:::end
```

### 3. Import file

Import from a local file. Supported formats: `.md`, `.txt`, `.vtt`, `.srt`.

```bash
devdocs-forge-agent transcript import-file \
  --from downloads/transcript.vtt \
  --out input/transcript.md

# With source URL:
devdocs-forge-agent transcript import-file \
  --from transcript.srt \
  --url "https://youtube.com/watch?v=..." \
  --out input/transcript.md
```

VTT and SRT files are automatically cleaned: timestamps, sequence numbers, and headers
are stripped. Only the dialogue text is kept.

### 4. YouTube Owner OAuth _(not yet implemented)_

Download captions from a YouTube video **that you own** using OAuth authentication.
This requires you to be the video owner — it is not a public scraping tool.

```bash
devdocs-forge-agent transcript youtube-owner \
  --url "https://youtube.com/watch?v=..." \
  --out input/transcript.md
```

**Prerequisites (when implemented):**
- Google Cloud project with YouTube Data API v3 enabled
- OAuth 2.0 credentials (client ID + client secret)
- You must be the owner of the video

### 5. Local Media Transcription _(not yet implemented)_

Transcribe a local audio or video file using Whisper (local or API).

```bash
devdocs-forge-agent transcript transcribe-file \
  --file downloads/tutorial.mp3 \
  --out input/transcript.md
```

**Planned:** whisper.cpp (local) or OpenAI Whisper API integration.

---

## After intake

Once your transcript is saved, generate documentation:

```bash
devdocs-forge-agent generate \
  --file input/transcript.md \
  --type docusaurus

# With source URL validation:
devdocs-forge-agent generate \
  --url "https://youtube.com/watch?v=..." \
  --file input/transcript.md \
  --type docusaurus
```

Or validate the source first:

```bash
devdocs-forge-agent validate-source \
  --url "https://youtube.com/watch?v=..." \
  --file input/transcript.md
```

---

## Minimum word count

Transcripts must be at least **150 words**. Transcripts under **500 words** produce a warning
since the output quality may be limited.

These thresholds are configurable in `config/devdocs-forge-agent.yml`:

```yaml
transcript_intake:
  min_words: 150
  warn_words: 500
```

---

## Config reference

```yaml
transcript_intake:
  enabled: true
  allow_clipboard: true
  allow_paste: true
  allow_file_import: true
  allow_youtube_owner_oauth: false   # requires setup — see above
  allow_local_media_transcription: false  # not yet implemented
  allow_public_youtube_scraping: false    # NEVER enable
  min_words: 150
  warn_words: 500
  output_dir: "input/transcripts"
  preserve_original: true
```

> **`allow_public_youtube_scraping`** must always remain `false`.
> devdocs-forge-agent is designed to never scrape transcripts automatically.
