import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions as PiniaModuleOptions } from '@pinia/nuxt'
import { addImportsDir, addPlugin, addServerPlugin, addTemplate, createResolver, defineNuxtModule, hasNuxtModule, installModule } from '@nuxt/kit'
import defu from 'defu'
import { type AuthOptions, type PublicAuthOptions, setAuthDefaults } from './runtime/options/authentication'
import { setTransportsDefaults, type TransportsOptions } from './runtime/options/transports'
import { addServicesImports } from './runtime/services'
import { clientTemplates } from './runtime/templates/client'
import { getServerTemplates } from './runtime/templates/server'

// Module options TypeScript interface definition
export interface ModuleOptions {
  transports?: TransportsOptions
  servicesDir?: string
  feathersDir?: string
  auth?: AuthOptions | boolean
  pinia?: boolean | Pick<PiniaModuleOptions, 'storesDirs'>
  loadFeathersConfig?: boolean
}

declare module '@nuxt/schema' {
  interface NuxtConfig {
    feathers?: ModuleOptions
  }

  interface RuntimeConfig {
    auth: AuthOptions | boolean
  }

  interface PublicRuntimeConfig {
    transports: TransportsOptions
    auth: PublicAuthOptions | undefined
  }
}

function setAliases(nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  const serverPath = resolver.resolve(nuxt.options.buildDir, './feathers/server/declarations')
  const clientPath = resolver.resolve('./runtime/declarations/client')

  nuxt.options.alias = defu(nuxt.options.alias, {
    'nuxt-feathers/server': serverPath,
    'nuxt-feathers/client': clientPath,
  })

  nuxt.hook('nitro:config', (nitroConfig) => {
    nitroConfig.alias = defu(nitroConfig.alias, {
      'nuxt-feathers/server': serverPath,
    })
  })
}

function setTsIncludes(nuxt: Nuxt, options: ModuleOptions) {
  const resolver = createResolver(import.meta.url)
  const servicesPath = resolver.resolve(nuxt.options.rootDir, options.servicesDir!, '**/*.ts')

  nuxt.options.typescript?.tsConfig?.include?.push(servicesPath)

  nuxt.hook('nitro:config', (nitroConfig) => {
    nitroConfig.typescript?.tsConfig?.include?.push(servicesPath)
  })
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
      loadFeathersConfig: false,
      auth: true,
    }
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Prepare the options
    setTransportsDefaults(options.transports!, nuxt)
    setAuthDefaults(options, nuxt)
    setAliases(nuxt)
    setTsIncludes(nuxt, options)

    if (options.transports!.websocket) {
      nuxt.hook('nitro:config', (nitroConfig) => {
        nitroConfig.experimental = defu(nitroConfig.experimental, { websocket: true })
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
      if (options.auth)
        addPlugin({ order: 1, src: resolver.resolve(plugins, 'feathers-auth') })
    }
    await addServicesImports(resolver.resolve(nuxt.options.rootDir, options.servicesDir!))

    for (const clientTemplate of clientTemplates) {
      addTemplate({ ...clientTemplate, options })
      addPlugin(resolver.resolve(nuxt.options.buildDir, clientTemplate.filename))
    }
    for (const serverTemplate of getServerTemplates(options)) {
      addTemplate({ ...serverTemplate, options })
      if (serverTemplate.plugin)
        addServerPlugin(resolver.resolve(nuxt.options.buildDir, serverTemplate.filename))
    }
  },
})
