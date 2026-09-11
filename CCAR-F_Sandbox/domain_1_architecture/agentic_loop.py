"""
CCAR-F Exam Practice: Domain 1
Topic: The Agentic Loop

This script demonstrates the core "Agentic Loop" pattern.
The exam heavily tests understanding of 'stop_reason' handling.
- 'tool_use' -> execute tool, append result, continue loop
- 'end_turn' -> terminate loop and return response
- ANTI-PATTERN: Parsing natural language like "I am done."
"""

import json

# Mock LLM that returns pre-determined responses to simulate a conversation
MOCK_LLM_RESPONSES = [
    {
        "stop_reason": "tool_use",
        "content": "I need to check the customer's balance.",
        "tool_call": {"name": "get_balance", "args": {"user_id": "u123"}}
    },
    {
        "stop_reason": "tool_use",
        "content": "The balance is 50. Now I need to check recent transactions.",
        "tool_call": {"name": "get_transactions", "args": {"user_id": "u123"}}
    },
    {
        "stop_reason": "end_turn",
        "content": "The customer has a balance of $50 and 2 recent transactions. I am done.",
        "tool_call": None
    }
]

# Mock tools
def get_balance(user_id):
    return {"status": "success", "balance": 50}

def get_transactions(user_id):
    return {"status": "success", "transactions": ["tx1", "tx2"]}

TOOLS = {
    "get_balance": get_balance,
    "get_transactions": get_transactions
}

def run_agentic_loop(prompt):
    print(f"User: {prompt}\n")
    
    conversation_history = [{"role": "user", "content": prompt}]
    loop_count = 0
    max_loops = 10 # Failsafe against infinite loops

    while loop_count < max_loops:
        loop_count += 1
        print(f"--- Iteration {loop_count} ---")
        
        # Simulate calling the LLM API
        # In real code: response = anthropic.messages.create(messages=conversation_history, ...)
        response = MOCK_LLM_RESPONSES.pop(0) 
        
        # Log the model's text response
        print(f"Assistant: {response['content']}")
        conversation_history.append({"role": "assistant", "content": response["content"]})
        
        # EXAM CONCEPT: Explicitly handle stop_reason
        if response["stop_reason"] == "end_turn":
            print("\n[SUCCESS] Agent completed task naturally (stop_reason == end_turn)")
            break
            
        elif response["stop_reason"] == "tool_use":
            tool_name = response["tool_call"]["name"]
            tool_args = response["tool_call"]["args"]
            print(f"[TOOL USE] Calling tool '{tool_name}' with args {tool_args}")
            
            # Execute the tool
            if tool_name in TOOLS:
                tool_result = TOOLS[tool_name](**tool_args)
            else:
                tool_result = {"error": "Tool not found"}
                
            print(f"[TOOL RESULT] {tool_result}")
            
            # Append the tool result back to the conversation history so the model can read it
            conversation_history.append({
                "role": "user", 
                "content": f"<tool_result>\n{json.dumps(tool_result)}\n</tool_result>"
            })
            
            # The loop CONTINUES because stop_reason was tool_use
            continue
            
    if loop_count >= max_loops:
        print("\n[ERROR] Hit iteration cap. This is a failsafe, not the primary completion mechanism.")

if __name__ == "__main__":
    print("Starting Domain 1: Agentic Loop Practice\n")
    run_agentic_loop("Can you summarize my account status?")
