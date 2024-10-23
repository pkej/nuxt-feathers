import type { Application as FeathersExpressApplication } from '@feathersjs/express'
import type { Application as FeathersKoaApplication } from '@feathersjs/koa'
import { serveStatic as expressServeStatic } from '@feathersjs/express'
import { serveStatic as koaServeStatic } from '@feathersjs/koa'
import { defineFeathersServerPlugin } from 'nuxt-feathers/server'

export default defineFeathersServerPlugin((app) => {
  console.log('Load static plugin')
  const framework = app.get('framework')
  if (framework === 'koa')
    (app as any as FeathersKoaApplication).use(koaServeStatic('./public'))
  if (framework === 'express')
    (app as any as FeathersExpressApplication).use(expressServeStatic('./public'))
})
