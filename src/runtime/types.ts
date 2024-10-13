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
  rest: RestTransportOptions
  websocket?: WebsocketTransportOptions | false
} | {
  rest?: RestTransportOptions | false
  websocket: WebsocketTransportOptions
} | {
  rest?: never
  websocket: false
} | {
  rest: false
  websocket?: never
}
