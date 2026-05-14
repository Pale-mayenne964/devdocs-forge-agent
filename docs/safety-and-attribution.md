# Safety and Attribution

devdocs-forge-agent is designed to be used with content you own or have explicit permission to process. This document explains the safety design decisions built into the tool and the responsibilities that remain with you as the user.

## Core Safety Principle

**The tool generates a first draft. A human always reviews it before publishing.**

Every output includes a `review-checklist.md` and an embedded review checklist in `index.md`. The `metadata.json` always contains `"reviewRequired": true`. These are not suggestions — they reflect the fundamental limitation of AI-generated content.

## What the Tool Will Not Do

| Action | Status | Reason |
|---|---|---|
| Scrape YouTube captions | Never | Violates platform ToS; not this tool's job |
| Download video content | Never | Out of scope; illegal in many jurisdictions |
| Fetch transcript from a URL | Never | Only local files are processed |
| Generate without a transcript | Blocked | `allow_url_only_generation: false` in config |
| Omit `reviewRequired` from metadata | Never | Hard-coded as `true` |
| Suppress the review checklist | Never | Required by all mode templates |

## The Video Intake Guard

When you pass `--url` to `generate`, the **Video Intake Guard** runs before generation:

1. **URL validation** — only `youtube.com`, `youtu.be`, and `vimeo.com` are accepted
2. **Tech classification** — scores the video's title, description, and category to verify it looks like a developer tutorial (0.0–1.0 confidence score)
3. **Transcript requirement** — `--file` is always required; the URL is never used as content

If the classification score is below the threshold (default: 0.6), generation is blocked unless you pass `--force`. Use `--force` only when you own the content and have verified it is appropriate to process.

### Why Tech Classification?

The intake guard exists to reduce misuse — to make it harder to accidentally process non-technical content (entertainment, news, personal) through a developer docs pipeline. It is not a rights check. You are still responsible for ensuring you have the right to use the transcript.

## Attribution

When you process content from a source you did not create:

1. Pass `--url` to record the source in `metadata.json` and `source-summary.md`
2. Review the generated `source-summary.md` to confirm attribution is accurate
3. Add a link back to the original source in the published document

devdocs-forge-agent cannot verify your rights to any content. Attribution recorded in the output is only as accurate as the URL you provide.

## Content You Should Not Process

- Tutorial transcripts you did not create and do not have permission to use
- Course content from paid platforms without the creator's permission
- Internal company documents classified as confidential
- Any content where you are not certain of your right to create derivative works

## AI Output Limitations

Generated documentation may contain:

- Invented API names, method signatures, or configuration values
- Incorrect code that looks plausible
- Outdated information from the model's training data
- Misattributed quotes or paraphrased facts

The review checklist in every output file specifically asks reviewers to check for these issues. Never publish generated documentation without human review.

## Responsible Use Summary

| You are responsible for | Tool helps with |
|---|---|
| Owning or having rights to the transcript | Structuring content into docs format |
| Reviewing generated content for accuracy | Generating a first draft quickly |
| Testing generated code before publishing | Creating review checklists |
| Attribution to original sources | Recording source URL in metadata |
| Final publishing decision | Running intake guard checks |
