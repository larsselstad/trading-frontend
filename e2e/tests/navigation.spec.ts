import { expect, test } from '@playwright/test'

test('redirects / to /stocks', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/stocks')
})

test('Stocks tab is active on /stocks', async ({ page }) => {
  await page.goto('/stocks')
  await expect(page.getByRole('link', { name: 'Stocks' })).toHaveClass(
    /tab-active/,
  )
})

test('can navigate to Experiments tab and back', async ({ page }) => {
  await page.goto('/stocks')
  await page.getByRole('link', { name: 'Experiments' }).click()
  await expect(page).toHaveURL('/experiments')
  await expect(page.getByRole('link', { name: 'Experiments' })).toHaveClass(
    /tab-active/,
  )

  await page.getByRole('link', { name: 'Stocks' }).click()
  await expect(page).toHaveURL('/stocks')
  await expect(page.getByRole('link', { name: 'Stocks' })).toHaveClass(
    /tab-active/,
  )
})
