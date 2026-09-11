# Explore Subagent Scratchpad

## Goal
Understand the architecture of the `billing-service` microservice, specifically how it handles Stripe webhooks.

## Findings
- **Entry Point**: `src/api/webhooks.ts`
- **Validation**: Uses `stripe.webhooks.constructEvent` with secret from `process.env.STRIPE_WEBHOOK_SECRET`.
- **Event Handlers**:
  - `invoice.paid`: Triggers `SubscriptionService.handlePaymentSuccess()`
  - `invoice.payment_failed`: Triggers `SubscriptionService.handlePaymentFailure()`

## Known Issues Discovered
- The `handlePaymentFailure` method does not currently send an email notification to the user; it only updates the database status.

---
## EXAM CONCEPTS:
1. **Context Degradation**: During a 40-minute codebase exploration, the agent's context window fills up with `cat` commands, `ls` commands, and thousands of lines of raw code. The agent begins to lose track of what it found 30 minutes ago.
2. **Scratchpad Pattern**: To solve this, the agent writes its findings into a `scratchpad.md` file (like this one) BEFORE it gets confused. 
3. **Resumption**: The user can then use the `/compact` command to clear the conversation history, or the agent can spawn a new subagent that ONLY reads this `scratchpad.md` file, giving it a fresh, clean context window containing only the highly distilled findings.
