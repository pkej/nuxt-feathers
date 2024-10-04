import type { Application } from '../../../declarations'
import { feathers } from '@feathersjs/feathers'
import { bodyParser, koa as feathersKoa, rest, serveStatic } from '@feathersjs/koa'

export const app: Application = feathersKoa(feathers())

app.use(bodyParser())

app.use(serveStatic('./test/fixtures/public'))

app.configure(rest())
