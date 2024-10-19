import type { Nuxt } from '@nuxt/schema'
import type { ModuleOptions as PiniaModuleOptions } from '@pinia/nuxt'
import { addImportsDir, addPlugin, addServerPlugin, addTemplate, createResolver, defineNuxtModule, hasNuxtModule, installModule } from '@nuxt/kit'
import defu from 'defu'
import { type AuthOptions, type PublicAuthOptions, setAuthDefaults } from './runtime/options/authentication'
import { type ServicesDir, type ServicesDirs, setDirectoriesDefaults } from './runtime/options/directories'
import { setTransportsDefaults, type TransportsOptions } from './runtime/options/transports'
import { setValidatorFormatsDefaults, type ValidatorOptions } from './runtime/options/validator'
import { addServicesImports } from './runtime/services'
import { clientTemplates } from './runtime/templates/client'
import { getServerTemplates } from './runtime/templates/server'

// Module options TypeScript interface definition
export interface ModuleOptions {
  transports?: TransportsOptions
  servicesDirs?: ServicesDir | ServicesDirs
  feathersDir?: string
  auth?: AuthOptions | boolean
  pinia?: boolean | Pick<PiniaModuleOptions, 'storesDirs'>
  validator?: ValidatorOptions
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
  const validatorsPath = resolver.resolve(nuxt.options.buildDir, './feathers/server/validators')

  nuxt.options.alias = defu(nuxt.options.alias, {
    'nuxt-feathers/server': serverPath,
    'nuxt-feathers/client': clientPath,
    'nuxt-feathers/validators': validatorsPath,
  })

  nuxt.hook('nitro:config', (nitroConfig) => {
    nitroConfig.alias = defu(nitroConfig.alias, {
      'nuxt-feathers/server': serverPath,
      'nuxt-feathers/validators': validatorsPath,
    })
  })
}

function setTsIncludes(options: ModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  const servicesDirs = (options.servicesDirs as ServicesDirs).map(dir => resolver.resolve(dir, '**/*.ts'))

  nuxt.options.typescript?.tsConfig?.include?.push(...servicesDirs)

  nuxt.hook('nitro:config', (nitroConfig) => {
    nitroConfig.typescript?.tsConfig?.include?.push(...servicesDirs)
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
      validator: {
        formats: [],
        extendDefaults: true,
      },
      feathersDir: resolver.resolve(nuxt.options.serverDir, './feathers'),
      servicesDirs: [],
      pinia: true,
      loadFeathersConfig: false,
      auth: true,
    }
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Prepare options
    setDirectoriesDefaults(options, nuxt)
    setTransportsDefaults(options.transports!, nuxt)
    setAuthDefaults(options, nuxt)
    setValidatorFormatsDefaults(options.validator!, nuxt)

    // Prepare tsconfig
    setAliases(nuxt)
    setTsIncludes(options, nuxt)

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
    await addServicesImports(options.servicesDirs as ServicesDirs)

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
