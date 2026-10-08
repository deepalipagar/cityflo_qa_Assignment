import { test, expect, type Page } from '@playwright/test';
import { existsSync } from 'node:fs';

const baseURL = process.env.CITYFLO_BASE_URL || 'https://app.cityflostaging.com';
const storageStatePath = process.env.CITYFLO_STORAGE_STATE;

type JsonObject = Record<string, unknown>;

function findPlan(value: unknown): JsonObject | undefined {
  if (Array.isArray(value)) {
    for (const item of value) {
      const result = findPlan(item);
      if (result) return result;
    }
    return undefined;
  }
  if (!value || typeof value !== 'object') return undefined;

  const object = value as JsonObject;
  if (object.plan_slug === 'unlimited-rides-30-days') return object;
  for (const child of Object.values(object)) {
    const result = findPlan(child);
    if (result) return result;
  }
  return undefined;
}

function requiredSelector(name: string): string {
  const selector = process.env[name];
  if (!selector) {
    throw new Error(
      `${name} is not set. Inspect the authenticated staging DOM and set this to a verified CSS selector before running purchase-flow tests.`,
    );
  }
  return selector;
}

async function loadRidePack(page: Page) {
  const plansResponsePromise = page.waitForResponse(response =>
    response.url().includes('get-lite-pack-details-with-plans/'),
  );
  await page.goto(`${baseURL}/booking/ride-pack`);
  const response = await plansResponsePromise;
  expect(response.ok(), 'Ride Pack plan request should succeed').toBeTruthy();
  return { response, plans: await response.json() as unknown };
}

async function bookSelectedPlan(page: Page) {
  const planSelector = requiredSelector('CITYFLO_PLAN_SELECTOR');
  const continueSelector = requiredSelector('CITYFLO_CONTINUE_SELECTOR');
  await page.locator(planSelector).click();
  await page.locator(continueSelector).click();
}

test.describe('Cityflo Unlimited Monthly Ride Pack', () => {
  test.beforeEach(() => {
    test.skip(
      !storageStatePath || !existsSync(storageStatePath),
      'Set CITYFLO_STORAGE_STATE to an authenticated Playwright state file. Manually complete OTP login; OTP is not automated.',
    );
  });

  test('RP-01 — Ride Pack plans load', async ({ page }) => {
    const { plans } = await loadRidePack(page);
    expect(findPlan(plans), 'Unlimited Monthly plan should be present in plan response').toBeDefined();
    await expect(page.getByText('Unlimited Monthly', { exact: true }).first()).toBeVisible();
  });

  test('RP-02 — Unlimited Monthly details match verified plan data', async ({ page }) => {
    const { plans } = await loadRidePack(page);
    const plan = findPlan(plans);
    expect(plan, 'Unlimited Monthly plan should be present in plan response').toBeDefined();
    expect(plan).toMatchObject({
      plan_slug: 'unlimited-rides-30-days',
      no_of_rides: 50,
      validity_days: 30,
      cost_per_ride: 101,
      total_cost: 5050,
      discount_percentage: 61,
      is_renewal: false,
      renewal_mode: null,
    });
    await expect(page.getByText('Unlimited Monthly', { exact: true }).first()).toBeVisible();
  });

  test('RP-03 — selecting Unlimited Monthly submits its plan slug', async ({ page }) => {
    const requestPromise = page.waitForRequest(request =>
      request.url().includes('book-lite-pack/') && request.method().toUpperCase() === 'POST',
    );
    await loadRidePack(page);
    await bookSelectedPlan(page);
    const request = await requestPromise;
    expect(request.postDataJSON()).toMatchObject({ plan_slug: 'unlimited-rides-30-days' });
  });

  test('RP-04 — booking stays unpaid when the user does not pay', async ({ page }) => {
    const responsePromise = page.waitForResponse(response =>
      response.url().includes('book-lite-pack/') &&
      response.request().method().toUpperCase() === 'POST',
    );
    await loadRidePack(page);
    await bookSelectedPlan(page);
    const response = await responsePromise;
    expect(response.ok(), 'Booking request should return successfully').toBeTruthy();
    expect(await response.json()).toMatchObject({
      order_status: 'unpaid',
      navigate_to_confirmation: false,
    });
    // Deliberately stop at the unpaid booking response. Never click a payment method.
  });
});
