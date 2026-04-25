import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/stocks')
  // Wait for all stock options to be populated from the API
  await expect(
    page.locator('#resource option[value="with-predictions"]'),
  ).toBeAttached()
})

test('stock dropdown is populated with fixture stocks', async ({ page }) => {
  const options = page.locator('#resource option')
  await expect(options).toHaveCount(4) // placeholder + 3 stocks
  await expect(options.nth(1)).toHaveText('Line Only Stock')
  await expect(options.nth(2)).toHaveText('OHLC Stock')
  await expect(options.nth(3)).toHaveText('Prediction Stock')
})

test('selecting a stock shows chart with data point count', async ({
  page,
}) => {
  await page.selectOption('#resource', 'line-only')
  await expect(page.locator('p.data-count')).toContainText(
    'Showing 20 data points',
  )
})

test('Candlestick button is disabled for line-only stock', async ({ page }) => {
  await page.selectOption('#resource', 'line-only')
  await expect(page.locator('p.data-count')).toContainText(
    'Showing 20 data points',
  )
  await expect(page.getByRole('button', { name: 'Candlestick' })).toBeDisabled()
})

test('Candlestick button is enabled for OHLC stock', async ({ page }) => {
  await page.selectOption('#resource', 'with-ohlc')
  await expect(page.locator('p.data-count')).toContainText(
    'Showing 20 data points',
  )
  await expect(page.getByRole('button', { name: 'Candlestick' })).toBeEnabled()
})

test('SVR legend is shown for prediction stock', async ({ page }) => {
  await page.selectOption('#resource', 'with-predictions')
  await expect(page.locator('p.data-count')).toContainText(
    'Showing 20 data points',
  )
  await expect(page.locator('.chart-legend')).toBeVisible()
  await expect(page.locator('.chart-legend')).toContainText('SVR Prediction')
})

test('page title updates to selected stock name', async ({ page }) => {
  await page.selectOption('#resource', 'line-only')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Line Only Stock',
  )
})
