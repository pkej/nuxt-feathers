import type { GetContentsDataType } from './types'
import { createResolver } from '@nuxt/kit'
import { globSync } from 'glob'
import { hash } from 'ohash'

export function getFeathersServerContents({ nuxt }: GetContentsDataType): string {
  const modules = globSync(createResolver(nuxt.options.serverDir).resolve('feathers/*.ts'))
  console.log('modules', modules)

  return `import type { NitroApp } from 'nitropack'
import { defineNitroPlugin } from 'nitropack/dist/runtime/plugin'
import type { Application } from '@gabortorma/nuxt-feathers'
${modules.map(module => `import _${hash(module)} from '${module}';`).join('\n')}
  
export default defineNitroPlugin((nitroApp: NitroApp) => {
  nitroApp.hooks.hook('feathers:beforeSetup', async (app: Application) => {
    ${modules.map(module => `app.configure(_${hash(module)})`).join('\n    ')}
  })
})`
}
