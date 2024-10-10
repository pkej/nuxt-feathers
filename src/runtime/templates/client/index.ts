import type { Templates } from '../types'
import { getServicesContents } from './services'

export const clientTemplates: Templates = [
  {
    filename: 'feathers/client/services.ts',
    getContents: getServicesContents,
    write: true,
  },
]
