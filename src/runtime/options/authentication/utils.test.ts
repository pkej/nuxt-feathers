import { describe, expect, it } from 'vitest'
import { capitalize } from './utils'

describe('capitalize', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('hello')).toBe('Hello')
  })

  it('should return an empty string if input is empty', () => {
    expect(capitalize('')).toBe('')
  })

  it('should not change the case of other letters', () => {
    expect(capitalize('hELLo')).toBe('HELLo')
  })

  it('should handle single character strings', () => {
    expect(capitalize('a')).toBe('A')
  })

  it('should handle strings with special characters', () => {
    expect(capitalize('!hello')).toBe('!hello')
  })
})
