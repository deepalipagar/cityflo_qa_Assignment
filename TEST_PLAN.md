# Test Plan — Unlimited Monthly Ride Pack

## Scope and source status

Target: Cityflo staging rider web app, Chrome, `https://app.cityflostaging.com`; Ride Pack / Unlimited Monthly purchase flow and Auto-Renew.

The Cityflo MCP assignment brief was retrieved. It identifies `HANDOFF.md`, `PRD.md` v0.9, `ACCESS.md`, and `bug-report-template.md` as required inputs, but the MCP response contains only the brief and no attachments. The bundle URL and direct URLs for all four files were inaccessible, and the project contains no copies. Accordingly, this plan does not attribute any detailed behavior to the missing PRD or handoff. The only product evidence available here is the prior recorded staging exercise and its network observations below.

Assignment start: 2026-10-08 14:36:39 UTC / 20:06:39 IST  
Assignment end: 2026-10-08 15:43:27 UTC / 21:13:27 IST (current system time, recorded at candidate's request).

## Verified observations

| Source | Verified observation |
|---|---|
| UI | Unlimited Monthly was displayed as a 30-day plan, ₹5,050 total, ₹101/ride, 61% discount, suitable for daily travel. |
| `get-lite-pack-details-with-plans/` response | `plan_slug=unlimited-rides-30-days`; `no_of_rides=50`; `validity_days=30`; `cost_per_ride=101`; `total_cost=5050`; `discount_percentage=61`; `is_renewal=false`; `renewal_mode=null`. |
| `book-lite-pack/` request | `plan_slug=unlimited-rides-30-days`; no `renewal` or `auto_renew` field was present. |
| `book-lite-pack/` response | `order_status=unpaid`; `navigate_to_confirmation=false`. |
| UI | No Auto-Renew control/consent was visible on the inspected Ride Pack/payment screens. |

No successful payment, entitlement, or recurring renewal was verified. No payment was made.

## Scenario matrix

Priority: P0 = money/pack-state safety; P1 = core purchase; P2 = requirement clarification/edge.

| ID | Type / priority | Scenario and checks | Expected / oracle | Coverage and current status |
|---|---|---|---|---|
| RP-01 | Happy path / P1 | Open Ride Pack after route/stops are configured; wait for plans. | Plans load and Unlimited Monthly is available. | Manual observed pass. Automation planned; needs authenticated state and verified locator/API contract. |
| RP-02 | Happy path / P1 | Inspect Unlimited Monthly details against the plan response. | UI/backend agree on 30 days, 50 rides, ₹5,050 total, ₹101/ride, 61% discount, slug `unlimited-rides-30-days`. | Manual observed pass for displayed values and response fields. |
| RP-03 | Happy path / P0 | Select Unlimited Monthly and inspect `book-lite-pack/` request. | Request uses `plan_slug=unlimited-rides-30-days`. | Manual observed pass. Automation planned; interaction locator not preserved/verified in this workspace. |
| RP-04 | Negative / P0 | Initiate booking but stop before payment; inspect response and navigation. | Booking remains unpaid; no confirmation navigation/entitlement before successful payment. | Manual observed pass: `unpaid`, `navigate_to_confirmation=false`; no payment made. |
| RP-05 | Negative / P0 | Cancel/close payment or return without paying; check order/pack state on revisit. | No paid/active pack or confirmation is shown. | Not run; verify only in sandbox with explicit stop before payment. |
| RP-06 | Edge / P0 | Payment gateway returns failure, timeout, or user cancellation; revisit order. | No duplicate charge, paid state, or entitlement; retry is safe and order state is clear. | Not run; sandbox/gateway coverage required. |
| RP-07 | Edge / P0 | Double-click/refresh/back during booking and payment initiation. | At most one order/charge; stale state cannot falsely confirm a pack. | Not run; avoid repeated shared-staging mutations until test limits are confirmed in ACCESS.md. |
| RP-08 | Edge / P1 | Plan data missing, malformed, stale, or unavailable. | No incorrect price/validity is shown or submitted; recoverable error is clear. | Not run; no fixture/API contract available. |
| RP-09 | Edge / P1 | Route/stops are absent or changed before purchase. | App enforces route prerequisites and prices the applicable plan consistently. | Not run; expected route rules unknown. |
| RP-10 | Negative / P1 | Revisit purchase while an existing pack/order is active or pending. | No unintended duplicate pack or ambiguous payment state. | Not run; existing account state and product rule unknown. |
| RP-11 | Consequential / P0 | Inspect renewal consent, renewal configuration, and server persistence across initial purchase. | Must follow explicit PRD and PM-approved consent/persistence rules. | UI/network observations show no control, `is_renewal=false`, `renewal_mode=null`, and no renewal field in booking request. Requirement unresolved; not a confirmed bug. |
| RP-12 | Edge / P0 | With renewal enabled (if supported), test opt-out, expiry boundary, failed renewal payment, and retry behavior. | Consent is explicit/revocable; no charge without valid consent; expiry and retry behavior follow documented policy. | Not run; renewal support and policy unavailable. |
| RP-13 | Negative / P0 | Verify a successful gateway callback is required before confirmation/entitlement. | Only verified successful payment transitions to paid/active. | Not run; no payment/entitlement test performed. |

## PM questions / PRD gaps

The actual PRD and Aditi's handoff were inaccessible, so these are questions derived from the assignment's Auto-Renew scope and the observed flow, not claims about exact PRD wording:

1. Is Auto-Renew required or optional for the first Unlimited Monthly purchase? Is consent opt-in, and what exact copy/control constitutes consent?
2. What backend field/state records consent, renewal mode, and the user's subsequent opt-out? Is `is_renewal=false` expected for a first purchase?
3. When is the next purchase/charge attempted relative to the 30-day validity end, and what happens after decline, insufficient balance, timeout, or repeated failure?
4. Is renewal tied to the original route, price, and payment method? What notice and cancellation cutoff must the rider receive?
5. What is the required behavior for payment cancellation/failure, duplicate submission, and pending orders? When are confirmation and entitlement allowed?
6. Do plan values (50 rides, 30 days, ₹101/ride, ₹5,050, 61%) apply universally, and which value is authoritative if UI/API values disagree?
7. Which route/stop/account states are eligible, and what are the expected empty/error states?
8. What respectful-testing limits and sandbox payment steps are authorized for shared staging? `ACCESS.md` is not available to confirm them.

Provisional assumption to keep moving: treat renewal as requirement-dependent; do not call missing renewal UI/configuration a defect unless the actual PRD explicitly requires it. Treat an order as unpaid until a verified successful payment response. No payment was made.

## Manual vs automated coverage

- **Manual, observed:** RP-01 through RP-04 in the prior recorded run, including UI, network request/response, and stopping at unpaid state.
- **Automated targets (4):** RP-01 plan load; RP-02 details/response values; RP-03 selection request slug; RP-04 unpaid booking response. They were **not executed**: npm registry TCP 443 is blocked (`Test-NetConnection` returned `TcpTestSucceeded: False`; curl could not connect), npm installation failed with EACCES, Playwright could not be installed, and Python Playwright is also unavailable (`ModuleNotFoundError`; `pip show` reported package not found). In addition, authenticated `CITYFLO_STORAGE_STATE` and verified UI selectors are unavailable. The existing starter tests were skipped and did not establish selectors. Do not report test results as passes; add/verify these after manual OTP login and inspect the live DOM; do not automate OTP.
- **Manual exploratory next:** RP-05 through RP-13; prioritize money/pack-state cases after ACCESS.md and sandbox constraints are obtained.

## Deliberate cuts

- No real UPI/card payment and no successful payment, entitlement, or renewal attempt.
- No OTP automation or bypass. Reuse only a manually authenticated Playwright `storageState` when available.
- No repeated booking, duplicate-submit, or gateway-failure mutation on shared staging until ACCESS.md's limits and safe test account state are known.
- No Apple Pay defect: the prior gateway/decode error was not tied to a confirmed product requirement.
- No map `AuthFailure` defect: scope/release requirement was not established.
- No Auto-Renew defect classification without the actual PRD requirement.

## Evidence needed to close

Obtain the four missing bundle files; confirm PM answers; configure a manually authenticated storage state; inspect and verify selectors; run and record the four Playwright cases without completing payment; record the actual assignment end time. Keep raw network/trace artifacts if the browser session permits.
