import type { Application, TransportConnection } from '@feathersjs/feathers'

export type { Message, MessageData, MessagePatch, MessageQuery } from '../services/messages/messages.shared'
export type { User, UserData, UserPatch, UserQuery } from '../services/users/users.shared'

export interface Configuration {
  connection: TransportConnection<ServiceTypes>
}

export interface ServiceTypes {}

export type ClientApplication = Application<ServiceTypes, Configuration>
