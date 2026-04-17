import { describe, it, expect } from 'vitest'
import { parseCSV } from '~/utils/csv'

describe('parseCSV', () => {
  it('parses a simple CSV with headers', () => {
    const csv = `name,age,score
Alice,30,95
Bob,25,88`
    const { data, columns } = parseCSV(csv)

    expect(columns).toEqual(['name', 'age', 'score'])
    expect(data).toHaveLength(2)
    expect(data[0]).toEqual({ name: 'Alice', age: 30, score: 95 })
    expect(data[1]).toEqual({ name: 'Bob', age: 25, score: 88 })
  })

  it('auto-converts numeric values', () => {
    const csv = `label,value
Revenue,45000
Growth,3.5`
    const { data } = parseCSV(csv)

    expect(data[0].value).toBe(45000)
    expect(typeof data[0].value).toBe('number')
    expect(data[1].value).toBe(3.5)
  })

  it('keeps non-numeric values as strings', () => {
    const csv = `date,category
2024-01,Sales
2024-02,Marketing`
    const { data } = parseCSV(csv)

    expect(data[0].date).toBe('2024-01')
    expect(typeof data[0].date).toBe('string')
    expect(data[0].category).toBe('Sales')
  })

  it('skips comment lines starting with #', () => {
    const csv = `# This is a comment
name,value
# Another comment
Alice,100`
    const { data, columns } = parseCSV(csv)

    expect(columns).toEqual(['name', 'value'])
    expect(data).toHaveLength(1)
    expect(data[0]).toEqual({ name: 'Alice', value: 100 })
  })

  it('skips empty lines', () => {
    const csv = `name,value

Alice,100

Bob,200
`
    const { data } = parseCSV(csv)
    expect(data).toHaveLength(2)
  })

  it('returns empty result for empty input', () => {
    const { data, columns } = parseCSV('')
    expect(data).toEqual([])
    expect(columns).toEqual([])
  })

  it('returns empty data for header-only CSV', () => {
    const { data, columns } = parseCSV('name,value')
    expect(columns).toEqual(['name', 'value'])
    expect(data).toEqual([])
  })

  it('trims whitespace from headers and values', () => {
    const csv = ` name , value 
 Alice , 100 `
    const { data, columns } = parseCSV(csv)

    expect(columns).toEqual(['name', 'value'])
    expect(data[0].name).toBe('Alice')
    expect(data[0].value).toBe(100)
  })

  it('handles missing values at end of row', () => {
    const csv = `a,b,c
1,2`
    const { data } = parseCSV(csv)
    expect(data[0]).toEqual({ a: 1, b: 2, c: '' })
  })
})
