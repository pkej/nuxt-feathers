// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions

import type { ClientApplication } from '../../src/runtime/declarations/client'
import { messageClient } from './messages/messages.shared'

export type { Message, MessageData, MessagePatch, MessageQuery } from './messages/messages.shared'

export const services = function (app: ClientApplication) {
  app.configure(messageClient)
}
