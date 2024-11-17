import type { ResolvedOptions } from '../../../runtime/options'
import type { Templates } from '../types'
import { getAuthContents } from './authentication'
import { getServerPluginContents } from './plugin'
import { getServerContents } from './server'
import { getServerValidatorContents } from './validators'

export function getServerTemplates(options: ResolvedOptions): Templates {
  const serverTemplates: Templates = [
    {
      filename: 'feathers/server/server.ts',
      getContents: getServerContents(options),
      write: true,
    },
    {
      filename: 'feathers/server/plugin.ts',
      getContents: getServerPluginContents(options),
      write: true,
    },
    {
      filename: 'feathers/server/validators.ts',
      getContents: getServerValidatorContents(options),
      write: true,
    },
  ]

  if (options.auth) {
    serverTemplates.push({
      filename: 'feathers/server/authentication.ts',
      getContents: getAuthContents(options),
      write: true,
    })
  }

  return serverTemplates
}
