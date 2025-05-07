import type { HookContext, NextFunction } from 'nuxt-feathers/server'
import { defineFeathersServerPlugin } from 'nuxt-feathers/server'

export default defineFeathersServerPlugin((app) => {
  app.hooks({
    setup: [
      async (context: HookContext, next: NextFunction) => {
        console.log('Running dummy setup hook')
        await context.app.service('messages').create([
          { text: 'Hello from the dummy setup hook!' },
          { text: 'Second hello from the dummy setup hook!' },
        ])
        await context.app.service('users').create([
          { userId: 'test', password: '12345' },
        ])
        await context.app.service('mongos').create([
          { text: 'mongo' },
        ])
        await next()
      },
    ],
  })
})
