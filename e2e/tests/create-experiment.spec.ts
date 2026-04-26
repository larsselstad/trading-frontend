import { expect, test } from '@playwright/test'

test.describe('create experiment form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experiments/new')
    await expect(
      page.locator('#stock-select option[value="line-only"]'),
    ).toBeAttached()
  })

  test('shows heading, all fields, and cancel button', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'New Experiment' }),
    ).toBeVisible()
    await expect(page.locator('#stock-select')).toBeVisible()
    await expect(page.locator('#exp-name')).toBeVisible()
    await expect(page.locator('#exp-start')).toBeVisible()
    await expect(page.locator('#exp-end')).toBeVisible()
    await expect(page.getByRole('button', { name: '✕ Cancel' })).toBeVisible()
  })

  test('submit is disabled when neither stock nor name is filled', async ({
    page,
  }) => {
    await expect(
      page.getByRole('button', { name: 'Create Experiment' }),
    ).toBeDisabled()
  })

  test('submit is disabled when only stock is selected', async ({ page }) => {
    await page.selectOption('#stock-select', 'line-only')
    await expect(
      page.getByRole('button', { name: 'Create Experiment' }),
    ).toBeDisabled()
  })

  test('submit is disabled when only name is filled', async ({ page }) => {
    await page.fill('#exp-name', 'My Test Experiment')
    await expect(
      page.getByRole('button', { name: 'Create Experiment' }),
    ).toBeDisabled()
  })

  test('submit is enabled when both stock and name are filled', async ({
    page,
  }) => {
    await page.selectOption('#stock-select', 'line-only')
    await page.fill('#exp-name', 'My Test Experiment')
    await expect(
      page.getByRole('button', { name: 'Create Experiment' }),
    ).toBeEnabled()
  })

  test('selecting a stock shows chart preview with data point count', async ({
    page,
  }) => {
    await page.selectOption('#stock-select', 'line-only')
    await expect(page.locator('.stock-preview')).toBeVisible()
    await expect(page.locator('.stock-preview p').first()).toContainText(
      '20 data points',
    )
  })

  test('cancel button returns to experiment list', async ({ page }) => {
    await page.getByRole('button', { name: '✕ Cancel' }).click()
    await expect(page).toHaveURL('/experiments')
  })

  test('submitting the form navigates to the new experiment', async ({
    page,
  }) => {
    await page.selectOption('#stock-select', 'line-only')
    await page.fill('#exp-name', 'My Test Experiment')
    await page.fill('#exp-start', '01.01.2025')
    await page.getByRole('button', { name: 'Create Experiment' }).click()
    await expect(page).toHaveURL('/experiments/created-experiment-id')
  })
})

test('New Experiment button navigates to create form', async ({ page }) => {
  await page.goto('/experiments')
  await expect(page.getByText('var-test')).toBeVisible()
  await page.getByRole('button', { name: '+ New Experiment' }).click()
  await expect(page).toHaveURL('/experiments/new')
  await expect(
    page.getByRole('heading', { name: 'New Experiment' }),
  ).toBeVisible()
})
