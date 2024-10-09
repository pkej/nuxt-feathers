import type { NuxtTemplate } from '@nuxt/schema'
import { getFeathersServerContents } from './feathers-server'
import { getFeathersServerServicesContents } from './feathers-server-services'

export const templates: Required<Pick<NuxtTemplate, 'filename' | 'getContents' | 'write'>>[] = [
  {
    filename: 'feathers-server.ts',
    getContents: getFeathersServerContents,
    write: true,
  },
  {
    filename: 'feathers-server-services.ts',
    getContents: getFeathersServerServicesContents,
    write: true,
  },
]
