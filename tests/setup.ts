import { vi } from 'vitest'

const store = new Map<string, string>()
const localStorageMock = {
  getItem: vi.fn((key: string) => store.get(key) ?? null),
  setItem: vi.fn((key: string, value: string) => {
    store.set(key, value)
  }),
  removeItem: vi.fn((key: string) => {
    store.delete(key)
  }),
  clear: vi.fn(() => {
    store.clear()
  }),
  get length() {
    return store.size
  },
  key: vi.fn((index: number) => [...store.keys()][index] ?? null),
}

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: vi.fn(() => 'test-uuid-' + Math.random().toString(36).slice(2, 9)),
  },
})
