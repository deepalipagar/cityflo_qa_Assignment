# Release Decision — Unlimited Monthly + Auto-Renew

## Call

**CONDITIONAL SHIP / NO BLOCKER IDENTIFIED FROM THE EVIDENCE AVAILABLE.** I am exercising zero of the one allowed blocker. This is a provisional QA call, not a claim that the missing PRD requirements have passed.

The actual PRD v0.9 and Aditi's handoff could not be obtained from the MCP context or the cited bundle URLs. I cannot make the requested PRD-versus-app comparison until those sources are available. Do not treat this call as final sign-off for recurring billing.

## Concrete rule

Block only when a requirement is explicit in the authoritative PRD/handoff, a repeatable staging result violates it, and the violation can charge incorrectly, misstate paid/entitled state, or leave a commuter without the promised pack. A requirement gap without the source text is a PM question, not a blocker. For recurring money, require explicit consent and verifiable persisted renewal state before claiming renewal is safe.

## Case where the rule breaks

The rule would permit shipping the observed first-purchase flow with no Auto-Renew control, `is_renewal=false`, `renewal_mode=null`, and no renewal field in the booking request. If the inaccessible PRD requires renewal consent/configuration at initial purchase, the observed flow would violate that requirement and my no-blocker rule would produce the wrong release call. I keep the rule because a requirement must be verified rather than inferred from the feature title; this exception means the call must be revisited as soon as the PRD is available.

## Cost and who pays

Shipping a confirmed renewal defect could expose riders to an unexpected recurring charge or cause a commuter to lose continuity and need a manual repurchase. Riders pay in money or a missed ride; Support and Product pay in refunds, trust damage, and incident handling. Blocking without a confirmed requirement delays the Friday release and costs Cityflo release time. The observed plan costs ₹5,050 for 30 days; that amount is the plan price, not an estimated loss. No real payment or renewal transaction was performed, so actual financial impact is unverified.

## Auto-Renew: observed, inferred, unverified

- **Observed:** No Auto-Renew UI control/consent on inspected Ride Pack/payment screens. `get-lite-pack-details-with-plans/` returned `is_renewal=false` and `renewal_mode=null`. The `book-lite-pack/` request used `plan_slug=unlimited-rides-30-days` and had no `renewal`/`auto_renew` field.
- **Inferred:** The exercised initial purchase request is configured as non-renewing. This does not establish what happens after a paid purchase or expiry.
- **Unverified:** Whether Auto-Renew is mandatory, optional, or out of scope for first purchase; what consent/persistence rules apply; renewal timing, notices, cancellation, failure/retry behavior; and whether a successful payment activates a pack or renewal. No payment or renewal was attempted.

## What is knowingly shipping under this call

- Ride Pack listing and Unlimited Monthly discovery, with observed 30-day / 50-ride / ₹5,050 / ₹101-per-ride / 61% values.
- The observed booking request uses `unlimited-rides-30-days`.
- An unpaid booking response remains `order_status=unpaid` and `navigate_to_confirmation=false` before payment.
- No verified successful payment, entitlement, recurring renewal, or exact PRD compliance for Auto-Renew.

## What would change my mind

1. The actual PRD/handoff explicitly requires Auto-Renew consent/configuration for initial purchase: reclassify the observed absence as a candidate bug and decide severity/blocker status from its exact requirement and impact.
2. A staging trace shows a paid pack is incorrectly confirmed/activated, or a charge occurs without explicit consent: block release under the rule above.
3. The PRD says renewal is optional or not part of initial purchase, or the UI/backend contract documents another consent path: keep the current no-blocker call, subject to verifying that path.
4. A safe sandbox test and trace demonstrate the intended opt-in, persistence, opt-out, expiry, failure, and retry behavior: update the unverified renewal assessment.

## Required follow-up before final sign-off

Obtain `PRD.md`, `HANDOFF.md`, `ACCESS.md`, and `bug-report-template.md`; get PM answers to the questions in `TEST_PLAN.md`; then perform authorized sandbox verification with an authenticated session and retain network evidence. Assignment end time recorded at the candidate's request as 2026-10-08 15:43:27 UTC / 21:13:27 IST (current system time).
