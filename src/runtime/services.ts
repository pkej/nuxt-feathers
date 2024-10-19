import { addImports, addServerImports } from '@nuxt/kit'
import { scanDirExports } from 'unimport'

export async function addServicesImports(dirs: string[]) {
  const exports = await scanDirExports(dirs, {
    filePatterns: ['*/*.schema.ts'],
  })
  const typeExports = exports.filter(({ type }) => type)
  console.log('Services typeExports', typeExports.map(({ as }) => as))
  addImports(typeExports)
  addServerImports(typeExports)
}
