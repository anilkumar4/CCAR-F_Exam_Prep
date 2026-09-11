# CCAR-F Hands-On Sandbox

Welcome to the CCAR-F Sandbox! This directory contains working code, configurations, and templates designed to help you physically practice the concepts from the Claude Certified Architect - Foundations (CCAR-F) exam.

## Directory Structure

### 1. `domain_1_architecture/`
Practice Agentic Architecture & Orchestration.
- Run `python agentic_loop.py` to see exactly how an agentic loop handles the `stop_reason == "tool_use"` logic.
- Run `python subagent_delegation.py` to see the Hub-and-Spoke architecture in action and why subagents must be explicitly passed context.

### 2. `domain_2_mcp/`
Practice Tool Design and MCP Integration.
- Review `bad_vs_good_tools.json` to understand why LLMs fail with vague tool descriptions.
- Run `python structured_errors.py` to see how an MCP tool should return errors to enable agent recovery.

### 3. `domain_3_config/`
Practice Claude Code Configuration.
- Explore the `.claude/` directory to see how `CLAUDE.md`, rules, and skills are scoped.
- Open `.claude/skills/analyze_logs/SKILL.md` to see the crucial `context: fork` and `allowed-tools` options.

### 4. `domain_4_prompting/`
Practice Prompt Engineering and Structured Output.
- Review `extraction_prompt_few_shot.txt` to see how to use few-shot examples to reduce false positives.
- Review `schema_with_tool_use.json` to see how to prevent hallucinated data using nullable fields.

### 5. `domain_5_reliability/`
Practice Context Management and Reliability.
- Read `case_facts_template.md` to understand how to protect transactional data from progressive summarization.
- Read `scratchpad_example.md` to see how subagents persist context during long sessions.

## How to Use
Don't just read the code—modify it! Break the `agentic_loop.py` script by changing the logic. Modify the `CLAUDE.md` to see how the rules apply. The exam tests your practical judgment, and breaking these examples is the best way to build that judgment.
