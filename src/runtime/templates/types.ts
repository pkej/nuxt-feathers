import type { NuxtTemplate } from 'nuxt/schema'
import type { ModuleOptions } from '../../module'

export type GetContentsType = Required<NuxtTemplate<ModuleOptions>>['getContents']

export type GetContentsDataType = Parameters<GetContentsType>[0]

export type Templates = Array<Required<Pick<NuxtTemplate, 'filename' | 'getContents' | 'write'>> & {
  plugin?: boolean
}
>
