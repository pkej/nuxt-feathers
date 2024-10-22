import type { Application as FeathersExpressApplication } from '@feathersjs/express'
import type { Application } from 'nuxt-feathers/server'
import { serveStatic } from '@feathersjs/express'

export default function express(app: Application): void {
  console.log('Load static plugin')
  void (app as any as FeathersExpressApplication).use('/', serveStatic('./public'))
}
