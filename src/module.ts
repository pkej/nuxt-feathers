import type { ModuleOptions as PiniaModuleOptions } from '@pinia/nuxt'
import { addImportsDir, addPlugin, addServerPlugin, addTemplate, createResolver, defineNuxtModule, hasNuxtModule, installModule } from '@nuxt/kit'
import defu from 'defu'
import { addServicesImports } from './runtime/services'
import { clientTemplates } from './runtime/templates/client'
import { serverTemplates } from './runtime/templates/server'
import { setTransportsDefaults, type TransportsOptions } from './runtime/transports'

// Module options TypeScript interface definition
export interface ModuleOptions {
  // authentication?: boolean
  transports?: TransportsOptions
  servicesDir?: string
  feathersDir?: string
  pinia?: boolean | Pick<PiniaModuleOptions, 'storesDirs'>
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    feathers?: ModuleOptions
  }

  interface PublicRuntimeConfig {
    transports: TransportsOptions
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'nuxt-feathers',
    configKey: 'feathers',
    compatibility: {
      nuxt: '^3.0.0',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: (nuxt) => {
    const resolver = createResolver(import.meta.url)
    return {
      transports: {
        websocket: true,
      },
      feathersDir: resolver.resolve(nuxt.options.serverDir, './feathers'),
      servicesDir: resolver.resolve(nuxt.options.rootDir, './services'),
      pinia: true,
    }
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Prepare the options
    setTransportsDefaults(options.transports!, nuxt.options.ssr)
    nuxt.options.runtimeConfig.public.transports = options.transports!
    console.log('options', options)

    nuxt.options.alias = defu(nuxt.options.alias, {
      'nuxt-feathers/server': resolver.resolve(nuxt.options.buildDir, './feathers/server/declarations'),
      'nuxt-feathers/client': resolver.resolve('./runtime/declarations/client'),
    })
    nuxt.options.typescript?.tsConfig?.include?.push(resolver.resolve(nuxt.options.rootDir, options.servicesDir!, '**/*.ts'))
    if (options.transports!.websocket) {
      nuxt.hook('nitro:config', (nitroConfig) => {
        nitroConfig.experimental = defu(nitroConfig.experimental, { websocket: true })
        nitroConfig.alias = defu(nitroConfig.alias, {
          'nuxt-feathers/server': resolver.resolve(nuxt.options.buildDir, './feathers/server/declarations'),
        })
        nitroConfig.typescript?.tsConfig?.include?.push(resolver.resolve(nuxt.options.rootDir, options.servicesDir!, '**/*.ts'))
      })
    }

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
    await addServicesImports(resolver.resolve(nuxt.options.rootDir, options.servicesDir!))

    for (const clientTemplate of clientTemplates) {
      addTemplate({ ...clientTemplate, options })
      addPlugin(resolver.resolve(nuxt.options.buildDir, clientTemplate.filename))
    }
    for (const serverTemplate of serverTemplates) {
      addTemplate({ ...serverTemplate, options })
      if (serverTemplate.plugin)
        addServerPlugin(resolver.resolve(nuxt.options.buildDir, serverTemplate.filename))
    }
  },
})
