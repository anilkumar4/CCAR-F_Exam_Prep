// ============================================================
// CCAR-F Exam Prep — Scenarios Data
// All 6 exam scenarios with details and decision points
// ============================================================

const SCENARIOS_DATA = [
  {
    id: 1,
    title: 'Customer Support Resolution Agent',
    icon: '🎧',
    color: '#8B5CF6',
    description: 'You are building a customer support resolution agent using the Claude Agent SDK. The agent handles high-ambiguity requests like returns, billing disputes, and account issues. It has access to your backend systems through custom MCP tools (get_customer, lookup_order, process_refund, escalate_to_human). Your target is 80%+ first-contact resolution while knowing when to escalate.',
    primaryDomains: [1, 2, 5],
    domainLabels: ['Agentic Architecture & Orchestration', 'Tool Design & MCP Integration', 'Context Management & Reliability'],
    keyTools: ['get_customer', 'lookup_order', 'process_refund', 'escalate_to_human'],
    architectureDiagram: 'graph TD\n  U["👤 Customer"] --> A["🤖 Support Agent"]\n  A --> T1["get_customer"]\n  A --> T2["lookup_order"]\n  A --> T3["process_refund"]\n  A --> T4["escalate_to_human"]\n  T1 --> DB["📦 Backend Systems"]\n  T2 --> DB\n  T3 --> DB\n  T4 --> H["👨‍💼 Human Agent"]\n  A -->|"PostToolUse Hook"| N["Data Normalizer"]\n  A -->|"Prerequisite Gate"| G["Identity Verification"]',
    decisionPoints: [
      {
        situation: 'A customer says "check my order #12345." Both get_customer and lookup_order have minimal descriptions.',
        correctDecision: 'Improve tool descriptions to include input formats, example queries, and boundaries.',
        wrongApproach: 'Adding few-shot examples without fixing the root cause (poor tool descriptions).',
        principle: 'Tool descriptions are the PRIMARY mechanism for LLM tool selection.'
      },
      {
        situation: 'The agent sometimes skips identity verification before processing refunds.',
        correctDecision: 'Add programmatic prerequisites that block process_refund until get_customer returns a verified ID.',
        wrongApproach: 'Adding "always verify identity first" to the system prompt (probabilistic, not deterministic).',
        principle: 'Use programmatic enforcement for critical business rules, not prompt-based guidance.'
      },
      {
        situation: 'A customer asks about competitor price matching, but your policy only covers own-site price adjustments.',
        correctDecision: 'Escalate to a human agent because the policy is silent on this specific request.',
        wrongApproach: 'Denying the request because it\'s not explicitly in the policy.',
        principle: 'Escalate when policy is ambiguous or silent. Policy gaps require human judgment.'
      },
      {
        situation: 'During a complex 3-issue conversation, the agent contradicts its earlier finding about a refund amount.',
        correctDecision: 'Extract transactional facts into a persistent "case facts" block outside summarized history.',
        wrongApproach: 'Increasing max_tokens or enabling extended thinking.',
        principle: 'Critical facts need structural protection from progressive summarization.'
      }
    ]
  },
  {
    id: 2,
    title: 'Code Generation with Claude Code',
    icon: '💻',
    color: '#10B981',
    description: 'You are using Claude Code to accelerate software development. Your team uses it for code generation, refactoring, debugging, and documentation. You need to integrate it into your development workflow with custom slash commands, CLAUDE.md configurations, and understand when to use plan mode vs direct execution.',
    primaryDomains: [3, 5],
    domainLabels: ['Claude Code Configuration & Workflows', 'Context Management & Reliability'],
    keyTools: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob'],
    architectureDiagram: 'graph TD\n  D["👨‍💻 Developer"] --> CC["Claude Code"]\n  CC --> CM["CLAUDE.md Hierarchy"]\n  CM --> UL["~/.claude/CLAUDE.md<br/>User Level"]\n  CM --> PL[".claude/CLAUDE.md<br/>Project Level"]\n  CM --> DL["subdir/CLAUDE.md<br/>Directory Level"]\n  CC --> R[".claude/rules/<br/>Path-specific Rules"]\n  CC --> SK[".claude/skills/<br/>Custom Skills"]\n  CC --> CMD[".claude/commands/<br/>Slash Commands"]\n  CC --> MCP[".mcp.json<br/>MCP Servers"]',
    decisionPoints: [
      {
        situation: 'A new team member doesn\'t see team testing conventions that all others see.',
        correctDecision: 'Move conventions from ~/.claude/CLAUDE.md (user-level) to .claude/CLAUDE.md (project-level, version-controlled).',
        wrongApproach: 'Asking each new team member to manually copy the config.',
        principle: 'User-level config is NOT shared via version control. Use project-level for team standards.'
      },
      {
        situation: 'You need to restructure a monolith into microservices across dozens of files.',
        correctDecision: 'Use plan mode to explore dependencies, design service boundaries, then execute.',
        wrongApproach: 'Jumping into direct execution and making changes incrementally.',
        principle: 'Plan mode for complex architectural tasks. Direct execution for simple, scoped changes.'
      },
      {
        situation: 'Test files are spread throughout the codebase and need consistent conventions.',
        correctDecision: 'Create .claude/rules/ files with glob patterns (e.g., **/*.test.tsx) for path-specific rules.',
        wrongApproach: 'Putting a CLAUDE.md in every test subdirectory.',
        principle: 'Glob-pattern rules work across directories. Subdirectory CLAUDE.md is directory-bound.'
      },
      {
        situation: 'A codebase analysis skill generates verbose output flooding the main conversation.',
        correctDecision: 'Add context: fork to the SKILL.md frontmatter.',
        wrongApproach: 'Limiting the skill\'s output length.',
        principle: 'context: fork isolates verbose skills in sub-agent context.'
      }
    ]
  },
  {
    id: 3,
    title: 'Multi-Agent Research System',
    icon: '🔬',
    color: '#06B6D4',
    description: 'You are building a multi-agent research system using the Claude Agent SDK. A coordinator agent delegates to specialized subagents: one searches the web, one analyzes documents, one synthesizes findings, and one generates reports. The system researches topics and produces comprehensive, cited reports.',
    primaryDomains: [1, 2, 5],
    domainLabels: ['Agentic Architecture & Orchestration', 'Tool Design & MCP Integration', 'Context Management & Reliability'],
    keyTools: ['Task', 'web_search', 'analyze_document', 'synthesize', 'generate_report'],
    architectureDiagram: 'graph TD\n  Q["📝 Research Query"] --> C["🧠 Coordinator"]\n  C -->|"Task"| WS["🌐 Web Search Agent"]\n  C -->|"Task"| DA["📄 Document Analysis Agent"]\n  C -->|"Task"| SY["🔗 Synthesis Agent"]\n  C -->|"Task"| RG["📊 Report Generator"]\n  WS --> C\n  DA --> C\n  SY --> C\n  RG --> C\n  SY -.->|"verify_fact<br/>(scoped tool)"| VF["Quick Fact Check"]\n  C -->|"Coverage Gap?"| WS',
    decisionPoints: [
      {
        situation: 'Reports cover only visual arts when researching "AI impact on creative industries."',
        correctDecision: 'Fix the coordinator\'s task decomposition to include all creative industry domains.',
        wrongApproach: 'Blaming the web search agent or synthesis agent.',
        principle: 'When output coverage is narrow, check the coordinator\'s task decomposition first.'
      },
      {
        situation: 'The synthesis agent frequently needs simple fact verification, causing 2-3 round trips.',
        correctDecision: 'Give the synthesis agent a scoped verify_fact tool for simple lookups.',
        wrongApproach: 'Giving the synthesis agent ALL web search tools.',
        principle: 'Least privilege: scoped cross-role tools for common cases, coordinator for complex ones.'
      },
      {
        situation: 'Two credible sources report conflicting market size statistics.',
        correctDecision: 'Include both values with source attribution and temporal context.',
        wrongApproach: 'Selecting the more recent value or averaging them.',
        principle: 'Annotate conflicts with source attribution. Don\'t arbitrarily resolve them.'
      },
      {
        situation: 'The web search subagent times out mid-research.',
        correctDecision: 'Return structured error context (failure type, attempted query, partial results, alternatives).',
        wrongApproach: 'Returning an empty result marked as success, or killing the entire workflow.',
        principle: 'Structured error context enables intelligent coordinator recovery.'
      }
    ]
  },
  {
    id: 4,
    title: 'Developer Productivity with Claude',
    icon: '🛠️',
    color: '#F59E0B',
    description: 'You are building developer productivity tools using the Claude Agent SDK. The agent helps engineers explore unfamiliar codebases, understand legacy systems, generate boilerplate code, and automate repetitive tasks. It uses the built-in tools (Read, Write, Bash, Grep, Glob) and integrates with MCP servers.',
    primaryDomains: [2, 3, 1],
    domainLabels: ['Tool Design & MCP Integration', 'Claude Code Configuration & Workflows', 'Agentic Architecture & Orchestration'],
    keyTools: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob', 'Task'],
    architectureDiagram: 'graph TD\n  E["👨‍💻 Engineer"] --> A["🤖 Productivity Agent"]\n  A --> G["Grep<br/>Content Search"]\n  A --> GL["Glob<br/>File Patterns"]\n  A --> R["Read<br/>File Contents"]\n  A --> W["Write<br/>File Output"]\n  A --> ED["Edit<br/>Targeted Mods"]\n  A --> B["Bash<br/>Shell Commands"]\n  A --> MCP["MCP Servers<br/>Jira, GitHub, etc."]\n  A -->|"Subagent"| SA["🔍 Explorer Agent"]\n  SA --> SP["📝 Scratchpad Files"]',
    decisionPoints: [
      {
        situation: 'An engineer asks to "find all files that import UserService."',
        correctDecision: 'Use Grep to search file contents for the import pattern.',
        wrongApproach: 'Using Glob (which finds files by name, not content).',
        principle: 'Grep = content search. Glob = file name/path pattern matching.'
      },
      {
        situation: 'After 45 minutes of exploration, the agent starts referencing "typical patterns" instead of specific classes.',
        correctDecision: 'Spawn subagents for specific investigations + use scratchpad files for findings.',
        wrongApproach: 'Switching to a larger context window or restarting every 20 minutes.',
        principle: 'Subagents + scratchpad files manage context degradation in extended sessions.'
      },
      {
        situation: 'The agent prefers Grep over a more capable custom MCP search tool.',
        correctDecision: 'Enhance the MCP tool\'s description to detail its capabilities and advantages.',
        wrongApproach: 'Removing Grep from the agent\'s allowedTools.',
        principle: 'Enhanced tool descriptions fix tool preference issues, not tool removal.'
      },
      {
        situation: 'Edit fails because target text appears multiple times in the file.',
        correctDecision: 'Use Read to load full contents + Write to save with modifications.',
        wrongApproach: 'Using Bash with sed for the replacement.',
        principle: 'Read + Write is the documented fallback when Edit can\'t find unique text.'
      }
    ]
  },
  {
    id: 5,
    title: 'Claude Code for Continuous Integration',
    icon: '🔄',
    color: '#EF4444',
    description: 'You are integrating Claude Code into your CI/CD pipeline. The system runs automated code reviews, generates test cases, and provides feedback on pull requests. You need to design prompts that provide actionable feedback and minimize false positives.',
    primaryDomains: [3, 4],
    domainLabels: ['Claude Code Configuration & Workflows', 'Prompt Engineering & Structured Output'],
    keyTools: ['-p flag', '--output-format json', '--json-schema', 'CLAUDE.md'],
    architectureDiagram: 'graph LR\n  PR["Pull Request"] --> CI["CI Pipeline"]\n  CI -->|"-p flag"| CC["Claude Code"]\n  CC -->|"--output-format json"| J["Structured JSON"]\n  J --> PC["Post as PR Comments"]\n  CC --> CM["CLAUDE.md<br/>Review Criteria"]\n  CC --> R1["Pass 1: Per-file<br/>Local Analysis"]\n  CC --> R2["Pass 2: Cross-file<br/>Integration Check"]\n  R1 --> J\n  R2 --> J',
    decisionPoints: [
      {
        situation: 'Claude Code hangs in CI pipeline waiting for interactive input.',
        correctDecision: 'Use the -p (--print) flag for non-interactive mode.',
        wrongApproach: 'Setting CLAUDE_HEADLESS=true or redirecting stdin.',
        principle: '-p flag is the documented way to run Claude Code non-interactively.'
      },
      {
        situation: 'Developers ignore valid security findings because "comment accuracy" findings are 80% false positives.',
        correctDecision: 'Temporarily disable the "comment accuracy" category while fixing those prompts.',
        wrongApproach: 'Adding "only report high-confidence findings" to the prompt.',
        principle: 'High false positives in one category erode trust in ALL categories.'
      },
      {
        situation: 'A 14-file PR review produces inconsistent, contradictory feedback.',
        correctDecision: 'Split into per-file local passes + a separate cross-file integration pass.',
        wrongApproach: 'Using a larger context window for the single-pass review.',
        principle: 'Multi-pass review avoids attention dilution in large code reviews.'
      },
      {
        situation: 'Same session generates code and reviews it, rarely finding issues.',
        correctDecision: 'Use independent instances for generation and review (no shared reasoning context).',
        wrongApproach: 'Adding more detailed review criteria to the same session.',
        principle: 'Self-review is unreliable. Separate sessions for generation and review.'
      }
    ]
  },
  {
    id: 6,
    title: 'Structured Data Extraction',
    icon: '📊',
    color: '#EC4899',
    description: 'You are building a structured data extraction system using Claude. The system extracts information from unstructured documents, validates the output using JSON schemas, and maintains high accuracy. It must handle edge cases gracefully and integrate with downstream systems.',
    primaryDomains: [4, 5],
    domainLabels: ['Prompt Engineering & Structured Output', 'Context Management & Reliability'],
    keyTools: ['tool_use', 'JSON Schema', 'tool_choice', 'Message Batches API'],
    architectureDiagram: 'graph TD\n  D["📄 Documents"] --> E["Extraction Engine"]\n  E -->|"tool_use"| S["JSON Schema"]\n  S --> V["Validation"]\n  V -->|"Pass"| O["✅ Output"]\n  V -->|"Fail"| R["Retry with Error Feedback"]\n  R --> E\n  V -->|"Info Missing"| HR["👤 Human Review"]\n  D -->|"Batch"| BA["Message Batches API"]\n  BA -->|"custom_id"| O\n  E --> TC["tool_choice Config"]\n  TC -->|"auto"| TA["May return text"]\n  TC -->|"any"| TB["Must call a tool"]\n  TC -->|"forced"| TF["Must call specific tool"]',
    decisionPoints: [
      {
        situation: 'Model fabricates PO numbers for invoices that don\'t have one.',
        correctDecision: 'Make the "Purchase Order" field optional/nullable in the schema.',
        wrongApproach: 'Adding a prompt instruction saying "don\'t make up values."',
        principle: 'Optional/nullable schema fields prevent fabrication of missing information.'
      },
      {
        situation: 'JSON syntax errors in text-based extraction output.',
        correctDecision: 'Use tool_use with JSON schema for guaranteed schema-compliant output.',
        wrongApproach: 'Using a JSON repair library or regex extraction.',
        principle: 'tool_use + JSON schema eliminates syntax errors entirely.'
      },
      {
        situation: 'Validation fails because the total is in a cover letter not provided to the model.',
        correctDecision: 'Route to human review — retries are ineffective when info is absent from source.',
        wrongApproach: 'Increasing retry count or adding "try harder" instructions.',
        principle: 'Retries work for format errors. Not for missing information.'
      },
      {
        situation: '97% overall accuracy but errors spike on medical billing documents after automation.',
        correctDecision: 'Implement stratified accuracy analysis by document type and field before automating.',
        wrongApproach: 'Raising the confidence threshold from 90% to 99%.',
        principle: 'Aggregate metrics mask segment-specific failures. Analyze by segment.'
      }
    ]
  }
];
