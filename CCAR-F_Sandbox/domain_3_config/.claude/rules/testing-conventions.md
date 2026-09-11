---
name: testing-conventions
description: Rules for writing tests in this project
paths: ["**/*.test.tsx", "**/*_test.py"]
---

# Testing Conventions

This file demonstrates a **path-specific rule**.

## Exam Concepts Demonstrated:
- The YAML frontmatter specifies `paths: ["**/*.test.tsx", "**/*_test.py"]`.
- Claude Code will ONLY load these rules into context when modifying files that match those glob patterns.
- This prevents the context window from being polluted with testing rules when the developer is writing database migration scripts.

## Rules
1. All tests must use the Arrange-Act-Assert pattern.
2. Mocks should be defined in a separate `conftest.py` or `setupTests.js` file.
