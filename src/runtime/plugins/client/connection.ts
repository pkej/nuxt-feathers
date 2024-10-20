import type { ClientApplication } from '../../declarations/client'
import type { RestTransportOptions } from '../../options/transports'
import { useRuntimeConfig } from '#app'
import rest from '@feathersjs/rest-client'
import socketioClient from '@feathersjs/socketio-client'
import { OFetch } from 'feathers-pinia'
import { $fetch } from 'ofetch'
import { io } from 'socket.io-client'

export function connection(client: ClientApplication) {
  const { transports } = useRuntimeConfig().public

  const connection = (import.meta.server || !transports?.websocket)
    ? rest((transports.rest as RestTransportOptions).path).fetch($fetch, OFetch)
    : socketioClient(io({ transports: ['websocket'] }))

  client.configure(connection)
  client.set('connection', connection)
}
