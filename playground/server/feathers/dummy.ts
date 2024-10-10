import type { Application, HookContext, NextFunction } from 'nuxt-feathers/runtime/declarations/server'

export default function dummy(app: Application) {
  app.hooks({
    setup: [
      async (context: HookContext, next: NextFunction) => {
        console.log('Running dummy setup hook')
        await context.app.service('messages').create([
          { text: 'Hello from the dummy setup hook!' },
          { text: 'Second hello from the dummy setup hook!' },
        ])
        await context.app.service('users').create([
          { userId: 'dummy', password: 'dummy' }, // workaround for this issue: https://github.com/marshallswain/feathers-pinia/pull/176
          { userId: 'test', password: '12345' },
        ])
        await next()
      },
    ],
  })
}
