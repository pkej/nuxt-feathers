import type { Templates } from '../types'
import { getAuthContents } from './authentication'
import { getServerDeclarationContents } from './declarations'
import { getServerContents } from './server'

export const serverTemplates: Templates = [
  {
    filename: 'feathers/server/server.ts',
    getContents: getServerContents,
    write: true,
    plugin: true,
  },
  {
    filename: 'feathers/server/authentication.ts',
    getContents: getAuthContents,
    write: true,
  },
  {
    filename: 'feathers/server/declarations.ts',
    getContents: getServerDeclarationContents,
    write: true,
  },
]
