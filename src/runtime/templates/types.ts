import type { NuxtTemplate } from 'nuxt/schema'
import type { ModuleConfig } from '../../module'

export type GetContentsType = Required<NuxtTemplate<ModuleConfig>>['getContents']

export type GetContentsDataType = Parameters<GetContentsType>[0]

export type Templates = Array<Required<Pick<NuxtTemplate, 'filename' | 'getContents' | 'write'>> & {
  plugin?: boolean
}>
