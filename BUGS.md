# Bug Reports — Unlimited Monthly Ride Pack

## Filed bugs

None. No confirmed product bug can be established from the available assignment brief and evidence; the actual PRD was unavailable. The actual `bug-report-template.md` could not be read: the Cityflo MCP assignment response did not include attachments, the cited bundle page and direct file URL were inaccessible, and the project contains no template copy. The format below follows the fields required by the assignment brief.

## Auto-Renew requirement question — not filed as a bug

**Title:** PM question: Is Auto-Renew required at initial Unlimited Monthly purchase?

**Environment:** Cityflo staging rider web app, Chrome; exact browser version not recorded.

**Preconditions:** Authenticated rider; route configured; Ride Pack plans loaded; no payment completed.

**Steps observed:**

1. Open Ride Pack and inspect Unlimited Monthly and the payment flow.
2. Inspect `get-lite-pack-details-with-plans/` response.
3. Select Unlimited Monthly and inspect `book-lite-pack/` request/response, stopping before payment.

**Expected result:** Requirement cannot be stated until the actual PRD and PM answer are available. The assignment brief describes an Auto-Renew feature but is not a specification of the control, consent, or persistence rules.

**Actual result:** No Auto-Renew control/consent was visible in inspected Ride Pack/payment screens. Plan response contained `is_renewal=false` and `renewal_mode=null`. Booking payload contained `plan_slug=unlimited-rides-30-days` and no `renewal` or `auto_renew` field. Booking response was `order_status=unpaid`, `navigate_to_confirmation=false`.

**Severity:** Not assigned; this is not a filed bug.

**Severity justification:** There is no verifiable expected behavior without the actual PRD. If the PRD explicitly requires opt-in renewal configuration at initial purchase, absence of that path may warrant a high-severity defect because it affects recurring money and commuter continuity. That conditional assessment is not a current severity assignment.

**Evidence:** Previously recorded UI inspection and network observations listed above. No raw HAR/trace was present in the workspace. No payment was made.

**PM question:** Is Auto-Renew mandatory or optional for initial purchase? If required, what consent UI, payload/state persistence, timing, opt-out, failure, and retry behavior should apply?

## Excluded observations

- A prior Apple Pay `initiate` response showed a gateway/decode error. It was not established as a Cityflo defect against a requirement, so no bug is filed.
- A map `AuthFailure` appeared during route usage. Map rendering was not established as an in-scope requirement, so no bug is filed.
