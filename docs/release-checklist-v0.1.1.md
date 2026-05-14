# Release Checklist — v0.1.1

Use this checklist before tagging and publishing the v0.1.1 release.

## Pre-Release Checks

### Code Quality
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] `npm test` passes on Node 22 (all 9 test files)
- [ ] `npm run lint` passes with zero errors
- [ ] No console.log left in production code paths

### Functionality
- [ ] `npm run demo` completes end-to-end in mock mode
- [ ] `npm run doctor` reports all green
- [ ] `npm run verify` validates the demo output
- [ ] `npm run providers` lists mock, openai, anthropic, gemini
- [ ] `npm run generate -- --file input/angular-signals-tutorial.md --type docusaurus` works
- [ ] `npm run generate -- --file input/angular-signals-tutorial.md --type blog` works
- [ ] `npm run batch -- --dir input/` processes all example transcripts

### Example Packs
- [ ] `examples/angular-signals/` contains all 4 files
- [ ] `examples/api-demo/` contains all 4 files
- [ ] `examples/product-walkthrough/` contains all 4 files
- [ ] `output-sample.md` in each pack passes `npm run verify` manually

### Documentation
- [ ] `docs/output-contract.md` reviewed for accuracy
- [ ] `docs/safety-and-attribution.md` reviewed for accuracy
- [ ] `docs/provider-system.md` reviewed for accuracy
- [ ] `docs/recruiter-review-guide.md` reviewed for accuracy
- [ ] `docs/ARCHITECTURE.md` Mermaid diagram renders in GitHub
- [ ] `docs/GOOD_FIRST_ISSUES.md` all 9 issues have clear acceptance criteria
- [ ] `docs/release-notes/v0.1.1.md` is accurate

### README
- [ ] All badge URLs are valid
- [ ] "Try It in One Command" section tested end-to-end
- [ ] "What This Proves" section reviewed by a non-engineer
- [ ] Mermaid diagram renders in GitHub README preview
- [ ] All internal links resolve correctly

### Website
- [ ] `npm run website:build` passes
- [ ] Website deploys correctly to GitHub Pages

## Release Steps

1. [ ] Update `package.json` version to `0.1.1`
2. [ ] Update `CHANGELOG.md` with v0.1.1 entry
3. [ ] Commit: `chore: release v0.1.1`
4. [ ] Tag: `git tag v0.1.1`
5. [ ] Push tag: `git push origin v0.1.1`
6. [ ] Create GitHub Release from tag with body from `docs/release-notes/v0.1.1.md`
7. [ ] Verify CI passes on the tag

## Post-Release

- [ ] Create GitHub issues for v0.1.1 good first issues (issues #6–9)
- [ ] Update README roadmap checkboxes
- [ ] Post LinkedIn launch announcement (see template below)
- [ ] Post to relevant developer communities (dev.to, Hacker News, etc.) if warranted

## LinkedIn Post Template

```
Just shipped devdocs-forge-agent v0.1.1 — a local-first TypeScript CLI that turns 
tutorial transcripts and demo recordings into Docusaurus pages, blog posts, FAQs, 
and troubleshooting guides.

No scraping. No SaaS. Your transcript → structured docs in one command.

Try it: git clone → npm install → npm run demo (mock mode, no API key needed)

Supports OpenAI, Anthropic, Gemini, and mock mode for local dev and CI.

Open to contributors — 9 good first issues labeled with clear acceptance criteria.

[repo link]

#DevRel #TechnicalWriting #OpenSource #TypeScript #AI #DeveloperTools
```
