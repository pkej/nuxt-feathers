import { fileURLToPath } from 'node:url'
import { expect, test } from '@nuxt/test-utils/playwright'

test.use({
  nuxt: {
    rootDir: fileURLToPath(new URL('../fixtures/client', import.meta.url)),
    nuxtConfig: {
      feathers: {
        auth: false,
        client: {
          pinia: false,
        },
      },
    },
  },
})

test('index page', async ({ page, goto }) => {
  await goto('/', { waitUntil: 'hydration' })
  await expect(page.getByRole('heading')).toHaveText('index')
})

test('messages', async ({ page, goto }) => {
  await goto('/messages', { waitUntil: 'hydration' })
  //  await page.waitForSelector('[data-testid="message-0"]')
  await expect(page.getByTestId('message-0')).toContainText('Hello from the dummy setup hook!')
})

test('plugin', async ({ page, goto }) => {
  const consolePromise = page.waitForEvent('console')
  await goto('/', { waitUntil: 'hydration' })
  expect((await consolePromise).text()).toEqual('feathers-client-plugin 1')
})

test('plugins', async ({ page, goto }) => {
  const waitingForPlugin1 = new Promise(resolve => page.on('console', msg => (msg.text() === 'feathers-client-plugin 1') && resolve(true)))
  const waitingForPlugin2 = new Promise(resolve => page.on('console', msg => (msg.text() === 'feathers-client-plugin 2') && resolve(msg.text())))
  await goto('/', { waitUntil: 'hydration' })

  expect(await waitingForPlugin1).toBeTruthy()
  expect(await waitingForPlugin2).toBeTruthy()
})

test('plugin1', async ({ page, goto }) => {
  const plugin1: Promise<string> = new Promise(resolve => page.on('console', msg => (msg.text() === 'feathers-client-plugin 1') && resolve(msg.text())))
  await goto('/', { waitUntil: 'hydration' })

  expect(await plugin1).toEqual('feathers-client-plugin 1')
})

test('plugin2', async ({ page, goto }) => {
  const plugin2: Promise<string> = new Promise(resolve => page.on('console', msg => (msg.text() === 'feathers-client-plugin 2') && resolve(msg.text())))
  await goto('/', { waitUntil: 'hydration' })

  expect(await plugin2).toEqual('feathers-client-plugin 2')
})
