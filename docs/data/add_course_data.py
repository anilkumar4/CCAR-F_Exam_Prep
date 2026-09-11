import json
import os

filepath = r'c:\Users\ANIL\Downloads\Claude-Code-Architect\CCAR-F_Exam_Prep\data\course-content.js'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# We need to remove the trailing ]; from the file so we can append more items
content = content.strip()
if content.endswith(';'):
    content = content[:-1]
if content.endswith(']'):
    content = content[:-1]

new_lessons = [
  {
    'id': '2.1', 'domain': 2, 'title': '2.1 Integrate MCP Servers',
    'content': 'The Model Context Protocol (MCP) allows Claude to interact with external tools and resources securely. Integrating an MCP server involves defining the server configuration in the client (like Claude Code) and ensuring the transport layer (stdio or HTTP/SSE) is correctly established.',
    'terminalDemo': {
      'prompt': 'Initialize GitHub MCP Server',
      'logs': [
        {'text': '[SYSTEM] Spawning MCP process: npx -y @modelcontextprotocol/server-github', 'type': 'system', 'delay': 500},
        {'text': '[MCP_CLIENT] Connecting via stdio transport...', 'type': 'info', 'delay': 800},
        {'text': '[MCP_SERVER] Server initialized with capabilities: { tools: true, resources: true }', 'type': 'success', 'delay': 800},
        {'text': '[AGENT] Discovered 12 tools from github-server.', 'type': 'tool', 'delay': 500}
      ]
    },
    'knowledgeCheck': {
      'question': 'Which transport protocol is typically used for local, command-line MCP servers?',
      'options': [{'id': 'a', 'text': 'HTTP/REST'}, {'id': 'b', 'text': 'stdio (Standard Input/Output)'}, {'id': 'c', 'text': 'GraphQL'}],
      'correctAnswer': 'b'
    }
  },
  {
    'id': '2.2', 'domain': 2, 'title': '2.2 Handle structured MCP errors',
    'content': 'When tools fail, agents must receive structured errors rather than raw stack traces. MCP defines standard error codes. The agent uses these structured messages to determine whether to retry with different parameters, ask the user for help, or fallback to another tool.',
    'terminalDemo': {
      'prompt': 'Read file: /secret/config.yaml',
      'logs': [
        {'text': '[AGENT] Calling tool: read_file(path=\'/secret/config.yaml\')', 'type': 'tool', 'delay': 500},
        {'text': '[MCP_SERVER] Error 403: Access Denied. Directory outside allowed workspace.', 'type': 'error', 'delay': 800},
        {'text': '[AGENT] Received structured error. stop_reason = tool_use (fallback)', 'type': 'info', 'delay': 800},
        {'text': '[AGENT] Synthesis: I do not have permission to read that file. Can you provide the contents?', 'type': 'output', 'delay': 500}
      ]
    },
    'knowledgeCheck': {
      'question': 'Why is returning a structured error message to an LLM agent better than a raw crash dump?',
      'options': [{'id': 'a', 'text': 'It saves token bandwidth'}, {'id': 'b', 'text': 'It allows the agent to reason about the failure and attempt a logical fallback'}, {'id': 'c', 'text': 'LLMs cannot process crash dumps'}],
      'correctAnswer': 'b'
    }
  },
  {
    'id': '2.3', 'domain': 2, 'title': '2.3 Implement resource-based context fetching',
    'content': 'MCP Resources allow servers to expose data without requiring the LLM to explicitly call a tool. Resources are referenced via URIs (e.g., `file:///path` or `postgres://schema/table`). The client reads these resources to pre-populate the LLM context.',
    'terminalDemo': {
      'prompt': 'Load API schema resource',
      'logs': [
        {'text': '[SYSTEM] Reading resource: mcp://api-server/schema/v1', 'type': 'system', 'delay': 500},
        {'text': '[MCP_SERVER] Streaming 15KB JSON schema...', 'type': 'tool', 'delay': 800},
        {'text': '[SYSTEM] Resource appended to LLM context block.', 'type': 'success', 'delay': 600},
        {'text': '[AGENT] I can see the schema. What endpoint do you need help with?', 'type': 'output', 'delay': 500}
      ]
    },
    'knowledgeCheck': {
      'question': 'What is the primary difference between an MCP Tool and an MCP Resource?',
      'options': [{'id': 'a', 'text': 'Tools are executed by the LLM, Resources are read by the client to populate context'}, {'id': 'b', 'text': 'Resources are write-only'}, {'id': 'c', 'text': 'Tools use HTTP, Resources use stdio'}],
      'correctAnswer': 'a'
    }
  },
  {
    'id': '2.4', 'domain': 2, 'title': '2.4 Design tool schemas for MCP',
    'content': 'Tool definitions in MCP use JSON Schema. A well-designed schema is crucial for the LLM to understand how and when to use the tool. It requires clear descriptions, strict type definitions, and explicitly marking required vs. optional properties.',
    'terminalDemo': {
      'prompt': 'Validating Tool Schema',
      'logs': [
        {'text': 'Validating schema for: search_code', 'type': 'system', 'delay': 500},
        {'text': '[WARNING] Parameter \'query\' is missing a description field.', 'type': 'error', 'delay': 800},
        {'text': '[FIX] Added description: \"The exact string or regex pattern to search for\".', 'type': 'info', 'delay': 800},
        {'text': 'Schema validation passed. Registered with LLM router.', 'type': 'success', 'delay': 500}
      ]
    },
    'knowledgeCheck': {
      'question': 'Which schema component is most critical for an LLM to decide whether to invoke a tool?',
      'options': [{'id': 'a', 'text': 'The tool name and description'}, {'id': 'b', 'text': 'The maximum timeout integer'}, {'id': 'c', 'text': "The server's IP address"}],
      'correctAnswer': 'a'
    }
  },
  {
    'id': '3.1', 'domain': 3, 'title': '3.1 Write effective CLAUDE.md guidelines',
    'content': 'The `CLAUDE.md` file is the master prompt configuration for Claude in a repository. It establishes project-specific coding standards, build commands, and behavioral constraints that Claude automatically injects into its system prompt.',
    'terminalDemo': {
      'prompt': 'User: Create a new React component.',
      'logs': [
        {'text': '[SYSTEM] Loading workspace CLAUDE.md...', 'type': 'system', 'delay': 500},
        {'text': '[RULE] \"Use functional components with hooks. Do NOT use class components.\"', 'type': 'info', 'delay': 800},
        {'text': '[AGENT] Writing functional component ProfileCard.tsx...', 'type': 'tool', 'delay': 800},
        {'text': '[AGENT] Component generated adhering to local guidelines.', 'type': 'success', 'delay': 500}
      ]
    },
    'knowledgeCheck': {
      'question': 'What is the primary purpose of a CLAUDE.md file?',
      'options': [{'id': 'a', 'text': 'To store API keys securely'}, {'id': 'b', 'text': 'To define persistent project guidelines and build commands for the agent'}, {'id': 'c', 'text': 'To keep a log of all agent conversations'}],
      'correctAnswer': 'b'
    }
  },
  {
    'id': '3.4', 'domain': 3, 'title': '3.4 Manage fork vs. shared context',
    'content': 'When dealing with complex tasks, agents can `fork` context. A shared context means all subagents see the same giant conversation history (slow, expensive). A forked context means the subagent only receives a clean, minimal prompt with the specific task parameters (fast, efficient).',
    'terminalDemo': {
      'prompt': 'Delegate analysis task',
      'logs': [
        {'text': '[COORDINATOR] Current context size: 85,000 tokens.', 'type': 'system', 'delay': 500},
        {'text': '[COORDINATOR] Spawning analyzer_subagent (Context strategy: FORK)', 'type': 'info', 'delay': 800},
        {'text': '[SUBAGENT] Initialized with 1,200 token context (Task only).', 'type': 'success', 'delay': 800},
        {'text': '[SUBAGENT] Task completed in 2.1s.', 'type': 'output', 'delay': 500}
      ]
    },
    'knowledgeCheck': {
      'question': 'Why is forking context preferred over sharing context for isolated subagent tasks?',
      'options': [{'id': 'a', 'text': 'It prevents context overflow and reduces token cost/latency'}, {'id': 'b', 'text': 'It makes the subagent smarter'}, {'id': 'c', 'text': "It allows the subagent to read the user's entire history"}],
      'correctAnswer': 'a'
    }
  },
  {
    'id': '4.2', 'domain': 4, 'title': '4.2 Use few-shot prompting for tool constraints',
    'content': 'When tools require highly specific input formats (like an advanced regex or a custom query language), zero-shot descriptions are often insufficient. Providing 2-3 examples (few-shot prompting) inside the tool description drastically reduces hallucinated or malformed tool calls.',
    'terminalDemo': {
      'prompt': 'Agent attempting custom query tool',
      'logs': [
        {'text': '[AGENT] Analyzing tool schema for `query_metrics`...', 'type': 'system', 'delay': 500},
        {'text': '[SCHEMA] Example 1: query_metrics("cpu_usage > 90% FOR 5m")', 'type': 'info', 'delay': 800},
        {'text': '[SCHEMA] Example 2: query_metrics("mem_free < 1G")', 'type': 'info', 'delay': 800},
        {'text': '[AGENT] Calling tool: query_metrics("disk_space < 10% FOR 1h")', 'type': 'tool', 'delay': 1000},
        {'text': 'Query syntax valid. Results returned.', 'type': 'success', 'delay': 500}
      ]
    },
    'knowledgeCheck': {
      'question': "What is the benefit of placing few-shot examples inside a tool's schema description?",
      'options': [{'id': 'a', 'text': 'It trains a new model'}, {'id': 'b', 'text': 'It prevents the LLM from making malformed syntax errors when calling the tool'}, {'id': 'c', 'text': 'It bypasses API rate limits'}],
      'correctAnswer': 'b'
    }
  },
  {
    'id': '5.3', 'domain': 5, 'title': '5.3 Debug context window overflows',
    'content': 'When an agent runs for too many turns or ingests too many large files, it hits its maximum context window (e.g., 200k tokens). Architects must implement truncation strategies: summarizing past turns, dropping oldest logs, or using prompt caching to mitigate overflow.',
    'terminalDemo': {
      'prompt': 'Simulating long-running debug session',
      'logs': [
        {'text': '[SYSTEM] Turn 45. Context size: 198,500 tokens.', 'type': 'system', 'delay': 500},
        {'text': '[WARNING] Approaching context limit!', 'type': 'error', 'delay': 800},
        {'text': '[SYSTEM] Executing compaction strategy...', 'type': 'info', 'delay': 800},
        {'text': '[SYSTEM] Summarized turns 1-30. Dropped 50,000 tokens.', 'type': 'success', 'delay': 1200},
        {'text': '[SYSTEM] Context size: 148,500 tokens. Continuing loop.', 'type': 'output', 'delay': 500}
      ]
    },
    'knowledgeCheck': {
      'question': 'Which is a valid architectural strategy for preventing context window overflow in an agentic loop?',
      'options': [{'id': 'a', 'text': 'Switching from Claude 3.5 Sonnet to Haiku'}, {'id': 'b', 'text': 'Summarizing and evicting older conversation turns while maintaining current state'}, {'id': 'c', 'text': 'Adding more RAM to the server'}],
      'correctAnswer': 'b'
    }
  }
]

# We append the new lessons and close the JSON array
out_str = content + ',' + json.dumps(new_lessons)[1:-1] + '];'

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(out_str)

print(f"Successfully added {len(new_lessons)} more lessons to course-content.js")
