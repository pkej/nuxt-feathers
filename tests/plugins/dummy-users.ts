import { defineFeathersServerPlugin, type HookContext, type NextFunction } from 'nuxt-feathers/server'

export default defineFeathersServerPlugin((app) => {
  app.hooks({
    setup: [
      async (context: HookContext, next: NextFunction) => {
        console.log('Running dummy-users setup hook')
        await context.app.service('users').create([
          { userId: 'dummy', password: 'dummy' }, // workaround for this issue: https://github.com/marshallswain/feathers-pinia/pull/176
          { userId: 'test', password: '12345' },
        ])
        await next()
      },
    ],
  })
})
