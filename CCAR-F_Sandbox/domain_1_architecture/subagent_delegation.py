"""
CCAR-F Exam Practice: Domain 1
Topic: Multi-Agent Hub-and-Spoke Delegation

This script demonstrates how a Coordinator Agent delegates to a Subagent.
EXAM CONCEPTS:
- Subagents DO NOT automatically inherit the parent's context.
- The coordinator MUST explicitly pass necessary context in the prompt.
- Subagents only communicate via the Coordinator (Hub-and-spoke).
"""

def search_subagent(prompt, context=None):
    """
    A specialized subagent that only performs searches.
    Notice it knows nothing about the user's original request unless explicitly told.
    """
    print(f"\n  [SUBAGENT SPAWNED] Searching with prompt: '{prompt}'")
    
    # Anti-pattern check: if context wasn't passed, the subagent will fail or hallucinate
    if not context or "user_id" not in context:
        return {"error": "Missing required context (user_id). Subagent cannot guess this."}
        
    print(f"  [SUBAGENT LOGIC] Running search for user {context['user_id']}...")
    return {"findings": "User has 3 open support tickets regarding slow performance."}

def coordinator_agent():
    print("Coordinator Agent Started.")
    
    # Coordinator holds the state/memory
    session_state = {
        "user_id": "cust_8829",
        "customer_tier": "Enterprise",
        "intent": "check open issues"
    }
    
    print("\n--- ANTI-PATTERN DEMONSTRATION ---")
    print("Coordinator calling subagent WITHOUT passing context...")
    # This will fail because the subagent doesn't share the coordinator's memory
    bad_result = search_subagent("Find all open tickets.")
    print(f"Coordinator received: {bad_result}")
    
    print("\n--- BEST PRACTICE DEMONSTRATION ---")
    print("Coordinator calling subagent explicitly passing required context...")
    
    # The Coordinator must craft a prompt that injects the required context
    good_prompt = "Find all open tickets."
    context_to_pass = {"user_id": session_state["user_id"]}
    
    good_result = search_subagent(good_prompt, context=context_to_pass)
    print(f"Coordinator received: {good_result}")
    
    print("\nCoordinator Synthesis:")
    print(f"Based on the subagent's findings: {good_result['findings']}")
    print("I will now formulate a response to the user.")

if __name__ == "__main__":
    coordinator_agent()
