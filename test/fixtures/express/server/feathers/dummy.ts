import type { Application, HookContext, NextFunction } from 'nuxt-feathers/server'

export default function (app: Application) {
  app.hooks({
    setup: [
      async (context: HookContext, next: NextFunction) => {
        console.log('Running dummy setup hook')
        await context.app.service('messages').create([
          { text: 'Hello from the dummy setup hook!' },
          { text: 'Second hello from the dummy setup hook!' },
        ])
        await next()
      },
    ],
  })
}
