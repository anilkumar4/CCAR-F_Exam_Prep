# 17. Appendix

## Technologies and Concepts

The following list contains technologies and concepts that might appear on the exam:

- Claude Agent SDK — agent definitions, agentic loops, `stop_reason` handling, hooks (`PostToolUse`, tool call interception), subagent spawning via `Task` tool, `allowedTools` configuration
- Model Context Protocol (MCP) — MCP servers, MCP tools, MCP resources, `isError` flag, tool descriptions, tool distribution, `.mcp.json` configuration, environment variable expansion
- Claude Code — CLAUDE.md configuration hierarchy (user/project/directory), `.claude/rules/` with YAML frontmatter path-scoping, `.claude/commands/` for slash commands, `.claude/skills/` with `SKILL.md` frontmatter (`context: fork`, `allowed-tools`, `argument-hint`), plan mode, direct execution, `/memory` command, `/compact`, `--resume`, `fork_session`, Explore subagent
- Claude Code CLI — `-p` / `--print` flag for non-interactive mode, `--output-format json`, `--json-schema` for structured CI output
- Claude API — `tool_use` with JSON schemas, `tool_choice` options (`"auto"`, `"any"`, forced tool selection), `stop_reason` values (`"tool_use"`, `"end_turn"`), `max_tokens`, system prompts
- Message Batches API — 50% cost savings, up to 24-hour processing window, `custom_id` for request/response correlation, polling for completion, no multi-turn tool calling support
- JSON Schema — required vs optional fields, enum types, nullable fields, "other" + detail string patterns, strict mode for syntax error elimination
- Pydantic — schema validation, semantic validation errors, validation-retry loops
- Built-in tools — Read, Write, Edit, Bash, Grep, Glob — their purposes and selection criteria
- Few-shot prompting — targeted examples for ambiguous scenarios, format demonstration, generalization to novel patterns
- Prompt chaining — sequential task decomposition into focused passes
- Context window management — token budgets, progressive summarization, lost-in-the-middle effects, context extraction, scratchpad files
- Session management — session resumption, `fork_session`, named sessions, session context isolation
- Confidence scoring — field-level confidence, calibration with labeled validation sets, stratified sampling for error rate measurement
