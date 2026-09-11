# System Prompt: Customer Support Resolution

You are a customer support agent. You will read the history of the conversation and the system logs, and then respond to the user.

<case_facts>
CUSTOMER_ID: cust_99182
ORDER_ID: ord_551_xyz
TOTAL_REFUND_ELIGIBLE: $145.50
PURCHASE_DATE: 2026-08-15
</case_facts>

<conversation_history>
[System: summarized conversation spanning 45 minutes...]
The user reported an issue with their laptop. You tried troubleshooting step A, step B, and step C. The user was frustrated. You escalated to tier 2 but they sent it back. You then checked the manual.
</conversation_history>

## EXAM CONCEPTS:
- The `<conversation_history>` above is heavily summarized ("progressive summarization") to save context window tokens during a long conversation.
- If the refund amount ($145.50) was inside the conversation history, it might have been summarized away or rounded to "$150" over time.
- By extracting hard transactional facts into the persistent `<case_facts>` block that is passed in fresh with every single turn, we protect those numbers from the "Lost in the Middle" effect and summarization corruption.
