const PATTERNS_DATA = [
  {
    id: 1,
    domain: 2,
    title: "Tool Description Overload",
    antiPattern: `
{
  "name": "get_customer",
  "description": "This tool gets a customer. You should use this when the user asks for a customer. If the customer is VIP, say 'Hello VIP'. If the customer is new, say 'Welcome'. You must always get the customer before processing a refund. Only use this if you really need to.",
  "input_schema": { ... }
}
    `,
    correctPattern: `
{
  "name": "get_customer",
  "description": "Retrieves customer profile, status, and verification level. Requires exact email address.",
  "input_schema": { ... }
}
    `,
    flaw: "Prompting instructions placed inside a tool description.",
    explanation: "Tool descriptions should ONLY describe WHAT the tool does, WHEN to use it, and HOW to format inputs. Do NOT put behavioral instructions ('say Hello VIP') or orchestration logic ('always get customer before refund') in tool descriptions; those belong in the system prompt or programmatic hooks."
  },
  {
    id: 2,
    domain: 1,
    title: "Orchestrator Bottleneck",
    antiPattern: `
// System Prompt for Orchestrator
"You are the master orchestrator. 
You must route to Billing, Tech Support, or Sales.
Also, if it is Billing, you must collect the credit card number.
If it is Tech Support, you must ask for the OS version.
If it is Sales, you must ask for their budget."
    `,
    correctPattern: `
// System Prompt for Orchestrator
"You are the router. Analyze the user request and route it to ONE of:
- Billing_Agent
- TechSupport_Agent
- Sales_Agent"

// Each sub-agent handles its own specific data collection.
    `,
    flaw: "Orchestrator is doing the job of sub-agents.",
    explanation: "An orchestrator should only classify, route, and aggregate. If you force the orchestrator to also execute domain-specific logic (like collecting OS versions or credit cards), you dilute its routing accuracy and create a massive single-point-of-failure prompt."
  },
  {
    id: 3,
    domain: 4,
    title: "Vague Structured Output Prompt",
    antiPattern: `
"Please extract the customer's name, age, and email. Format it as JSON."
    `,
    correctPattern: `
"Extract the customer data into JSON matching this exact schema:
{
  \"name\": string,
  \"age\": number (or null if unknown),
  \"email\": string
}
Only output valid JSON, with no markdown formatting or conversational filler."
    `,
    flaw: "Relying on implicit schema generation.",
    explanation: "When requiring structured output (JSON/XML), you must explicitly define the expected schema, data types, and null-handling behavior. You must also explicitly instruct the model to omit conversational filler (like 'Here is the JSON:')."
  },
  {
    id: 4,
    domain: 2,
    title: "Unconstrained Dangerous Tool",
    antiPattern: `
{
  "name": "execute_sql",
  "description": "Executes any SQL query on the production database.",
  "input_schema": {
    "type": "object",
    "properties": {
      "query": { "type": "string" }
    }
  }
}
    `,
    correctPattern: `
{
  "name": "lookup_user_purchases",
  "description": "Retrieves purchase history for a specific user ID.",
  "input_schema": {
    "type": "object",
    "properties": {
      "user_id": { "type": "string" }
    }
  }
}
    `,
    flaw: "Providing a generic, unconstrained execution tool.",
    explanation: "Never give an LLM an open-ended execution tool (like raw SQL, shell access, or eval) in a production system. Instead, provide narrowly scoped, parameterized tools that map to specific, safe business operations."
  },
  {
    id: 5,
    domain: 5,
    title: "Naive Context Window Filling",
    antiPattern: `
// User asks a question about a codebase
const allFiles = readAllFiles(repoPath); 
const prompt = \`Answer the user's question based on this code:\n\n\${allFiles}\n\nQuestion: \${userQuestion}\`;
    `,
    correctPattern: `
// User asks a question about a codebase
const relevantSnippets = semanticSearch(repoPath, userQuestion, { topK: 5 });
const prompt = \`Answer the user's question based on these specific snippets:\n\n\${relevantSnippets}\n\nQuestion: \${userQuestion}\`;
    `,
    flaw: "Dumping entire datasets into the context window without filtering.",
    explanation: "Even with a 200k context window, dumping irrelevant data degrades the model's precision (the 'needle in a haystack' problem) and increases latency and cost. Always use RAG or filtering to provide only the necessary context."
  },
  {
    id: 6,
    domain: 1,
    title: "Prompt-Based Constraints for Hard Rules",
    antiPattern: `
// System Prompt
"You are a medical AI. NEVER diagnose a patient. 
If they ask for a diagnosis, always say 'I cannot diagnose you'."
    `,
    correctPattern: `
// System Prompt
"You are a medical AI. Answer general health questions."

// Application Logic (Post-Generation Hook)
const response = await llm.generate();
if (containsDiagnosis(response)) {
  return "I cannot provide medical diagnoses. Please consult a doctor.";
}
    `,
    flaw: "Using probabilistic LLMs to enforce deterministic safety rules.",
    explanation: "System prompts are probabilistic. The model might still violate a 'NEVER' instruction under certain prompt injections. Hard constraints (safety, compliance, access control) must be enforced programmatically via code, not just by asking the LLM nicely."
  },
  {
    id: 7,
    domain: 3,
    title: "Global CLAUDE.md for Everything",
    antiPattern: `
# CLAUDE.md
Build commands:
- Frontend: npm run build
- Backend: mvn package
- Docs: mkdocs build
Testing:
- Frontend: npm test
- Backend: mvn test
(Plus 50 more lines of unrelated commands)
    `,
    correctPattern: `
// In frontend/CLAUDE.md:
Build: npm run build
Test: npm test

// In backend/CLAUDE.md:
Build: mvn package
Test: mvn test
    `,
    flaw: "Bloated, monolithic CLAUDE.md file at the root.",
    explanation: "CLAUDE.md files should be scoped to their specific directories. A massive root CLAUDE.md pollutes Claude Code's context window with irrelevant commands when working deep inside a specific sub-project."
  },
  {
    id: 8,
    domain: 2,
    title: "Boolean Tool Arguments",
    antiPattern: `
{
  "name": "search_database",
  "input_schema": {
    "properties": {
      "query": { "type": "string" },
      "is_fuzzy": { "type": "boolean" },
      "include_archived": { "type": "boolean" }
    }
  }
}
    `,
    correctPattern: `
{
  "name": "search_database",
  "input_schema": {
    "properties": {
      "query": { "type": "string" },
      "search_mode": { "type": "string", "enum": ["exact", "fuzzy"] },
      "record_status": { "type": "string", "enum": ["active_only", "all_including_archived"] }
    }
  }
}
    `,
    flaw: "Using ambiguous boolean flags.",
    explanation: "LLMs struggle with boolean flags because 'true/false' lacks semantic meaning. Instead, use string Enums with highly descriptive values. It makes the LLM's choice explicitly clear and reduces hallucinated arguments."
  },
  {
    id: 9,
    domain: 5,
    title: "Progressive Summarization Loss",
    antiPattern: `
// Every 10 turns, summarize the chat history
let history = "[Summary of turns 1-10: User wants a refund for order 12345. Amount is $50.]"
// Turn 20: 
let history = "[Summary of turns 1-20: User is discussing a refund.]"
// Fact lost: Order 12345, $50
    `,
    correctPattern: `
// Maintain a persistent 'Case Facts' state separate from conversational history
let caseFacts = { order_id: "12345", amount: "$50", intent: "refund" };
let history = "[Summary of turns 1-20: User is discussing the refund timeline.]"

const prompt = \`Facts: \${JSON.stringify(caseFacts)}\nHistory: \${history}\`;
    `,
    flaw: "Relying on rolling summaries for critical entities.",
    explanation: "Rolling summaries naturally abstract away specific details over time. Critical transactional data (IDs, amounts, status) must be extracted and stored in a persistent, structured 'state' outside the summarized conversational flow."
  },
  {
    id: 10,
    domain: 4,
    title: "Premature Optimization in Prompts",
    antiPattern: `
"Translate this text to French. But do it in exactly 45 tokens, use exactly 3 verbs, and ensure the word 'bonjour' appears at the 5th position."
    `,
    correctPattern: `
"Translate this text to French. The translation should be concise and sound professional. Ensure you include a greeting."
    `,
    flaw: "Over-constraining the model with exact token/position counting.",
    explanation: "LLMs operate on sub-word tokens and do not 'count' words, characters, or specific positions reliably during generation. Over-constraining mechanics leads to degraded output quality as the model focuses on the math rather than the semantics."
  },
  {
    id: 11,
    domain: 2,
    title: "Hallucination-Prone Schema Design",
    antiPattern: `
{
  "name": "create_user",
  "input_schema": {
    "properties": {
      "username": { "type": "string" },
      "role": { "type": "string" }
    }
  }
}
    `,
    correctPattern: `
{
  "name": "create_user",
  "input_schema": {
    "properties": {
      "username": { "type": "string" },
      "role": { "type": "string", "enum": ["admin", "editor", "viewer"] }
    },
    "required": ["username", "role"]
  }
}
    `,
    flaw: "Missing enums and required fields.",
    explanation: "If you don't provide an enum for constrained string fields, the LLM will hallucinate roles like 'super_admin' or 'user'. Always use 'enum' for categorical data, and explicitly mark fields as 'required' to prevent incomplete tool calls."
  },
  {
    id: 12,
    domain: 1,
    title: "The 'Just Use GPT' Routing",
    antiPattern: `
// Routing Logic
const routerPrompt = "Read this text and decide if it goes to the DB agent or API agent.";
const destination = await llm.generate(routerPrompt, userInput);
    `,
    correctPattern: `
// Routing Logic with Tool Choice
const routerPrompt = "Classify the user intent.";
const destination = await llm.toolCall(routerPrompt, userInput, {
  tools: [
    { name: "route_to_db", description: "Use for historical queries" },
    { name: "route_to_api", description: "Use for live data" }
  ]
});
    `,
    flaw: "Using raw text generation for deterministic routing.",
    explanation: "Relying on raw text generation for routing forces you to parse unpredictable text. Using Tool Calling (function calling) forces the LLM to output a guaranteed JSON structure, making routing robust and deterministic."
  },
  {
    id: 13,
    domain: 4,
    title: "Implicit Negative Constraints",
    antiPattern: `
"Summarize this document. Do not include quotes, do not use bullet points, do not exceed 3 paragraphs, and do not use jargon."
    `,
    correctPattern: `
"Summarize this document.
Format: 2-3 paragraphs.
Style: Plain text (no quotes, no bullets), 8th-grade reading level.
Focus: Key outcomes and next steps."
    `,
    flaw: "Stacking multiple negative ('do not') constraints.",
    explanation: "LLMs struggle with long lists of negative constraints because they focus attention on the exact things you want to avoid. Reframe negative constraints into positive, explicit instructions (e.g., 'Do not use jargon' -> 'Use 8th-grade reading level')."
  },
  {
    id: 14,
    domain: 3,
    title: "Ignoring Claude Code's Pre-computation",
    antiPattern: `
// The user asks Claude Code: "What does calculate_tax() do?"
// Claude Code runs grep, reads 5 files, and answers.
// The next day, user asks again: "What does calculate_tax() do?"
    `,
    correctPattern: `
// Create a persistent architecture document
// Run: claude -c "Explain calculate_tax() and save it to docs/TAX_SYSTEM.md"
// Next day, Claude Code natively reads TAX_SYSTEM.md in its context.
    `,
    flaw: "Treating Claude Code as a stateless search engine.",
    explanation: "Claude Code is powerful, but having it re-discover architecture via grep every session is slow and costly. Have Claude Code document its findings into persistent markdown files so they become part of its immediate context in future sessions."
  },
  {
    id: 15,
    domain: 5,
    title: "Over-Relying on LLM Memory for Math",
    antiPattern: `
"The user has a $500 balance. They bought a $32 item, a $14 item, and applied a 15% discount. What is their new balance?"
    `,
    correctPattern: `
"The user has a $500 balance. They bought a $32 item, a $14 item, and applied a 15% discount."
// Agent uses a tool:
{
  "name": "calculate_cart_total",
  "input": { "subtotal": 46, "discount_pct": 15 }
}
    `,
    flaw: "Asking the LLM to perform arithmetic.",
    explanation: "LLMs predict the next token; they do not have a built-in calculator. They frequently hallucinate math, especially with decimals or multiple steps. Always provide a calculator tool or perform the math programmatically and feed the result back to the LLM."
  },
  {
    id: 16,
    domain: 2,
    title: "Vague Tool Error Handling",
    antiPattern: `
try {
  executeTool(args);
} catch (e) {
  return "Error occurred.";
}
    `,
    correctPattern: `
try {
  executeTool(args);
} catch (e) {
  return \`Error: \${e.message}. The user ID must be a 16-character UUID. Please check your input and try again.\`;
}
    `,
    flaw: "Returning opaque errors to the LLM.",
    explanation: "When a tool fails, the LLM receives the error string as context. If the error is just 'Failed', the LLM will hallucinate a fix or give up. Return highly descriptive errors that tell the LLM exactly *why* it failed and *how* to fix the input."
  },
  {
    id: 17,
    domain: 1,
    title: "Single-Pass Complex Generation",
    antiPattern: `
"Write a complete, production-ready React application for a shopping cart, including state management, CSS, and API integration. Output all 5 files now."
    `,
    correctPattern: `
// Step 1 (Agent): "Outline the architecture and state management for a React shopping cart."
// Step 2 (Agent): "Generate the CSS variables."
// Step 3 (Agent): "Generate the Cart component using the architecture."
    `,
    flaw: "Attempting complex, multi-file generation in a single zero-shot prompt.",
    explanation: "LLMs degrade in quality and adherence when asked to do too much in one pass. Use a 'Plan and Execute' pattern where the agent first outputs a plan, validates it, and then iterates through the generation step-by-step."
  },
  {
    id: 18,
    domain: 5,
    title: "Unbounded History Growth",
    antiPattern: `
let messages = [];
messages.push({role: "user", content: "Hi"});
messages.push({role: "assistant", content: "Hello"});
// 500 turns later...
const response = await anthropic.messages.create({ messages });
    `,
    correctPattern: `
// Implement a sliding window with a rolling summary
let messages = window.slice(-10); // Keep last 10 turns
let systemPrompt = \`System Context: \${rollingSummary}\`;
const response = await anthropic.messages.create({ system: systemPrompt, messages });
    `,
    flaw: "Letting the messages array grow infinitely.",
    explanation: "Passing the entire raw history eventually hits the token limit, increases latency drastically, and degrades the model's ability to focus on the current turn. You must implement history pruning (sliding window + summarization)."
  },
  {
    id: 19,
    domain: 4,
    title: "Burying the Lead in Prompts",
    antiPattern: `
"Please look at this data. [10,000 words of data]. Based on the data above, extract the email address."
    `,
    correctPattern: `
"Extract the email address from the data below.
<data>
[10,000 words of data]
</data>
Remember, only output the email address."
    `,
    flaw: "Placing the core instruction at the very end of a massive prompt.",
    explanation: "In long context windows, attention can wane in the middle (the 'lost in the middle' phenomenon). Place the primary instruction at the very top, provide the context inside XML tags, and optionally repeat the instruction at the very end."
  },
  {
    id: 20,
    domain: 3,
    title: "Running Claude Code in the Wrong Directory",
    antiPattern: `
// User opens terminal at C:\
$ claude -c "fix the bug in the authentication module"
    `,
    correctPattern: `
// User navigates to specific microservice
$ cd /src/services/auth-service
$ claude -c "fix the bug in login.js"
    `,
    flaw: "Running the agent globally without scoping.",
    explanation: "Claude Code searches and analyzes files relative to where it is executed. Running it at the root of a massive monorepo causes it to waste time scanning irrelevant projects. Always scope the agent to the tightest relevant directory."
  },
  {
    id: 21,
    domain: 2,
    title: "Tool Schema Without Descriptions",
    antiPattern: `
{
  "name": "calculate_shipping",
  "description": "Calculates shipping cost.",
  "input_schema": {
    "type": "object",
    "properties": {
      "weight": { "type": "number" },
      "zip_code": { "type": "string" },
      "expedited": { "type": "boolean" }
    }
  }
}
    `,
    correctPattern: `
{
  "name": "calculate_shipping",
  "description": "Calculates shipping cost.",
  "input_schema": {
    "type": "object",
    "properties": {
      "weight": { "type": "number", "description": "Weight of the package in kilograms." },
      "zip_code": { "type": "string", "description": "5-digit US postal code." },
      "shipping_speed": { "type": "string", "enum": ["standard", "expedited"], "description": "Desired shipping speed." }
    }
  }
}
    `,
    flaw: "Omitting property-level descriptions.",
    explanation: "Just as the main tool description is critical for routing, property-level descriptions are critical for accurate argument generation. Without knowing that 'weight' is in kilograms or 'zip_code' must be a US 5-digit code, the LLM will hallucinate units and formats."
  },
  {
    id: 22,
    domain: 5,
    title: "Silent Tool Failures",
    antiPattern: `
// In the backend:
function executeTool(args) {
  try {
    const result = db.query(args);
    return result;
  } catch(e) {
    // Return empty array on failure
    return []; 
  }
}
    `,
    correctPattern: `
// In the backend:
function executeTool(args) {
  try {
    const result = db.query(args);
    return result;
  } catch(e) {
    // Return explicit error message to the LLM
    return \`Database error: \${e.message}\`; 
  }
}
    `,
    flaw: "Masking tool errors by returning empty results.",
    explanation: "If a tool fails silently and returns an empty result (like `[]` or `null`), the LLM assumes the search was successful but found nothing. The LLM will then confidently tell the user 'No records exist', which is a hallucinated negative. Always return explicit error strings."
  },
  {
    id: 23,
    domain: 4,
    title: "Inconsistent Few-Shot Examples",
    antiPattern: `
"Classify the sentiment.
Examples:
Review: I loved it! -> Positive
Review: Terrible experience. -> Sentiment: Negative
Review: It was okay. -> Output: Neutral"
    `,
    correctPattern: `
"Classify the sentiment.
Examples:
Review: I loved it!
Sentiment: Positive

Review: Terrible experience.
Sentiment: Negative

Review: It was okay.
Sentiment: Neutral"
    `,
    flaw: "Providing few-shot examples that do not share a strict format.",
    explanation: "The purpose of few-shot prompting is to establish a pattern for the LLM to follow. If the examples themselves are inconsistently formatted, you teach the LLM that formatting doesn't matter, leading to unpredictable parsing downstream."
  },
  {
    id: 24,
    domain: 1,
    title: "Rigid Linear Orchestration",
    antiPattern: `
// Hardcoded pipeline
const translation = await translateAgent(input);
const summary = await summarizeAgent(translation);
const sentiment = await sentimentAgent(summary);
return sentiment;
    `,
    correctPattern: `
// Dynamic graph routing
const intent = await routerAgent(input);
if (intent === 'translate_and_summarize') {
  // execute specific graph path
} else if (intent === 'sentiment_only') {
  // execute specific graph path
}
    `,
    flaw: "Forcing all queries through a static, multi-step pipeline.",
    explanation: "Running every user request through a heavy, linear chain of LLM calls creates massive latency, cost, and compounding error rates. Architecture should be dynamic—routing requests only to the necessary agents."
  },
  {
    id: 25,
    domain: 5,
    title: "Injecting Unstructured Data into Context",
    antiPattern: `
const prompt = \`
Here are the search results:
result 1 was about cats it was written by bob on tuesday
result 2 dogs are cool written by alice

Answer the user's question.
\`;
    `,
    correctPattern: `
const prompt = \`
Here are the search results:
<results>
  <result id="1" author="bob" date="tuesday">Cats</result>
  <result id="2" author="alice">Dogs are cool</result>
</results>

Answer the user's question.
\`;
    `,
    flaw: "Concatenating data without structural delimiters.",
    explanation: "LLMs need help distinguishing between instructions, user queries, and injected data. Using XML tags or Markdown headers to create a clear structural hierarchy significantly improves the LLM's ability to parse and reason over the context."
  },
  {
    id: 26,
    domain: 3,
    title: "Asking Claude Code to 'Remember'",
    antiPattern: `
$ claude -c "Hey, remember that we use the 'postgres' user for the database for all future commands."
    `,
    correctPattern: `
$ claude -c "Add a note to CLAUDE.md that the database user is always 'postgres'."
    `,
    flaw: "Treating Claude Code's session memory as permanent.",
    explanation: "Claude Code's memory is bounded by the current conversation's context window. If you want it to 'remember' a project-wide rule for all future sessions, you must instruct it to write that rule into the CLAUDE.md file."
  },
  {
    id: 27,
    domain: 2,
    title: "Giant Monolithic Tools",
    antiPattern: `
{
  "name": "manage_server",
  "description": "Use this tool to start, stop, restart, provision, or delete a server, and to update its configuration.",
  "input_schema": { ... complex 50-field schema ... }
}
    `,
    correctPattern: `
{ "name": "start_server", ... },
{ "name": "stop_server", ... },
{ "name": "update_server_config", ... }
    `,
    flaw: "Bundling multiple distinct actions into one mega-tool.",
    explanation: "Mega-tools have overly complex input schemas that confuse the LLM, leading to validation errors and hallucinated arguments. Break complex tools down into smaller, single-responsibility tools (CRUD operations)."
  },
  {
    id: 28,
    domain: 4,
    title: "Leading the Witness",
    antiPattern: `
"Analyze this performance review. The employee clearly struggled with communication and missed deadlines, right? Summarize their weaknesses."
    `,
    correctPattern: `
"Analyze this performance review. Provide an objective summary of the employee's strengths and weaknesses based strictly on the text."
    `,
    flaw: "Baking assumptions or biases into the prompt.",
    explanation: "LLMs are highly sycophantic (they want to agree with the user). If you state an assumption in the prompt, the model will often hallucinate evidence to support your assumption rather than objectively analyzing the data."
  },
  {
    id: 29,
    domain: 1,
    title: "Unsafe Tool Confirmation",
    antiPattern: `
// LLM decides to delete a database
const toolCall = llmResponse.tool_calls[0];
if (toolCall.name === 'drop_table') {
  await executeQuery(\`DROP TABLE \${toolCall.args.table_name}\`);
}
    `,
    correctPattern: `
// LLM decides to delete a database
const toolCall = llmResponse.tool_calls[0];
if (toolCall.name === 'drop_table') {
  // Pause execution and require Human-in-the-Loop (HITL) approval
  const approved = await promptUserForApproval(toolCall.args.table_name);
  if (approved) {
    await executeQuery(\`DROP TABLE \${toolCall.args.table_name}\`);
  }
}
    `,
    flaw: "Allowing an autonomous agent to execute destructive actions without human oversight.",
    explanation: "Any tool that causes irreversible, destructive, or high-financial-impact changes must be placed behind a Human-in-the-Loop (HITL) approval gate in the orchestration layer."
  },
  {
    id: 30,
    domain: 5,
    title: "Truncating History from the Bottom",
    antiPattern: `
// Context window is getting full
if (messages.length > 50) {
  // Remove the most recent 10 messages to save space
  messages = messages.slice(0, 40);
}
    `,
    correctPattern: `
// Context window is getting full
if (messages.length > 50) {
  // Keep the system prompt (index 0), and the most recent 39 messages
  messages = [messages[0], ...messages.slice(-39)];
}
    `,
    flaw: "Deleting the most recent conversational context.",
    explanation: "When pruning message history, the most recent messages contain the current state and intent of the user. You should prune the *oldest* messages (while preserving the original system prompt) so the agent doesn't lose track of the immediate conversation."
  }
];
