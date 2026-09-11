// ============================================================
// CCAR-F Exam Prep — Cheat Sheets Data
// Quick reference for each domain
// ============================================================

const CHEATSHEETS_DATA = [
  {
    domain: 1,
    title: 'Agentic Architecture & Orchestration',
    icon: '🤖',
    color: '#8B5CF6',
    sections: [
      {
        title: 'Agentic Loop Control Flow',
        items: [
          'stop_reason === "tool_use" → continue loop (execute tool, append result)',
          'stop_reason === "end_turn" → terminate loop (return response)',
          '❌ ANTI-PATTERN: Parsing text for "done"/"complete"',
          '❌ ANTI-PATTERN: Arbitrary iteration caps as primary stop',
          '❌ ANTI-PATTERN: Checking for assistant text as completion'
        ]
      },
      {
        title: 'Multi-Agent Architecture',
        items: [
          'Hub-and-spoke: coordinator manages ALL inter-subagent comms',
          'Subagents do NOT inherit coordinator context automatically',
          'Pass context EXPLICITLY in the Task prompt',
          'Spawn parallel subagents: multiple Task calls in ONE response',
          'allowedTools MUST include "Task" for coordinator agents'
        ]
      },
      {
        title: 'Enforcement Patterns',
        items: [
          'Programmatic (hooks/prerequisites) = DETERMINISTIC ✅',
          'Prompt-based = PROBABILISTIC ⚠️',
          'Financial/identity rules → always programmatic',
          'PostToolUse hooks → data normalization',
          'Tool interception hooks → policy enforcement'
        ]
      },
      {
        title: 'Task Decomposition',
        items: [
          'Prompt chaining → predictable sequential workflows',
          'Dynamic decomposition → open-ended investigation',
          'Per-file analysis + cross-file integration pass',
          'Iterative refinement: evaluate → re-delegate → re-synthesize'
        ]
      },
      {
        title: 'Session Management',
        items: [
          '--resume <name> → continue named session',
          'fork_session → parallel exploration branches',
          'Resume when prior context mostly valid',
          'Fresh + summaries when tool results are stale',
          'Inform about specific file changes on resume'
        ]
      }
    ]
  },
  {
    domain: 2,
    title: 'Tool Design & MCP Integration',
    icon: '🔧',
    color: '#06B6D4',
    sections: [
      {
        title: 'Tool Description Best Practices',
        items: [
          'Descriptions = PRIMARY mechanism for LLM tool selection',
          'Include: purpose, inputs, outputs, examples, edge cases, boundaries',
          'Differentiate vs similar tools explicitly',
          'Rename to eliminate overlap (analyze_content → extract_web_results)',
          'Split generic tools into purpose-specific ones'
        ]
      },
      {
        title: 'MCP Error Responses',
        items: [
          'isError flag → communicates failure to agent',
          'Return: errorCategory + isRetryable + description',
          'Categories: transient | validation | business | permission',
          '❌ Generic "Operation failed" prevents recovery',
          'Distinguish access failures from valid empty results'
        ]
      },
      {
        title: 'Tool Distribution',
        items: [
          '4-5 tools per agent (18+ degrades selection)',
          'Scoped to role: don\'t give synthesis agent search tools',
          'Scoped cross-role tools for high-frequency needs (verify_fact)',
          'tool_choice: "auto" | "any" | forced {"type":"tool","name":"..."}',
          '"any" = guaranteed tool call; "auto" = might return text'
        ]
      },
      {
        title: 'MCP Server Config',
        items: [
          '.mcp.json → project-scoped (shared, version-controlled)',
          '~/.claude.json → user-scoped (personal/experimental)',
          '${ENV_VAR} expansion for credentials',
          'MCP resources → content catalogs (reduce exploratory calls)',
          'Community servers > custom for standard integrations'
        ]
      },
      {
        title: 'Built-in Tools Quick Reference',
        items: [
          'Grep → search file CONTENTS (function calls, imports, errors)',
          'Glob → find files by NAME pattern (**/*.test.tsx)',
          'Read → load file contents',
          'Write → save file contents',
          'Edit → targeted text replacement (needs unique anchor)',
          'Edit fails? → Read + Write fallback',
          'Bash → shell commands (last resort)'
        ]
      }
    ]
  },
  {
    domain: 3,
    title: 'Claude Code Configuration & Workflows',
    icon: '⚙️',
    color: '#10B981',
    sections: [
      {
        title: 'CLAUDE.md Hierarchy',
        items: [
          '~/.claude/CLAUDE.md → User (personal, NOT shared)',
          '.claude/CLAUDE.md or root CLAUDE.md → Project (shared via git)',
          'subdir/CLAUDE.md → Directory-specific',
          '@import → modular file references',
          '.claude/rules/ → topic-specific rule files',
          '/memory → verify loaded config files'
        ]
      },
      {
        title: 'Commands & Skills',
        items: [
          '.claude/commands/ → project commands (git-shared)',
          '~/.claude/commands/ → personal commands',
          'SKILL.md frontmatter: context, allowed-tools, argument-hint',
          'context: fork → isolated sub-agent (prevents context pollution)',
          'allowed-tools → restrict tool access during skill',
          'Skills = on-demand. CLAUDE.md = always loaded.'
        ]
      },
      {
        title: 'Path-Specific Rules',
        items: [
          'YAML frontmatter: paths: ["**/*.test.tsx"]',
          'Load ONLY when editing matching files',
          'Better than subdir CLAUDE.md for cross-directory conventions',
          'Use glob patterns for file-type conventions'
        ]
      },
      {
        title: 'Plan Mode vs Direct Execution',
        items: [
          'PLAN: complex, multi-file, architectural, multiple approaches',
          'DIRECT: simple, single-file, well-scoped, clear stack trace',
          'Explore subagent → isolate verbose discovery',
          'Plan for investigation → Direct for implementation'
        ]
      },
      {
        title: 'CI/CD Integration',
        items: [
          '-p (--print) → non-interactive mode',
          '--output-format json + --json-schema → structured CI output',
          'CLAUDE.md → provide review criteria to CI',
          'Separate sessions for generation and review',
          'Include prior findings on re-review to avoid duplicates',
          'Provide existing tests to avoid generating duplicates'
        ]
      },
      {
        title: 'Iterative Refinement',
        items: [
          'Input/output examples > prose descriptions',
          'Test-driven: write tests first, iterate on failures',
          'Interview pattern: Claude asks questions before implementing',
          'Interacting issues → one message. Independent → sequential.'
        ]
      }
    ]
  },
  {
    domain: 4,
    title: 'Prompt Engineering & Structured Output',
    icon: '✍️',
    color: '#F59E0B',
    sections: [
      {
        title: 'Precision & False Positives',
        items: [
          'Explicit criteria > vague "be conservative"',
          'Define what to report AND what to skip',
          'High FP in one category → erodes trust in ALL',
          'Disable problematic categories, fix separately',
          'Concrete code examples per severity level'
        ]
      },
      {
        title: 'Few-Shot Prompting',
        items: [
          '2-4 targeted examples for ambiguous scenarios',
          'Show reasoning for WHY one choice over alternatives',
          'Demonstrate desired output FORMAT explicitly',
          'Include varied document structures in examples',
          'Enables generalization beyond pre-specified cases'
        ]
      },
      {
        title: 'Structured Output',
        items: [
          'tool_use + JSON schema = GUARANTEED compliance',
          'Eliminates syntax errors but NOT semantic errors',
          'Required fields → model may fabricate values',
          'Optional/nullable → returns null when info absent',
          '"other" + detail string → extensible enums',
          '"unclear" enum value → ambiguous cases'
        ]
      },
      {
        title: 'tool_choice Decision Tree',
        items: [
          '"auto" → model may return text (default)',
          '"any" → MUST call a tool, can choose which',
          'forced → MUST call specific named tool',
          '"any" for unknown document types with multiple schemas',
          'Forced for mandatory first steps (extract_metadata)'
        ]
      },
      {
        title: 'Validation & Retry',
        items: [
          'Retry with error feedback: include document + failed output + specific errors',
          'Retries work: format mismatches, structural errors',
          'Retries DON\'T work: info absent from source',
          'detected_pattern field → analyze dismissal patterns',
          'calculated_total vs stated_total → flag discrepancies'
        ]
      },
      {
        title: 'Message Batches API',
        items: [
          '50% cost savings, up to 24hr processing',
          'NO latency SLA — NOT for blocking workflows',
          'Use for: overnight reports, weekly audits',
          'custom_id → correlate request/response pairs',
          'NO multi-turn tool calling support',
          'Refine prompts on sample before batch processing'
        ]
      },
      {
        title: 'Multi-Pass Review',
        items: [
          'Self-review is unreliable (retained reasoning context)',
          'Independent instances for effective review',
          'Per-file local analysis + cross-file integration',
          'Confidence-based review routing'
        ]
      }
    ]
  },
  {
    domain: 5,
    title: 'Context Management & Reliability',
    icon: '🛡️',
    color: '#EF4444',
    sections: [
      {
        title: 'Context Preservation',
        items: [
          '"Lost in the middle" → key info at START and END',
          'Progressive summarization → loses numbers, dates',
          '"Case facts" block → persistent structured facts',
          'Trim tool outputs to relevant fields (40 → 5)',
          'Structured data > verbose content for downstream agents',
          '/compact → reduce context in extended sessions'
        ]
      },
      {
        title: 'Escalation Triggers',
        items: [
          '✅ Customer explicitly requests human',
          '✅ Policy exceptions/gaps',
          '✅ Unable to make meaningful progress',
          '❌ NOT: sentiment analysis',
          '❌ NOT: self-reported confidence scores',
          'Multiple customer matches → ask for more identifiers'
        ]
      },
      {
        title: 'Error Propagation',
        items: [
          'Return: failure type + attempted query + partial results + alternatives',
          'Distinguish: access failure vs valid empty result',
          '❌ Generic "search unavailable" hides context',
          '❌ Silent suppression (empty as success)',
          '❌ Terminate entire workflow on single failure',
          'Local recovery first → propagate if unresolvable'
        ]
      },
      {
        title: 'Large Codebase Exploration',
        items: [
          'Context degrades after extended exploration',
          'Subagents → isolate verbose investigation',
          'Scratchpad files → persist findings across context',
          '/compact → summarize verbose discovery output',
          'Structured manifests → crash recovery'
        ]
      },
      {
        title: 'Human Review & Confidence',
        items: [
          'Aggregate accuracy hides segment-specific failures',
          'Stratified sampling by document type AND field',
          'Field-level confidence → calibrate with labeled sets',
          'Analyze by segment before automating'
        ]
      },
      {
        title: 'Information Provenance',
        items: [
          'Claim-source mappings → preserve through synthesis',
          'Conflicting sources → annotate, don\'t auto-resolve',
          'Require publication dates → prevent temporal misinterpretation',
          'Financial data as tables, news as prose, technical as lists'
        ]
      }
    ]
  }
];
