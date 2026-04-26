import { expect, test } from '@playwright/test'

const EXPERIMENT_ID = '546c5395-86cf-4508-bf5b-c6e0c8589e7b'

test.describe('experiment list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experiments')
    await expect(page.getByText('var-test')).toBeVisible()
  })

  test('shows both fixture experiments', async ({ page }) => {
    await expect(page.getByText('var-test')).toBeVisible()
    await expect(page.getByText('TGS Feb')).toBeVisible()
  })

  test('shows correct stock IDs', async ({ page }) => {
    const varRow = page.locator('.experiment-table-row', {
      hasText: 'var-test',
    })
    const tgsRow = page.locator('.experiment-table-row', { hasText: 'TGS Feb' })
    await expect(varRow.locator('td').nth(1)).toHaveText('var')
    await expect(tgsRow.locator('td').nth(1)).toHaveText('tgs')
  })

  test('shows start dates', async ({ page }) => {
    const varRow = page.locator('.experiment-table-row', {
      hasText: 'var-test',
    })
    await expect(varRow.locator('td').nth(2)).toHaveText('29.10.2025')
  })

  test('shows buy price for var-test', async ({ page }) => {
    const varRow = page.locator('.experiment-table-row', {
      hasText: 'var-test',
    })
    await expect(varRow.locator('td').nth(3)).toHaveText('31.60')
  })

  test('navigates to experiment detail on row click', async ({ page }) => {
    await page.locator('.experiment-table-row', { hasText: 'var-test' }).click()
    await expect(page).toHaveURL(`/experiments/${EXPERIMENT_ID}`)
  })
})

test.describe('experiment detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`/experiments/${EXPERIMENT_ID}`)
    await expect(page.getByRole('heading', { name: 'var-test' })).toBeVisible()
  })

  test('shows experiment name and stock info', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'var-test' })).toBeVisible()
    await expect(page.getByText('var | 29.10.2025')).toBeVisible()
  })

  test('shows SVR chart with correct start date', async ({ page }) => {
    await expect(page.locator('.chart-label')).toContainText(
      'SVR from 18.12.2025',
    )
  })

  test('shows data point count after chart data loads', async ({ page }) => {
    await expect(page.locator('p.data-count')).toContainText(
      'Showing 73 data points',
    )
  })

  test('shows SVR prediction legend', async ({ page }) => {
    await expect(page.locator('p.data-count')).toContainText(
      'Showing 73 data points',
    )
    await expect(page.locator('.chart-legend')).toBeVisible()
    await expect(page.locator('.chart-legend')).toContainText('SVR Prediction')
  })

  test('back button returns to experiment list', async ({ page }) => {
    await page.getByRole('button', { name: '← Back' }).click()
    await expect(page).toHaveURL('/experiments')
  })
})

test.describe('experiment detail — no SVR charts', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/experiments/no-charts-experiment-id')
    await expect(
      page.getByRole('heading', { name: 'no-charts-test' }),
    ).toBeVisible()
  })

  test('shows stock chart instead of empty-state text', async ({ page }) => {
    await expect(
      page.getByText('No SVR charts yet. Add one above.'),
    ).not.toBeVisible()
    await expect(page.locator('.chart-container').first()).toBeVisible()
  })

  test('shows data point count for stock chart', async ({ page }) => {
    await expect(page.locator('p.data-count').first()).toContainText('Showing')
  })
})
