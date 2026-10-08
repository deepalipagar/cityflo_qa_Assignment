# Cityflo QA Engineer Take-Home

Evidence-based QA notes and a four-case Playwright suite for the Unlimited Monthly Ride Pack.

## Status

- Cityflo MCP assignment brief retrieved; source bundle files `PRD.md`, `HANDOFF.md`, `ACCESS.md`, and `bug-report-template.md` were not returned by MCP and were inaccessible at the cited bundle URL/direct paths.
- Current recorded staging observations are documented in `TEST_PLAN.md`; no payment was made.
- No confirmed bugs are filed. Auto-Renew remains a requirement question until the actual PRD is read.
- Exactly four Playwright tests are authored in `tests/ride-pack.spec.ts`. They are **not currently runnable against staging**: `CITYFLO_STORAGE_STATE` and verified UI action selectors are unavailable. Without state the cases skip; purchase cases require `CITYFLO_PLAN_SELECTOR` and `CITYFLO_CONTINUE_SELECTOR`, and fail with an explicit setup message if those selectors are unset.
- `decisions.jsonl` contains an exact quote from a user message in this session, but its transcript anchor is unresolved. Export the raw transcript and locate a valid anchor before submission; do not present the placeholder as a valid anchor.

## Playwright setup

1. Install Node.js and dependencies, then Chromium. Exact one-line commands:

   `npm.cmd install` (PowerShell on Windows; use `npm install` in a shell where the npm script wrapper is permitted)

   `npx.cmd playwright install chromium`

   `npx.cmd playwright --version`

2. Manually authenticate to staging using the user's own number and OTP. Do not automate or bypass OTP. Save the authenticated browser context and set `CITYFLO_STORAGE_STATE` to its path (for example `playwright/.auth/user.json`). Keep this file private; it is ignored by git.
3. Inspect the authenticated Ride Pack page and set `CITYFLO_PLAN_SELECTOR` to a verified CSS selector that selects Unlimited Monthly, and `CITYFLO_CONTINUE_SELECTOR` to a verified CSS selector that proceeds to booking/payment. These selectors were not available in the workspace and must not be guessed.
4. Exact PowerShell run command after setting the values below. Replace selector placeholders only with selectors verified against the authenticated live DOM:

   `$env:CITYFLO_STORAGE_STATE='playwright/.auth/user.json'; $env:CITYFLO_PLAN_SELECTOR='YOUR_VERIFIED_PLAN_SELECTOR'; $env:CITYFLO_CONTINUE_SELECTOR='YOUR_VERIFIED_CONTINUE_SELECTOR'; npm.cmd run test:e2e`

   `CITYFLO_BASE_URL` defaults to `https://app.cityflostaging.com`. `CITYFLO_STORAGE_STATE`, `CITYFLO_PLAN_SELECTOR`, and `CITYFLO_CONTINUE_SELECTOR` are required for the complete suite.

The booking cases create only the unpaid booking and stop after checking the response. They never click a payment method. Because staging is shared, use only after confirming `ACCESS.md` limits and the test account state.

## Execution attempt

**The four tests were NOT executed.** npm registry TCP 443 is blocked in this environment; npm installation failed, and no usable Playwright installation is present. Python Playwright is also unavailable. Authenticated state and verified selectors are also missing. No pass/fail test results are claimed.

### Exact test/setup command outcomes

- `npm install` — PowerShell blocked `C:\Program Files\nodejs\npm.ps1` because running scripts is disabled.
- `npm.cmd install` — failed with `npm error code EACCES` / `FetchError` requesting `https://registry.npmjs.org/@playwright%2ftest`.
- `npm.cmd config get cache` — returned `C:\Users\User\AppData\Local\npm-cache`.
- `npm.cmd install --cache .npm-cache` — failed with the same EACCES registry fetch error; no install completed.
- `npx.cmd playwright --version` — produced no output and remained pending; stopped after about 60 seconds, version unknown.
- `npx.cmd --no-install playwright --version` — produced no output and remained pending; stopped, version unknown.
- `npm.cmd run test:e2e` — failed with `'playwright' is not recognized as an internal or external command`; tests did not execute.

### Registry and cache diagnostics

Commands run: `npm.cmd config get registry`, `npm.cmd config get proxy`, `npm.cmd config get https-proxy`, `Test-NetConnection registry.npmjs.org -Port 443`, `curl.exe -I https://registry.npmjs.org/@playwright%2ftest`, and `npm.cmd cache verify`.

- Registry: `https://registry.npmjs.org/`; proxy and https-proxy: `null`.
- `Test-NetConnection`: ping succeeded, but TCP 443 failed for the reported IPv4 and IPv6 addresses; `TcpTestSucceeded: False`.
- `curl.exe`: `curl: (7) Failed to connect to registry.npmjs.org:443`.
- `npm.cmd view @playwright/test version`: failed with EACCES fetching `https://registry.npmjs.org/@playwright%2ftest`.
- `npm.cmd cache verify`: failed with `EPERM` while unlinking a file in `C:\Users\User\AppData\Local\npm-cache\_cacache`.

### Existing Playwright and Python checks

- `where.exe node`, `where.exe npm`, and `where.exe npx` found executables under `C:\Program Files\nodejs`; `where.exe playwright` found no executable. Project `node_modules` was absent. `npm.cmd root -g` returned `C:\Program Files\nodejs\node_modules`; the inspected global package roots had no Playwright installation.
- `python --version` returned Python 3.13.2. `py --version` failed with Windows “Access is denied” while creating the process.
- `python -c "import playwright; print(playwright.__file__)"` failed with `ModuleNotFoundError: No module named 'playwright'`; `python -m pip show playwright` reported `Package(s) not found: playwright`.
- `py -c "import playwright; print(playwright.__file__)"` and `py -m pip show playwright` failed because Windows denied access to the Python executable.

Static inspection confirms exactly four declared `RP-01`–`RP-04` tests. They remain unexecuted; the test definitions are not evidence of a pass.

## Deliverables

- `TEST_PLAN.md` — scenario matrix, observed evidence, PM questions, coverage split, and deliberate cuts.
- `BUGS.md` — evidence disposition and Auto-Renew PM question; no unsupported bug filed.
- `DECISION.md` — one release call with rule, exception, costs, and mind-changing evidence.
- `decisions.jsonl` — steering ledger with unresolved anchor disclosed.
- `tests/ride-pack.spec.ts` — four consequential automation cases.
- `playwright.config.ts`, `package.json`, `.gitignore` — runner and local authenticated state setup.

## Submission checklist

- [ ] Obtain and read `PRD.md`, `HANDOFF.md`, `ACCESS.md`, and `bug-report-template.md`; update conclusions only from those sources.
- [ ] Manually authenticate, capture `CITYFLO_STORAGE_STATE`, verify selectors, and execute the four tests without making or simulating a real payment. Record actual output; do not infer a pass.
- [x] Record the assignment end time at the candidate's request using current system time: 2026-10-08 15:43:27 UTC / 21:13:27 IST.
- [ ] Export the raw agent transcript, then replace the unresolved ledger anchor only with a real transcript anchor. The raw transcript must be exported before submission.
- [ ] Publish the reviewed deliverables in a public repo or gist and record its URL.
- [ ] Upload the raw session log through the Cityflo MCP session-log upload flow and retain the returned session-log key.
- [ ] Call `submit_assignment` only after all deliverables are ready and submission is explicitly authorized. This assignment has not been submitted and the session log has not been uploaded.
