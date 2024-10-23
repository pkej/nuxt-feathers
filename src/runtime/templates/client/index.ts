import type { ModuleOptions } from '../../../module'
import type { Templates } from '../types'
import { getClientAuthenticationContents } from './authentication'
import { getClientContents } from './client'
import { getClientConnectionContents } from './connection'
import { getClientPluginContents } from './plugin'

export function getClientTemplates(options: ModuleOptions): Templates {
  const clientTemplates: Templates = [
    {
      filename: 'feathers/client/client.ts',
      getContents: getClientContents,
      write: true,
    },
    {
      filename: 'feathers/client/connection.ts',
      getContents: getClientConnectionContents,
      write: true,
    },
    {
      filename: 'feathers/client/plugin.ts',
      getContents: getClientPluginContents,
      write: true,
    },
  ]

  if (options.auth) {
    clientTemplates.push({
      filename: 'feathers/client/authentication.ts',
      getContents: getClientAuthenticationContents,
      write: true,
    },
    )
  }

  return clientTemplates
}
