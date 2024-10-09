// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions

import type { ClientApplication } from '../declarations/client'
import { messageClient } from './messages/messages.shared'
import { userClient } from './users/users.shared'

export const services = function (app: ClientApplication) {
  app.configure(messageClient)
  app.configure(userClient)
}
