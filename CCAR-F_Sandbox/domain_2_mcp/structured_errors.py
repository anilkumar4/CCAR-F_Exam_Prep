"""
CCAR-F Exam Practice: Domain 2
Topic: Structured Error Responses for MCP Tools

This script demonstrates how an MCP tool should return errors to the agent.
EXAM CONCEPTS:
- isError flag: communicates failure back to the agent so it can recover.
- Error Categories: transient, validation, permission, business.
- Anti-pattern: Returning an empty string or generic "Operation failed" which prevents the agent from understanding what went wrong.
"""

import json

def process_refund(order_id, amount):
    """
    A mock tool that processes a refund but intentionally fails to demonstrate error handling.
    """
    print(f"Executing process_refund for order {order_id}, amount ${amount}")
    
    # 1. Validation Error Example
    if amount <= 0:
        return {
            "isError": True,
            "errorCategory": "validation",
            "isRetryable": False,
            "description": "Refund amount must be greater than zero. Cannot process a refund for $0."
        }
        
    # 2. Business Logic / Policy Error Example
    if amount > 500:
        return {
            "isError": True,
            "errorCategory": "business",
            "isRetryable": False,
            "description": "Amount exceeds maximum automated refund limit ($500). Please escalate this to a human manager."
        }
        
    # 3. Transient Error Example
    if order_id == "TIMEOUT_TEST":
        return {
            "isError": True,
            "errorCategory": "transient",
            "isRetryable": True,
            "description": "Payment gateway timeout. Please retry the request in 5 seconds."
        }
        
    # 4. Success Example
    return {
        "isError": False,
        "status": "success",
        "transaction_id": "tx_9992384",
        "message": f"Successfully refunded ${amount} to order {order_id}."
    }

if __name__ == "__main__":
    print("--- Testing Validation Error ---")
    print(json.dumps(process_refund("ord_123", 0), indent=2))
    
    print("\n--- Testing Policy/Business Error ---")
    print(json.dumps(process_refund("ord_123", 600), indent=2))
    
    print("\n--- Testing Transient Error ---")
    print(json.dumps(process_refund("TIMEOUT_TEST", 50), indent=2))
    
    print("\n--- Testing Success ---")
    print(json.dumps(process_refund("ord_123", 50), indent=2))
