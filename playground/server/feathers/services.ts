// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html#configure-functions

import type { Application } from '@gabortorma/nuxt-feathers/declarations/server'
import { message } from '~/services/messages/messages'
import { user } from '~/services/users/users'

export default function (app: Application) {
  app.configure(message)
  app.configure(user)
}
