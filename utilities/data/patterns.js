const PATTERNS_DATA = [
  {
    id: 1,
    domain: 1,
    taskStatement: "1.1",
    title: "Arbitrary Loop Termination",
    antiPattern: `
let iterations = 0;
while (iterations < 5) {
  const response = await llm.generate();
  if (response.text.includes("I am done")) break;
  iterations++;
}
    `,
    correctPattern: `
while (true) {
  const response = await llm.generate();
  if (response.stop_reason === "end_turn") break;
  if (response.stop_reason === "tool_use") {
    // Execute tools and append results
  }
}
    `,
    flaw: "Using natural language parsing or arbitrary caps instead of `stop_reason`.",
    explanation: "Task Statement 1.1: Design and implement agentic loops. You should never parse assistant text or use arbitrary loop limits to terminate a task. Always rely on the deterministic `stop_reason` field provided by the API."
  },
  {
    id: 2,
    domain: 1,
    taskStatement: "1.2",
    title: "Coordinator Context Bleed",
    antiPattern: `
// Coordinator prompt includes the entire conversation history
const subagentPrompt = \`
Here is the whole chat history: \${fullChatHistory}
Go research the second topic.\`;
    `,
    correctPattern: `
// Coordinator synthesizes a specific task for the subagent
const subagentPrompt = \`
Task: Research the economic impact of solar subsidies.
Context: User requested a 500-word summary. Focus only on economic data.\`;
    `,
    flaw: "Dumping raw coordinator history into subagent prompts.",
    explanation: "Task Statement 1.2: Orchestrate multi-agent systems. Subagents operate with isolated context. Dumping the coordinator's raw history increases token cost and causes the subagent to lose focus. The coordinator must synthesize a narrow task."
  },
  {
    id: 3,
    domain: 1,
    taskStatement: "1.3",
    title: "Implicit Subagent Invocation",
    antiPattern: `
// Sending a prompt and hoping it spawns a subagent
const response = await llm.generate("Research this topic deeply.");
    `,
    correctPattern: `
// Explicitly providing the Task tool
const response = await llm.generate("Research this topic deeply.", {
  tools: [{
    name: "Task",
    description: "Spawns a subagent to perform research."
  }]
});
    `,
    flaw: "Expecting multi-agent behavior without providing the `Task` tool.",
    explanation: "Task Statement 1.3: Configure subagent invocation. Subagents cannot be spawned magically via text. The coordinator must be explicitly provided a `Task` tool in its `allowedTools` array to invoke a subagent."
  },
  {
    id: 4,
    domain: 1,
    taskStatement: "1.4",
    title: "Prompt-Based Enforcement",
    antiPattern: `
"You must always verify the user's ID before processing a refund. Do not skip this step under any circumstances."
    `,
    correctPattern: `
// Programmatic enforcement in the orchestrator
if (intent === 'refund' && !user.isVerified) {
  return "Error: User verification required.";
}
    `,
    flaw: "Relying on prompts for deterministic compliance.",
    explanation: "Task Statement 1.4: Implement workflows with enforcement. Prompt instructions have a non-zero failure rate. When deterministic compliance is required (e.g., identity verification), use programmatic enforcement gates."
  },
  {
    id: 5,
    domain: 1,
    taskStatement: "1.5",
    title: "Raw Tool Data Injection",
    antiPattern: `
const dbResult = await db.rawQuery("SELECT * FROM users");
messages.push({ role: "tool", content: JSON.stringify(dbResult) });
    `,
    correctPattern: `
const dbResult = await db.rawQuery("SELECT * FROM users");
const normalized = dbResult.map(u => ({ id: u.id, status: u.status }));
messages.push({ role: "tool", content: JSON.stringify(normalized) });
    `,
    flaw: "Injecting unnormalized, raw database objects into context.",
    explanation: "Task Statement 1.5: Apply SDK hooks for data normalization. Raw data often contains noise, PII, or verbose metadata. Always normalize and filter tool outputs via hooks before passing them back to the LLM to save tokens and improve focus."
  },
  {
    id: 6,
    domain: 1,
    taskStatement: "1.6",
    title: "Monolithic Task Delegation",
    antiPattern: `
// Coordinator
const response = await executeTask("Write a book, edit it, format it, and publish it.");
    `,
    correctPattern: `
// Coordinator decomposes the task
const outline = await executeTask("Create chapter outline.");
const chapter1 = await executeTask(\`Write chapter 1 based on outline: \${outline}\`);
    `,
    flaw: "Failing to decompose complex workflows.",
    explanation: "Task Statement 1.6: Design task decomposition strategies. Passing massive, multi-step tasks to a single agent leads to degradation. A coordinator must decompose large goals into narrow, verifiable sub-tasks."
  },
  {
    id: 7,
    domain: 1,
    taskStatement: "1.7",
    title: "Lossy Session Resumption",
    antiPattern: `
// Resuming a session by just loading the last user message
const messages = [{ role: "user", content: lastMessage }];
await llm.generate({ messages });
    `,
    correctPattern: `
// Restoring the full session state
const messages = await db.loadMessages(sessionId);
// Apply history pruning if necessary
await llm.generate({ messages });
    `,
    flaw: "Losing conversation context on resumption.",
    explanation: "Task Statement 1.7: Manage session state. When resuming an asynchronous workflow, you must restore the full message history (or a summarized context) so the agent maintains state awareness."
  },
  {
    id: 8,
    domain: 2,
    taskStatement: "2.1",
    title: "Vague Tool Descriptions",
    antiPattern: `
{
  "name": "search",
  "description": "Searches for things."
}
    `,
    correctPattern: `
{
  "name": "search_kb",
  "description": "Searches the internal knowledge base for technical support articles. Requires a 3-word query."
}
    `,
    flaw: "Providing descriptions that do not explain when or how to use the tool.",
    explanation: "Task Statement 2.1: Design effective tool interfaces. The LLM relies entirely on the description to decide whether to route a request to this tool. Descriptions must be explicit about the tool's purpose and constraints."
  },
  {
    id: 9,
    domain: 2,
    taskStatement: "2.2",
    title: "Silent MCP Failures",
    antiPattern: `
try {
  return await mcpServer.callTool("read_file", args);
} catch (e) {
  return "Failed.";
}
    `,
    correctPattern: `
try {
  return await mcpServer.callTool("read_file", args);
} catch (e) {
  return \`Error: \${e.message}. Ensure the file path is absolute.\`;
}
    `,
    flaw: "Masking MCP tool errors with generic strings.",
    explanation: "Task Statement 2.2: Implement structured error responses. If an MCP tool fails, returning 'Failed' gives the LLM zero context to correct its mistake. Return detailed errors so the LLM can self-correct the arguments."
  },
  {
    id: 10,
    domain: 2,
    taskStatement: "2.3",
    title: "Global Tool Overload",
    antiPattern: `
// Giving the translation agent access to the database dropping tool
const translationAgent = new Agent({
  tools: [translateTool, dropTableTool, restartServerTool]
});
    `,
    correctPattern: `
// Applying Principle of Least Privilege
const translationAgent = new Agent({
  tools: [translateTool]
});
    `,
    flaw: "Distributing irrelevant or dangerous tools to specialized agents.",
    explanation: "Task Statement 2.3: Distribute tools appropriately. Giving agents tools they don't need clutters their context, wastes tokens on schema definitions, and increases the risk of hallucinated, dangerous executions."
  },
  {
    id: 11,
    domain: 2,
    taskStatement: "2.4",
    title: "Hardcoding MCP Server Endpoints",
    antiPattern: `
// Hardcoded direct connection
const mcp = new MCPServer("http://localhost:8080/api");
    `,
    correctPattern: `
// Using standard MCP client config
const mcp = new MCPClient({
  command: "npx",
  args: ["-y", "@modelcontextprotocol/server-postgres"]
});
    `,
    flaw: "Bypassing standard MCP initialization protocols.",
    explanation: "Task Statement 2.4: Integrate MCP servers. MCP servers should typically be integrated via the standard stdio client configuration or SSE, allowing Claude Code to seamlessly discover and utilize their resources."
  },
  {
    id: 12,
    domain: 2,
    taskStatement: "2.5",
    title: "Reinventing Built-in Tools",
    antiPattern: `
// Creating a custom file reader
{
  "name": "my_file_reader",
  "description": "Reads a file from disk."
}
    `,
    correctPattern: `
// Utilizing Claude Code's native capabilities
// Claude Code natively supports \`Read\`, \`Write\`, \`Grep\`, etc.
    `,
    flaw: "Wasting effort building tools that Claude Code natively provides.",
    explanation: "Task Statement 2.5: Apply built-in tools. Claude Code has highly optimized native tools (Bash, Grep, Read, Edit). Do not build custom MCP servers for local file IO unless you need specific, restricted programmatic hooks."
  },
  {
    id: 13,
    domain: 3,
    taskStatement: "3.1",
    title: "Monolithic CLAUDE.md",
    antiPattern: `
// Putting all rules for the entire company in the root CLAUDE.md
# Root CLAUDE.md
- React rules
- Python rules
- Postgres rules
- Deployment rules
    `,
    correctPattern: `
# Root CLAUDE.md
- General architecture guidelines

# src/frontend/CLAUDE.md
- React and Tailwind rules

# src/backend/CLAUDE.md
- Python and Postgres rules
    `,
    flaw: "Failing to scope rules hierarchically.",
    explanation: "Task Statement 3.1: Configure CLAUDE.md files. Claude Code traverses directories to find rules. Dumping everything in the root file consumes excess tokens for irrelevant tasks. Scope rules tightly to their relevant directories."
  },
  {
    id: 14,
    domain: 3,
    taskStatement: "3.2",
    title: "Prompting Instead of Skills",
    antiPattern: `
User: "Run the linter, fix all the standard issues, run the tests, and format the output as a table."
(Repeats this prompt every single day)
    `,
    correctPattern: `
// Creating a custom slash command in config
"skills": {
  "lint-and-test": {
    "description": "Runs linters, tests, and formats output.",
    "instructions": "Run npm run lint --fix, then npm test..."
  }
}
User: "/lint-and-test"
    `,
    flaw: "Repeating complex workflows via manual prompting.",
    explanation: "Task Statement 3.2: Create custom slash commands. If you execute a multi-step workflow frequently, you should codify it as a custom skill or slash command to guarantee consistent execution."
  },
  {
    id: 15,
    domain: 3,
    taskStatement: "3.3",
    title: "Global Convention Loading",
    antiPattern: `
// Loading all conventions unconditionally
if (true) {
  loadConvention("typescript-rules");
  loadConvention("python-rules");
}
    `,
    correctPattern: `
// Path-specific loading
if (filePath.endsWith('.ts')) {
  loadConvention("typescript-rules");
}
    `,
    flaw: "Flooding the context with irrelevant conventions.",
    explanation: "Task Statement 3.3: Apply path-specific rules. Dynamically load conventions based on the file extension or path. Loading Python rules while the agent is editing a React file is a waste of context."
  
  },
  {
    id: 16,
    domain: 3,
    taskStatement: "3.4",
    title: "Direct Execution for Refactors",
    antiPattern: `
// User requests a massive multi-file refactor
$ claude -c "Refactor the entire authentication flow."
// Claude immediately starts editing files directly.
    `,
    correctPattern: `
// User requests a massive multi-file refactor
$ claude -p "Refactor the entire authentication flow."
// Claude generates a plan. User approves.
$ claude -c "Execute the plan."
    `,
    flaw: "Using direct execution for complex architectural changes.",
    explanation: "Task Statement 3.4: Plan mode vs direct execution. For large refactors, always use plan mode (-p) first to verify the agent's intended changes before allowing it to write to disk."
  },
  {
    id: 17,
    domain: 3,
    taskStatement: "3.5",
    title: "Zero-Shot Code Generation",
    antiPattern: `
$ claude -c "Write a complex data parser and exit."
    `,
    correctPattern: `
$ claude -c "Write a data parser. Then write tests for it. Run the tests. If they fail, fix the parser until it passes."
    `,
    flaw: "Assuming the first draft is perfect.",
    explanation: "Task Statement 3.5: Apply iterative refinement. LLMs often make logic errors on the first pass. Build workflows that force the agent to write tests, run them, and iteratively refine the code before concluding."
  },
  {
    id: 18,
    domain: 3,
    taskStatement: "3.6",
    title: "Unsupervised CI/CD Agents",
    antiPattern: `
# In GitHub Actions
- name: Auto-Fix Bugs
  run: claude -c "Fix any bugs found in the PR and commit directly to main."
    `,
    correctPattern: `
# In GitHub Actions
- name: Suggest Fixes
  run: claude -c "Review PR and output suggestions as PR comments."
    `,
    flaw: "Allowing an agent to commit to protected branches unsupervised.",
    explanation: "Task Statement 3.6: Integrate into CI/CD. Agents in CI/CD pipelines should act in an advisory capacity (e.g., code review, test generation) or commit to feature branches. Never allow unsupervised commits to main."
  },
  {
    id: 19,
    domain: 4,
    taskStatement: "4.1",
    title: "Implicit Output Criteria",
    antiPattern: `
"Find all the aggressive emails in this dataset."
    `,
    correctPattern: `
"Find all aggressive emails. 
Definition of 'aggressive': Contains profanity, threats of legal action, or personal insults.
Do NOT include emails that are merely frustrated or impatient."
    `,
    flaw: "Failing to define abstract concepts.",
    explanation: "Task Statement 4.1: Design explicit criteria. Words like 'aggressive' or 'good' are subjective. You must provide strict, explicit definitions and edge-case boundaries to reduce false positives."
  },
  {
    id: 20,
    domain: 4,
    taskStatement: "4.2",
    title: "Zero-Shot Extraction",
    antiPattern: `
"Extract the key entities from this text."
    `,
    correctPattern: `
"Extract the key entities.
Examples:
Input: 'Apple bought a startup.' -> Entities: [Apple, startup]
Input: 'John flew to NY.' -> Entities: [John, NY]"
    `,
    flaw: "Relying purely on zero-shot instructions for consistent extraction.",
    explanation: "Task Statement 4.2: Apply few-shot prompting. Providing 2-3 examples drastically improves the consistency, tone, and formatting of the output compared to zero-shot instructions."
  },
  {
    id: 21,
    domain: 4,
    taskStatement: "4.3",
    title: "Prompting for JSON Text",
    antiPattern: `
"Analyze the document and reply ONLY with a JSON object containing { sentiment, keywords }."
    `,
    correctPattern: `
// Using Tool Calling to guarantee schema adherence
const response = await llm.toolCall("Analyze the document", {
  tools: [{
    name: "save_analysis",
    input_schema: { ... JSON schema ... }
  }]
});
    `,
    flaw: "Asking for raw JSON in the text completion.",
    explanation: "Task Statement 4.3: Enforce structured output. Asking for JSON in text is flaky (often preceded by 'Here is the JSON:'). Using Tool Calling natively forces the model to adhere to the strict JSON schema."
  },
  {
    id: 22,
    domain: 4,
    taskStatement: "4.4",
    title: "Blind Downstream Processing",
    antiPattern: `
const data = await extractDataAgent();
await database.insert(data);
    `,
    correctPattern: `
let data = await extractDataAgent();
if (!validateSchema(data)) {
  data = await extractDataAgent(\`Fix these validation errors: \${errors}\`);
}
await database.insert(data);
    `,
    flaw: "Trusting LLM output without validation loops.",
    explanation: "Task Statement 4.4: Implement validation loops. Always validate structured output against a schema (e.g., Zod) before using it. If it fails, feed the error back to the LLM so it can retry."
  },
  {
    id: 23,
    domain: 4,
    taskStatement: "4.5",
    title: "Serial Independent Processing",
    antiPattern: `
for (const doc of 1000_documents) {
  await agent.summarize(doc); // Takes 3 hours
}
    `,
    correctPattern: `
// Using Message Batching API
await anthropic.messages.batches.create({
  requests: 1000_documents.map(doc => ({ ... }))
});
    `,
    flaw: "Processing independent tasks serially in a loop.",
    explanation: "Task Statement 4.5: Efficient batch processing. When tasks do not depend on each other, use asynchronous Batch APIs. It reduces costs by up to 50% and processes massively in parallel."
  },
  {
    id: 24,
    domain: 4,
    taskStatement: "4.6",
    title: "Single-Judge Evaluation",
    antiPattern: `
const evaluation = await judgeAgent.evaluate(output);
return evaluation.score;
    `,
    correctPattern: `
const scores = await Promise.all([
  judgeAgent1.evaluate(output),
  judgeAgent2.evaluate(output),
  judgeAgent3.evaluate(output)
]);
return median(scores);
    `,
    flaw: "Trusting a single LLM pass for critical evaluations.",
    explanation: "Task Statement 4.6: Multi-pass architectures. LLMs have variance. For high-stakes evaluation or extraction, use a 'mixture of agents' or multi-pass review to average out hallucinations and biases."
  },
  {
    id: 25,
    domain: 5,
    taskStatement: "5.1",
    title: "Infinite Context Growth",
    antiPattern: `
let conversation = [];
// Appending to array forever
conversation.push(newMessage);
    `,
    correctPattern: `
// Implement a rolling window
let conversation = window.slice(-20);
// Store older context in a persistent summary
let summary = await summarize(window.slice(0, -20));
    `,
    flaw: "Failing to prune long-running conversations.",
    explanation: "Task Statement 5.1: Manage conversation context. Passing massive histories increases latency, cost, and triggers the 'lost in the middle' effect. Use sliding windows and rolling summaries to preserve critical facts."
  },
  {
    id: 26,
    domain: 5,
    taskStatement: "5.2",
    title: "Hallucinating Missing Info",
    antiPattern: `
"What is the user's account ID?"
// Agent searches DB, doesn't find it, and invents "ACCT-1234".
    `,
    correctPattern: `
"If you cannot find the account ID in the database, you must use the 'escalate_to_human' tool to ask the user."
    `,
    flaw: "Failing to provide an ambiguity resolution pathway.",
    explanation: "Task Statement 5.2: Escalation patterns. If an agent hits a dead end, it will often hallucinate to fulfill the prompt. You must explicitly provide an escalation tool or prompt instruction on how to handle missing data."
  },
  {
    id: 27,
    domain: 5,
    taskStatement: "5.3",
    title: "Fatal Cascading Errors",
    antiPattern: `
// Subagent fails
const data = await subagent.run(); // throws error
// Coordinator crashes, workflow dies
    `,
    correctPattern: `
try {
  const data = await subagent.run();
} catch (error) {
  // Coordinator catches error and tries an alternative subagent
  const backupData = await fallbackAgent.run();
}
    `,
    flaw: "Allowing subagent failures to crash the coordinator.",
    explanation: "Task Statement 5.3: Error propagation. In multi-agent systems, subagents will inevitably fail or hallucinate. The coordinator must wrap subagent calls in try/catch blocks and have fallback strategies."
  },
  {
    id: 28,
    domain: 5,
    taskStatement: "5.4",
    title: "Dumping Entire Codebases",
    antiPattern: `
const prompt = "Explain the architecture.";
const context = await readAllFiles("./src"); // 500,000 tokens
    `,
    correctPattern: `
// Agent uses tools to explore
const files = await listDir("./src");
const coreFiles = await grep("export class", files);
    `,
    flaw: "Stuffing the context window with raw codebase dumps.",
    explanation: "Task Statement 5.4: Context in codebase exploration. Do not dump entire repositories into the prompt. Provide the agent with precise tools (ls, grep, AST parsers) so it can pull only the context it needs."
  },
  {
    id: 29,
    domain: 5,
    taskStatement: "5.5",
    title: "Blind Autonomous Execution",
    antiPattern: `
const analysis = await agent.analyze();
await sendEmailToClient(analysis);
    `,
    correctPattern: `
const analysis = await agent.analyze();
const confidence = analysis.confidenceScore;
if (confidence < 0.9) {
  await humanReviewQueue.push(analysis);
} else {
  await sendEmailToClient(analysis);
}
    `,
    flaw: "Executing critical actions without confidence calibration.",
    explanation: "Task Statement 5.5: Human review workflows. Agents should output a calibrated confidence score alongside their work. High-confidence actions can proceed autonomously; low-confidence actions route to a human."
  },
  {
    id: 30,
    domain: 5,
    taskStatement: "5.6",
    title: "Losing Data Provenance",
    antiPattern: `
// Agent reads 5 articles and outputs:
"The market will grow by 5%."
    `,
    correctPattern: `
// Agent reads 5 articles and outputs:
"The market will grow by 5% [Source: Forbes_Article_2, Page 4]."
    `,
    flaw: "Synthesizing multi-source data without citations.",
    explanation: "Task Statement 5.6: Preserve information provenance. When an agent aggregates data from multiple sources, it must be explicitly prompted to retain inline citations. Without provenance, the output cannot be verified."
  }  ,
  {
    id: 31,
    domain: 1,
    taskStatement: "1.1",
    title: "Static Execution Graphs",
    antiPattern: `
async function runAgent() {
  await step1_research();
  await step2_compile();
  await step3_format();
}
    `,
    correctPattern: `
async function runAgent() {
  let state = "research";
  while (state !== "done") {
    const response = await llm.route(state);
    state = response.nextAction;
    await executeAction(state);
  }
}
    `,
    flaw: "Forcing autonomous agents into static, linear execution chains.",
    explanation: "Task Statement 1.1: Design agentic loops. Agents must be able to dynamically route their own execution (e.g., returning to research if compilation fails) rather than being forced into rigid, deterministic pipelines."
  },
  {
    id: 32,
    domain: 1,
    taskStatement: "1.2",
    title: "Silent Subagent Failures",
    antiPattern: `
// Coordinator ignores subagent output and proceeds
const result = await subagent.execute();
return "The subagent finished successfully.";
    `,
    correctPattern: `
// Coordinator verifies subagent output
const result = await subagent.execute();
if (!result.includes("Required Data")) {
  return await subagent.execute("You missed the required data. Try again.");
}
return result;
    `,
    flaw: "Coordinator blindly assuming the subagent succeeded.",
    explanation: "Task Statement 1.2: Orchestrate multi-agent systems. The coordinator is responsible for evaluating the quality and completeness of subagent outputs. It must implement iterative refinement loops to correct subagent mistakes."
  },
  {
    id: 33,
    domain: 1,
    taskStatement: "1.3",
    title: "Implicit Context Inheritance",
    antiPattern: `
// Spawning a subagent and assuming it knows the context
const subagent = new SubAgent();
await subagent.ask("What did the user just say?");
    `,
    correctPattern: `
// Explicitly passing context
const subagent = new SubAgent();
await subagent.ask(\`The user asked: '\${userQuery}'. Answer this.\`);
    `,
    flaw: "Assuming subagents inherit the coordinator's memory.",
    explanation: "Task Statement 1.3: Configure subagent invocation. Subagents are spawned with blank slates. You must explicitly inject necessary context (prior findings, user intents, rules) directly into their invocation prompt."
  },
  {
    id: 34,
    domain: 1,
    taskStatement: "1.4",
    title: "Prompting for Security Constraints",
    antiPattern: `
"You are a helpful assistant. NEVER execute bash commands that delete files (like rm or rmdir)."
    `,
    correctPattern: `
// Implementing a programmatic gate in the tool executor
function executeBash(cmd) {
  if (cmd.includes("rm ")) throw new Error("Deletion is forbidden.");
  return exec(cmd);
}
    `,
    flaw: "Relying on LLM compliance for destructive operations.",
    explanation: "Task Statement 1.4: Implement enforcement patterns. Do not rely on prompt engineering to prevent destructive actions. Security and compliance rules must be enforced programmatically via execution hooks or middleware."
  },
  {
    id: 35,
    domain: 1,
    taskStatement: "1.5",
    title: "Exposing PII to the Agent",
    antiPattern: `
// Returning raw user records from the DB to the LLM
const userRecord = await db.getUser(userId); 
// { id: 1, name: "John", ssn: "000-00-0000", passwordHash: "..." }
return JSON.stringify(userRecord);
    `,
    correctPattern: `
// Normalizing and masking data in the tool hook
const userRecord = await db.getUser(userId); 
return JSON.stringify({ id: userRecord.id, name: userRecord.name });
    `,
    flaw: "Leaking sensitive, unnecessary fields to the LLM context.",
    explanation: "Task Statement 1.5: Apply SDK hooks for data normalization. Use tool interception hooks to scrub Personally Identifiable Information (PII) and internal hashes before the data enters the LLM context window."
  },
  {
    id: 36,
    domain: 1,
    taskStatement: "1.6",
    title: "Shallow Task Decomposition",
    antiPattern: `
// Decomposing "Build a website" into one subtask
await uiAgent("Build the HTML, CSS, and JS for a dashboard.");
    `,
    correctPattern: `
// Decomposing by discrete lifecycle phases
const html = await skeletonAgent("Build HTML skeleton");
const css = await styleAgent(\`Style this HTML: \${html}\`);
const js = await logicAgent(\`Add logic to this UI: \${html}\`);
    `,
    flaw: "Creating sub-tasks that are still too broad for reliable execution.",
    explanation: "Task Statement 1.6: Design task decomposition. If a subagent task still requires multiple distinct skills (e.g., visual design AND complex logic), it is too broad. Decompose into narrow, single-responsibility steps."
  },
  {
    id: 37,
    domain: 1,
    taskStatement: "1.7",
    title: "Destructive Session Overwrites",
    antiPattern: `
// User wants to try an alternative approach
// Agent modifies the existing conversation state
conversation.push({ role: "user", content: "Let's try a different idea." });
    `,
    correctPattern: `
// Forking the session for divergent exploration
const newSessionId = await db.forkSession(currentSessionId);
// Continue exploring the alternative idea in newSessionId
    `,
    flaw: "Mutating a stable session state to explore risky alternatives.",
    explanation: "Task Statement 1.7: Manage session forking. When exploring divergent approaches from a shared baseline (e.g., trying a different architectural pattern), use fork-based session management to preserve the original state."
  },
  {
    id: 38,
    domain: 2,
    taskStatement: "2.1",
    title: "The God Tool",
    antiPattern: `
{
  "name": "do_everything",
  "description": "Can read files, write files, search the web, and send emails.",
  "input_schema": { ... 50 properties ... }
}
    `,
    correctPattern: `
// Split into narrow CRUD tools
[
  { "name": "read_file" },
  { "name": "write_file" },
  { "name": "search_web" }
]
    `,
    flaw: "Designing massive, multi-purpose tools.",
    explanation: "Task Statement 2.1: Design effective tool interfaces. Massive tools with dozens of optional parameters confuse the model and cause frequent schema validation errors. Design single-responsibility CRUD tools."
  },
  {
    id: 39,
    domain: 2,
    taskStatement: "2.2",
    title: "Crashing on Invalid Schema",
    antiPattern: `
// Tool executor crashes the whole server if arguments are invalid
if (!args.filepath) {
  throw new Error("Missing filepath! Shutting down.");
}
    `,
    correctPattern: `
// Returning the error gracefully as a tool response
if (!args.filepath) {
  return "Error: Missing required argument 'filepath'. Please try again.";
}
    `,
    flaw: "Throwing fatal exceptions instead of returning structured errors.",
    explanation: "Task Statement 2.2: Implement structured error responses. LLMs frequently hallucinate tool arguments. Tools must catch schema errors and return them as text to the LLM so it can self-correct, rather than crashing the orchestrator."
  },
  {
    id: 40,
    domain: 2,
    taskStatement: "2.3",
    title: "Forced Tool Choice in Dynamic Loops",
    antiPattern: `
// Forcing the agent to use a specific tool in an open-ended loop
const response = await llm.generate(prompt, {
  tool_choice: { type: "tool", name: "search_db" }
});
    `,
    correctPattern: `
// Allowing the agent to decide (auto)
const response = await llm.generate(prompt, {
  tool_choice: { type: "auto" }
});
    `,
    flaw: "Using forced `tool_choice` when the agent needs autonomy.",
    explanation: "Task Statement 2.3: Configure tool choice. Forced tool choice is useful for deterministic extraction (forcing a JSON schema), but breaks autonomous agentic loops where the model needs to decide between multiple tools or returning text."
  },
  {
    id: 41,
    domain: 2,
    taskStatement: "2.4",
    title: "Ignoring SSE Reconnection",
    antiPattern: `
// Initiating SSE connection and assuming it stays alive forever
const mcp = new SSEClient("https://mcp.server.com/sse");
    `,
    correctPattern: `
const mcp = new SSEClient("https://mcp.server.com/sse");
mcp.on('disconnect', async () => {
  await mcp.reconnect();
});
    `,
    flaw: "Failing to handle transient network disconnects in MCP SSE clients.",
    explanation: "Task Statement 2.4: Integrate MCP servers. When using Server-Sent Events (SSE) for remote MCP integration, you must implement resilient reconnection logic, as long-running agents will encounter dropped connections."
  },
  {
    id: 42,
    domain: 2,
    taskStatement: "2.5",
    title: "Custom Bash Tools",
    antiPattern: `
// Building an MCP server just to run bash commands
const mcp = new MCPServer();
mcp.addTool("run_shell_script", executeBash);
    `,
    correctPattern: `
// Using the Claude Code built-in Bash capability
// (No custom MCP required, Bash is native to the agent environment)
    `,
    flaw: "Building complex MCPs for features the host environment already has.",
    explanation: "Task Statement 2.5: Select built-in tools. Do not reinvent the wheel. Claude Code natively ships with highly optimized Bash, Glob, Grep, and Edit tools. Use built-in tools over custom MCPs when interacting with the local workspace."
  },
  {
    id: 43,
    domain: 3,
    taskStatement: "3.1",
    title: "Conflicting Global Rules",
    antiPattern: `
# CLAUDE.md
- Always use Python 2 syntax.
- Always use Python 3 syntax.
    `,
    correctPattern: `
# legacy_app/CLAUDE.md
- Use Python 2.7.

# modern_app/CLAUDE.md
- Use Python 3.11.
    `,
    flaw: "Defining mutually exclusive conventions in the root project.",
    explanation: "Task Statement 3.1: Configure CLAUDE.md files. Defining conflicting rules globally confuses the model. Modularize your conventions into sub-directories so the agent only loads the rules relevant to the code it is currently editing."
  },
  {
    id: 44,
    domain: 3,
    taskStatement: "3.2",
    title: "Hardcoding Secrets in Skills",
    antiPattern: `
"skills": {
  "deploy": {
    "instructions": "Run npm run deploy --token=ABCD1234XYZ"
  }
}
    `,
    correctPattern: `
"skills": {
  "deploy": {
    "instructions": "Run npm run deploy. Ensure the $DEPLOY_TOKEN environment variable is set."
  }
}
    `,
    flaw: "Committing API keys and secrets directly into skill configuration.",
    explanation: "Task Statement 3.2: Configure custom skills. Skills and slash commands are often committed to version control (.gemini/config). Never hardcode secrets in skill instructions; rely on environment variables."
  },
  {
    id: 45,
    domain: 3,
    taskStatement: "3.3",
    title: "Overloading Path Matchers",
    antiPattern: `
// Loading massive rule sets for every single file type
if (path.includes(".")) {
  loadConvention("massive-frontend-and-backend-rules.md");
}
    `,
    correctPattern: `
if (path.endsWith(".tsx")) {
  loadConvention("react-rules.md");
}
    `,
    flaw: "Using excessively broad globs to load conventions.",
    explanation: "Task Statement 3.3: Apply path-specific rules. Broad globs (like matching every file) defeat the purpose of path-specific rules. Be precise with your globs so the agent's context window remains lean and focused."
  }
  ,
  {
    id: 46,
    domain: 3,
    taskStatement: "3.4",
    title: "Skipping Plan Mode for Dependencies",
    antiPattern: `
// User asks to upgrade a major framework
$ claude -c "Upgrade React from 17 to 18 and fix all the breaking changes."
    `,
    correctPattern: `
// High-risk changes require plan mode
$ claude -p "Upgrade React from 17 to 18. Audit breaking changes."
    `,
    flaw: "Using direct execution for high-risk, cascading dependency updates.",
    explanation: "Task Statement 3.4: Plan mode vs direct execution. Major dependency upgrades often cause cascading breakages. Plan mode allows the user to review the upgrade path and necessary refactors before the codebase is destabilized."
  },
  {
    id: 47,
    domain: 3,
    taskStatement: "3.5",
    title: "Ignoring Compiler Feedback",
    antiPattern: `
// The agent writes code, gets a compiler error, and immediately stops
const code = generate();
const error = compile(code);
if (error) return "I failed to write the code.";
    `,
    correctPattern: `
// The agent feeds the error back into itself
let code = generate();
let error = compile(code);
while (error && attempts < 3) {
  code = generate(\`Fix this compilation error: \${error}\`);
  error = compile(code);
  attempts++;
}
    `,
    flaw: "Failing to build iterative self-correction loops.",
    explanation: "Task Statement 3.5: Iterative refinement. The core advantage of agentic coding is self-correction. Agents must be programmed to parse compiler/linter errors and iteratively refine their output."
  },
  {
    id: 48,
    domain: 3,
    taskStatement: "3.6",
    title: "CI/CD Sandbox Escape",
    antiPattern: `
// Giving the CI agent root access to the deployment environment
agent.run("Review the PR", { environment: "production_root" });
    `,
    correctPattern: `
// Running the CI agent in an isolated, read-only container
agent.run("Review the PR", { environment: "ephemeral_docker_sandbox" });
    `,
    flaw: "Providing agents with excessive permissions in automated pipelines.",
    explanation: "Task Statement 3.6: Integrate into CI/CD. Agents running in automated pipelines must operate in strictly isolated sandboxes to prevent generated code (or hallucinated bash commands) from modifying production infrastructure."
  },
  {
    id: 49,
    domain: 4,
    taskStatement: "4.1",
    title: "Vague Semantic Boundaries",
    antiPattern: `
"Identify all medical conditions in this text."
    `,
    correctPattern: `
"Identify all medical conditions.
CRITERIA:
- Include diseases, syndromes, and chronic conditions (e.g., Asthma).
- EXCLUDE symptoms (e.g., coughing).
- EXCLUDE medical procedures (e.g., surgery)."
    `,
    flaw: "Failing to provide explicit exclusion criteria.",
    explanation: "Task Statement 4.1: Explicit criteria. When extracting specific entities, defining what *not* to include (the negative boundaries) is often more important than defining what to include, significantly reducing false positives."
  },
  {
    id: 50,
    domain: 4,
    taskStatement: "4.2",
    title: "Misaligned Few-Shot Formatting",
    antiPattern: `
// Prompt asks for XML but examples use JSON
"Format the output as XML. 
Example: {'name': 'John'}"
    `,
    correctPattern: `
"Format the output as XML.
Example: <person><name>John</name></person>"
    `,
    flaw: "Providing few-shot examples that contradict the structural instructions.",
    explanation: "Task Statement 4.2: Apply few-shot prompting. The model heavily biases toward the format of your few-shot examples. If the examples do not perfectly match your requested output schema, the model will output malformed data."
  },
  {
    id: 51,
    domain: 4,
    taskStatement: "4.3",
    title: "Loose JSON Schemas",
    antiPattern: `
"input_schema": {
  "type": "object",
  "properties": {
    "tags": { "type": "array" }
  }
}
    `,
    correctPattern: `
"input_schema": {
  "type": "object",
  "properties": {
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Exactly 3 descriptive tags."
    }
  },
  "required": ["tags"]
}
    `,
    flaw: "Using untyped arrays or missing 'required' fields in schemas.",
    explanation: "Task Statement 4.3: Enforce structured output schemas. If you do not strongly type array items or explicitly mark fields as required, the LLM will often return arrays of mixed types or omit the field entirely."
  },
  {
    id: 52,
    domain: 4,
    taskStatement: "4.4",
    title: "Static Retry Prompts",
    antiPattern: `
if (!isValid(output)) {
  // Retrying with the exact same prompt
  output = await agent.run(originalPrompt);
}
    `,
    correctPattern: `
if (!isValid(output)) {
  // Passing the exact validation error back to the agent
  output = await agent.run(\`\${originalPrompt}. PREVIOUS ERROR TO FIX: \${validationError}\`);
}
    `,
    flaw: "Retrying a failed generation without providing the error context.",
    explanation: "Task Statement 4.4: Validation and feedback loops. If an LLM fails a validation schema, running the exact same prompt will likely yield the exact same error. You must feed the specific validation error back into the next turn."
  },
  {
    id: 53,
    domain: 4,
    taskStatement: "4.5",
    title: "Synchronous Rate Limit Thrashing",
    antiPattern: `
// Blasting the API concurrently until it 429s
await Promise.all(1000_items.map(i => llm.generate(i)));
    `,
    correctPattern: `
// Using standard Message Batching for large async jobs
const batch = await anthropic.messages.batches.create({ ... });
    `,
    flaw: "Attempting to brute-force concurrency instead of using Batch APIs.",
    explanation: "Task Statement 4.5: Efficient batch processing. Blasting the standard API concurrently will trigger 429 Rate Limit errors and cost more. Use the Anthropic Message Batch API for offline, high-volume processing."
  },
  {
    id: 54,
    domain: 4,
    taskStatement: "4.6",
    title: "Self-Evaluation Bias",
    antiPattern: `
// Asking the same agent to grade its own work
const draft = await agent.write();
const grade = await agent.evaluate(draft);
    `,
    correctPattern: `
// Using a separate agent (often a different model) to evaluate
const draft = await writerAgent.write();
const grade = await criticAgent.evaluate(draft);
    `,
    flaw: "Allowing a model to evaluate its own direct output in the same context.",
    explanation: "Task Statement 4.6: Multi-pass architectures. LLMs exhibit 'sycophancy' and self-affirmation bias. If you ask an agent if its own work is good, it will almost always say yes. Use a separate, isolated evaluator agent."
  },
  {
    id: 55,
    domain: 5,
    taskStatement: "5.1",
    title: "Middle-Heavy Context",
    antiPattern: `
// Dumping 100 pages of text in the exact middle of a prompt
const prompt = \`Instructions... \${massiveDocument} ... Question?\`;
    `,
    correctPattern: `
// Placing critical instructions at the very end
const prompt = \`\${massiveDocument} ... Instructions: Do X, Y, Z. Question?\`;
    `,
    flaw: "Burying critical instructions in the middle of massive context windows.",
    explanation: "Task Statement 5.1: Manage conversation context. Due to attention mechanisms, LLMs recall the very beginning and very end of a prompt best. Burying your actual instructions in the middle of 100k tokens leads to poor adherence."
  },
  {
    id: 56,
    domain: 5,
    taskStatement: "5.2",
    title: "Assuming Happy Paths",
    antiPattern: `
"Fetch the user's email from the DB and send a welcome message."
// DB lookup fails, agent hallucinates an email to fulfill the 'send' instruction.
    `,
    correctPattern: `
"Fetch the user's email. IF the email is missing, DO NOT send a message. Instead, use the 'flag_account' tool."
    `,
    flaw: "Failing to instruct the agent on what to do if a prerequisite fails.",
    explanation: "Task Statement 5.2: Escalation and ambiguity. If you do not provide explicit instructions for failure states, the agent's strong desire to fulfill your final instruction will cause it to hallucinate missing prerequisites."
  },
  {
    id: 57,
    domain: 5,
    taskStatement: "5.3",
    title: "Swallowing Subagent Errors",
    antiPattern: `
try {
  await subagent.execute();
} catch (e) {
  // Coordinator hides the error from the user and outputs a blank result
  return ""; 
}
    `,
    correctPattern: `
try {
  await subagent.execute();
} catch (e) {
  // Coordinator propagates a structured summary of the failure
  return \`Subagent failed to process data: \${e.message}\`;
}
    `,
    flaw: "Silently catching subagent errors without alerting the coordinator or user.",
    explanation: "Task Statement 5.3: Error propagation. Silent failures corrupt the multi-agent workflow. The coordinator must be made aware of subagent failures so it can either retry, use a fallback, or escalate to the user."
  },
  {
    id: 58,
    domain: 5,
    taskStatement: "5.4",
    title: "Redundant Tree Traversal",
    antiPattern: `
// Agent repeatedly runs 'ls' on the root directory every turn
await agent.run("ls /");
await agent.run("ls /");
    `,
    correctPattern: `
// Agent stores the directory structure in a persistent summary tool
await agent.run("tree / > repo_structure.txt");
    `,
    flaw: "Wasting tokens on redundant exploratory commands.",
    explanation: "Task Statement 5.4: Context in codebase exploration. Agents exploring large codebases often waste tokens running `ls` or `find` repeatedly. Teach them to generate and cache index files (like a `tree` dump) for reference."
  },
  {
    id: 59,
    domain: 5,
    taskStatement: "5.5",
    title: "Binary Confidence Scores",
    antiPattern: `
// Agent evaluates its own confidence
"I am 100% confident this is correct."
    `,
    correctPattern: `
// Agent utilizes a rigorous confidence calibration rubric
"Confidence: 0.7. Deduction: I lack access to the Q3 financial data required for absolute certainty."
    `,
    flaw: "Allowing arbitrary confidence scoring without a rubric.",
    explanation: "Task Statement 5.5: Confidence calibration. LLMs are naturally overconfident. To build reliable Human-in-the-Loop workflows, you must provide a strict rubric (e.g., 'Deduct 0.3 if you haven't seen raw source data') for calibration."
  },
  {
    id: 60,
    domain: 5,
    taskStatement: "5.6",
    title: "Stripping Metadata on Ingestion",
    antiPattern: `
// Ingesting 5 PDF files into a single text blob
const combinedText = doc1.text + doc2.text + doc3.text;
await agent.summarize(combinedText);
    `,
    correctPattern: `
// Preserving source boundaries
const combinedText = \`
<source id="doc1">\${doc1.text}</source>
<source id="doc2">\${doc2.text}</source>
\`;
await agent.summarize(combinedText);
    `,
    flaw: "Concatenating data sources without XML delimiters.",
    explanation: "Task Statement 5.6: Preserve information provenance. If you strip metadata and boundaries when passing multi-source context to an agent, it becomes impossible for the agent to accurately cite which document a fact came from."
  }
];

// If running in browser or Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PATTERNS_DATA };
}

