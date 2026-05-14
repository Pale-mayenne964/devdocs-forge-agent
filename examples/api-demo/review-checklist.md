# Review Checklist — API Demo Example

> Complete this checklist before publishing the generated output.

## Source Accuracy

- [ ] All code snippets in `output-sample.md` are consistent with `input.md`
- [ ] No invented SDK methods or API parameters
- [ ] Model name (`claude-3-5-sonnet-latest`) confirmed current against Anthropic docs
- [ ] SDK import path (`@anthropic-ai/sdk`) confirmed correct

## Code Quality

- [ ] `agent.mjs` runs end-to-end with `node agent.mjs` after `npm install`
- [ ] ESM usage is consistent (`"type": "module"` in package.json, `.mjs` extension)
- [ ] `.env` setup instructions are complete and accurate
- [ ] No hardcoded secrets in any code sample

## Content Quality

- [ ] Prerequisites section is accurate for the target reader
- [ ] "Extending the Agent" table reflects real and feasible extensions
- [ ] Key Takeaways section accurately summarizes the source transcript
- [ ] No claims about production readiness that exceed what the source says

## Publishing

- [ ] Frontmatter `id`, `title`, `description`, `tags` are appropriate
- [ ] Reviewed by a developer familiar with AI agent patterns and the Anthropic SDK

## Generation Info

- Provider: mock
- Mode: docusaurus
- Source: `examples/api-demo/input.md`
- Generated: see `metadata-sample.json`
