import type { NuxtTemplate } from 'nuxt/schema'
import type { ModuleOptions } from '../../module'

export type GetContentsType = Required<NuxtTemplate<ModuleOptions>>['getContents']

export type GetContentsDataType = Parameters<GetContentsType>[0]
