import type { Application } from 'nuxt-feathers/runtime/declarations/server'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('feathers:afterSetup', async (app: Application) => {
    // Message type automatically imported
    const res: Message = await app.service('messages').create({ text: 'Hello from Nitro Plugin!' })
    console.log('Message created:', res)
  })
})
