import type { GetContentsDataType } from '../types'
import { createResolver } from '@nuxt/kit'
import { globSync } from 'glob'
import { hash } from 'ohash'

export function getServicesContents({ nuxt, options }: GetContentsDataType): string {
  const path = createResolver(nuxt.options.srcDir).resolve(`${options.servicesDir}/*/*.shared.ts`)
  console.log(path)
  const modules = globSync(path)
  console.log('modules', modules)

  return `import { defineNuxtPlugin } from 'nuxt/app'
import type { ClientApplication } from 'nuxt-feathers/runtime/declarations/client'
${modules.map(module => `import _${hash(module)} from '${module.replace('.ts', '')}';`).join('\n')}
  
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook('feathers:beforeCreate', async (client: ClientApplication) => {
    ${modules.map(module => `client.configure(_${hash(module)})`).join('\n    ')}
  })
})`
}
