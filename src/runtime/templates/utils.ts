import type { Import } from 'unimport'
import path from 'node:path'
import { hash } from 'ohash'

type putData = [expr: any, content: string, def?: string]

export function put(expr: any, content: string, def: string = ''): string {
  return expr ? content : def
}
export function puts(puts: putData[]): string {
  return puts.map(p => put(p[0], p[1], p?.[2])).filter(Boolean).join('\n')
}

export function filterExports({ name, from, as }: Import) {
  return name === 'default'
    || new RegExp(`^${as}\w{0,2}`).test(path.basename(from, path.extname(from)))
}

export interface ModuleImport extends Import {
  meta: {
    hash: string
    import: string
  }
}

export function setImportMeta(module: Import): ModuleImport {
  const _hash = `_${hash(module.from)}`
  const _import = module.name === 'default' ? _hash : `{ ${module.as} as ${_hash} }`

  module.meta = {
    hash: _hash,
    import: `import ${_import} from '${module.from.replace('.ts', '')}'`,
  }
  return module as ModuleImport
}

export function setImportsMeta(modules: Import[]): ModuleImport[] {
  return modules.map(setImportMeta)
}
