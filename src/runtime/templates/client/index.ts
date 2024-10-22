import type { ModuleOptions } from '../../../module'
import type { Templates } from '../types'
import { getClientAuthenticationContents } from './authentication'
import { getClientContents } from './client'
import { getClientConnectionContents } from './connection'

export function getClientTemplates(options: ModuleOptions): Templates {
  const templates: Templates = [
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
  ]

  if (options.auth) {
    templates.push({
      filename: 'feathers/client/authentication.ts',
      getContents: getClientAuthenticationContents,
      write: true,
    },
    )
  }

  return templates
}
