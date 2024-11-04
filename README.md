# nuxt-feathers

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![code style][code-style-src]][code-style-href]

Feathers API integration for Nuxt

[🏀 Online playground](https://stackblitz.com/github/gabortorma/nuxt-feathers?file=playground%2Fapp.vue)

## Install

```bash
pnpm install add -D nuxt-feathers
```

## Usage

### Nuxt

Add the plugin to your `nuxt.config.js`:

```ts
export default defineNuxtConfig({
  modules: [
    'nuxt-feathers'
  ],

  feathers: {
    // your module options
  }
})
```

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@gabortorma/nuxt-feathers/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@gabortorma/nuxt-feathers
[npm-downloads-src]: https://img.shields.io/npm/dm/@gabortorma/nuxt-feathers.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@gabortorma/nuxt-feathers
[license-src]: https://img.shields.io/npm/l/@gabortorma/nuxt-feathers.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@gabortorma/nuxt-feathers
[code-style-src]: https://antfu.me/badge-code-style.svg
[code-style-href]: https://github.com/gabortorma/antfu-eslint-config
