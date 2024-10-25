import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({
  nuxt: {
    rootDir: fileURLToPath(new URL('../fixtures/pinia', import.meta.url)),
  },
})

test('index page', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading')).toHaveText('index')
})

test('auth', async ({ page, goto }) => {
  await goto('/login', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading')).toHaveText('login-page')
  await page.getByTestId('login-button').click()
  await page.waitForURL('**/user/test', { waitUntil: 'load' })
  await expect(page.getByTestId('user-id')).toHaveText('test')
})
