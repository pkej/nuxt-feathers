import antfu from '@gabortorma/antfu-eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(antfu({
  rules: {
    'unused-imports/no-unused-vars': 'off',
  },
}))