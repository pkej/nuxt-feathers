import type { Nuxt } from '@nuxt/schema'
import defu from 'defu'

export interface CommonTransportOptions {
  path?: string
}

export type RestTransportOptions = CommonTransportOptions & {
  framework?: 'koa' | 'express'
}

export type WebsocketTransportOptions = CommonTransportOptions & {
  connectTimeout?: number
}

export type TransportsOptions = {
  rest: RestTransportOptions | true
  websocket?: WebsocketTransportOptions | boolean
} | {
  rest?: RestTransportOptions | boolean
  websocket: WebsocketTransportOptions | true
} | {
  rest?: never
  websocket: false
} | {
  rest: false
  websocket?: never
}

export const websocketDefaultOptions: WebsocketTransportOptions = {
  path: '/socket.io',
  connectTimeout: 45000, // default settings for socket.io
}

export const restDefaultOptions: RestTransportOptions = {
  path: '/feathers',
  framework: 'koa',
}

export function setTransportsDefaults(transports: TransportsOptions, nuxt: Nuxt) {
  if (transports.rest === true || transports.rest === undefined) {
    if (nuxt.options.ssr || transports.websocket === false)
      transports.rest = restDefaultOptions
    else
      transports.rest = false
  }
  else if (transports.rest !== false) {
    transports.rest = defu(transports.rest, restDefaultOptions)
  }

  if (transports.websocket === true || transports.websocket === undefined) {
    transports.websocket = websocketDefaultOptions
  }
  else if (transports.websocket !== false) {
    transports.websocket = defu(transports.websocket, websocketDefaultOptions)
  }

  nuxt.options.runtimeConfig.public.transports = transports
}
