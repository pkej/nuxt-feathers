import { fileURLToPath } from 'node:url'
import { createPage, setup, url } from '@nuxt/test-utils/e2e'
import { describe, expect, it } from 'vitest'

describe('app', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/koa', import.meta.url)),
  })

  it('test', async () => {
    const page = await createPage()
    await page.goto(url('/'), { waitUntil: 'hydration' })
    const div = await page.textContent('div')
    expect(div).toContain('index')
  })
})
