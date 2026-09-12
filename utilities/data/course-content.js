const COURSE_DATA = [
  {
    "id": "1.1",
    "domain": 1,
    "title": "1.1 Design and implement agentic loops",
    "content": "An agentic loop is the core control structure that allows an LLM to interact with its environment. Instead of a single call-and-response, the agent runs in a loop. It decides to use a tool (`stop_reason == 'tool_use'`), the system executes the tool and appends the result, and the loop continues until the agent decides it has finished (`stop_reason == 'end_turn'`).",
    "terminalDemo": {
      "prompt": "Can you check my balance and then my recent tickets?",
      "logs": [
        {
          "text": "[SYSTEM] Initializing Agentic Loop...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[AGENT] stop_reason: tool_use",
          "type": "info",
          "delay": 800
        },
        {
          "text": "Executing tool: get_balance(user_id='u123')",
          "type": "tool",
          "delay": 1200
        },
        {
          "text": "Result: { balance: $50 }",
          "type": "success",
          "delay": 800
        },
        {
          "text": "[AGENT] stop_reason: tool_use",
          "type": "info",
          "delay": 800
        },
        {
          "text": "Executing tool: get_tickets(user_id='u123')",
          "type": "tool",
          "delay": 1200
        },
        {
          "text": "Result: { tickets: ['T-882'] }",
          "type": "success",
          "delay": 800
        },
        {
          "text": "[AGENT] stop_reason: end_turn",
          "type": "info",
          "delay": 800
        },
        {
          "text": "Synthesis: You have $50 and 1 open ticket.",
          "type": "output",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "What is the correct programmatic condition to continue an agentic loop?",
      "options": [
        {
          "id": "a",
          "text": "Parse the text for the word 'done'"
        },
        {
          "id": "b",
          "text": "Continue while stop_reason == 'tool_use'"
        },
        {
          "id": "c",
          "text": "Run for a fixed cap of 5 iterations"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "1.2",
    "domain": 1,
    "title": "1.2 Orchestrate multi-agent systems",
    "content": "A Hub-and-Spoke architecture uses a Coordinator (Hub) agent to delegate tasks to specialized Subagents (Spokes). The critical rule is that Subagents DO NOT inherit the Coordinator's context window. The Coordinator must explicitly pass required context (like a user ID) into the Subagent's prompt.",
    "terminalDemo": {
      "prompt": "Help me debug this multi-agent failure.",
      "logs": [
        {
          "text": "[COORDINATOR] Spawning Search Subagent...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[SUBAGENT] Error: I don't know who the user is.",
          "type": "error",
          "delay": 800
        },
        {
          "text": "[COORDINATOR] Retrying. Passing context: { user_id: 'u123' }",
          "type": "system",
          "delay": 1200
        },
        {
          "text": "[SUBAGENT] Searching database for u123...",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "[SUBAGENT] Found 3 results.",
          "type": "success",
          "delay": 800
        },
        {
          "text": "[COORDINATOR] Received results. Terminating subagent.",
          "type": "info",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "In a Hub-and-Spoke architecture, how does a subagent know the user's ID?",
      "options": [
        {
          "id": "a",
          "text": "It automatically reads the Coordinator's memory"
        },
        {
          "id": "b",
          "text": "The Coordinator must explicitly pass the ID in the prompt to the subagent"
        },
        {
          "id": "c",
          "text": "The subagent uses a global variable"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "1.3",
    "domain": 1,
    "title": "1.3 Configure subagent invocation models",
    "content": "When spawning subagents, you must configure their LLM model appropriately. A 'Routing' subagent that simply classifies intents should use a fast, cheap model (like Haiku). A 'Coding' subagent requires a highly capable model (like Sonnet or Opus). Mismatching models leads to high latency or poor reasoning.",
    "terminalDemo": {
      "prompt": "Simulating dynamic model selection...",
      "logs": [
        {
          "text": "[REQUEST] 'Reset my password'",
          "type": "system",
          "delay": 500
        },
        {
          "text": "Spawning intent_classifier (Model: claude-3-haiku)...",
          "type": "tool",
          "delay": 600
        },
        {
          "text": "Intent detected: 'Account Recovery'",
          "type": "success",
          "delay": 500
        },
        {
          "text": "[REQUEST] 'Write a complex Rust server algorithm'",
          "type": "system",
          "delay": 1000
        },
        {
          "text": "Spawning code_generator (Model: claude-3-5-sonnet)...",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "Code generated successfully.",
          "type": "success",
          "delay": 1500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Which task is best suited for Claude 3.5 Haiku as a subagent?",
      "options": [
        {
          "id": "a",
          "text": "Complex architectural refactoring"
        },
        {
          "id": "b",
          "text": "Quickly classifying user intent from a dropdown list"
        },
        {
          "id": "c",
          "text": "Analyzing a 100-page legal contract"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "1.4",
    "domain": 1,
    "title": "1.4 Implement multi-step workflows",
    "content": "Complex tasks must be broken down into Directed Acyclic Graphs (DAGs) or State Machines. For example, an ETL pipeline might have states: Extract -> Transform -> Load. Agents transition between these states, allowing the system to track progress and resume if interrupted.",
    "terminalDemo": {
      "prompt": "Execute Report Generation Workflow",
      "logs": [
        {
          "text": "[STATE: EXTRACT] Fetching raw data...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "Data fetched (10MB). Transitioning to TRANSFORM.",
          "type": "success",
          "delay": 800
        },
        {
          "text": "[STATE: TRANSFORM] Normalizing dates...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "Normalization complete. Transitioning to LOAD.",
          "type": "success",
          "delay": 1000
        },
        {
          "text": "[STATE: LOAD] Writing to database...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "Workflow complete.",
          "type": "output",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "What is the primary benefit of modeling a workflow as a State Machine?",
      "options": [
        {
          "id": "a",
          "text": "It allows the process to resume from the last successful state if interrupted"
        },
        {
          "id": "b",
          "text": "It reduces the API cost"
        },
        {
          "id": "c",
          "text": "It prevents hallucination"
        }
      ],
      "correctAnswer": "a"
    }
  },
  {
    "id": "1.5",
    "domain": 1,
    "title": "1.5 Apply Agent SDK hooks for logging",
    "content": "When building with the Claude Agent SDK, you cannot rely on print statements. You must use lifecycle hooks (e.g., `on_tool_call`, `on_tool_result`, `on_turn_complete`) to emit structured logs for observability and debugging.",
    "terminalDemo": {
      "prompt": "Show SDK Hook execution order",
      "logs": [
        {
          "text": "EVENT: on_turn_start (msg='What is the weather?')",
          "type": "info",
          "delay": 500
        },
        {
          "text": "EVENT: on_tool_call (tool='get_weather')",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "EVENT: on_tool_result (status=200)",
          "type": "success",
          "delay": 800
        },
        {
          "text": "EVENT: on_turn_complete (usage={tokens: 150})",
          "type": "info",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Which hook should you use to record the execution time of a specific tool?",
      "options": [
        {
          "id": "a",
          "text": "on_turn_start"
        },
        {
          "id": "b",
          "text": "on_tool_result (calculating diff from on_tool_call)"
        },
        {
          "id": "c",
          "text": "on_message_complete"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "1.6",
    "domain": 1,
    "title": "1.6 Design task decomposition logic",
    "content": "Task decomposition is the process of breaking a user's prompt into parallel executable steps. Instead of searching for 3 items sequentially (taking 15 seconds), an agent can decompose the request and trigger 3 parallel tool calls (taking 5 seconds).",
    "terminalDemo": {
      "prompt": "User: 'Compare the weather in NY, London, and Tokyo'",
      "logs": [
        {
          "text": "[DECOMPOSITION] Splitting request into 3 parallel tasks...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "Executing tool: get_weather('NY') [ASYNC]",
          "type": "tool",
          "delay": 400
        },
        {
          "text": "Executing tool: get_weather('London') [ASYNC]",
          "type": "tool",
          "delay": 400
        },
        {
          "text": "Executing tool: get_weather('Tokyo') [ASYNC]",
          "type": "tool",
          "delay": 400
        },
        {
          "text": "All 3 results received concurrently.",
          "type": "success",
          "delay": 1000
        }
      ]
    },
    "knowledgeCheck": {
      "question": "What is the main architectural advantage of task decomposition?",
      "options": [
        {
          "id": "a",
          "text": "Reduced latency through parallel execution"
        },
        {
          "id": "b",
          "text": "Reduced token usage"
        },
        {
          "id": "c",
          "text": "Better grammar in the final response"
        }
      ],
      "correctAnswer": "a"
    }
  },
  {
    "id": "1.7",
    "domain": 1,
    "title": "1.7 Manage session state across turns",
    "content": "Stateless APIs require you to pass the entire conversation history back with every request. To prevent the 'Lost in the Middle' effect where the LLM forgets early details, you should extract important transactional data (like an Order ID) into a persistent `<case_facts>` block.",
    "terminalDemo": {
      "prompt": "Simulating progressive summarization vs Case Facts...",
      "logs": [
        {
          "text": "[TURN 1] User provides Order ID: ORD-551",
          "type": "info",
          "delay": 500
        },
        {
          "text": "[SYSTEM] Extracting to persistent state...",
          "type": "system",
          "delay": 600
        },
        {
          "text": "<case_facts> order_id = ORD-551 </case_facts>",
          "type": "success",
          "delay": 800
        },
        {
          "text": "[TURN 20] Conversation history summarized (Order ID lost from text)",
          "type": "error",
          "delay": 1200
        },
        {
          "text": "[SYSTEM] Re-injecting fresh Case Facts into prompt...",
          "type": "info",
          "delay": 800
        },
        {
          "text": "Agent correctly references ORD-551.",
          "type": "success",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Why should you use a <case_facts> block instead of relying on the conversation history?",
      "options": [
        {
          "id": "a",
          "text": "Because it looks cooler"
        },
        {
          "id": "b",
          "text": "To protect critical identifiers from being lost during conversation summarization"
        },
        {
          "id": "c",
          "text": "To reduce API latency"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "2.1",
    "domain": 2,
    "title": "2.1 Integrate MCP Servers",
    "content": "The Model Context Protocol (MCP) allows Claude to interact with external tools and resources securely. Integrating an MCP server involves defining the server configuration in the client (like Claude Code) and ensuring the transport layer (stdio or HTTP/SSE) is correctly established.",
    "terminalDemo": {
      "prompt": "Initialize GitHub MCP Server",
      "logs": [
        {
          "text": "[SYSTEM] Spawning MCP process: npx -y @modelcontextprotocol/server-github",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[MCP_CLIENT] Connecting via stdio transport...",
          "type": "info",
          "delay": 800
        },
        {
          "text": "[MCP_SERVER] Server initialized with capabilities: { tools: true, resources: true }",
          "type": "success",
          "delay": 800
        },
        {
          "text": "[AGENT] Discovered 12 tools from github-server.",
          "type": "tool",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Which transport protocol is typically used for local, command-line MCP servers?",
      "options": [
        {
          "id": "a",
          "text": "HTTP/REST"
        },
        {
          "id": "b",
          "text": "stdio (Standard Input/Output)"
        },
        {
          "id": "c",
          "text": "GraphQL"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "2.2",
    "domain": 2,
    "title": "2.2 Handle structured MCP errors",
    "content": "When tools fail, agents must receive structured errors rather than raw stack traces. MCP defines standard error codes. The agent uses these structured messages to determine whether to retry with different parameters, ask the user for help, or fallback to another tool.",
    "terminalDemo": {
      "prompt": "Read file: /secret/config.yaml",
      "logs": [
        {
          "text": "[AGENT] Calling tool: read_file(path='/secret/config.yaml')",
          "type": "tool",
          "delay": 500
        },
        {
          "text": "[MCP_SERVER] Error 403: Access Denied. Directory outside allowed workspace.",
          "type": "error",
          "delay": 800
        },
        {
          "text": "[AGENT] Received structured error. stop_reason = tool_use (fallback)",
          "type": "info",
          "delay": 800
        },
        {
          "text": "[AGENT] Synthesis: I do not have permission to read that file. Can you provide the contents?",
          "type": "output",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Why is returning a structured error message to an LLM agent better than a raw crash dump?",
      "options": [
        {
          "id": "a",
          "text": "It saves token bandwidth"
        },
        {
          "id": "b",
          "text": "It allows the agent to reason about the failure and attempt a logical fallback"
        },
        {
          "id": "c",
          "text": "LLMs cannot process crash dumps"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "2.3",
    "domain": 2,
    "title": "2.3 Implement resource-based context fetching",
    "content": "MCP Resources allow servers to expose data without requiring the LLM to explicitly call a tool. Resources are referenced via URIs (e.g., `file:///path` or `postgres://schema/table`). The client reads these resources to pre-populate the LLM context.",
    "terminalDemo": {
      "prompt": "Load API schema resource",
      "logs": [
        {
          "text": "[SYSTEM] Reading resource: mcp://api-server/schema/v1",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[MCP_SERVER] Streaming 15KB JSON schema...",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "[SYSTEM] Resource appended to LLM context block.",
          "type": "success",
          "delay": 600
        },
        {
          "text": "[AGENT] I can see the schema. What endpoint do you need help with?",
          "type": "output",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "What is the primary difference between an MCP Tool and an MCP Resource?",
      "options": [
        {
          "id": "a",
          "text": "Tools are executed by the LLM, Resources are read by the client to populate context"
        },
        {
          "id": "b",
          "text": "Resources are write-only"
        },
        {
          "id": "c",
          "text": "Tools use HTTP, Resources use stdio"
        }
      ],
      "correctAnswer": "a"
    }
  },
  {
    "id": "2.4",
    "domain": 2,
    "title": "2.4 Design tool schemas for MCP",
    "content": "Tool definitions in MCP use JSON Schema. A well-designed schema is crucial for the LLM to understand how and when to use the tool. It requires clear descriptions, strict type definitions, and explicitly marking required vs. optional properties.",
    "terminalDemo": {
      "prompt": "Validating Tool Schema",
      "logs": [
        {
          "text": "Validating schema for: search_code",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[WARNING] Parameter 'query' is missing a description field.",
          "type": "error",
          "delay": 800
        },
        {
          "text": "[FIX] Added description: \"The exact string or regex pattern to search for\".",
          "type": "info",
          "delay": 800
        },
        {
          "text": "Schema validation passed. Registered with LLM router.",
          "type": "success",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Which schema component is most critical for an LLM to decide whether to invoke a tool?",
      "options": [
        {
          "id": "a",
          "text": "The tool name and description"
        },
        {
          "id": "b",
          "text": "The maximum timeout integer"
        },
        {
          "id": "c",
          "text": "The server's IP address"
        }
      ],
      "correctAnswer": "a"
    }
  },
  {
    "id": "2.5",
    "domain": 2,
    "title": "2.5 Select and apply built-in tools (Read, Write, Edit, Bash, Grep, Glob) effectively",
    "content": "Claude Code provides built-in file manipulation tools. `Grep` is ideal for searching across a codebase, while `Glob` finds files by path pattern. `Edit` uses string matching for fast replacements, but if the match isn't unique, falling back to `Read` followed by `Write` guarantees correctness.",
    "terminalDemo": {
      "prompt": "Find where 'processPayment' is used and update it.",
      "logs": [
        {
          "text": "Executing tool: grep(pattern='processPayment')",
          "type": "tool",
          "delay": 500
        },
        {
          "text": "Found 3 references in src/checkout.ts",
          "type": "success",
          "delay": 800
        },
        {
          "text": "Executing tool: edit(file='src/checkout.ts')",
          "type": "tool",
          "delay": 600
        },
        {
          "text": "[ERROR] Target content not unique.",
          "type": "error",
          "delay": 500
        },
        {
          "text": "Executing tool: read_file(file='src/checkout.ts')",
          "type": "tool",
          "delay": 600
        },
        {
          "text": "Executing tool: write_file(file='src/checkout.ts')",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "Update applied successfully.",
          "type": "success",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "What should an agent do if an `Edit` tool call fails due to a non-unique text match?",
      "options": [
        {
          "id": "a",
          "text": "Fail the task and ask the user for help"
        },
        {
          "id": "b",
          "text": "Use the Bash tool to run a sed command instead"
        },
        {
          "id": "c",
          "text": "Fallback to using Read to get the full file, then Write to replace the entire contents"
        }
      ],
      "correctAnswer": "c"
    }
  },
  {
    "id": "3.1",
    "domain": 3,
    "title": "3.1 Write effective CLAUDE.md guidelines",
    "content": "The `CLAUDE.md` file is the master prompt configuration for Claude in a repository. It establishes project-specific coding standards, build commands, and behavioral constraints that Claude automatically injects into its system prompt.",
    "terminalDemo": {
      "prompt": "User: Create a new React component.",
      "logs": [
        {
          "text": "[SYSTEM] Loading workspace CLAUDE.md...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[RULE] \"Use functional components with hooks. Do NOT use class components.\"",
          "type": "info",
          "delay": 800
        },
        {
          "text": "[AGENT] Writing functional component ProfileCard.tsx...",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "[AGENT] Component generated adhering to local guidelines.",
          "type": "success",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "What is the primary purpose of a CLAUDE.md file?",
      "options": [
        {
          "id": "a",
          "text": "To store API keys securely"
        },
        {
          "id": "b",
          "text": "To define persistent project guidelines and build commands for the agent"
        },
        {
          "id": "c",
          "text": "To keep a log of all agent conversations"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "3.2",
    "domain": 3,
    "title": "3.2 Create and configure custom slash commands and skills",
    "content": "Skills (`SKILL.md`) allow packaging complex behaviors. You can configure `context: fork` in a skill's frontmatter to run it in an isolated subagent, keeping verbose exploratory output from polluting the main conversation history.",
    "terminalDemo": {
      "prompt": "/brainstorm-architecture",
      "logs": [
        {
          "text": "[SYSTEM] Executing skill 'brainstorm-architecture' (context: fork)",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[SUBAGENT] Analyzing codebase...",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "[SUBAGENT] Generated 3 extensive proposals (12,000 tokens)",
          "type": "info",
          "delay": 1000
        },
        {
          "text": "[SYSTEM] Subagent finished. Returning summary to main context.",
          "type": "success",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "What does setting `context: fork` in a SKILL.md frontmatter achieve?",
      "options": [
        {
          "id": "a",
          "text": "It clones the git repository"
        },
        {
          "id": "b",
          "text": "It isolates the skill's execution in a subagent so its verbose output doesn't pollute the main conversation"
        },
        {
          "id": "c",
          "text": "It shares the skill with all users in the workspace"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "3.3",
    "domain": 3,
    "title": "3.3 Apply path-specific rules for conditional convention loading",
    "content": "To prevent token bloat, rules shouldn't be loaded globally if they only apply to specific files. By adding a `paths` glob array to the frontmatter of a rule file in `.claude/rules/`, Claude only loads the rule when editing matching files.",
    "terminalDemo": {
      "prompt": "Update the authentication test.",
      "logs": [
        {
          "text": "[SYSTEM] User requested edit to `auth.test.tsx`",
          "type": "info",
          "delay": 500
        },
        {
          "text": "[SYSTEM] Matched rule path `**/*.test.tsx`. Loading `testing.md`...",
          "type": "system",
          "delay": 800
        },
        {
          "text": "[AGENT] Applying mock convention specified in testing rules.",
          "type": "success",
          "delay": 800
        }
      ]
    },
    "knowledgeCheck": {
      "question": "How do you ensure a specific set of rules only loads when editing test files?",
      "options": [
        {
          "id": "a",
          "text": "Put the rules in a file in `.claude/rules/` with `paths: [\"**/*.test.*\"]` in the frontmatter"
        },
        {
          "id": "b",
          "text": "Put the rules in `~/.claude/CLAUDE.md`"
        },
        {
          "id": "c",
          "text": "Use the /memory command before editing"
        }
      ],
      "correctAnswer": "a"
    }
  },
  {
    "id": "3.4",
    "domain": 3,
    "title": "3.4 Manage fork vs. shared context",
    "content": "When dealing with complex tasks, agents can `fork` context. A shared context means all subagents see the same giant conversation history (slow, expensive). A forked context means the subagent only receives a clean, minimal prompt with the specific task parameters (fast, efficient).",
    "terminalDemo": {
      "prompt": "Delegate analysis task",
      "logs": [
        {
          "text": "[COORDINATOR] Current context size: 85,000 tokens.",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[COORDINATOR] Spawning analyzer_subagent (Context strategy: FORK)",
          "type": "info",
          "delay": 800
        },
        {
          "text": "[SUBAGENT] Initialized with 1,200 token context (Task only).",
          "type": "success",
          "delay": 800
        },
        {
          "text": "[SUBAGENT] Task completed in 2.1s.",
          "type": "output",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Why is forking context preferred over sharing context for isolated subagent tasks?",
      "options": [
        {
          "id": "a",
          "text": "It prevents context overflow and reduces token cost/latency"
        },
        {
          "id": "b",
          "text": "It makes the subagent smarter"
        },
        {
          "id": "c",
          "text": "It allows the subagent to read the user's entire history"
        }
      ],
      "correctAnswer": "a"
    }
  },
  {
    "id": "3.5",
    "domain": 3,
    "title": "3.5 Apply iterative refinement techniques",
    "content": "When dealing with complex code generation, providing concrete input/output examples is much more effective than adding paragraphs of prose. Additionally, adopting a test-driven iteration loop (writing tests, failing them, then fixing code) yields the most robust results.",
    "terminalDemo": {
      "prompt": "Fix the date parsing logic to match the new format.",
      "logs": [
        {
          "text": "[AGENT] Updating parser...",
          "type": "tool",
          "delay": 500
        },
        {
          "text": "[USER] The parser is still missing timezone offsets. Example: '2023-01-01T12:00+05:00' -> should yield offset 300.",
          "type": "system",
          "delay": 1200
        },
        {
          "text": "[AGENT] I see the concrete example. Updating regex to capture timezone component...",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "Tests passed: 5/5",
          "type": "success",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "When natural language instructions produce inconsistent code generation, what is the most effective way to refine the prompt?",
      "options": [
        {
          "id": "a",
          "text": "Write longer, more descriptive paragraphs"
        },
        {
          "id": "b",
          "text": "Tell the model to 'think harder' and 'be careful'"
        },
        {
          "id": "c",
          "text": "Provide 2-3 concrete input/output examples"
        }
      ],
      "correctAnswer": "c"
    }
  },
  {
    "id": "3.6",
    "domain": 3,
    "title": "3.6 Integrate Claude Code into CI/CD pipelines",
    "content": "Claude Code can run in CI pipelines to perform automated code review or generate tests. Use the `-p` (print) flag to prevent interactive hangs, and `--output-format json` to generate structured findings that scripts can parse into PR comments.",
    "terminalDemo": {
      "prompt": "claude -p --output-format json 'Review src/ for security issues'",
      "logs": [
        {
          "text": "[CI PIPELINE] Triggering Claude Code in headless mode...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[AGENT] Analyzing src/auth.ts...",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "[AGENT] Generating JSON output...",
          "type": "info",
          "delay": 600
        },
        {
          "text": "{\n  \"findings\": [\n    {\"file\": \"auth.ts\", \"issue\": \"Hardcoded secret\"}\n  ]\n}",
          "type": "success",
          "delay": 800
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Which flag is critical to prevent Claude Code from hanging while waiting for user input when running in a CI/CD pipeline?",
      "options": [
        {
          "id": "a",
          "text": "--ci"
        },
        {
          "id": "b",
          "text": "-p (or --print)"
        },
        {
          "id": "c",
          "text": "--headless"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "4.1",
    "domain": 4,
    "title": "4.1 Design prompts with explicit criteria to improve precision",
    "content": "Vague instructions like 'only report high-confidence findings' fail to improve precision. Instead, define specific categorical criteria (e.g., 'flag comments only when claimed behavior contradicts actual code behavior').",
    "terminalDemo": {
      "prompt": "Review for comment drift.",
      "logs": [
        {
          "text": "[SYSTEM] Vague Prompt: 'Find bad comments. Be conservative.'",
          "type": "error",
          "delay": 500
        },
        {
          "text": "[AGENT] Result: 14 minor stylistic issues (False Positives).",
          "type": "info",
          "delay": 800
        },
        {
          "text": "[SYSTEM] Explicit Prompt: 'Flag comments ONLY if they describe a parameter that no longer exists in the function signature.'",
          "type": "success",
          "delay": 1200
        },
        {
          "text": "[AGENT] Result: 2 critical documentation drift issues.",
          "type": "output",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "How should you reduce false positives in a review agent's output?",
      "options": [
        {
          "id": "a",
          "text": "Tell the model to 'only report things you are 95% sure about'"
        },
        {
          "id": "b",
          "text": "Lower the model temperature to 0"
        },
        {
          "id": "c",
          "text": "Replace general heuristics with highly specific, categorical inclusion/exclusion criteria"
        }
      ],
      "correctAnswer": "c"
    }
  },
  {
    "id": "4.2",
    "domain": 4,
    "title": "4.2 Use few-shot prompting for tool constraints",
    "content": "When tools require highly specific input formats (like an advanced regex or a custom query language), zero-shot descriptions are often insufficient. Providing 2-3 examples (few-shot prompting) inside the tool description drastically reduces hallucinated or malformed tool calls.",
    "terminalDemo": {
      "prompt": "Agent attempting custom query tool",
      "logs": [
        {
          "text": "[AGENT] Analyzing tool schema for `query_metrics`...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[SCHEMA] Example 1: query_metrics(\"cpu_usage > 90% FOR 5m\")",
          "type": "info",
          "delay": 800
        },
        {
          "text": "[SCHEMA] Example 2: query_metrics(\"mem_free < 1G\")",
          "type": "info",
          "delay": 800
        },
        {
          "text": "[AGENT] Calling tool: query_metrics(\"disk_space < 10% FOR 1h\")",
          "type": "tool",
          "delay": 1000
        },
        {
          "text": "Query syntax valid. Results returned.",
          "type": "success",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "What is the benefit of placing few-shot examples inside a tool's schema description?",
      "options": [
        {
          "id": "a",
          "text": "It trains a new model"
        },
        {
          "id": "b",
          "text": "It prevents the LLM from making malformed syntax errors when calling the tool"
        },
        {
          "id": "c",
          "text": "It bypasses API rate limits"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "4.3",
    "domain": 4,
    "title": "4.3 Enforce structured output using tool use and JSON schemas",
    "content": "To guarantee structured JSON output without syntax errors, define a tool with a strict JSON schema and use `tool_choice: 'any'` (or a specific tool). Make fields optional if the source document might lack the information, preventing hallucination.",
    "terminalDemo": {
      "prompt": "Extract invoice details using extraction_tool",
      "logs": [
        {
          "text": "[SYSTEM] Enforcing tool_choice: {'type':'tool', 'name':'extract_invoice'}",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[AGENT] stop_reason = tool_use",
          "type": "info",
          "delay": 800
        },
        {
          "text": "Argument: { 'invoice_id': 'INV-99', 'tax_amount': null }",
          "type": "success",
          "delay": 800
        },
        {
          "text": "[SYSTEM] Missing optional field correctly returned as null instead of fabricated.",
          "type": "output",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "How can you prevent an extraction agent from fabricating data for fields that don't exist in the source document?",
      "options": [
        {
          "id": "a",
          "text": "Tell the model not to hallucinate in the system prompt"
        },
        {
          "id": "b",
          "text": "Make those fields optional in the JSON schema"
        },
        {
          "id": "c",
          "text": "Run the prompt multiple times and take the average"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "4.4",
    "domain": 4,
    "title": "4.4 Implement validation, retry, and feedback loops",
    "content": "When structured extraction fails semantic validation (e.g., line items don't sum to the total), implement a retry loop. Send the original document, the failed output, and the specific validation error back to the model for self-correction.",
    "terminalDemo": {
      "prompt": "Validate extracted JSON",
      "logs": [
        {
          "text": "[SYSTEM] Validation failed: items (10+15) do not match total (30)",
          "type": "error",
          "delay": 500
        },
        {
          "text": "[SYSTEM] Retrying... appending error feedback to context.",
          "type": "info",
          "delay": 800
        },
        {
          "text": "[AGENT] I see the error. Re-evaluating source document...",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "[AGENT] Corrected payload generated.",
          "type": "success",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "When is a retry-with-feedback loop INEFFECTIVE?",
      "options": [
        {
          "id": "a",
          "text": "When the extracted values do not mathematically sum to the total"
        },
        {
          "id": "b",
          "text": "When the required information is completely absent from the provided source documents"
        },
        {
          "id": "c",
          "text": "When the model places a valid string into the wrong schema field"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "4.5",
    "domain": 4,
    "title": "4.5 Design efficient batch processing strategies",
    "content": "The Message Batches API offers 50% cost savings for latency-tolerant workflows (like overnight analysis). However, batch processing does not support multi-turn tool calling mid-request. Use `custom_id` to correlate inputs and handle localized failures.",
    "terminalDemo": {
      "prompt": "Submit 10,000 documents for batch analysis",
      "logs": [
        {
          "text": "[SYSTEM] Submitting Batch Job (SLA: 24h)...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "Waiting for asynchronous completion...",
          "type": "info",
          "delay": 1500
        },
        {
          "text": "[SYSTEM] Batch complete. 9,998 succeeded, 2 failed.",
          "type": "success",
          "delay": 500
        },
        {
          "text": "[SYSTEM] Correlating failures via custom_id and re-queueing.",
          "type": "tool",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Which workflow is appropriate for the Message Batches API?",
      "options": [
        {
          "id": "a",
          "text": "A live customer support chatbot"
        },
        {
          "id": "b",
          "text": "A blocking pre-merge pull request review"
        },
        {
          "id": "c",
          "text": "A weekly automated audit of all codebase dependencies"
        }
      ],
      "correctAnswer": "c"
    }
  },
  {
    "id": "4.6",
    "domain": 4,
    "title": "4.6 Design multi-instance and multi-pass review architectures",
    "content": "An LLM is bad at reviewing its own code because it retains its original reasoning context. Always use a second, independent agent instance for review. For large changes, split the review into isolated per-file passes and a final cross-file integration pass.",
    "terminalDemo": {
      "prompt": "Initiating code review...",
      "logs": [
        {
          "text": "[GENERATOR] Wrote 500 lines of complex logic.",
          "type": "info",
          "delay": 500
        },
        {
          "text": "[SYSTEM] Spawning fresh REVIEWER agent without generation history.",
          "type": "system",
          "delay": 800
        },
        {
          "text": "[REVIEWER] Found subtle race condition in line 42.",
          "type": "error",
          "delay": 1000
        },
        {
          "text": "[SYSTEM] Sending feedback back to GENERATOR.",
          "type": "success",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Why is it better to use a fresh, independent agent instance to review generated code rather than asking the generating agent to review itself?",
      "options": [
        {
          "id": "a",
          "text": "The generating agent retains its flawed reasoning context and is less likely to question its own decisions"
        },
        {
          "id": "b",
          "text": "It saves token costs"
        },
        {
          "id": "c",
          "text": "The generating agent gets tired"
        }
      ],
      "correctAnswer": "a"
    }
  },
  {
    "id": "5.1",
    "domain": 5,
    "title": "5.1 Manage conversation context to preserve critical info",
    "content": "Progressive summarization saves tokens but often destroys critical transactional data (IDs, dates, amounts). To solve this, extract vital facts into a persistent `<case_facts>` block that is passed alongside the summary to protect it from the 'lost in the middle' effect.",
    "terminalDemo": {
      "prompt": "Handling long conversation...",
      "logs": [
        {
          "text": "[SYSTEM] Conversation reaching context limit (80k tokens).",
          "type": "error",
          "delay": 500
        },
        {
          "text": "[AGENT] Extracting to case facts: { order: 'O-99', amount: 45.00 }",
          "type": "tool",
          "delay": 800
        },
        {
          "text": "[SYSTEM] Compacting turns 1-40 into summary...",
          "type": "info",
          "delay": 800
        },
        {
          "text": "[SYSTEM] Next prompt injected with Case Facts + Summary.",
          "type": "success",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "What is the risk of using progressive summarization to manage context limits?",
      "options": [
        {
          "id": "a",
          "text": "It increases latency dramatically"
        },
        {
          "id": "b",
          "text": "It can condense and lose critical transactional details like IDs or stated expectations"
        },
        {
          "id": "c",
          "text": "It causes the model to hallucinate new languages"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "5.2",
    "domain": 5,
    "title": "5.2 Design effective escalation patterns",
    "content": "Agents should escalate when customers explicitly demand a human, when facing policy exceptions, or when progress stalls. Avoid escalating based solely on negative sentiment if the agent has the capability to cleanly resolve the issue.",
    "terminalDemo": {
      "prompt": "User: 'I'm so angry about this late package! Fix it now.'",
      "logs": [
        {
          "text": "[AGENT] Analyzing sentiment: High frustration.",
          "type": "info",
          "delay": 500
        },
        {
          "text": "[AGENT] Analyzing request: User wants package tracking/resolution.",
          "type": "info",
          "delay": 600
        },
        {
          "text": "[AGENT] I have the tools to track and refund late packages.",
          "type": "success",
          "delay": 800
        },
        {
          "text": "[AGENT] Response: 'I understand your frustration. I have located your package and am issuing a refund.'",
          "type": "output",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "If a customer expresses high frustration but asks for something the agent can easily resolve via tools, what should the agent do?",
      "options": [
        {
          "id": "a",
          "text": "Immediately escalate to a human due to the negative sentiment"
        },
        {
          "id": "b",
          "text": "Acknowledge the frustration and attempt to resolve the issue autonomously"
        },
        {
          "id": "c",
          "text": "End the chat"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "5.3",
    "domain": 5,
    "title": "5.3 Debug context window overflows",
    "content": "When an agent runs for too many turns or ingests too many large files, it hits its maximum context window (e.g., 200k tokens). Architects must implement truncation strategies: summarizing past turns, dropping oldest logs, or using prompt caching to mitigate overflow.",
    "terminalDemo": {
      "prompt": "Simulating long-running debug session",
      "logs": [
        {
          "text": "[SYSTEM] Turn 45. Context size: 198,500 tokens.",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[WARNING] Approaching context limit!",
          "type": "error",
          "delay": 800
        },
        {
          "text": "[SYSTEM] Executing compaction strategy...",
          "type": "info",
          "delay": 800
        },
        {
          "text": "[SYSTEM] Summarized turns 1-30. Dropped 50,000 tokens.",
          "type": "success",
          "delay": 1200
        },
        {
          "text": "[SYSTEM] Context size: 148,500 tokens. Continuing loop.",
          "type": "output",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Which is a valid architectural strategy for preventing context window overflow in an agentic loop?",
      "options": [
        {
          "id": "a",
          "text": "Switching from Claude 3.5 Sonnet to Haiku"
        },
        {
          "id": "b",
          "text": "Summarizing and evicting older conversation turns while maintaining current state"
        },
        {
          "id": "c",
          "text": "Adding more RAM to the server"
        }
      ],
      "correctAnswer": "b"
    }
  },
  {
    "id": "5.4",
    "domain": 5,
    "title": "5.4 Manage context effectively in large codebase exploration",
    "content": "During long codebase explorations, models experience context degradation (giving inconsistent answers based on 'typical patterns' rather than exact facts). Use scratchpad files to persist key findings, and spawn subagents for verbose discovery to keep the coordinator's context clean.",
    "terminalDemo": {
      "prompt": "Explore massive monorepo architecture",
      "logs": [
        {
          "text": "[COORDINATOR] Spawning subagent to explore /auth directory...",
          "type": "system",
          "delay": 500
        },
        {
          "text": "[SUBAGENT] Read 40 files. Summarizing...",
          "type": "tool",
          "delay": 1200
        },
        {
          "text": "[COORDINATOR] Writing summary to 'architecture_scratchpad.md'",
          "type": "success",
          "delay": 800
        },
        {
          "text": "[COORDINATOR] Cleared subagent context. Memory remains pristine.",
          "type": "info",
          "delay": 500
        }
      ]
    },
    "knowledgeCheck": {
      "question": "What is the best way to prevent context degradation during a long codebase exploration?",
      "options": [
        {
          "id": "a",
          "text": "Use scratchpad files to persist key findings and spawn subagents for verbose discovery tasks"
        },
        {
          "id": "b",
          "text": "Increase the context window to 2 million tokens"
        },
        {
          "id": "c",
          "text": "Use Glob instead of Grep"
        }
      ],
      "correctAnswer": "a"
    }
  },
  {
    "id": "5.5",
    "domain": 5,
    "title": "5.5 Design human review workflows and confidence calibration",
    "content": "Aggregate accuracy metrics hide segment-specific failures. Always output field-level confidence scores calibrated against validation sets. Route low-confidence extractions, or a stratified random sample of high-confidence ones, to limited human reviewers.",
    "terminalDemo": {
      "prompt": "Evaluate extraction confidence",
      "logs": [
        {
          "text": "Extracting from W2 form...",
          "type": "tool",
          "delay": 500
        },
        {
          "text": "Wages: $45,000 (Confidence: 0.99)",
          "type": "success",
          "delay": 600
        },
        {
          "text": "Tax Withheld: [Illegible] (Confidence: 0.35)",
          "type": "error",
          "delay": 600
        },
        {
          "text": "Routing document to Human Review Queue...",
          "type": "info",
          "delay": 800
        }
      ]
    },
    "knowledgeCheck": {
      "question": "Why is stratified random sampling of high-confidence automated extractions necessary?",
      "options": [
        {
          "id": "a",
          "text": "To keep human reviewers busy"
        },
        {
          "id": "b",
          "text": "To train a new base model"
        },
        {
          "id": "c",
          "text": "To measure ongoing error rates and detect novel failure patterns in supposedly safe extractions"
        }
      ],
      "correctAnswer": "c"
    }
  },
  {
    "id": "5.6",
    "domain": 5,
    "title": "5.6 Preserve information provenance and handle uncertainty",
    "content": "When summarizing across multiple documents, source attribution is easily lost. Subagents must output structured claim-source mappings. If sources conflict, annotate the conflict with attribution rather than hallucinating an arbitrary resolution.",
    "terminalDemo": {
      "prompt": "Synthesize market sizing reports",
      "logs": [
        {
          "text": "[SUBAGENT] Report A: Market is $5B.",
          "type": "info",
          "delay": 500
        },
        {
          "text": "[SUBAGENT] Report B: Market is $7B.",
          "type": "info",
          "delay": 500
        },
        {
          "text": "[SYNTHESIS] Processing conflicting data...",
          "type": "system",
          "delay": 800
        },
        {
          "text": "Result: 'Market size estimates vary: $5B [Source A] to $7B [Source B]'",
          "type": "success",
          "delay": 800
        }
      ]
    },
    "knowledgeCheck": {
      "question": "How should a synthesis agent handle conflicting facts from two credible source documents?",
      "options": [
        {
          "id": "a",
          "text": "Average the two numbers"
        },
        {
          "id": "b",
          "text": "Pick the one from the longer document"
        },
        {
          "id": "c",
          "text": "Preserve both claims, annotating them with explicit source attributions"
        }
      ],
      "correctAnswer": "c"
    }
  }
];
