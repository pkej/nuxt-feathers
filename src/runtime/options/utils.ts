import type { Import } from 'unimport'
import path from 'node:path'
import { camelCase } from 'change-case'
import { safeHash } from '../utils'

export function filterExports({ name, from, as }: Import) {
  return name === 'default'
    || new RegExp(`^${as}\w{0,2}`).test(camelCase(path.basename(from, path.extname(from))))
}

export interface ModuleImport extends Import {
  meta: {
    hash: string
    import: string
  }
}

export function setImportMeta(module: Import): ModuleImport {
  const _hash = `_${safeHash(module.from)}`
  const _import = module.name === 'default' ? _hash : `{ ${module.as} as ${_hash} }`
  const _from = module.from.replace(/.ts$/, '')

  module.meta = {
    hash: _hash,
    import: `import ${_import} from '${_from}'`,
  }
  return module as ModuleImport
}

export function setImportsMeta(modules: Import[]): ModuleImport[] {
  return modules.map(setImportMeta)
}
