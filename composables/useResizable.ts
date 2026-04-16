import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface ResizableOptions {
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  onResize?: (dimensions: { width: number; height: number }) => void
  onResizeStart?: () => void
  onResizeEnd?: (dimensions: { width: number; height: number }) => void
}

type HandlePosition = 'se' | 'sw' | 'ne' | 'nw' | 'n' | 's' | 'e' | 'w'

export function useResizable(elementRef: Ref<HTMLElement | null>, options: ResizableOptions = {}) {
  const isResizing = ref(false)
  const handles: Array<{ element: HTMLElement; position: HandlePosition }> = []

  let originalWidth = 0
  let originalHeight = 0
  let startX = 0
  let startY = 0
  let activeHandle: HandlePosition | null = null

  const minWidth = options.minWidth || 50
  const minHeight = options.minHeight || 50
  const maxWidth = options.maxWidth || Infinity
  const maxHeight = options.maxHeight || Infinity

  const createHandles = () => {
    const element = elementRef.value
    if (!element) return

    const positions: HandlePosition[] = ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w']

    positions.forEach((position) => {
      const handle = document.createElement('div')
      handle.className = `resize-handle resize-handle-${position}`
      handle.style.position = 'absolute'
      handle.style.width = '10px'
      handle.style.height = '10px'
      handle.style.backgroundColor = 'transparent'
      handle.style.zIndex = '10'

      // Position the handle
      switch (position) {
        case 'se':
          handle.style.bottom = '0'
          handle.style.right = '0'
          handle.style.cursor = 'nwse-resize'
          break
        case 'sw':
          handle.style.bottom = '0'
          handle.style.left = '0'
          handle.style.cursor = 'nesw-resize'
          break
        case 'ne':
          handle.style.top = '0'
          handle.style.right = '0'
          handle.style.cursor = 'nesw-resize'
          break
        case 'nw':
          handle.style.top = '0'
          handle.style.left = '0'
          handle.style.cursor = 'nwse-resize'
          break
        case 'n':
          handle.style.top = '0'
          handle.style.left = '50%'
          handle.style.transform = 'translateX(-50%)'
          handle.style.cursor = 'ns-resize'
          break
        case 's':
          handle.style.bottom = '0'
          handle.style.left = '50%'
          handle.style.transform = 'translateX(-50%)'
          handle.style.cursor = 'ns-resize'
          break
        case 'e':
          handle.style.right = '0'
          handle.style.top = '50%'
          handle.style.transform = 'translateY(-50%)'
          handle.style.cursor = 'ew-resize'
          break
        case 'w':
          handle.style.left = '0'
          handle.style.top = '50%'
          handle.style.transform = 'translateY(-50%)'
          handle.style.cursor = 'ew-resize'
          break
      }

      handle.addEventListener('mousedown', (e) => handleResizeStart(e, position))
      element.appendChild(handle)
      handles.push({ element: handle, position })
    })
  }

  const handleResizeStart = (e: MouseEvent, position: HandlePosition) => {
    e.preventDefault()
    e.stopPropagation()

    const element = elementRef.value
    if (!element) return

    isResizing.value = true
    const rect = element.getBoundingClientRect()
    originalWidth = rect.width
    originalHeight = rect.height
    startX = e.clientX
    startY = e.clientY
    activeHandle = position

    window.addEventListener('mousemove', handleResize)
    window.addEventListener('mouseup', handleResizeEnd)

    document.body.classList.add('resizing')

    if (options.onResizeStart) {
      options.onResizeStart()
    }
  }

  const handleResize = (e: MouseEvent) => {
    if (!activeHandle) return

    const element = elementRef.value
    if (!element) return

    let width = originalWidth
    let height = originalHeight
    const dx = e.clientX - startX
    const dy = e.clientY - startY

    // Calculate new dimensions based on drag direction
    switch (activeHandle) {
      case 'se':
        width += dx
        height += dy
        break
      case 'sw':
        width -= dx
        height += dy
        break
      case 'ne':
        width += dx
        height -= dy
        break
      case 'nw':
        width -= dx
        height -= dy
        break
      case 'n':
        height -= dy
        break
      case 's':
        height += dy
        break
      case 'e':
        width += dx
        break
      case 'w':
        width -= dx
        break
    }

    // Apply constraints
    width = Math.max(minWidth, Math.min(maxWidth, width))
    height = Math.max(minHeight, Math.min(maxHeight, height))

    // Update element dimensions
    element.style.width = `${width}px`
    element.style.height = `${height}px`

    if (options.onResize) {
      options.onResize({ width, height })
    }
  }

  const handleResizeEnd = () => {
    isResizing.value = false
    activeHandle = null

    window.removeEventListener('mousemove', handleResize)
    window.removeEventListener('mouseup', handleResizeEnd)

    document.body.classList.remove('resizing')

    const element = elementRef.value
    if (element && options.onResizeEnd) {
      const rect = element.getBoundingClientRect()
      options.onResizeEnd({
        width: rect.width,
        height: rect.height,
      })
    }
  }

  const cleanup = () => {
    const element = elementRef.value
    if (!element) return

    handles.forEach(({ element: handle }) => {
      if (element.contains(handle)) {
        element.removeChild(handle)
      }
    })
    handles.length = 0

    window.removeEventListener('mousemove', handleResize)
    window.removeEventListener('mouseup', handleResizeEnd)
  }

  onMounted(() => {
    createHandles()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    isResizing,
  }
}
