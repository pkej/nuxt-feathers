// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions

import type { Application } from '../../../../../src/runtime/declarations/server'
import { message } from '../../../../services/messages/messages'

export default function (app: Application) {
  app.configure(message)
}
