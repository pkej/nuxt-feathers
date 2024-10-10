import type { Templates } from '../types'
import { getServerContents } from './server'
import { getServicesContents } from './services'

export const serverTemplates: Templates = [
  {
    filename: 'feathers/server/server.ts',
    getContents: getServerContents,
    write: true,
  },
  {
    filename: 'feathers/server/services.ts',
    getContents: getServicesContents,
    write: true,
  },
]
