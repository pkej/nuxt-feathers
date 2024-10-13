type putData = [expr: any, content: string]

export function put(expr: any, content: string): string {
  return expr ? content : ''
}
export function puts(puts: putData[]): string {
  return puts.map(p => put(p[0], p[1])).filter(Boolean).join('\n')
}
