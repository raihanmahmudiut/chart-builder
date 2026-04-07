export function parseCSV(text: string): { data: Record<string, any>[]; columns: string[] } {
  const lines = text.split('\n').filter((line) => line.trim() && !line.startsWith('#'))
  if (lines.length === 0) return { data: [], columns: [] }

  const columns = lines[0].split(',').map((h) => h.trim())
  const data: Record<string, any>[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim())
    const row: Record<string, any> = {}
    columns.forEach((col, idx) => {
      const raw = values[idx] || ''
      const num = Number(raw)
      row[col] = raw !== '' && !Number.isNaN(num) ? num : raw
    })
    data.push(row)
  }

  return { data, columns }
}
