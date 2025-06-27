import { test, expect } from '@playwright/test'

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/')
  
  // Check if the page loads
  await expect(page).toHaveTitle(/CreatorSwap/)
  
  // Check if main heading is present
  await expect(page.locator('h1')).toBeVisible()
})

test('navigation works', async ({ page }) => {
  await page.goto('/')
  
  // Test navigation elements are present
  const nav = page.locator('nav')
  await expect(nav).toBeVisible()
})

test('wallet connection button is present', async ({ page }) => {
  await page.goto('/')
  
  // Look for wallet connection related elements
  const connectButton = page.getByRole('button', { name: /connect/i })
  await expect(connectButton).toBeVisible()
})