import type { GetContentsDataType } from '../types'
import { createResolver } from '@nuxt/kit'
import { scanDirExports } from 'unimport'

export async function getServicesContents({ nuxt, options }: GetContentsDataType): Promise<string> {
  const resolver = createResolver(nuxt.options.rootDir)
  const services = await scanDirExports(
    options.servicesDirs!.map(dir => resolver.resolve(dir)),
    {
      filePatterns: ['*/*.shared.ts'],
      fileFilter: file => /shared.ts$/.test(file),
      types: false,
    },
  )
  const modules = services.filter(({ name }) => /Client|default$/.test(name))
  console.log('client services modules', modules)

  return `import { defineNuxtPlugin } from 'nuxt/app'
import type { ClientApplication } from 'nuxt-feathers/client'
${modules.map(module => `import ${module.name === 'default' ? module.as : `{ ${module.as} }`} from '${module.from.replace('.ts', '')}'`).join('\n')}
  
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook('feathers:beforeCreate', async (client: ClientApplication) => {
    ${modules.map(module => `client.configure(${module.as})`).join('\n    ')}
  })
})`
}
