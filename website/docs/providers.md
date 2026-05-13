---
id: providers
title: Providers
sidebar_position: 5
description: Configure AI providers — OpenAI, Anthropic, Gemini, and mock.
---

# Providers

DevDocs Forge Agent supports mock mode by default and can connect to OpenAI, Anthropic, or Gemini with environment variables. All providers use native `fetch` — no external AI SDK packages are installed.

## Mock provider

No API key required. Returns structured placeholder markdown — perfect for development, demos, and CI.

```env title=".env"
DEVDOCS_PROVIDER=mock
```

| Setting          | Value                              |
| ---------------- | ---------------------------------- |
| API key required | No                                 |
| Best for         | Local demos, contributors, CI/CD   |
| Output           | Deterministic placeholder docs     |

Run `npm run demo` to see full output generated in mock mode.

## OpenAI

Get a key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys).

```env title=".env"
DEVDOCS_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
```

| Model          | Notes                                       |
| -------------- | ------------------------------------------- |
| `gpt-4.1-mini` | Fast and cost-effective for docs generation |
| `gpt-4.1`      | Higher quality, slower and more expensive   |
| `o4-mini`      | Best reasoning — use for complex tech docs  |

## Anthropic

Get a key at [console.anthropic.com](https://console.anthropic.com/).

```env title=".env"
DEVDOCS_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-3-5-sonnet-latest
```

| Model                      | Notes                                          |
| -------------------------- | ---------------------------------------------- |
| `claude-3-5-sonnet-latest` | Strong technical writing and structured output |
| `claude-3-5-haiku-latest`  | Faster, cheaper drafts                         |
| `claude-opus-4-5`          | Highest capability                             |

## Google Gemini

Get a key at [aistudio.google.com](https://aistudio.google.com/).

```env title=".env"
DEVDOCS_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash
```

| Model              | Notes                                |
| ------------------ | ------------------------------------ |
| `gemini-2.0-flash` | Fast and cost-effective generation   |
| `gemini-1.5-pro`   | More capable long-context generation |

## Provider selection

Switch between providers with one environment variable:

```env title=".env"
DEVDOCS_PROVIDER=mock       # default — no key needed
DEVDOCS_PROVIDER=openai
DEVDOCS_PROVIDER=anthropic
DEVDOCS_PROVIDER=gemini
```

| Provider  | Environment variable         | API key required |
| --------- | ---------------------------- | ---------------: |
| Mock      | `DEVDOCS_PROVIDER=mock`      |               No |
| OpenAI    | `DEVDOCS_PROVIDER=openai`    |              Yes |
| Anthropic | `DEVDOCS_PROVIDER=anthropic` |              Yes |
| Gemini    | `DEVDOCS_PROVIDER=gemini`    |              Yes |

## List available providers

```bash title="List providers"
npm run providers
```

## Adding a new provider

Each provider implements a simple interface:

```typescript title="src/providers/example.provider.ts"
export interface Provider {
  readonly name: string;
  readonly model: string;
  generate(options: GenerateOptions): Promise<string>;
}
```

To add a provider (e.g., Ollama):

1. Create `src/providers/ollama.provider.ts`
2. Implement the `Provider` interface using native `fetch`
3. Register it in `src/providers/provider-registry.ts`
4. Add `OLLAMA_BASE_URL` and `OLLAMA_MODEL` to `.env.example`

See [GitHub Issue #1](https://github.com/AnkitParekh007/devdocs-forge-agent/issues/1) — Ollama support is a good first issue.

:::tip No SDK packages
All providers use Node.js 18+ native `fetch`. There are no `openai`, `anthropic`, or `@google/generativeai` packages in the dependency tree.
:::
