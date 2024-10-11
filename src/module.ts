import type { ModuleOptions as PiniaModuleOptions } from '@pinia/nuxt'
import { readFileSync } from 'node:fs'
import process from 'node:process'
import { addImports, addImportsDir, addPlugin, addServerPlugin, addTemplate, createResolver, defineNuxtModule, hasNuxtModule, installModule } from '@nuxt/kit'
import defu from 'defu'
import { addServicesImports } from './runtime/services'
import { clientTemplates } from './runtime/templates/client'
import { serverTemplates } from './runtime/templates/server'

export * from './runtime/declarations/shared'

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
  /* rest?: boolean
  websocket?: boolean
  authentication?: boolean */
  servicesDir?: string
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
    servicesDir: 'services',
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
    const services = resolver.resolve(nuxt.options.srcDir, options.servicesDir || '')

    if (options.pinia) {
      if (!hasNuxtModule('@pinia/nuxt')) {
        if (options.pinia === true)
          await installModule('@pinia/nuxt')
        else if (typeof options.pinia === 'object')
          await installModule('@pinia/nuxt', options.pinia)
      }
      addImportsDir(resolver.resolve('./runtime/composables/*.ts'))
      addImportsDir(resolver.resolve('./runtime/stores/*.ts'))

      nuxt.hook('vite:extendConfig', (config) => {
        config.optimizeDeps?.include?.push('feathers-pinia')
      })
      const plugins = resolver.resolve('./runtime/plugins')
      addPlugin({ order: 0, src: resolver.resolve(plugins, 'feathers-client') })
      addPlugin({ order: 1, src: resolver.resolve(plugins, 'feathers-auth') })
    }
    await addServicesImports(services)

    // const services = resolver.resolve(nuxt.options.srcDir, options.servicesDir || '', '*/*.shared.ts')
    // addImportsDir(services)
    /* const declarations = resolver.resolve('./runtime/declarations')
    addImports({ from: resolver.resolve(declarations, 'client'), name: 'ClientApplication' })
    addServerImports([{ from: resolver.resolve(declarations, 'server'), name: 'Application' }]) */
    // const exports = await scanDirExports(services, { filePatterns: ['*/*.shared.ts'] })
    /* const typeExports = exports.filter(({ type }) => type)
      console.log('typeExports', typeExports)
      addImports(typeExports) */

    for (const clientTemplate of clientTemplates) {
      addTemplate({ ...clientTemplate, options })
      addPlugin(resolver.resolve(nuxt.options.buildDir, clientTemplate.filename))
    }
    for (const serverTemplate of serverTemplates) {
      addTemplate({ ...serverTemplate, options })
      addServerPlugin(resolver.resolve(nuxt.options.buildDir, serverTemplate.filename))
    }

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addServerPlugin(resolver.resolve('./runtime/server/plugins/feathers/index'))
  },
})
