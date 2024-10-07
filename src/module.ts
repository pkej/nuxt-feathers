import type { ModuleOptions as PiniaModuleOptions } from '@pinia/nuxt'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { addImports, addServerImports, addServerPlugin, addTemplate, createResolver, defineNuxtModule, hasNuxtModule, installModule } from '@nuxt/kit'
import defu from 'defu'
import { getFeathersContents } from './runtime/templates/feathers'

export * from './runtime/declarations'

export interface FeathersAppInfo {
  transports?: Array<'rest' | 'websockets'>
  // The HTTP framework used
  framework?: 'koa' | false
  // The main schema definition format
  schema?: 'typebox' | 'json' | false
}
// Module options TypeScript interface definition
export interface ModuleOptions extends FeathersAppInfo {
  // A list of all chosen transports
  pinia?: boolean | Pick<PiniaModuleOptions, 'storesDirs'>
}

declare module '@nuxt/schema' {

  interface NuxtConfig {
    feathers?: ModuleOptions
  }

  interface RuntimeConfig {
    feathers: ModuleOptions
  }
}

interface AppPackageJson {
  feathers?: FeathersAppInfo
}

const pkgJson = readFileSync(createResolver(process.cwd()).resolve('./package.json'), 'utf-8')
const pkg = JSON.parse(pkgJson) as AppPackageJson
// console.log(pkg.feathers)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-feathers',
    configKey: 'feathers',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: {
    framework: pkg.feathers?.framework ?? 'koa',
    schema: pkg.feathers?.schema ?? 'typebox',
    pinia: true,
  },
  async setup(options, nuxt) {
    options.transports = options.transports || pkg.feathers?.transports || ['rest', 'websockets']
    nuxt.options.runtimeConfig.feathers = options
    console.log('options', nuxt.options.runtimeConfig.feathers)

    if (options.transports.includes('websockets')) {
      nuxt.hook('nitro:config', (nitroConfig) => {
        nitroConfig.experimental = defu(nitroConfig.experimental, { websocket: true })
      })
    }

    const resolver = createResolver(import.meta.url)

    if (options.pinia) {
      if (!hasNuxtModule('@pinia/nuxt')) {
        if (options.pinia === true)
          await installModule('@pinia/nuxt')
        else if (typeof options.pinia === 'object')
          await installModule('@pinia/nuxt', options.pinia)
      }
      if (!hasNuxtModule('nuxt-feathers-pinia')) {
        await installModule('nuxt-feathers-pinia')
      }

      nuxt.hook('vite:extendConfig', (config) => {
        config.optimizeDeps?.include?.push('feathers-pinia')
      })

      const composables = resolver.resolve('./runtime/composables/index')
      addImports({ from: composables, name: 'useFeathers' })
      const stores = resolver.resolve('./runtime/stores/index')
      addImports({ from: stores, name: 'useAuthStore' })

      /* addTemplate({
        filename: 'dist/server/feathers.mjs',
        getContents: getFeathersContents,
        write: true,
      }) */
    }

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addServerPlugin(resolver.resolve('./runtime/server/plugins/feathers/index'))
  },
})
