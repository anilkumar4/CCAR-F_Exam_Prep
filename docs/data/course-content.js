const COURSE_DATA = [
  {
    id: "1.1",
    domain: 1,
    title: "1.1 Design and implement agentic loops",
    content: "An agentic loop is the core control structure that allows an LLM to interact with its environment. Instead of a single call-and-response, the agent runs in a loop. It decides to use a tool (`stop_reason == 'tool_use'`), the system executes the tool and appends the result, and the loop continues until the agent decides it has finished (`stop_reason == 'end_turn'`).",
    terminalDemo: {
      prompt: "Can you check my balance and then my recent tickets?",
      logs: [
        { text: "[SYSTEM] Initializing Agentic Loop...", type: "system", delay: 500 },
        { text: "[AGENT] stop_reason: tool_use", type: "info", delay: 800 },
        { text: "Executing tool: get_balance(user_id='u123')", type: "tool", delay: 1200 },
        { text: "Result: { balance: $50 }", type: "success", delay: 800 },
        { text: "[AGENT] stop_reason: tool_use", type: "info", delay: 800 },
        { text: "Executing tool: get_tickets(user_id='u123')", type: "tool", delay: 1200 },
        { text: "Result: { tickets: ['T-882'] }", type: "success", delay: 800 },
        { text: "[AGENT] stop_reason: end_turn", type: "info", delay: 800 },
        { text: "Synthesis: You have $50 and 1 open ticket.", type: "output", delay: 500 }
      ]
    },
    knowledgeCheck: {
      question: "What is the correct programmatic condition to continue an agentic loop?",
      options: [
        { id: "a", text: "Parse the text for the word 'done'" },
        { id: "b", text: "Continue while stop_reason == 'tool_use'" },
        { id: "c", text: "Run for a fixed cap of 5 iterations" }
      ],
      correctAnswer: "b"
    }
  },
  {
    id: "1.2",
    domain: 1,
    title: "1.2 Orchestrate multi-agent systems",
    content: "A Hub-and-Spoke architecture uses a Coordinator (Hub) agent to delegate tasks to specialized Subagents (Spokes). The critical rule is that Subagents DO NOT inherit the Coordinator's context window. The Coordinator must explicitly pass required context (like a user ID) into the Subagent's prompt.",
    terminalDemo: {
      prompt: "Help me debug this multi-agent failure.",
      logs: [
        { text: "[COORDINATOR] Spawning Search Subagent...", type: "system", delay: 500 },
        { text: "[SUBAGENT] Error: I don't know who the user is.", type: "error", delay: 800 },
        { text: "[COORDINATOR] Retrying. Passing context: { user_id: 'u123' }", type: "system", delay: 1200 },
        { text: "[SUBAGENT] Searching database for u123...", type: "tool", delay: 800 },
        { text: "[SUBAGENT] Found 3 results.", type: "success", delay: 800 },
        { text: "[COORDINATOR] Received results. Terminating subagent.", type: "info", delay: 500 }
      ]
    },
    knowledgeCheck: {
      question: "In a Hub-and-Spoke architecture, how does a subagent know the user's ID?",
      options: [
        { id: "a", text: "It automatically reads the Coordinator's memory" },
        { id: "b", text: "The Coordinator must explicitly pass the ID in the prompt to the subagent" },
        { id: "c", text: "The subagent uses a global variable" }
      ],
      correctAnswer: "b"
    }
  },
  {
    id: "1.3",
    domain: 1,
    title: "1.3 Configure subagent invocation models",
    content: "When spawning subagents, you must configure their LLM model appropriately. A 'Routing' subagent that simply classifies intents should use a fast, cheap model (like Haiku). A 'Coding' subagent requires a highly capable model (like Sonnet or Opus). Mismatching models leads to high latency or poor reasoning.",
    terminalDemo: {
      prompt: "Simulating dynamic model selection...",
      logs: [
        { text: "[REQUEST] 'Reset my password'", type: "system", delay: 500 },
        { text: "Spawning intent_classifier (Model: claude-3-haiku)...", type: "tool", delay: 600 },
        { text: "Intent detected: 'Account Recovery'", type: "success", delay: 500 },
        { text: "[REQUEST] 'Write a complex Rust server algorithm'", type: "system", delay: 1000 },
        { text: "Spawning code_generator (Model: claude-3-5-sonnet)...", type: "tool", delay: 800 },
        { text: "Code generated successfully.", type: "success", delay: 1500 }
      ]
    },
    knowledgeCheck: {
      question: "Which task is best suited for Claude 3.5 Haiku as a subagent?",
      options: [
        { id: "a", text: "Complex architectural refactoring" },
        { id: "b", text: "Quickly classifying user intent from a dropdown list" },
        { id: "c", text: "Analyzing a 100-page legal contract" }
      ],
      correctAnswer: "b"
    }
  },
  {
    id: "1.4",
    domain: 1,
    title: "1.4 Implement multi-step workflows",
    content: "Complex tasks must be broken down into Directed Acyclic Graphs (DAGs) or State Machines. For example, an ETL pipeline might have states: Extract -> Transform -> Load. Agents transition between these states, allowing the system to track progress and resume if interrupted.",
    terminalDemo: {
      prompt: "Execute Report Generation Workflow",
      logs: [
        { text: "[STATE: EXTRACT] Fetching raw data...", type: "system", delay: 500 },
        { text: "Data fetched (10MB). Transitioning to TRANSFORM.", type: "success", delay: 800 },
        { text: "[STATE: TRANSFORM] Normalizing dates...", type: "system", delay: 500 },
        { text: "Normalization complete. Transitioning to LOAD.", type: "success", delay: 1000 },
        { text: "[STATE: LOAD] Writing to database...", type: "system", delay: 500 },
        { text: "Workflow complete.", type: "output", delay: 500 }
      ]
    },
    knowledgeCheck: {
      question: "What is the primary benefit of modeling a workflow as a State Machine?",
      options: [
        { id: "a", text: "It allows the process to resume from the last successful state if interrupted" },
        { id: "b", text: "It reduces the API cost" },
        { id: "c", text: "It prevents hallucination" }
      ],
      correctAnswer: "a"
    }
  },
  {
    id: "1.5",
    domain: 1,
    title: "1.5 Apply Agent SDK hooks for logging",
    content: "When building with the Claude Agent SDK, you cannot rely on print statements. You must use lifecycle hooks (e.g., `on_tool_call`, `on_tool_result`, `on_turn_complete`) to emit structured logs for observability and debugging.",
    terminalDemo: {
      prompt: "Show SDK Hook execution order",
      logs: [
        { text: "EVENT: on_turn_start (msg='What is the weather?')", type: "info", delay: 500 },
        { text: "EVENT: on_tool_call (tool='get_weather')", type: "tool", delay: 800 },
        { text: "EVENT: on_tool_result (status=200)", type: "success", delay: 800 },
        { text: "EVENT: on_turn_complete (usage={tokens: 150})", type: "info", delay: 500 }
      ]
    },
    knowledgeCheck: {
      question: "Which hook should you use to record the execution time of a specific tool?",
      options: [
        { id: "a", text: "on_turn_start" },
        { id: "b", text: "on_tool_result (calculating diff from on_tool_call)" },
        { id: "c", text: "on_message_complete" }
      ],
      correctAnswer: "b"
    }
  },
  {
    id: "1.6",
    domain: 1,
    title: "1.6 Design task decomposition logic",
    content: "Task decomposition is the process of breaking a user's prompt into parallel executable steps. Instead of searching for 3 items sequentially (taking 15 seconds), an agent can decompose the request and trigger 3 parallel tool calls (taking 5 seconds).",
    terminalDemo: {
      prompt: "User: 'Compare the weather in NY, London, and Tokyo'",
      logs: [
        { text: "[DECOMPOSITION] Splitting request into 3 parallel tasks...", type: "system", delay: 500 },
        { text: "Executing tool: get_weather('NY') [ASYNC]", type: "tool", delay: 400 },
        { text: "Executing tool: get_weather('London') [ASYNC]", type: "tool", delay: 400 },
        { text: "Executing tool: get_weather('Tokyo') [ASYNC]", type: "tool", delay: 400 },
        { text: "All 3 results received concurrently.", type: "success", delay: 1000 }
      ]
    },
    knowledgeCheck: {
      question: "What is the main architectural advantage of task decomposition?",
      options: [
        { id: "a", text: "Reduced latency through parallel execution" },
        { id: "b", text: "Reduced token usage" },
        { id: "c", text: "Better grammar in the final response" }
      ],
      correctAnswer: "a"
    }
  },
  {
    id: "1.7",
    domain: 1,
    title: "1.7 Manage session state across turns",
    content: "Stateless APIs require you to pass the entire conversation history back with every request. To prevent the 'Lost in the Middle' effect where the LLM forgets early details, you should extract important transactional data (like an Order ID) into a persistent `<case_facts>` block.",
    terminalDemo: {
      prompt: "Simulating progressive summarization vs Case Facts...",
      logs: [
        { text: "[TURN 1] User provides Order ID: ORD-551", type: "info", delay: 500 },
        { text: "[SYSTEM] Extracting to persistent state...", type: "system", delay: 600 },
        { text: "<case_facts> order_id = ORD-551 </case_facts>", type: "success", delay: 800 },
        { text: "[TURN 20] Conversation history summarized (Order ID lost from text)", type: "error", delay: 1200 },
        { text: "[SYSTEM] Re-injecting fresh Case Facts into prompt...", type: "info", delay: 800 },
        { text: "Agent correctly references ORD-551.", type: "success", delay: 500 }
      ]
    },
    knowledgeCheck: {
      question: "Why should you use a <case_facts> block instead of relying on the conversation history?",
      options: [
        { id: "a", text: "Because it looks cooler" },
        { id: "b", text: "To protect critical identifiers from being lost during conversation summarization" },
        { id: "c", text: "To reduce API latency" }
      ],
      correctAnswer: "b"
    }
  }
,{"id": "2.1", "domain": 2, "title": "2.1 Integrate MCP Servers", "content": "The Model Context Protocol (MCP) allows Claude to interact with external tools and resources securely. Integrating an MCP server involves defining the server configuration in the client (like Claude Code) and ensuring the transport layer (stdio or HTTP/SSE) is correctly established.", "terminalDemo": {"prompt": "Initialize GitHub MCP Server", "logs": [{"text": "[SYSTEM] Spawning MCP process: npx -y @modelcontextprotocol/server-github", "type": "system", "delay": 500}, {"text": "[MCP_CLIENT] Connecting via stdio transport...", "type": "info", "delay": 800}, {"text": "[MCP_SERVER] Server initialized with capabilities: { tools: true, resources: true }", "type": "success", "delay": 800}, {"text": "[AGENT] Discovered 12 tools from github-server.", "type": "tool", "delay": 500}]}, "knowledgeCheck": {"question": "Which transport protocol is typically used for local, command-line MCP servers?", "options": [{"id": "a", "text": "HTTP/REST"}, {"id": "b", "text": "stdio (Standard Input/Output)"}, {"id": "c", "text": "GraphQL"}], "correctAnswer": "b"}}, {"id": "2.2", "domain": 2, "title": "2.2 Handle structured MCP errors", "content": "When tools fail, agents must receive structured errors rather than raw stack traces. MCP defines standard error codes. The agent uses these structured messages to determine whether to retry with different parameters, ask the user for help, or fallback to another tool.", "terminalDemo": {"prompt": "Read file: /secret/config.yaml", "logs": [{"text": "[AGENT] Calling tool: read_file(path='/secret/config.yaml')", "type": "tool", "delay": 500}, {"text": "[MCP_SERVER] Error 403: Access Denied. Directory outside allowed workspace.", "type": "error", "delay": 800}, {"text": "[AGENT] Received structured error. stop_reason = tool_use (fallback)", "type": "info", "delay": 800}, {"text": "[AGENT] Synthesis: I do not have permission to read that file. Can you provide the contents?", "type": "output", "delay": 500}]}, "knowledgeCheck": {"question": "Why is returning a structured error message to an LLM agent better than a raw crash dump?", "options": [{"id": "a", "text": "It saves token bandwidth"}, {"id": "b", "text": "It allows the agent to reason about the failure and attempt a logical fallback"}, {"id": "c", "text": "LLMs cannot process crash dumps"}], "correctAnswer": "b"}}, {"id": "2.3", "domain": 2, "title": "2.3 Implement resource-based context fetching", "content": "MCP Resources allow servers to expose data without requiring the LLM to explicitly call a tool. Resources are referenced via URIs (e.g., `file:///path` or `postgres://schema/table`). The client reads these resources to pre-populate the LLM context.", "terminalDemo": {"prompt": "Load API schema resource", "logs": [{"text": "[SYSTEM] Reading resource: mcp://api-server/schema/v1", "type": "system", "delay": 500}, {"text": "[MCP_SERVER] Streaming 15KB JSON schema...", "type": "tool", "delay": 800}, {"text": "[SYSTEM] Resource appended to LLM context block.", "type": "success", "delay": 600}, {"text": "[AGENT] I can see the schema. What endpoint do you need help with?", "type": "output", "delay": 500}]}, "knowledgeCheck": {"question": "What is the primary difference between an MCP Tool and an MCP Resource?", "options": [{"id": "a", "text": "Tools are executed by the LLM, Resources are read by the client to populate context"}, {"id": "b", "text": "Resources are write-only"}, {"id": "c", "text": "Tools use HTTP, Resources use stdio"}], "correctAnswer": "a"}}, {"id": "2.4", "domain": 2, "title": "2.4 Design tool schemas for MCP", "content": "Tool definitions in MCP use JSON Schema. A well-designed schema is crucial for the LLM to understand how and when to use the tool. It requires clear descriptions, strict type definitions, and explicitly marking required vs. optional properties.", "terminalDemo": {"prompt": "Validating Tool Schema", "logs": [{"text": "Validating schema for: search_code", "type": "system", "delay": 500}, {"text": "[WARNING] Parameter 'query' is missing a description field.", "type": "error", "delay": 800}, {"text": "[FIX] Added description: \"The exact string or regex pattern to search for\".", "type": "info", "delay": 800}, {"text": "Schema validation passed. Registered with LLM router.", "type": "success", "delay": 500}]}, "knowledgeCheck": {"question": "Which schema component is most critical for an LLM to decide whether to invoke a tool?", "options": [{"id": "a", "text": "The tool name and description"}, {"id": "b", "text": "The maximum timeout integer"}, {"id": "c", "text": "The server's IP address"}], "correctAnswer": "a"}}, {"id": "3.1", "domain": 3, "title": "3.1 Write effective CLAUDE.md guidelines", "content": "The `CLAUDE.md` file is the master prompt configuration for Claude in a repository. It establishes project-specific coding standards, build commands, and behavioral constraints that Claude automatically injects into its system prompt.", "terminalDemo": {"prompt": "User: Create a new React component.", "logs": [{"text": "[SYSTEM] Loading workspace CLAUDE.md...", "type": "system", "delay": 500}, {"text": "[RULE] \"Use functional components with hooks. Do NOT use class components.\"", "type": "info", "delay": 800}, {"text": "[AGENT] Writing functional component ProfileCard.tsx...", "type": "tool", "delay": 800}, {"text": "[AGENT] Component generated adhering to local guidelines.", "type": "success", "delay": 500}]}, "knowledgeCheck": {"question": "What is the primary purpose of a CLAUDE.md file?", "options": [{"id": "a", "text": "To store API keys securely"}, {"id": "b", "text": "To define persistent project guidelines and build commands for the agent"}, {"id": "c", "text": "To keep a log of all agent conversations"}], "correctAnswer": "b"}}, {"id": "3.4", "domain": 3, "title": "3.4 Manage fork vs. shared context", "content": "When dealing with complex tasks, agents can `fork` context. A shared context means all subagents see the same giant conversation history (slow, expensive). A forked context means the subagent only receives a clean, minimal prompt with the specific task parameters (fast, efficient).", "terminalDemo": {"prompt": "Delegate analysis task", "logs": [{"text": "[COORDINATOR] Current context size: 85,000 tokens.", "type": "system", "delay": 500}, {"text": "[COORDINATOR] Spawning analyzer_subagent (Context strategy: FORK)", "type": "info", "delay": 800}, {"text": "[SUBAGENT] Initialized with 1,200 token context (Task only).", "type": "success", "delay": 800}, {"text": "[SUBAGENT] Task completed in 2.1s.", "type": "output", "delay": 500}]}, "knowledgeCheck": {"question": "Why is forking context preferred over sharing context for isolated subagent tasks?", "options": [{"id": "a", "text": "It prevents context overflow and reduces token cost/latency"}, {"id": "b", "text": "It makes the subagent smarter"}, {"id": "c", "text": "It allows the subagent to read the user's entire history"}], "correctAnswer": "a"}}, {"id": "4.2", "domain": 4, "title": "4.2 Use few-shot prompting for tool constraints", "content": "When tools require highly specific input formats (like an advanced regex or a custom query language), zero-shot descriptions are often insufficient. Providing 2-3 examples (few-shot prompting) inside the tool description drastically reduces hallucinated or malformed tool calls.", "terminalDemo": {"prompt": "Agent attempting custom query tool", "logs": [{"text": "[AGENT] Analyzing tool schema for `query_metrics`...", "type": "system", "delay": 500}, {"text": "[SCHEMA] Example 1: query_metrics(\"cpu_usage > 90% FOR 5m\")", "type": "info", "delay": 800}, {"text": "[SCHEMA] Example 2: query_metrics(\"mem_free < 1G\")", "type": "info", "delay": 800}, {"text": "[AGENT] Calling tool: query_metrics(\"disk_space < 10% FOR 1h\")", "type": "tool", "delay": 1000}, {"text": "Query syntax valid. Results returned.", "type": "success", "delay": 500}]}, "knowledgeCheck": {"question": "What is the benefit of placing few-shot examples inside a tool's schema description?", "options": [{"id": "a", "text": "It trains a new model"}, {"id": "b", "text": "It prevents the LLM from making malformed syntax errors when calling the tool"}, {"id": "c", "text": "It bypasses API rate limits"}], "correctAnswer": "b"}}, {"id": "5.3", "domain": 5, "title": "5.3 Debug context window overflows", "content": "When an agent runs for too many turns or ingests too many large files, it hits its maximum context window (e.g., 200k tokens). Architects must implement truncation strategies: summarizing past turns, dropping oldest logs, or using prompt caching to mitigate overflow.", "terminalDemo": {"prompt": "Simulating long-running debug session", "logs": [{"text": "[SYSTEM] Turn 45. Context size: 198,500 tokens.", "type": "system", "delay": 500}, {"text": "[WARNING] Approaching context limit!", "type": "error", "delay": 800}, {"text": "[SYSTEM] Executing compaction strategy...", "type": "info", "delay": 800}, {"text": "[SYSTEM] Summarized turns 1-30. Dropped 50,000 tokens.", "type": "success", "delay": 1200}, {"text": "[SYSTEM] Context size: 148,500 tokens. Continuing loop.", "type": "output", "delay": 500}]}, "knowledgeCheck": {"question": "Which is a valid architectural strategy for preventing context window overflow in an agentic loop?", "options": [{"id": "a", "text": "Switching from Claude 3.5 Sonnet to Haiku"}, {"id": "b", "text": "Summarizing and evicting older conversation turns while maintaining current state"}, {"id": "c", "text": "Adding more RAM to the server"}], "correctAnswer": "b"}}];