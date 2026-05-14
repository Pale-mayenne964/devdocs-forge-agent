# Review Checklist — Product Walkthrough Example

> Complete this checklist before publishing the generated output.

## Source Accuracy

- [ ] All feature descriptions in `output-sample.md` match `input.md`
- [ ] Login URL is current and correct for your deployment
- [ ] SSO provider name (Okta) confirmed correct
- [ ] Keyboard shortcut (C for new task) verified in current app version
- [ ] Column names match current Kanban board configuration
- [ ] Slack channel name (#streamlinehq-support) is current

## Content Quality

- [ ] Table layouts render correctly in your docs platform
- [ ] Getting Help section reflects current support channels
- [ ] No features described that have been removed or renamed

## Technical Accuracy

- [ ] PR linking syntax (`closes TASK-42`) confirmed working in your GitHub integration
- [ ] Burndown chart description matches current Reports UI
- [ ] Velocity calculation (story points vs. hours) matches your team's settings

## Publishing

- [ ] Frontmatter `id`, `title`, `description`, `tags` are appropriate for your docs site
- [ ] The "Note: StreamlineHQ is fictional" disclaimer is removed if this is a real product guide
- [ ] Reviewed by a team member who uses StreamlineHQ daily

## Generation Info

- Provider: mock
- Mode: docs
- Source: `examples/product-walkthrough/input.md`
- Generated: see `metadata-sample.json`
