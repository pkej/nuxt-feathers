import type { HookContext, NextFunction } from 'nuxt-feathers/server'
import { defineFeathersServerPlugin } from 'nuxt-feathers/server'

export default defineFeathersServerPlugin((app) => {
  app.hooks({
    setup: [
      async (context: HookContext, next: NextFunction) => {
        console.log('Running dummy-mongos setup hook')
        await context.app.service('mongos').create([
          { text: 'mongo' },
        ])
        await next()
      },
    ],
  })
})
