# CCAR-F Project Configuration

This file demonstrates a project-level `CLAUDE.md` file, which is shared via version control (git) so the entire team shares the same standards.

## Exam Concepts Demonstrated:
1. **Hierarchy**: This file overrides user-level settings (`~/.claude/CLAUDE.md`) but can be overridden by subdirectory rules or path-specific rules.
2. **@import Syntax**: Used below to keep the file modular rather than monolithic.

## Global Project Rules
- We use Python 3.10+
- All API responses must follow the JSend format.

## Imported Standards
@import .claude/rules/testing-conventions.md

## Custom Prompt Templates
You can define project-specific prompt fragments here that agents can use.
