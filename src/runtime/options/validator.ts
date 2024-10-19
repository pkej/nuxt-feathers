import type { Nuxt } from '@nuxt/schema'
import type { FormatName } from 'ajv-formats'

export type ValidatorFormatsOptions = Array<FormatName>

export interface ValidatorOptions {
  formats: ValidatorFormatsOptions
  extendDefaults?: boolean
}

export const validatorFormatsDefaultOptions: ValidatorFormatsOptions = [
  'date-time',
  'time',
  'date',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'uri',
  'uri-reference',
  'uuid',
  'uri-template',
  'json-pointer',
  'relative-json-pointer',
  'regex',
]

export function setValidatorFormatsDefaults(validator: ValidatorOptions, nuxt: Nuxt) {
  if (validator.formats.length) {
    validator.formats = Array.from(
      new Set(validator.formats.concat(validator.extendDefaults ? validatorFormatsDefaultOptions : [])),
    )
  }
  else {
    validator.formats = validatorFormatsDefaultOptions
  }
}
