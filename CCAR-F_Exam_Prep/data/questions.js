// ============================================================
// CCAR-F Exam Prep — Practice Questions Data
// 65 questions across all 5 domains & 6 scenarios
// ============================================================

const QUESTIONS_DATA = [
  // ========== SCENARIO 1: Customer Support Resolution Agent ==========
  // Domain 1 questions
  {
    id: 'q1',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 1,
    taskStatement: '1.1',
    type: 'single',
    difficulty: 'medium',
    question: 'Production data shows that in 12% of cases, your agent skips get_customer entirely and calls lookup_order using only the customer\'s stated name, occasionally leading to misidentified accounts and incorrect refunds. What change would most effectively address this reliability issue?',
    options: [
      { id: 'a', text: 'Add a programmatic prerequisite that blocks lookup_order and process_refund calls until get_customer has returned a verified customer ID.' },
      { id: 'b', text: 'Enhance the system prompt to state that customer verification via get_customer is mandatory before any order operations.' },
      { id: 'c', text: 'Add few-shot examples showing the agent always calling get_customer first, even when customers volunteer order details.' },
      { id: 'd', text: 'Implement a routing classifier that analyzes each request and enables only the subset of tools appropriate for that request type.' }
    ],
    correctAnswer: 'a',
    explanation: 'When a specific tool sequence is required for critical business logic (like verifying customer identity before processing refunds), programmatic enforcement provides deterministic guarantees that prompt-based approaches cannot. Options B and C rely on probabilistic LLM compliance, which is insufficient when errors have financial consequences. Option D addresses tool availability rather than tool ordering, which is not the actual problem.',
    keyTakeaway: 'Use programmatic enforcement (hooks/prerequisites) for critical business rules, not prompt-based guidance.'
  },
  {
    id: 'q2',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 2,
    taskStatement: '2.1',
    type: 'single',
    difficulty: 'medium',
    question: 'Production logs show the agent frequently calls get_customer when users ask about orders (e.g., "check my order #12345"), instead of calling lookup_order. Both tools have minimal descriptions ("Retrieves customer information" / "Retrieves order details") and accept similar identifier formats. What\'s the most effective first step to improve tool selection reliability?',
    options: [
      { id: 'a', text: 'Add few-shot examples to the system prompt demonstrating correct tool selection patterns, with 5-8 examples showing order-related queries routing to lookup_order.' },
      { id: 'b', text: 'Expand each tool\'s description to include input formats it handles, example queries, edge cases, and boundaries explaining when to use it versus similar tools.' },
      { id: 'c', text: 'Implement a routing layer that parses user input before each turn and pre-selects the appropriate tool based on detected keywords and identifier patterns.' },
      { id: 'd', text: 'Consolidate both tools into a single lookup_entity tool that accepts any identifier and internally determines which backend to query.' }
    ],
    correctAnswer: 'b',
    explanation: 'Tool descriptions are the primary mechanism LLMs use for tool selection. When descriptions are minimal, models lack the context to differentiate between similar tools. Option B directly addresses this root cause with a low-effort, high-leverage fix. Few-shot examples (A) add token overhead without fixing the underlying issue. A routing layer (C) is over-engineered and bypasses the LLM\'s natural language understanding. Consolidating tools (D) is a valid architectural choice but requires more effort than a "first step" warrants.',
    keyTakeaway: 'Tool descriptions are the PRIMARY mechanism for LLM tool selection. Make them detailed and differentiated.'
  },
  {
    id: 'q3',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 5,
    taskStatement: '5.2',
    type: 'single',
    difficulty: 'medium',
    question: 'Your agent achieves 55% first-contact resolution, well below the 80% target. Logs show it escalates straightforward cases (standard damage replacements with photo evidence) while attempting to autonomously handle complex situations requiring policy exceptions. What\'s the most effective way to improve escalation calibration?',
    options: [
      { id: 'a', text: 'Add explicit escalation criteria to your system prompt with few-shot examples demonstrating when to escalate versus resolve autonomously.' },
      { id: 'b', text: 'Have the agent self-report a confidence score (1-10) before each response and automatically route requests to humans when confidence falls below a threshold.' },
      { id: 'c', text: 'Deploy a separate classifier model trained on historical tickets to predict which requests need escalation before the main agent begins processing.' },
      { id: 'd', text: 'Implement sentiment analysis to detect customer frustration levels and automatically escalate when negative sentiment exceeds a threshold.' }
    ],
    correctAnswer: 'a',
    explanation: 'Adding explicit escalation criteria with few-shot examples directly addresses the root cause: unclear decision boundaries. This is the proportionate first response before adding infrastructure. Option B fails because LLM self-reported confidence is poorly calibrated. Option C is over-engineered, requiring labeled data and ML infrastructure when prompt optimization hasn\'t been tried. Option D solves a different problem entirely; sentiment doesn\'t correlate with case complexity.',
    keyTakeaway: 'Self-reported confidence scores are poorly calibrated. Use explicit criteria with few-shot examples for escalation decisions.'
  },
  {
    id: 'q4',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 1,
    taskStatement: '1.5',
    type: 'single',
    difficulty: 'hard',
    question: 'Your support agent uses MCP tools that return data in inconsistent formats: get_customer returns Unix timestamps, lookup_order returns ISO 8601 dates, and process_refund returns numeric status codes. The agent occasionally misinterprets these formats, leading to incorrect date comparisons. What\'s the most reliable approach to fix this?',
    options: [
      { id: 'a', text: 'Add format conversion instructions to the system prompt, specifying the expected format for each tool.' },
      { id: 'b', text: 'Implement PostToolUse hooks to normalize all tool outputs to consistent formats before the agent processes them.' },
      { id: 'c', text: 'Include few-shot examples showing correct interpretation of each format in the system prompt.' },
      { id: 'd', text: 'Add a data validation step in the agentic loop that checks format consistency before processing tool results.' }
    ],
    correctAnswer: 'b',
    explanation: 'PostToolUse hooks provide deterministic data transformation, guaranteeing that the agent always receives consistently formatted data. Prompt-based approaches (A, C) are probabilistic and may fail under complex scenarios. A validation step (D) detects but doesn\'t fix the problem—the agent still needs to handle heterogeneous formats.',
    keyTakeaway: 'PostToolUse hooks provide deterministic data normalization. Use them when format consistency is critical.'
  },
  {
    id: 'q5',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 5,
    taskStatement: '5.1',
    type: 'single',
    difficulty: 'hard',
    question: 'During a complex customer interaction involving three separate order issues, your agent correctly identifies all problems initially but by the third issue, it contradicts its earlier findings about the first issue\'s refund amount ($47.99 vs the correct $42.99). What\'s the most effective mitigation strategy?',
    options: [
      { id: 'a', text: 'Increase the model\'s max_tokens to allow more room for processing all three issues.' },
      { id: 'b', text: 'Extract transactional facts (amounts, dates, order numbers, statuses) into a persistent "case facts" block included in each prompt, outside summarized history.' },
      { id: 'c', text: 'Process each issue in a separate conversation to prevent cross-contamination.' },
      { id: 'd', text: 'Enable extended thinking to give the model more time to track multiple concurrent issues.' }
    ],
    correctAnswer: 'b',
    explanation: 'A persistent "case facts" block ensures critical numerical data is always available and not subject to progressive summarization that can corrupt values. Option A doesn\'t solve attention/memory issues. Option C loses the holistic view needed for a unified response. Option D doesn\'t address the fundamental context management issue.',
    keyTakeaway: 'Extract critical facts into a persistent structured block to prevent progressive summarization from corrupting values.'
  },
  // Domain 1 - Agentic Loop
  {
    id: 'q6',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 1,
    taskStatement: '1.1',
    type: 'single',
    difficulty: 'easy',
    question: 'Your agentic loop for the customer support agent sometimes terminates prematurely before completing multi-step resolutions. You\'re currently using a check that looks for assistant text containing "resolution complete" to determine when to stop the loop. What should you change?',
    options: [
      { id: 'a', text: 'Check stop_reason === "end_turn" to determine loop termination instead of parsing assistant text content.' },
      { id: 'b', text: 'Set a higher iteration cap (e.g., 50 iterations) to ensure the loop doesn\'t stop too early.' },
      { id: 'c', text: 'Add more keywords to the termination check, like "done", "finished", "completed".' },
      { id: 'd', text: 'Use a timeout-based approach that terminates the loop after 60 seconds of inactivity.' }
    ],
    correctAnswer: 'a',
    explanation: 'The correct way to determine agentic loop termination is by checking stop_reason. When stop_reason is "tool_use", the loop should continue. When it\'s "end_turn", the model has decided it\'s done. Parsing natural language signals (B, C) is an anti-pattern. Arbitrary iteration caps (B) and timeouts (D) are unreliable primary stopping mechanisms.',
    keyTakeaway: 'Always use stop_reason ("tool_use" to continue, "end_turn" to stop) for agentic loop control flow.'
  },

  // ========== SCENARIO 2: Code Generation with Claude Code ==========
  {
    id: 'q7',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.2',
    type: 'single',
    difficulty: 'medium',
    question: 'You want to create a custom /review slash command that runs your team\'s standard code review checklist. This command should be available to every developer when they clone or pull the repository. Where should you create this command file?',
    options: [
      { id: 'a', text: 'In the .claude/commands/ directory in the project repository' },
      { id: 'b', text: 'In ~/.claude/commands/ in each developer\'s home directory' },
      { id: 'c', text: 'In the CLAUDE.md file at the project root' },
      { id: 'd', text: 'In a .claude/config.json file with a commands array' }
    ],
    correctAnswer: 'a',
    explanation: 'Project-scoped custom slash commands should be stored in the .claude/commands/ directory within the repository. These commands are version-controlled and automatically available to all developers when they clone or pull the repo. Option B is for personal commands not shared via version control. Option C is for project instructions, not command definitions. Option D describes a configuration mechanism that doesn\'t exist in Claude Code.',
    keyTakeaway: '.claude/commands/ = project-scoped (shared via git). ~/.claude/commands/ = user-scoped (personal).'
  },
  {
    id: 'q8',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.4',
    type: 'single',
    difficulty: 'medium',
    question: 'You\'ve been assigned to restructure the team\'s monolithic application into microservices. This will involve changes across dozens of files and requires decisions about service boundaries and module dependencies. Which approach should you take?',
    options: [
      { id: 'a', text: 'Enter plan mode to explore the codebase, understand dependencies, and design an implementation approach before making changes.' },
      { id: 'b', text: 'Start with direct execution and make changes incrementally, letting the implementation reveal the natural service boundaries.' },
      { id: 'c', text: 'Use direct execution with comprehensive upfront instructions detailing exactly how each service should be structured.' },
      { id: 'd', text: 'Begin in direct execution mode and only switch to plan mode if you encounter unexpected complexity during implementation.' }
    ],
    correctAnswer: 'a',
    explanation: 'Plan mode is designed for complex tasks involving large-scale changes, multiple valid approaches, and architectural decisions—exactly what monolith-to-microservices restructuring requires. It enables safe codebase exploration and design before committing to changes. Option B risks costly rework when dependencies are discovered late. Option C assumes you already know the right structure. Option D ignores that the complexity is already apparent.',
    keyTakeaway: 'Plan mode for complex tasks (multi-file, architectural). Direct execution for simple, well-scoped changes.'
  },
  {
    id: 'q9',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.3',
    type: 'single',
    difficulty: 'medium',
    question: 'Your codebase has distinct areas with different coding conventions: React components use functional style with hooks, API handlers use async/await with specific error handling, and test files are spread throughout the codebase alongside the code they test. What\'s the most maintainable way to ensure Claude automatically applies the correct conventions?',
    options: [
      { id: 'a', text: 'Create rule files in .claude/rules/ with YAML frontmatter specifying glob patterns to conditionally apply conventions based on file paths' },
      { id: 'b', text: 'Consolidate all conventions in the root CLAUDE.md file under headers for each area, relying on Claude to infer which section applies' },
      { id: 'c', text: 'Create skills in .claude/skills/ for each code type that include the relevant conventions in their SKILL.md files' },
      { id: 'd', text: 'Place a separate CLAUDE.md file in each subdirectory containing that area\'s specific conventions' }
    ],
    correctAnswer: 'a',
    explanation: '.claude/rules/ with glob patterns (e.g., **/*.test.tsx) allows conventions to be automatically applied based on file paths regardless of directory location—essential for test files spread throughout the codebase. Option B relies on inference rather than explicit matching. Option C requires manual skill invocation. Option D can\'t easily handle files spread across many directories.',
    keyTakeaway: 'Use .claude/rules/ with glob patterns for file-type conventions. Use subdirectory CLAUDE.md for directory-specific conventions.'
  },
  {
    id: 'q10',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.1',
    type: 'single',
    difficulty: 'easy',
    question: 'A new team member reports that Claude Code is not following the team\'s testing conventions that all other developers see. The conventions are stored in ~/.claude/CLAUDE.md. What\'s the most likely cause?',
    options: [
      { id: 'a', text: 'The new member hasn\'t copied the ~/.claude/CLAUDE.md file to their home directory since user-level configs are not shared via version control.' },
      { id: 'b', text: 'Claude Code has a caching issue and needs to be restarted.' },
      { id: 'c', text: 'The new member needs to run /memory to load the configuration.' },
      { id: 'd', text: 'User-level configurations are automatically synced but require authentication first.' }
    ],
    correctAnswer: 'a',
    explanation: 'User-level settings in ~/.claude/CLAUDE.md apply only to that user and are NOT shared via version control. Each developer must set up their own user-level config. For team-wide conventions, use project-level configuration (.claude/CLAUDE.md or root CLAUDE.md) which IS version-controlled.',
    keyTakeaway: '~/.claude/ = user-level (not shared). .claude/ in project root = project-level (shared via git).'
  },
  {
    id: 'q11',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.5',
    type: 'single',
    difficulty: 'hard',
    question: 'You\'re asking Claude to transform CSV data into a specific JSON format, but the output is inconsistent across runs—sometimes nesting arrays differently and sometimes omitting optional fields. Detailed prose instructions haven\'t resolved the inconsistency. What\'s the most effective next step?',
    options: [
      { id: 'a', text: 'Provide 2-3 concrete input/output examples showing the exact transformation you expect, including cases with optional fields present and absent.' },
      { id: 'b', text: 'Add "be consistent" and "follow the exact format" instructions to the prompt.' },
      { id: 'c', text: 'Switch to a different model with better instruction following.' },
      { id: 'd', text: 'Break the transformation into smaller steps, processing one field at a time.' }
    ],
    correctAnswer: 'a',
    explanation: 'Concrete input/output examples are the most effective way to communicate expected transformations when prose descriptions are interpreted inconsistently. They demonstrate exactly what the output should look like, including edge cases. "Be consistent" (B) is too vague. Switching models (C) doesn\'t address the ambiguous specification. Breaking into steps (D) adds complexity without clarifying the target format.',
    keyTakeaway: 'When prose instructions produce inconsistent results, provide concrete input/output examples.'
  },
  {
    id: 'q12',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.2',
    type: 'single',
    difficulty: 'hard',
    question: 'You\'re building a skill that performs codebase analysis, generating verbose output about file structure, dependencies, and test coverage. When invoked, this analysis floods the main conversation context with thousands of tokens. What frontmatter option should you use?',
    options: [
      { id: 'a', text: 'context: fork to run the skill in an isolated sub-agent context' },
      { id: 'b', text: 'max-tokens: 500 to limit the output length' },
      { id: 'c', text: 'mode: silent to suppress the output' },
      { id: 'd', text: 'scope: isolated to separate the skill context' }
    ],
    correctAnswer: 'a',
    explanation: 'context: fork runs the skill in an isolated sub-agent context, preventing verbose output from polluting the main conversation. The skill runs independently and only a summary returns to the main session. Options B, C, D reference frontmatter options that don\'t exist in Claude Code skills.',
    keyTakeaway: 'Use context: fork in SKILL.md frontmatter for skills that produce verbose output.'
  },

  // ========== SCENARIO 3: Multi-Agent Research System ==========
  {
    id: 'q13',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 1,
    taskStatement: '1.2',
    type: 'single',
    difficulty: 'medium',
    question: 'After running the system on "impact of AI on creative industries," the final reports cover only visual arts, missing music, writing, and film production. The coordinator decomposed the topic into "AI in digital art creation," "AI in graphic design," and "AI in photography." What is the most likely root cause?',
    options: [
      { id: 'a', text: 'The synthesis agent lacks instructions for identifying coverage gaps in the findings it receives from other agents.' },
      { id: 'b', text: 'The coordinator agent\'s task decomposition is too narrow, resulting in subagent assignments that don\'t cover all relevant domains of the topic.' },
      { id: 'c', text: 'The web search agent\'s queries are not comprehensive enough and need to be expanded to cover more creative industry sectors.' },
      { id: 'd', text: 'The document analysis agent is filtering out sources related to non-visual creative industries due to overly restrictive relevance criteria.' }
    ],
    correctAnswer: 'b',
    explanation: 'The coordinator\'s logs reveal the root cause directly: it decomposed "creative industries" into only visual arts subtasks. The subagents executed their assigned tasks correctly—the problem is what they were assigned. Options A, C, and D incorrectly blame downstream agents that are working correctly within their assigned scope.',
    keyTakeaway: 'When output coverage is narrow, check the coordinator\'s task decomposition first—not downstream agents.'
  },
  {
    id: 'q14',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 5,
    taskStatement: '5.3',
    type: 'single',
    difficulty: 'medium',
    question: 'The web search subagent times out while researching a complex topic. You need to design how this failure information flows back to the coordinator agent. Which error propagation approach best enables intelligent recovery?',
    options: [
      { id: 'a', text: 'Return structured error context to the coordinator including the failure type, the attempted query, any partial results, and potential alternative approaches.' },
      { id: 'b', text: 'Implement automatic retry logic with exponential backoff within the subagent, returning a generic "search unavailable" status only after all retries are exhausted.' },
      { id: 'c', text: 'Catch the timeout within the subagent and return an empty result set marked as successful.' },
      { id: 'd', text: 'Propagate the timeout exception directly to a top-level handler that terminates the entire research workflow.' }
    ],
    correctAnswer: 'a',
    explanation: 'Structured error context gives the coordinator the information it needs to make intelligent recovery decisions. Option B\'s generic status hides valuable context. Option C suppresses the error by marking failure as success. Option D terminates the entire workflow unnecessarily when recovery strategies could succeed.',
    keyTakeaway: 'Return structured error context (failure type, attempted query, partial results, alternatives) to enable intelligent recovery.'
  },
  {
    id: 'q15',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 2,
    taskStatement: '2.3',
    type: 'single',
    difficulty: 'hard',
    question: 'During testing, the synthesis agent frequently needs to verify claims. Currently, it returns control to the coordinator for each verification, adding 2-3 round trips. 85% of verifications are simple fact-checks, 15% require deeper investigation. What\'s the most effective approach?',
    options: [
      { id: 'a', text: 'Give the synthesis agent a scoped verify_fact tool for simple lookups, while complex verifications continue delegating to the web search agent through the coordinator.' },
      { id: 'b', text: 'Have the synthesis agent accumulate all verification needs and batch them to the coordinator at the end.' },
      { id: 'c', text: 'Give the synthesis agent access to all web search tools so it can handle any verification need directly.' },
      { id: 'd', text: 'Have the web search agent proactively cache extra context around each source during initial research.' }
    ],
    correctAnswer: 'a',
    explanation: 'Option A applies the principle of least privilege—giving the synthesis agent only what it needs for the 85% common case while preserving the existing coordination pattern for complex cases. Batching (B) creates blocking dependencies. Full access (C) violates separation of concerns. Proactive caching (D) can\'t reliably predict verification needs.',
    keyTakeaway: 'Apply principle of least privilege: scoped cross-role tools for high-frequency needs, coordinator delegation for complex cases.'
  },
  {
    id: 'q16',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 1,
    taskStatement: '1.3',
    type: 'single',
    difficulty: 'medium',
    question: 'Your coordinator needs to invoke both the web search and document analysis subagents for a research query. Currently, it invokes them sequentially across separate turns, taking twice as long. How can you enable parallel execution?',
    options: [
      { id: 'a', text: 'Have the coordinator emit multiple Task tool calls in a single response to spawn parallel subagents.' },
      { id: 'b', text: 'Use async/await in the coordinator\'s system prompt to request parallel processing.' },
      { id: 'c', text: 'Configure a "parallel" flag in the AgentDefinition for each subagent.' },
      { id: 'd', text: 'Create a separate orchestration layer above the coordinator that manages parallel scheduling.' }
    ],
    correctAnswer: 'a',
    explanation: 'Spawning parallel subagents is done by having the coordinator emit multiple Task tool calls in a single response. This is the built-in mechanism for parallelism. Options B, C, and D reference mechanisms that don\'t exist in the Agent SDK. No additional orchestration layer is needed.',
    keyTakeaway: 'Emit multiple Task tool calls in a single coordinator response for parallel subagent execution.'
  },
  {
    id: 'q17',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 5,
    taskStatement: '5.6',
    type: 'single',
    difficulty: 'hard',
    question: 'Two credible sources in your research system report conflicting market size statistics for AI in healthcare: $45B (source A, 2023 data) and $62B (source B, 2024 projection). How should the synthesis agent handle this?',
    options: [
      { id: 'a', text: 'Report only the more recent figure ($62B) as it\'s the most current.' },
      { id: 'b', text: 'Average the two values and report $53.5B as the estimated market size.' },
      { id: 'c', text: 'Include both values with source attribution and note the temporal difference (2023 data vs 2024 projection).' },
      { id: 'd', text: 'Flag the conflict and escalate to a human reviewer to determine the correct value.' }
    ],
    correctAnswer: 'c',
    explanation: 'When credible sources conflict, annotate the conflict with source attribution rather than arbitrarily selecting one value. The temporal difference (2023 vs 2024) explains the discrepancy and is essential context. Averaging (B) is mathematically inappropriate. Escalation (D) is unnecessary when the conflict can be explained by temporal context.',
    keyTakeaway: 'Annotate conflicts with source attribution and temporal context. Don\'t arbitrarily select or average conflicting values.'
  },
  {
    id: 'q18',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 1,
    taskStatement: '1.3',
    type: 'single',
    difficulty: 'easy',
    question: 'Your coordinator agent fails to invoke subagents, throwing an error. Investigation reveals the coordinator\'s allowedTools configuration. What\'s the most likely issue?',
    options: [
      { id: 'a', text: 'The allowedTools list doesn\'t include "Task", which is required for spawning subagents.' },
      { id: 'b', text: 'The subagent definitions are missing description fields.' },
      { id: 'c', text: 'The coordinator\'s system prompt doesn\'t mention subagent capabilities.' },
      { id: 'd', text: 'The subagents don\'t have their own allowedTools configured.' }
    ],
    correctAnswer: 'a',
    explanation: 'The Task tool is the mechanism for spawning subagents, and allowedTools must include "Task" for a coordinator to invoke subagents. Without it, the coordinator simply cannot spawn subagents regardless of other configuration.',
    keyTakeaway: 'allowedTools MUST include "Task" for any agent that needs to spawn subagents.'
  },

  // ========== SCENARIO 4: Developer Productivity with Claude ==========
  {
    id: 'q19',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 2,
    taskStatement: '2.5',
    type: 'single',
    difficulty: 'easy',
    question: 'An engineer asks the agent to "find all files that import the UserService class." Which built-in tool is most appropriate?',
    options: [
      { id: 'a', text: 'Grep — to search file contents for the import statement pattern.' },
      { id: 'b', text: 'Glob — to find files matching a naming pattern.' },
      { id: 'c', text: 'Read — to load each file and check its imports.' },
      { id: 'd', text: 'Bash — to run a shell command that searches for the pattern.' }
    ],
    correctAnswer: 'a',
    explanation: 'Grep is designed for content search—searching file contents for patterns like function names, error messages, or import statements. Glob (B) finds files by name pattern, not content. Read (C) would require knowing which files to check. Bash (D) is unnecessarily complex when Grep does this natively.',
    keyTakeaway: 'Grep = search file CONTENTS. Glob = find files by NAME pattern.'
  },
  {
    id: 'q20',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 2,
    taskStatement: '2.5',
    type: 'single',
    difficulty: 'easy',
    question: 'An engineer asks the agent to "find all test files in the project." Which built-in tool is most appropriate?',
    options: [
      { id: 'a', text: 'Grep — to search for "test" in file contents.' },
      { id: 'b', text: 'Glob — to find files matching the pattern **/*.test.tsx.' },
      { id: 'c', text: 'Bash — to run find . -name "*.test.tsx".' },
      { id: 'd', text: 'Read — to load directory listings.' }
    ],
    correctAnswer: 'b',
    explanation: 'Glob is designed for file path pattern matching—finding files by name or extension patterns. **/*.test.tsx matches all test files regardless of directory. Grep (A) searches content, not filenames. Bash (C) works but is less efficient than the purpose-built Glob tool.',
    keyTakeaway: 'Glob = find files by naming pattern. Grep = search inside file contents.'
  },
  {
    id: 'q21',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 5,
    taskStatement: '5.4',
    type: 'single',
    difficulty: 'hard',
    question: 'An engineer is exploring a large unfamiliar codebase. After 45 minutes, the agent starts giving inconsistent answers and referencing "typical patterns" rather than specific classes it discovered earlier. What\'s the most effective strategy?',
    options: [
      { id: 'a', text: 'Spawn subagents to investigate specific questions while the main agent maintains high-level coordination, and have agents record key findings in scratchpad files.' },
      { id: 'b', text: 'Restart the conversation every 20 minutes to prevent context degradation.' },
      { id: 'c', text: 'Switch to a model with a larger context window.' },
      { id: 'd', text: 'Ask the agent to summarize everything it knows at regular intervals to reinforce its memory.' }
    ],
    correctAnswer: 'a',
    explanation: 'Context degradation in extended sessions is addressed by: (1) spawning subagents to isolate verbose exploration, (2) maintaining scratchpad files to persist findings across context boundaries, and (3) keeping the main agent focused on coordination. Frequent restarts (B) lose accumulated understanding. Larger windows (C) don\'t solve attention quality. Summaries (D) consume even more context.',
    keyTakeaway: 'Use subagents + scratchpad files to manage context in extended exploration sessions.'
  },
  {
    id: 'q22',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 2,
    taskStatement: '2.4',
    type: 'single',
    difficulty: 'medium',
    question: 'Your team wants to add a Jira MCP server for issue tracking. A well-maintained community MCP server exists. You also have some team-specific Jira workflows. What\'s the recommended approach?',
    options: [
      { id: 'a', text: 'Use the community MCP server for standard Jira integration, and build a custom server only for team-specific workflows.' },
      { id: 'b', text: 'Build a fully custom MCP server to ensure it covers all team needs from the start.' },
      { id: 'c', text: 'Fork the community server and modify it to add team-specific features.' },
      { id: 'd', text: 'Use the community server and implement team-specific workflows as Claude Code skills instead.' }
    ],
    correctAnswer: 'a',
    explanation: 'Choose existing community MCP servers over custom implementations for standard integrations, reserving custom servers for team-specific workflows. Building from scratch (B) duplicates effort. Forking (C) creates maintenance burden. Skills (D) aren\'t the right abstraction for backend system integration.',
    keyTakeaway: 'Use community MCP servers for standard integrations. Custom servers only for team-specific workflows.'
  },
  {
    id: 'q23',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 2,
    taskStatement: '2.5',
    type: 'single',
    difficulty: 'medium',
    question: 'The agent tries to use Edit to modify a file, but it fails because the target text appears multiple times in the file and Edit can\'t determine which occurrence to change. What\'s the correct fallback approach?',
    options: [
      { id: 'a', text: 'Use Read to load the full file contents, make the modification, then use Write to save the complete file.' },
      { id: 'b', text: 'Use Bash to run a sed command for the replacement.' },
      { id: 'c', text: 'Expand the Edit target text to include more surrounding context for a unique match.' },
      { id: 'd', text: 'Use Grep to find the line number, then use Edit with the line number.' }
    ],
    correctAnswer: 'a',
    explanation: 'When Edit fails due to non-unique text matches, the documented fallback is Read + Write. Read loads the full file, you modify the specific occurrence, then Write saves the result. While expanding context (C) could work, Read + Write is the reliable fallback pattern.',
    keyTakeaway: 'Edit fails on non-unique text → fallback to Read + Write for reliable file modification.'
  },

  // ========== SCENARIO 5: Claude Code for CI ==========
  {
    id: 'q24',
    scenario: 5,
    scenarioTitle: 'Claude Code for Continuous Integration',
    domain: 3,
    taskStatement: '3.6',
    type: 'single',
    difficulty: 'easy',
    question: 'Your pipeline script runs `claude "Analyze this pull request for security issues"` but the job hangs indefinitely. Logs indicate Claude Code is waiting for interactive input. What\'s the correct fix?',
    options: [
      { id: 'a', text: 'Add the -p flag: claude -p "Analyze this pull request for security issues"' },
      { id: 'b', text: 'Set the environment variable CLAUDE_HEADLESS=true before running the command' },
      { id: 'c', text: 'Redirect stdin from /dev/null: claude "..." < /dev/null' },
      { id: 'd', text: 'Add the --batch flag: claude --batch "..."' }
    ],
    correctAnswer: 'a',
    explanation: 'The -p (or --print) flag is the documented way to run Claude Code in non-interactive mode. It processes the prompt, outputs the result to stdout, and exits without waiting for user input. Options B, C, and D reference non-existent features or Unix workarounds that don\'t properly address Claude Code\'s command syntax.',
    keyTakeaway: 'Use -p (--print) flag for non-interactive Claude Code execution in CI/CD pipelines.'
  },
  {
    id: 'q25',
    scenario: 5,
    scenarioTitle: 'Claude Code for Continuous Integration',
    domain: 4,
    taskStatement: '4.5',
    type: 'single',
    difficulty: 'medium',
    question: 'Your team wants to reduce API costs. Currently, real-time Claude calls power two workflows: (1) a blocking pre-merge check and (2) an overnight technical debt report. Your manager proposes switching both to the Message Batches API for 50% cost savings. How should you evaluate?',
    options: [
      { id: 'a', text: 'Use batch processing for the technical debt reports only; keep real-time calls for pre-merge checks.' },
      { id: 'b', text: 'Switch both workflows to batch processing with status polling to check for completion.' },
      { id: 'c', text: 'Keep real-time calls for both workflows to avoid batch result ordering issues.' },
      { id: 'd', text: 'Switch both to batch processing with a timeout fallback to real-time if batches take too long.' }
    ],
    correctAnswer: 'a',
    explanation: 'The Message Batches API has processing times up to 24 hours with no guaranteed latency SLA. This makes it unsuitable for blocking pre-merge checks but ideal for overnight batch jobs. Option B is wrong because "often faster" isn\'t acceptable for blocking workflows. Option D adds unnecessary complexity.',
    keyTakeaway: 'Batch API = non-blocking, latency-tolerant workloads. Synchronous API = blocking workflows.'
  },
  {
    id: 'q26',
    scenario: 5,
    scenarioTitle: 'Claude Code for Continuous Integration',
    domain: 4,
    taskStatement: '4.6',
    type: 'single',
    difficulty: 'hard',
    question: 'A pull request modifies 14 files. Your single-pass review produces inconsistent results: detailed feedback for some files but superficial comments for others, obvious bugs missed, and contradictory feedback—flagging a pattern as problematic in one file while approving identical code elsewhere. How should you restructure?',
    options: [
      { id: 'a', text: 'Split into focused passes: analyze each file individually for local issues, then run a separate integration-focused pass examining cross-file data flow.' },
      { id: 'b', text: 'Require developers to split large PRs into smaller submissions of 3-4 files before the automated review runs.' },
      { id: 'c', text: 'Switch to a higher-tier model with a larger context window to give all 14 files adequate attention in one pass.' },
      { id: 'd', text: 'Run three independent review passes on the full PR and only flag issues that appear in at least two of the three runs.' }
    ],
    correctAnswer: 'a',
    explanation: 'Splitting reviews into focused passes directly addresses attention dilution. File-by-file analysis ensures consistent depth, while a separate integration pass catches cross-file issues. Option B shifts burden to developers. Option C misunderstands that larger context windows don\'t solve attention quality. Option D would suppress detection of real bugs.',
    keyTakeaway: 'Multi-pass review: per-file local analysis + separate cross-file integration pass to avoid attention dilution.'
  },
  {
    id: 'q27',
    scenario: 5,
    scenarioTitle: 'Claude Code for Continuous Integration',
    domain: 4,
    taskStatement: '4.1',
    type: 'single',
    difficulty: 'medium',
    question: 'Your CI code review produces findings across 5 categories. Developers trust the security and bug findings but dismiss 80% of "comment accuracy" findings as false positives, leading them to also start ignoring valid security findings. What\'s the best approach?',
    options: [
      { id: 'a', text: 'Temporarily disable the "comment accuracy" category to restore trust while you improve those prompts specifically.' },
      { id: 'b', text: 'Add "only report high-confidence findings" to the system prompt.' },
      { id: 'c', text: 'Reduce the overall number of findings reported by raising the severity threshold across all categories.' },
      { id: 'd', text: 'Add a confidence score to each finding and let developers filter by confidence level.' }
    ],
    correctAnswer: 'a',
    explanation: 'High false positive rates in one category undermine developer trust in ALL categories. Temporarily disabling the problematic category restores trust while you improve the prompts. "High-confidence" instructions (B) are too vague. Raising thresholds (C) suppresses valid findings. Confidence scores (D) add noise without addressing the root cause.',
    keyTakeaway: 'High false positives in one category erode trust in all categories. Disable problematic categories and fix separately.'
  },
  {
    id: 'q28',
    scenario: 5,
    scenarioTitle: 'Claude Code for Continuous Integration',
    domain: 3,
    taskStatement: '3.6',
    type: 'single',
    difficulty: 'medium',
    question: 'Your CI pipeline runs Claude Code to generate code, then uses the same session to review that code. The review rarely finds issues, but independent human reviews frequently catch problems. Why?',
    options: [
      { id: 'a', text: 'Session context isolation: the same session that generated code retains reasoning context, making it less likely to question its own decisions compared to an independent review instance.' },
      { id: 'b', text: 'The review prompt needs more detailed criteria for what issues to flag.' },
      { id: 'c', text: 'The model needs extended thinking enabled to catch more subtle issues.' },
      { id: 'd', text: 'The generated code is already high quality, and human reviewers are overly critical.' }
    ],
    correctAnswer: 'a',
    explanation: 'A model retains reasoning context from generation, making it biased toward approving its own work. Independent review instances (without prior reasoning context) are more effective at catching issues. This is why the exam guide emphasizes using separate sessions for generation and review.',
    keyTakeaway: 'Self-review is unreliable. Use independent instances for review—no shared reasoning context.'
  },

  // ========== SCENARIO 6: Structured Data Extraction ==========
  {
    id: 'q29',
    scenario: 6,
    scenarioTitle: 'Structured Data Extraction',
    domain: 4,
    taskStatement: '4.3',
    type: 'single',
    difficulty: 'medium',
    question: 'You\'re building an extraction system that processes invoices. Some invoices have a "Purchase Order" field and others don\'t. When you make this field required in the JSON schema, the model fabricates PO numbers for invoices that don\'t have one. What\'s the correct schema design?',
    options: [
      { id: 'a', text: 'Make the "Purchase Order" field optional (nullable) in the schema so the model can return null when the information doesn\'t exist in the source document.' },
      { id: 'b', text: 'Add a prompt instruction saying "Don\'t make up PO numbers if they\'re not present."' },
      { id: 'c', text: 'Add a validation step that cross-references extracted PO numbers against a database.' },
      { id: 'd', text: 'Use a separate extraction pass just for PO numbers with a specialized prompt.' }
    ],
    correctAnswer: 'a',
    explanation: 'Making fields optional/nullable when information may not exist in source documents prevents the model from fabricating values to satisfy required fields. Prompt instructions (B) are probabilistic and won\'t reliably prevent fabrication. Cross-referencing (C) catches errors after the fact. Separate passes (D) add unnecessary complexity.',
    keyTakeaway: 'Use optional/nullable fields in schemas when source documents may not contain the information.'
  },
  {
    id: 'q30',
    scenario: 6,
    scenarioTitle: 'Structured Data Extraction',
    domain: 4,
    taskStatement: '4.3',
    type: 'single',
    difficulty: 'easy',
    question: 'You need guaranteed schema-compliant structured output from Claude for your extraction pipeline. You\'re currently parsing JSON from Claude\'s text response and getting occasional syntax errors (unclosed brackets, trailing commas). What approach eliminates these errors?',
    options: [
      { id: 'a', text: 'Use tool_use with a JSON schema defined in the tool\'s input_schema, and extract data from the tool_use response.' },
      { id: 'b', text: 'Add "Return valid JSON only. No markdown, no explanation." to the prompt.' },
      { id: 'c', text: 'Implement a JSON repair library that fixes common syntax errors in the output.' },
      { id: 'd', text: 'Use regex to extract the JSON block from the response before parsing.' }
    ],
    correctAnswer: 'a',
    explanation: 'Tool use with JSON schemas is the most reliable approach for guaranteed schema-compliant structured output, eliminating JSON syntax errors entirely. The model is constrained to produce valid JSON matching the schema. Prompt instructions (B) reduce but don\'t eliminate errors. JSON repair (C) and regex (D) are fragile workarounds.',
    keyTakeaway: 'tool_use + JSON schema = guaranteed schema-compliant output. Eliminates syntax errors entirely.'
  },
  {
    id: 'q31',
    scenario: 6,
    scenarioTitle: 'Structured Data Extraction',
    domain: 4,
    taskStatement: '4.4',
    type: 'single',
    difficulty: 'hard',
    question: 'Your extraction pipeline validates that line item amounts sum to the stated total. When validation fails, you retry by sending a follow-up request. For some documents, retries always fail because the total is only stated in a separate cover letter not provided to the model. How should you handle this?',
    options: [
      { id: 'a', text: 'Identify that retries are ineffective when required information is absent from the source document, and route these cases to human review instead of infinite retry loops.' },
      { id: 'b', text: 'Increase the retry count from 3 to 10 to give the model more attempts.' },
      { id: 'c', text: 'Add a prompt instruction to "try harder" on subsequent retries.' },
      { id: 'd', text: 'Lower the validation threshold to accept sums within 10% of the stated total.' }
    ],
    correctAnswer: 'a',
    explanation: 'Retries are ineffective when the required information simply isn\'t in the source document. The model can\'t extract what doesn\'t exist. More retries (B) waste compute. "Try harder" (C) doesn\'t help when the information is absent. Lowering thresholds (D) masks real errors alongside missing data.',
    keyTakeaway: 'Retries work for format/structural errors. They\'re ineffective when information is absent from the source.'
  },
  {
    id: 'q32',
    scenario: 6,
    scenarioTitle: 'Structured Data Extraction',
    domain: 4,
    taskStatement: '4.2',
    type: 'single',
    difficulty: 'medium',
    question: 'Your extraction system handles documents with varied structures—some use inline citations, others have bibliographies, some embed data in methodology sections. The model extracts well from bibliographies but returns empty results for inline citations. What\'s the most effective fix?',
    options: [
      { id: 'a', text: 'Add few-shot examples showing correct extraction from documents with varied formats, including inline citations, methodology sections, and embedded details.' },
      { id: 'b', text: 'Create separate extraction prompts for each document type.' },
      { id: 'c', text: 'Add a classification step that identifies the document structure before extraction.' },
      { id: 'd', text: 'Use regex pre-processing to normalize all documents to a standard format before extraction.' }
    ],
    correctAnswer: 'a',
    explanation: 'Few-shot examples demonstrating correct extraction from varied document structures teach the model to handle structural variety. This is more efficient than separate prompts (B) or classification (C), and more robust than regex normalization (D) which can\'t handle the full variety of natural language structures.',
    keyTakeaway: 'Few-shot examples showing varied document structures are the most effective way to handle structural variety.'
  },
  {
    id: 'q33',
    scenario: 6,
    scenarioTitle: 'Structured Data Extraction',
    domain: 5,
    taskStatement: '5.5',
    type: 'single',
    difficulty: 'hard',
    question: 'Your extraction system reports 97% overall accuracy. Management wants to automate all high-confidence extractions without human review. After automation, errors spike on medical billing documents specifically. What went wrong and what\'s the fix?',
    options: [
      { id: 'a', text: 'Aggregate accuracy masked poor performance on specific document types. Implement accuracy analysis by document type and field before automating.' },
      { id: 'b', text: 'The model degraded over time and needs to be updated to the latest version.' },
      { id: 'c', text: 'The confidence threshold was set too low. Raise it from 90% to 99%.' },
      { id: 'd', text: 'Medical billing documents should have been excluded from the extraction pipeline entirely.' }
    ],
    correctAnswer: 'a',
    explanation: 'Aggregate accuracy metrics can mask poor performance on specific document types or fields. 97% overall may hide 80% accuracy on medical billing. The fix is stratified analysis by document type and field segment before reducing human review. Simply raising thresholds (C) doesn\'t address the underlying performance disparity.',
    keyTakeaway: 'Aggregate metrics hide segment-specific failures. Always analyze accuracy by document type and field before automation.'
  },

  // ========== Additional cross-domain questions ==========
  {
    id: 'q34',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 1,
    taskStatement: '1.4',
    type: 'single',
    difficulty: 'medium',
    question: 'A customer contacts your support agent with three issues: a wrong item received, a billing overcharge, and a question about warranty coverage. How should the agent handle this multi-concern request?',
    options: [
      { id: 'a', text: 'Decompose the request into three distinct items, investigate each in parallel using shared context, then synthesize a unified resolution covering all three.' },
      { id: 'b', text: 'Address each issue one at a time in sequence, asking the customer to confirm resolution before moving to the next.' },
      { id: 'c', text: 'Prioritize the most urgent issue (billing overcharge) and address the others only if time permits.' },
      { id: 'd', text: 'Escalate immediately since multi-concern requests are too complex for automated handling.' }
    ],
    correctAnswer: 'a',
    explanation: 'Multi-concern requests should be decomposed into distinct items, investigated in parallel using shared context, and synthesized into a unified resolution. Sequential handling (B) is unnecessarily slow. Prioritizing one (C) ignores customer concerns. Escalating all multi-concern requests (D) defeats the purpose of automation.',
    keyTakeaway: 'Decompose multi-concern requests → investigate in parallel with shared context → synthesize unified resolution.'
  },
  {
    id: 'q35',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 1,
    taskStatement: '1.2',
    type: 'single',
    difficulty: 'medium',
    question: 'Your coordinator currently runs all subagents (web search, document analysis, synthesis, report generation) for every query, regardless of complexity. Simple factual questions take the same 3 minutes as complex multi-source research. What\'s the improvement?',
    options: [
      { id: 'a', text: 'Design the coordinator to analyze query requirements and dynamically select which subagents to invoke rather than always routing through the full pipeline.' },
      { id: 'b', text: 'Add a timeout that kills subagents if they take too long on simple queries.' },
      { id: 'c', text: 'Create a "fast mode" and "thorough mode" and let users choose.' },
      { id: 'd', text: 'Cache results from previous queries to skip subagent calls when possible.' }
    ],
    correctAnswer: 'a',
    explanation: 'The coordinator should dynamically select which subagents to invoke based on query complexity rather than always routing through the full pipeline. Timeouts (B) may kill needed work. User-facing mode selection (C) shifts decision burden. Caching (D) helps for repeated queries but doesn\'t address the core routing issue.',
    keyTakeaway: 'Coordinators should dynamically select subagents based on query complexity, not always run the full pipeline.'
  },
  {
    id: 'q36',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 1,
    taskStatement: '1.7',
    type: 'single',
    difficulty: 'medium',
    question: 'You spent two hours with Claude exploring a codebase and have detailed findings. Now you want to explore two different refactoring approaches from this shared understanding. What\'s the best approach?',
    options: [
      { id: 'a', text: 'Use fork_session to create two independent branches from the shared analysis baseline, each exploring a different approach.' },
      { id: 'b', text: 'Continue in the same session, trying one approach, then undoing it and trying the second.' },
      { id: 'c', text: 'Start two new sessions, manually copying the key findings into each.' },
      { id: 'd', text: 'Use --resume with two different session names pointing to the same base session.' }
    ],
    correctAnswer: 'a',
    explanation: 'fork_session creates independent branches from a shared analysis baseline, perfect for exploring divergent approaches. This preserves the shared understanding while allowing independent exploration. The same session (B) creates confusing context. Manual copying (C) loses nuance. --resume with multiple names (D) isn\'t how session resumption works.',
    keyTakeaway: 'Use fork_session to explore divergent approaches from a shared analysis baseline.'
  },
  {
    id: 'q37',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.1',
    type: 'single',
    difficulty: 'medium',
    question: 'Your project\'s CLAUDE.md has grown to 500+ lines covering testing, API conventions, deployment procedures, database patterns, and frontend standards. Claude sometimes misses relevant sections or applies the wrong conventions. What\'s the best way to restructure?',
    options: [
      { id: 'a', text: 'Split the monolithic CLAUDE.md into focused topic-specific files in .claude/rules/ (e.g., testing.md, api-conventions.md, deployment.md).' },
      { id: 'b', text: 'Keep the single file but add a table of contents at the top.' },
      { id: 'c', text: 'Move less critical sections to a separate README-CONVENTIONS.md file.' },
      { id: 'd', text: 'Use markdown headers more aggressively to help Claude navigate the long document.' }
    ],
    correctAnswer: 'a',
    explanation: '.claude/rules/ directory provides organized topic-specific rule files as an alternative to a monolithic CLAUDE.md. Each file can focus on one convention area, and path-scoped rules load only when relevant. Options B and D don\'t solve the attention problem with large files.',
    keyTakeaway: 'Split large CLAUDE.md files into focused topic-specific files in .claude/rules/ directory.'
  },
  {
    id: 'q38',
    scenario: 6,
    scenarioTitle: 'Structured Data Extraction',
    domain: 4,
    taskStatement: '4.3',
    type: 'single',
    difficulty: 'medium',
    question: 'Your extraction system needs to categorize documents into predefined types (invoice, receipt, contract, memo). Occasionally, documents don\'t fit any predefined category. How should you design the enum field in your schema?',
    options: [
      { id: 'a', text: 'Add an "other" enum value paired with a detail string field for the model to describe the actual document type.' },
      { id: 'b', text: 'Allow free text instead of an enum to handle any document type.' },
      { id: 'c', text: 'Add every possible document type to the enum, including rare ones, to ensure complete coverage.' },
      { id: 'd', text: 'Force the model to choose the closest matching predefined type, even if it\'s not exact.' }
    ],
    correctAnswer: 'a',
    explanation: 'An "other" + detail string pattern provides extensible categorization while maintaining schema structure. Free text (B) loses the benefits of constrained output. Exhaustive enums (C) aren\'t practical. Forcing closest match (D) produces incorrect categorizations.',
    keyTakeaway: 'Use "other" + detail string pattern for extensible enum categorization in schemas.'
  },
  {
    id: 'q39',
    scenario: 5,
    scenarioTitle: 'Claude Code for Continuous Integration',
    domain: 3,
    taskStatement: '3.6',
    type: 'single',
    difficulty: 'medium',
    question: 'Your CI pipeline generates test cases for new code. The generated tests frequently duplicate scenarios already covered by the existing test suite. How do you reduce duplication?',
    options: [
      { id: 'a', text: 'Provide existing test files in context so test generation avoids suggesting duplicate scenarios already covered by the test suite.' },
      { id: 'b', text: 'Add "don\'t duplicate existing tests" to the prompt without providing the existing tests.' },
      { id: 'c', text: 'Run a deduplication pass after generation that removes tests similar to existing ones.' },
      { id: 'd', text: 'Generate tests in a separate directory and manually merge non-duplicates.' }
    ],
    correctAnswer: 'a',
    explanation: 'Providing existing test files as context allows Claude to see what\'s already tested and generate complementary tests. Without context (B), the model can\'t know what exists. Post-processing (C) wastes generation compute. Manual merging (D) defeats the automation purpose.',
    keyTakeaway: 'Include existing test files in context for test generation to avoid duplicating covered scenarios.'
  },
  {
    id: 'q40',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 1,
    taskStatement: '1.4',
    type: 'single',
    difficulty: 'medium',
    question: 'When your agent escalates to a human agent, the human agent reports that they lack sufficient context to continue the resolution effectively. They have to re-ask the customer basic questions. What should you implement?',
    options: [
      { id: 'a', text: 'Compile a structured handoff summary including customer ID, root cause, refund amount, actions taken, and recommended next steps.' },
      { id: 'b', text: 'Give the human agent access to the full conversation transcript.' },
      { id: 'c', text: 'Have the AI agent summarize the conversation in natural language prose before escalating.' },
      { id: 'd', text: 'Transfer the entire agent session state to the human agent\'s interface.' }
    ],
    correctAnswer: 'a',
    explanation: 'Structured handoff summaries provide human agents with the essential information they need in a quickly digestible format. Full transcripts (B) are too verbose to scan quickly. Natural language summaries (C) may miss critical details. Session state transfer (D) is impractical for human agents.',
    keyTakeaway: 'Compile structured handoff summaries (customer ID, root cause, amount, recommended action) for human escalation.'
  },
  {
    id: 'q41',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 5,
    taskStatement: '5.6',
    type: 'single',
    difficulty: 'medium',
    question: 'Your synthesis agent combines findings from multiple subagents. The final report contains claims like "studies show..." and "recent research indicates..." but doesn\'t indicate which specific source supports which claim. What\'s the fix?',
    options: [
      { id: 'a', text: 'Require subagents to output structured claim-source mappings (source URLs, document names, relevant excerpts) that the synthesis agent must preserve when combining findings.' },
      { id: 'b', text: 'Add footnotes to the report after synthesis, matching claims to a bibliography.' },
      { id: 'c', text: 'Have each subagent produce its own mini-report with citations, then concatenate them.' },
      { id: 'd', text: 'Ask the synthesis agent to cite its sources more carefully in a follow-up pass.' }
    ],
    correctAnswer: 'a',
    explanation: 'Source attribution is lost during summarization when findings are compressed without preserving claim-source mappings. The fix is structural: require subagents to output structured mappings that the synthesis agent must preserve. Post-hoc footnotes (B) can\'t recover lost attribution. Concatenation (C) doesn\'t synthesize. A follow-up pass (D) can\'t restore information that was already lost.',
    keyTakeaway: 'Require structured claim-source mappings from subagents. Synthesis must preserve these through combination.'
  },
  {
    id: 'q42',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 2,
    taskStatement: '2.4',
    type: 'single',
    difficulty: 'easy',
    question: 'Your team shares a GitHub MCP server that requires a personal access token. Where should you configure the token to avoid committing it to the repository?',
    options: [
      { id: 'a', text: 'Use environment variable expansion in .mcp.json (e.g., ${GITHUB_TOKEN}) and set the token in each developer\'s environment.' },
      { id: 'b', text: 'Hardcode the token directly in .mcp.json since it\'s a shared configuration.' },
      { id: 'c', text: 'Store the token in CLAUDE.md under a "credentials" section.' },
      { id: 'd', text: 'Configure the token in ~/.claude.json and reference it from .mcp.json.' }
    ],
    correctAnswer: 'a',
    explanation: 'Environment variable expansion in .mcp.json (e.g., ${GITHUB_TOKEN}) allows credential management without committing secrets. The config file references the variable name, and each developer sets the actual token in their environment. Hardcoding (B) commits secrets. CLAUDE.md (C) is for instructions, not credentials.',
    keyTakeaway: 'Use ${ENV_VAR} expansion in .mcp.json for credentials. Never hardcode tokens in config files.'
  },
  {
    id: 'q43',
    scenario: 6,
    scenarioTitle: 'Structured Data Extraction',
    domain: 4,
    taskStatement: '4.3',
    type: 'single',
    difficulty: 'medium',
    question: 'Your extraction system processes both invoices and receipts. When tool_choice is set to "auto", the model sometimes returns a text explanation instead of calling the extraction tool. You need guaranteed structured output but the document type is unknown. What\'s the fix?',
    options: [
      { id: 'a', text: 'Set tool_choice: "any" to guarantee the model calls a tool, while letting it choose between the invoice and receipt extraction tools based on document content.' },
      { id: 'b', text: 'Add "You must always call a tool. Never respond with text." to the system prompt.' },
      { id: 'c', text: 'Create a single combined extraction tool that handles both document types.' },
      { id: 'd', text: 'Add a classification step before extraction to determine the document type, then force the specific tool.' }
    ],
    correctAnswer: 'a',
    explanation: 'tool_choice: "any" guarantees the model calls a tool but lets it choose which one—perfect when multiple extraction schemas exist and document type is unknown. Prompt instructions (B) are probabilistic. A combined tool (C) loses the benefit of type-specific schemas. Pre-classification (D) adds latency unnecessarily.',
    keyTakeaway: 'tool_choice: "auto" = model may return text. "any" = must call a tool, can choose which. Forced = must call specific tool.'
  },
  {
    id: 'q44',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.5',
    type: 'single',
    difficulty: 'medium',
    question: 'You\'re building a complex caching system in a domain you\'re unfamiliar with. You want Claude to help design it, but you\'re worried about missing important edge cases like cache invalidation strategies, TTL policies, and memory pressure handling. What approach should you use?',
    options: [
      { id: 'a', text: 'Use the interview pattern: have Claude ask questions to surface design considerations you may not have anticipated before implementing.' },
      { id: 'b', text: 'Provide a detailed specification and have Claude implement it directly.' },
      { id: 'c', text: 'Ask Claude to generate the complete caching system with all possible features enabled.' },
      { id: 'd', text: 'Start with a minimal implementation and add features as edge cases are discovered in production.' }
    ],
    correctAnswer: 'a',
    explanation: 'The interview pattern has Claude ask questions to surface considerations the developer may not have anticipated. This is especially valuable in unfamiliar domains where you don\'t know what you don\'t know. Direct implementation (B) assumes you\'ve thought of everything. Feature-complete generation (C) may include unnecessary complexity. Minimal + production discovery (D) is risky for caching systems.',
    keyTakeaway: 'Use the interview pattern in unfamiliar domains to surface design considerations before implementing.'
  },
  {
    id: 'q45',
    scenario: 5,
    scenarioTitle: 'Claude Code for Continuous Integration',
    domain: 3,
    taskStatement: '3.6',
    type: 'single',
    difficulty: 'hard',
    question: 'Your CI pipeline runs code reviews on PRs. When a PR gets new commits after an initial review, re-running the review produces many duplicate findings—issues that were already flagged in the first review and haven\'t been addressed yet. This creates noise. What\'s the solution?',
    options: [
      { id: 'a', text: 'Include prior review findings in context when re-running, instructing Claude to report only new or still-unaddressed issues.' },
      { id: 'b', text: 'Only review the diff between the new commits and the previous review point.' },
      { id: 'c', text: 'Cache the previous review output and filter duplicates before posting.' },
      { id: 'd', text: 'Skip the re-review and assume previous findings still apply.' }
    ],
    correctAnswer: 'a',
    explanation: 'Including prior findings in context lets Claude understand what\'s already been flagged and focus on new or unresolved issues. Reviewing only the diff (B) may miss issues introduced by interactions between old and new code. Caching + filtering (C) requires fuzzy matching logic. Skipping (D) misses new issues.',
    keyTakeaway: 'Include prior review findings in context on re-review. Instruct to report only new/unaddressed issues.'
  },
  {
    id: 'q46',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 5,
    taskStatement: '5.2',
    type: 'single',
    difficulty: 'medium',
    question: 'A frustrated customer says "I want to speak with a real person" after the agent has correctly identified a simple issue (a standard return within policy). How should the agent respond?',
    options: [
      { id: 'a', text: 'Honor the explicit request for a human agent immediately without first attempting investigation.' },
      { id: 'b', text: 'Explain that the issue is simple and offer to resolve it quickly, escalating only if the customer reiterates their preference.' },
      { id: 'c', text: 'Escalate immediately with a structured handoff summary.' },
      { id: 'd', text: 'Both A and C — honor the request AND provide the handoff summary.' }
    ],
    correctAnswer: 'd',
    explanation: 'When a customer explicitly requests a human agent, honor that request immediately (A). AND compile a structured handoff summary (C) so the human agent has the context. The correct approach combines both actions: immediate escalation with complete context handoff.',
    keyTakeaway: 'Honor explicit requests for human agents immediately. Always include structured handoff summaries.'
  },
  {
    id: 'q47',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 1,
    taskStatement: '1.7',
    type: 'single',
    difficulty: 'medium',
    question: 'You used Claude to analyze a codebase yesterday and got detailed findings. Today, you\'ve made significant changes to 5 of the files Claude analyzed. You want to continue the analysis. What\'s the best approach?',
    options: [
      { id: 'a', text: 'Start a new session with a structured summary of yesterday\'s key findings, since prior tool results referencing the changed files are now stale.' },
      { id: 'b', text: 'Use --resume to continue yesterday\'s session and inform the agent about the specific files that changed for targeted re-analysis.' },
      { id: 'c', text: 'Use --resume and let the agent discover the changes on its own.' },
      { id: 'd', text: 'Start completely fresh without any context from yesterday.' }
    ],
    correctAnswer: 'b',
    explanation: 'When files have changed but prior context is mostly valid, resume the session and inform the agent about specific changes for targeted re-analysis. A new session with summaries (A) is appropriate when most tool results are stale. Letting the agent discover changes (C) wastes time. Starting fresh (D) loses valuable context.',
    keyTakeaway: '--resume when prior context is mostly valid. Fresh session with summaries when prior tool results are largely stale.'
  },
  {
    id: 'q48',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 1,
    taskStatement: '1.2',
    type: 'single',
    difficulty: 'hard',
    question: 'Your coordinator evaluates the synthesis agent\'s output and finds it doesn\'t adequately cover the economic impact dimension of the research topic. What should the coordinator do?',
    options: [
      { id: 'a', text: 'Re-delegate to search and analysis subagents with targeted queries about economic impact, then re-invoke synthesis with the new findings plus the previous output.' },
      { id: 'b', text: 'Ask the synthesis agent to add more content about economic impact from its existing findings.' },
      { id: 'c', text: 'Add a note to the final report that economic impact was not fully covered.' },
      { id: 'd', text: 'Run the entire research pipeline again with "economic impact" added to the original query.' }
    ],
    correctAnswer: 'a',
    explanation: 'Iterative refinement loops are a key coordinator pattern: evaluate output for gaps, re-delegate to search/analysis with targeted queries, then re-invoke synthesis until coverage is sufficient. The synthesis agent can\'t add what it doesn\'t have (B). A coverage note (C) is insufficient. Full re-run (D) is wasteful.',
    keyTakeaway: 'Coordinators should implement iterative refinement: evaluate → re-delegate targeted queries → re-synthesize.'
  },
  {
    id: 'q49',
    scenario: 6,
    scenarioTitle: 'Structured Data Extraction',
    domain: 4,
    taskStatement: '4.5',
    type: 'single',
    difficulty: 'medium',
    question: 'You need to extract data from 10,000 invoices. A pilot run on 50 invoices shows an 85% first-pass success rate with specific error patterns. What should you do before processing the full batch?',
    options: [
      { id: 'a', text: 'Refine prompts on the sample set to maximize first-pass success rates before batch-processing the full volume.' },
      { id: 'b', text: 'Process all 10,000 immediately and fix errors in a second pass.' },
      { id: 'c', text: 'Split the 10,000 into batches of 50 and process each batch with manual review.' },
      { id: 'd', text: 'Use a different model for the full batch that has higher accuracy.' }
    ],
    correctAnswer: 'a',
    explanation: 'Use prompt refinement on a sample set before batch-processing large volumes to maximize first-pass success rates and reduce iterative resubmission costs. Processing all immediately (B) at 85% accuracy means 1,500 failures to handle. Small manual batches (C) defeat automation. Model switching (D) doesn\'t address the prompt issues.',
    keyTakeaway: 'Refine prompts on a sample set before large batch processing. Fix error patterns before scaling.'
  },
  {
    id: 'q50',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.1',
    type: 'single',
    difficulty: 'easy',
    question: 'You have a monorepo with separate packages for frontend, backend, and shared utilities. Each package has its own conventions, but there are also project-wide standards. What\'s the best CLAUDE.md organization?',
    options: [
      { id: 'a', text: 'Project-level CLAUDE.md with universal standards, plus @import to include package-specific standards files relevant to each package.' },
      { id: 'b', text: 'One large CLAUDE.md at the root covering everything for all packages.' },
      { id: 'c', text: 'Only package-level CLAUDE.md files with no project-level config.' },
      { id: 'd', text: 'A separate repository for CLAUDE.md files that each package references.' }
    ],
    correctAnswer: 'a',
    explanation: 'Project-level CLAUDE.md for universal standards combined with @import for package-specific standards provides modular organization. A single large file (B) has attention issues. Package-only (C) loses universal standards. Separate repo (D) adds unnecessary complexity.',
    keyTakeaway: 'Use project-level CLAUDE.md + @import for modular, hierarchical configuration in monorepos.'
  },
  // Additional questions for completeness
  {
    id: 'q51',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 2,
    taskStatement: '2.2',
    type: 'single',
    difficulty: 'medium',
    question: 'Your MCP tool lookup_order returns a generic "Operation failed" for both temporary database timeouts and permanent "order not found" conditions. The agent treats both the same way, retrying "order not found" errors unnecessarily. How should you fix the error responses?',
    options: [
      { id: 'a', text: 'Return structured error metadata including errorCategory (transient/validation), isRetryable boolean, and a human-readable description for each error type.' },
      { id: 'b', text: 'Add error handling instructions to the system prompt explaining which errors to retry.' },
      { id: 'c', text: 'Implement client-side retry logic with exponential backoff for all errors.' },
      { id: 'd', text: 'Return different HTTP status codes and let the agent interpret them.' }
    ],
    correctAnswer: 'a',
    explanation: 'Structured error metadata gives the agent the information to make appropriate recovery decisions. Prompt instructions (B) are probabilistic. Blanket retries (C) waste resources on non-retryable errors. HTTP status codes (D) lose the semantic richness of structured error categories.',
    keyTakeaway: 'Return structured error metadata: errorCategory, isRetryable, description. Don\'t use generic "Operation failed" responses.'
  },
  {
    id: 'q52',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 2,
    taskStatement: '2.3',
    type: 'single',
    difficulty: 'medium',
    question: 'Your research system gives each subagent access to all 18 tools in the system. You notice the synthesis agent sometimes performs web searches instead of synthesizing findings, and the search agent sometimes tries to write the final report. What\'s happening?',
    options: [
      { id: 'a', text: 'Too many tools degrades selection reliability. Restrict each subagent\'s tools to those relevant to its role.' },
      { id: 'b', text: 'The system prompt needs clearer instructions about each agent\'s role.' },
      { id: 'c', text: 'The model is too capable and needs to be downgraded to prevent cross-role usage.' },
      { id: 'd', text: 'Add tool_choice: "auto" to let the model decide the best tools to use.' }
    ],
    correctAnswer: 'a',
    explanation: 'Giving an agent too many tools (18 instead of 4-5) degrades tool selection reliability. Agents with tools outside their specialization tend to misuse them. The fix is scoped tool access: each agent gets only the tools needed for its role. System prompt instructions (B) are insufficient against the decision complexity of 18 tools.',
    keyTakeaway: 'Limit agents to 4-5 role-specific tools. Too many tools degrades selection reliability.'
  },
  {
    id: 'q53',
    scenario: 5,
    scenarioTitle: 'Claude Code for Continuous Integration',
    domain: 3,
    taskStatement: '3.6',
    type: 'single',
    difficulty: 'medium',
    question: 'Your CI pipeline needs Claude Code to output review findings in a structured JSON format that your automation can parse and post as inline PR comments. What CLI flags should you use?',
    options: [
      { id: 'a', text: '--output-format json with --json-schema to produce machine-parseable structured findings.' },
      { id: 'b', text: '--format json to set the output format.' },
      { id: 'c', text: '-p with a prompt that says "respond in JSON format."' },
      { id: 'd', text: '--structured-output with a schema file path.' }
    ],
    correctAnswer: 'a',
    explanation: '--output-format json and --json-schema are the CLI flags for enforcing structured output in CI contexts. They ensure the output is machine-parseable and conforms to a specific schema. Options B and D reference non-existent flags. Option C relies on prompt-based JSON which is unreliable.',
    keyTakeaway: 'Use --output-format json + --json-schema for structured CI output from Claude Code.'
  },
  {
    id: 'q54',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 5,
    taskStatement: '5.4',
    type: 'single',
    difficulty: 'easy',
    question: 'During an extended codebase exploration session, the context is filling with verbose discovery output and responses are slowing down. What command should you use to reduce context usage?',
    options: [
      { id: 'a', text: '/compact to reduce context usage by summarizing the conversation.' },
      { id: 'b', text: '/clear to delete the conversation history.' },
      { id: 'c', text: '/reset to start a fresh session with no context.' },
      { id: 'd', text: '/trim to remove old messages from the context.' }
    ],
    correctAnswer: 'a',
    explanation: '/compact reduces context usage during extended exploration sessions by summarizing verbose discovery output. It preserves key information while freeing context space. Options B, C, D reference commands that either don\'t exist or have different behavior.',
    keyTakeaway: 'Use /compact to reduce context in extended sessions. It summarizes verbose output while preserving key info.'
  },
  {
    id: 'q55',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 5,
    taskStatement: '5.2',
    type: 'single',
    difficulty: 'hard',
    question: 'A customer asks for a competitor price match. Your company\'s policy mentions price adjustments for own-site discrepancies but is silent on competitor price matching. What should the agent do?',
    options: [
      { id: 'a', text: 'Escalate because the policy is ambiguous or silent on the customer\'s specific request—policy gaps require human judgment.' },
      { id: 'b', text: 'Deny the request since the policy doesn\'t explicitly mention competitor price matching.' },
      { id: 'c', text: 'Approve the price match since the policy mentions price adjustments generally.' },
      { id: 'd', text: 'Ask the customer to provide proof of the competitor\'s price before making a decision.' }
    ],
    correctAnswer: 'a',
    explanation: 'When policy is ambiguous or silent on a customer\'s specific request, the agent should escalate. Policy gaps require human judgment—the agent shouldn\'t deny or approve based on inference. Asking for proof (D) implies the agent has authority to approve, which it doesn\'t when policy is unclear.',
    keyTakeaway: 'Escalate when policy is ambiguous or silent on the request. Policy gaps need human judgment.'
  },
  // Questions to reach 60+
  {
    id: 'q56',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 5,
    taskStatement: '5.1',
    type: 'single',
    difficulty: 'medium',
    question: 'Your research subagents return verbose outputs (5000+ tokens each) containing full document excerpts, analysis reasoning, and metadata. The synthesis subagent has limited context budget and starts dropping details. What should you change?',
    options: [
      { id: 'a', text: 'Modify upstream agents to return structured data (key facts, citations, relevance scores) instead of verbose content and reasoning chains.' },
      { id: 'b', text: 'Increase the synthesis agent\'s context window size.' },
      { id: 'c', text: 'Have the synthesis agent process one subagent output at a time.' },
      { id: 'd', text: 'Add a summarization step between each subagent and the synthesis agent.' }
    ],
    correctAnswer: 'a',
    explanation: 'When downstream agents have limited context budgets, upstream agents should return structured data (key facts, citations, relevance scores) instead of verbose content. This is more effective than summarization (D) because it preserves structured information. Larger context (B) doesn\'t solve attention. Sequential processing (C) may lose cross-source connections.',
    keyTakeaway: 'When downstream agents have limited context, upstream agents should return structured data, not verbose content.'
  },
  {
    id: 'q57',
    scenario: 6,
    scenarioTitle: 'Structured Data Extraction',
    domain: 4,
    taskStatement: '4.4',
    type: 'single',
    difficulty: 'medium',
    question: 'Your extraction pipeline extracts a "stated_total" from invoices and calculates its own "calculated_total" by summing line items. When these don\'t match, how should the system handle it?',
    options: [
      { id: 'a', text: 'Extract both values and add a "conflict_detected" boolean flag, letting downstream systems or human reviewers investigate the discrepancy.' },
      { id: 'b', text: 'Always use the calculated total since arithmetic is deterministic.' },
      { id: 'c', text: 'Always use the stated total since it\'s the "source of truth."' },
      { id: 'd', text: 'Retry the extraction assuming the model misread one of the values.' }
    ],
    correctAnswer: 'a',
    explanation: 'Extracting both values with a conflict_detected flag preserves information for investigation. Automatically choosing either value (B, C) hides potential errors in the source document. Retrying (D) may reproduce the same result if the source document itself has an error.',
    keyTakeaway: 'Extract both calculated and stated values. Flag conflicts for investigation rather than auto-resolving.'
  },
  {
    id: 'q58',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.4',
    type: 'single',
    difficulty: 'easy',
    question: 'You need to add a single date validation check to one function in a well-understood codebase. The change is straightforward with a clear stack trace showing exactly where the validation should go. Which mode should you use?',
    options: [
      { id: 'a', text: 'Direct execution — the change is simple, well-scoped, and clearly defined.' },
      { id: 'b', text: 'Plan mode — to explore potential side effects of the validation change.' },
      { id: 'c', text: 'Plan mode — because all code changes should start with planning.' },
      { id: 'd', text: 'Direct execution in a forked session — to test the change in isolation.' }
    ],
    correctAnswer: 'a',
    explanation: 'Direct execution is appropriate for simple, well-scoped changes with clear scope. A single-function date validation with a clear stack trace doesn\'t need planning. Plan mode (B, C) is overkill for trivial changes. A forked session (D) is unnecessary for a simple edit.',
    keyTakeaway: 'Direct execution for simple, well-scoped changes. Plan mode for complex, multi-file, architectural tasks.'
  },
  {
    id: 'q59',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 2,
    taskStatement: '2.4',
    type: 'single',
    difficulty: 'medium',
    question: 'You\'ve configured a custom MCP server with rich search capabilities, but the agent keeps using the built-in Grep tool instead of your MCP search tool, even when the MCP tool would provide better results. What\'s the most likely cause and fix?',
    options: [
      { id: 'a', text: 'The MCP tool\'s description doesn\'t adequately explain its capabilities. Enhance it to detail what it does, what it returns, and why it\'s better than Grep for specific queries.' },
      { id: 'b', text: 'Remove the Grep tool from the agent\'s allowedTools.' },
      { id: 'c', text: 'Add an instruction to the system prompt saying "always prefer MCP tools over built-in tools."' },
      { id: 'd', text: 'The agent needs to be explicitly configured to prioritize MCP tools.' }
    ],
    correctAnswer: 'a',
    explanation: 'When agents prefer built-in tools over MCP tools, the most likely cause is that the MCP tool description doesn\'t adequately explain its capabilities. Enhanced descriptions that detail what the tool does, its outputs, and when to prefer it over alternatives fix tool selection. Removing Grep (B) may break other workflows.',
    keyTakeaway: 'If agents prefer built-in tools over MCP tools, enhance the MCP tool descriptions with detailed capabilities.'
  },
  {
    id: 'q60',
    scenario: 1,
    scenarioTitle: 'Customer Support Resolution Agent',
    domain: 5,
    taskStatement: '5.1',
    type: 'single',
    difficulty: 'medium',
    question: 'Your agent calls get_customer which returns 40+ fields (name, address, phone, email, loyalty_status, signup_date, last_login, preferences, payment_methods, etc.). For most support interactions, only 5 fields are relevant. These verbose responses accumulate in context over a multi-turn conversation. What should you do?',
    options: [
      { id: 'a', text: 'Trim verbose tool outputs to only relevant fields before they accumulate in context (e.g., keep only return-relevant fields from customer lookups).' },
      { id: 'b', text: 'Modify the get_customer tool to return fewer fields by default.' },
      { id: 'c', text: 'Increase the model\'s context window to accommodate the verbose outputs.' },
      { id: 'd', text: 'Don\'t worry about it — the model handles large contexts efficiently.' }
    ],
    correctAnswer: 'a',
    explanation: 'Tool results accumulate in context and consume tokens disproportionately to their relevance. Trimming verbose outputs to only relevant fields before they accumulate prevents context bloat. Modifying the tool (B) may break other consumers. Larger context (C) doesn\'t solve the attention dilution problem.',
    keyTakeaway: 'Trim verbose tool outputs to relevant fields before context accumulation. 40 fields → 5 relevant fields.'
  },
  {
    id: 'q61',
    scenario: 5,
    scenarioTitle: 'Claude Code for Continuous Integration',
    domain: 4,
    taskStatement: '4.2',
    type: 'single',
    difficulty: 'medium',
    question: 'Your CI code review produces verbose, inconsistently formatted findings. Some include file locations and severity, others are vague paragraphs. Detailed instructions about the desired format haven\'t achieved consistency. What\'s the most effective approach?',
    options: [
      { id: 'a', text: 'Include 2-4 few-shot examples showing the exact desired format: file location, issue description, severity level, and suggested fix.' },
      { id: 'b', text: 'Use a more detailed prompt with explicit formatting rules and markdown templates.' },
      { id: 'c', text: 'Post-process the output with regex to extract structured data from whatever format is returned.' },
      { id: 'd', text: 'Use tool_use with a JSON schema to force structured output for each finding.' }
    ],
    correctAnswer: 'a',
    explanation: 'Few-shot examples are the most effective technique for achieving consistently formatted output when detailed instructions alone produce inconsistent results. While tool_use (D) is also valid, few-shot examples are specified as the technique for this exact problem in the exam guide. Post-processing (C) is fragile.',
    keyTakeaway: 'Few-shot examples are the most effective way to achieve consistent output formatting when instructions alone fail.'
  },
  {
    id: 'q62',
    scenario: 3,
    scenarioTitle: 'Multi-Agent Research System',
    domain: 5,
    taskStatement: '5.3',
    type: 'single',
    difficulty: 'medium',
    question: 'Your web search subagent runs a query and gets zero results. It returns an empty result set to the coordinator. The coordinator interprets this as a search failure and retries the query multiple times, wasting resources. What\'s the issue?',
    options: [
      { id: 'a', text: 'The subagent doesn\'t distinguish between access failures (search engine timeout) and valid empty results (successful query, no matches). It should use different response formats for each.' },
      { id: 'b', text: 'The coordinator needs better retry logic to detect repeated empty results.' },
      { id: 'c', text: 'The search query needs to be broader to avoid zero-result queries.' },
      { id: 'd', text: 'Empty results should always trigger a retry with modified search terms.' }
    ],
    correctAnswer: 'a',
    explanation: 'The subagent must distinguish between access failures (search unavailable, needing retry) and valid empty results (query succeeded but found nothing). Without this distinction, the coordinator can\'t make appropriate decisions. Better retry logic (B) treats symptoms not causes.',
    keyTakeaway: 'Distinguish access failures (retry-worthy) from valid empty results (no matches found). Different response formats for each.'
  },
  {
    id: 'q63',
    scenario: 6,
    scenarioTitle: 'Structured Data Extraction',
    domain: 4,
    taskStatement: '4.5',
    type: 'single',
    difficulty: 'medium',
    question: 'Your batch extraction job processed 500 documents. 480 succeeded, 20 failed. The batch API returns results identified by custom_id. How should you handle the failures?',
    options: [
      { id: 'a', text: 'Resubmit only the 20 failed documents (identified by custom_id) with appropriate modifications like chunking oversized documents.' },
      { id: 'b', text: 'Resubmit all 500 documents to ensure consistency.' },
      { id: 'c', text: 'Manually process the 20 failed documents.' },
      { id: 'd', text: 'Accept 96% success rate and skip the failures.' }
    ],
    correctAnswer: 'a',
    explanation: 'custom_id fields allow you to identify exactly which documents failed. Resubmit only those failed documents with appropriate modifications (e.g., chunking oversized ones). Resubmitting all (B) wastes resources. Manual processing (C) doesn\'t scale. Skipping (D) may lose important data.',
    keyTakeaway: 'Use custom_id to identify failed batch items. Resubmit only failures with appropriate modifications.'
  },
  {
    id: 'q64',
    scenario: 4,
    scenarioTitle: 'Developer Productivity with Claude',
    domain: 5,
    taskStatement: '5.4',
    type: 'single',
    difficulty: 'hard',
    question: 'Your multi-agent codebase exploration system crashes mid-analysis. On restart, the coordinator has no memory of which subagents completed and what they found. How should you design crash recovery?',
    options: [
      { id: 'a', text: 'Design structured agent state exports (manifests) where each agent saves its state to a known location, and the coordinator loads the manifest on resume to inject prior findings into agent prompts.' },
      { id: 'b', text: 'Implement database-backed state management with full transaction logging.' },
      { id: 'c', text: 'Run all subagents again from scratch since cached state may be stale.' },
      { id: 'd', text: 'Use checkpointing in the coordinator to save conversation state at regular intervals.' }
    ],
    correctAnswer: 'a',
    explanation: 'Structured state persistence via manifests allows crash recovery: each agent exports state, and the coordinator loads the manifest on resume. This is lighter than full database state management (B) and more efficient than re-running everything (C). Conversation checkpointing (D) doesn\'t capture subagent findings.',
    keyTakeaway: 'Use structured manifests for crash recovery: agents export state → coordinator loads manifest on resume.'
  },
  {
    id: 'q65',
    scenario: 2,
    scenarioTitle: 'Code Generation with Claude Code',
    domain: 3,
    taskStatement: '3.5',
    type: 'single',
    difficulty: 'medium',
    question: 'You\'re iterating on a code generation task with Claude. The output has 5 issues: 3 are independent formatting bugs, and 2 are interacting logic errors where fixing one affects the other. How should you structure your feedback?',
    options: [
      { id: 'a', text: 'Address the 2 interacting logic errors together in a single detailed message, then fix the 3 formatting bugs sequentially or in a separate batch.' },
      { id: 'b', text: 'Report all 5 issues in one message to maximize efficiency.' },
      { id: 'c', text: 'Fix each of the 5 issues one at a time in separate messages.' },
      { id: 'd', text: 'Fix the formatting bugs first since they\'re simpler, then tackle the logic errors.' }
    ],
    correctAnswer: 'a',
    explanation: 'When fixes interact (the 2 logic errors), address them together in a single message so Claude can consider their interdependencies. Independent issues (3 formatting bugs) can be handled sequentially. Reporting all 5 together (B) may cause the model to prioritize incorrectly. One-at-a-time for everything (C) is slow for the independent issues.',
    keyTakeaway: 'Interacting issues → single detailed message. Independent issues → sequential iteration or batch.'
  }
];
