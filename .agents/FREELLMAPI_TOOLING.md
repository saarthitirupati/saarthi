# FreeLLMAPI Developer Tooling Guide for Saarthi

This guide explains how to use **[FreeLLMAPI](https://github.com/tashfeenahmed/freellmapi)** as a local zero-cost LLM proxy for coding agents (**Claude Code**, **Cursor**, **Codex**, **Aider**, **Cline**, **Continue**) working on the Saarthi codebase.

---

## 1. Quick Setup: Running FreeLLMAPI Locally

FreeLLMAPI runs locally on your machine and serves all models on port `3001` (`http://localhost:3001/v1`).

### Method A: Windows Desktop App (Recommended)
1. Download the Windows `.exe` installer from [FreeLLMAPI Releases](https://github.com/tashfeenahmed/freellmapi/releases/latest).
2. Run the installer. FreeLLMAPI will sit in your Windows system tray.
3. Click the tray icon to open the local dashboard at `http://localhost:3001`.

### Method B: Docker (Linux / WSL / Mac)
```bash
docker run -d -p 3001:3001 -v ~/.freellmapi:/data ghcr.io/tashfeenahmed/freellmapi:latest
```

---

## 2. Recommended Free Provider Keys for Saarthi Dev

Once inside the dashboard (`http://localhost:3001`), add free API keys for any of these providers:

| Provider | Free Quota | Best Used For | Recommended Models |
| :--- | :--- | :--- | :--- |
| **Groq** | Free RPM/RPD | Blazing fast TypeScript & React edits (300+ tok/s) | `llama-3.3-70b-versatile`, `llama-3.1-8b-instant` |
| **Cerebras** | Free daily allowance | Ultra low-latency code generation (2,000+ tok/s) | `llama-3.3-70b`, `llama-3.1-8b` |
| **Google AI Studio** | 15 RPM / 1M TPM free | Deep architectural reasoning & multi-file refactoring | `gemini-2.5-flash`, `gemini-2.5-pro` |
| **Mistral** | Free tier | Precision code generation | `codestral-latest`, `mistral-large-2407` |
| **OpenRouter** | Free models pool | DeepSeek R1 / V3 reasoning & Qwen Coder | `deepseek/deepseek-r1:free`, `qwen/qwen-2.5-coder-32b-instruct:free` |

Copy your **Unified API Key** (`freellmapi-...`) from the top of the **Keys** page.

---

## 3. Configuring Your Coding Agents

### A. Cursor
1. In Cursor, open **Settings → Models → OpenAI API Key**.
2. Set **Base URL** (Override): `http://localhost:3001/v1`
3. Set **API Key**: Your unified FreeLLMAPI key.
4. Add model names:
   * `llama-3.3-70b-versatile` (fastest)
   * `gemini-2.5-flash`
   * `gemini-2.5-pro`
   * `codestral-latest`

### B. Claude Code
Run the automated configurator provided by FreeLLMAPI:
```bash
npx freellmapi setup-claude --url http://localhost:3001 --api-key <your-unified-key>
```
Or use the zero-persistence launcher:
```bash
npx freellmapi launch
```

### C. Aider
```bash
npx freellmapi setup-aider --url http://localhost:3001 --api-key <your-unified-key>
```
Or start Aider directly pointing to the proxy:
```bash
aider --openai-api-base http://localhost:3001/v1 --openai-api-key <your-unified-key> --model openai/llama-3.3-70b-versatile
```

### D. Codex CLI
```bash
npx freellmapi setup-codex --url http://localhost:3001 --api-key <your-unified-key>
```

### E. Continue (VS Code)
```bash
npx freellmapi setup-continue --url http://localhost:3001 --api-key <your-unified-key>
```

---

## 4. Coding Agent Guardrails for Saarthi

Whenever you invoke an agent via FreeLLMAPI, ensure it follows Saarthi's core engineering principles from `.agents/AGENTS.md`:

1. **Lazy Senior Dev Mode**:
   * Shortest working diff wins.
   * Reuse existing helpers in `src/utils/`, `src/lib/`, `src/data/places.ts`, and `src/data/templeLayouts.ts`.
   * No unnecessary abstractions, no new npm dependencies unless strictly required.
2. **Explainability Rule**:
   * Every pilgrim recommendation must provide a clear "Why" reason.
3. **Verification**:
   * Run `npx tsc --noEmit` before proposing any PR or code modifications.
