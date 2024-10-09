// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions

import type { ClientApplication } from '@gabortorma/nuxt-feathers/declarations/client'
import { messageClient } from './messages/messages.shared'
import { type User, userClient } from './users/users.shared'

export type { Message, MessageData, MessagePatch, MessageQuery } from './messages/messages.shared'
export type { User, UserData, UserPatch, UserQuery } from './users/users.shared'

export const services = function (app: ClientApplication) {
  app.configure(messageClient)
  app.configure(userClient)
}

// Add the user as an optional property to all params
declare module '@feathersjs/feathers' {
  interface Params {
    user?: User
  }
}
