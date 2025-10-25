import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface DraggableOptions {
  data?: Record<string, any>
  fromPalette?: boolean
  onDragStart?: (event: DragEvent) => void
  onDragEnd?: (position: { x: number; y: number }) => void
}

export function useDraggable(
  elementRef: Ref<HTMLElement | null>,
  options: DraggableOptions = {}
) {
  const isDragging = ref(false)

  const handleDragStart = (event: DragEvent) => {
    if (!event.dataTransfer) return

    isDragging.value = true

    // Set the data being dragged
    if (options.data) {
      for (const [key, value] of Object.entries(options.data)) {
        event.dataTransfer.setData(key, String(value))
      }
    }

    // Set effectAllowed based on source
    event.dataTransfer.effectAllowed = options.fromPalette ? 'copy' : 'move'

    // Create drag image if dragging from palette
    if (options.fromPalette && elementRef.value) {
      const rect = elementRef.value.getBoundingClientRect()
      const ghostNode = elementRef.value.cloneNode(true) as HTMLElement

      ghostNode.style.width = `${rect.width}px`
      ghostNode.style.height = `${rect.height}px`
      ghostNode.style.opacity = '0.7'
      ghostNode.style.position = 'absolute'
      ghostNode.style.top = '-1000px'
      ghostNode.style.backgroundColor = 'rgba(59, 130, 246, 0.5)'

      document.body.appendChild(ghostNode)
      event.dataTransfer.setDragImage(ghostNode, rect.width / 2, rect.height / 2)
      setTimeout(() => document.body.removeChild(ghostNode), 0)
    }

    if (options.onDragStart) {
      options.onDragStart(event)
    }
  }

  const handleDragEnd = (event: DragEvent) => {
    isDragging.value = false

    if (options.onDragEnd && event.target instanceof HTMLElement) {
      const rect = event.target.getBoundingClientRect()
      options.onDragEnd({
        x: rect.left,
        y: rect.top
      })
    }
  }

  onMounted(() => {
    const element = elementRef.value
    if (!element) return

    element.setAttribute('draggable', 'true')
    element.addEventListener('dragstart', handleDragStart as EventListener)
    element.addEventListener('dragend', handleDragEnd as EventListener)
  })

  onUnmounted(() => {
    const element = elementRef.value
    if (!element) return

    element.removeEventListener('dragstart', handleDragStart as EventListener)
    element.removeEventListener('dragend', handleDragEnd as EventListener)
  })

  return {
    isDragging
  }
}

