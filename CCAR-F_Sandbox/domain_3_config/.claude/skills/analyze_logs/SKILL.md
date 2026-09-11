---
name: analyze_logs
description: Analyzes raw server logs for error patterns and returns a structured summary.
context: fork
allowed-tools: [Read, Grep, Glob]
argument-hint: "Which log directory should I analyze?"
---

# Analyze Logs Skill

This file demonstrates a custom Skill configuration.

## Exam Concepts Demonstrated:

1. **`context: fork`**: This is a critical concept. Log analysis is extremely verbose. By setting `context: fork`, this skill runs in an isolated sub-agent. The main conversation is not polluted with thousands of lines of log processing—only the final summary is returned to the user.
2. **`allowed-tools`**: We restrict this skill to `Read`, `Grep`, and `Glob`. It is explicitly NOT allowed to use `Write`, `Edit`, or `Bash`. This enforces least privilege, preventing a runaway log analysis from modifying code or executing dangerous shell scripts.
3. **`argument-hint`**: If a user types `/analyze_logs` without arguments, they will be prompted: "Which log directory should I analyze?"

## Instructions
1. Find all `.log` files in the specified directory.
2. Use Grep to extract lines containing "ERROR" or "FATAL".
3. Group the errors by signature and count occurrences.
4. Output a markdown table summarizing the findings.
