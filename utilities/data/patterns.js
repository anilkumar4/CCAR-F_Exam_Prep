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
  }
];
