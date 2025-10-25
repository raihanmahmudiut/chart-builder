import { ref, onMounted, onUnmounted, type Ref } from 'vue'

export interface DropItemDetail {
  originalEvent: DragEvent
  getData: (key: string) => string | null
  x: number
  y: number
}

export interface DroppableOptions {
  accept?: () => boolean
  onDrop?: (detail: DropItemDetail) => void
}

export function useDroppable(
  elementRef: Ref<HTMLElement | null>,
  options: DroppableOptions = {}
) {
  const isOver = ref(false)

  const handleDragOver = (event: DragEvent) => {
    if (!event.dataTransfer) return

    event.preventDefault()
    event.dataTransfer.dropEffect = event.dataTransfer.effectAllowed === 'copy' ? 'copy' : 'move'

    const element = elementRef.value
    if (element) {
      element.classList.add('drop-active')
    }
  }

  const handleDragEnter = (event: DragEvent) => {
    isOver.value = true
    const element = elementRef.value
    if (element) {
      element.classList.add('drop-over')
    }
  }

  const handleDragLeave = (event: DragEvent) => {
    isOver.value = false
    const element = elementRef.value
    if (element) {
      element.classList.remove('drop-over')
    }
  }

  const handleDrop = (event: DragEvent) => {
    event.preventDefault()
    isOver.value = false

    const element = elementRef.value
    if (element) {
      element.classList.remove('drop-active')
      element.classList.remove('drop-over')
    }

    if (options.onDrop) {
      const rect = element?.getBoundingClientRect()
      const x = rect ? event.clientX - rect.left : event.offsetX
      const y = rect ? event.clientY - rect.top : event.offsetY

      options.onDrop({
        originalEvent: event,
        getData: (key: string) => event.dataTransfer?.getData(key) || null,
        x,
        y
      })
    }
  }

  onMounted(() => {
    const element = elementRef.value
    if (!element) return

    element.addEventListener('dragover', handleDragOver as EventListener)
    element.addEventListener('dragenter', handleDragEnter as EventListener)
    element.addEventListener('dragleave', handleDragLeave as EventListener)
    element.addEventListener('drop', handleDrop as EventListener)
  })

  onUnmounted(() => {
    const element = elementRef.value
    if (!element) return

    element.removeEventListener('dragover', handleDragOver as EventListener)
    element.removeEventListener('dragenter', handleDragEnter as EventListener)
    element.removeEventListener('dragleave', handleDragLeave as EventListener)
    element.removeEventListener('drop', handleDrop as EventListener)
  })

  return {
    isOver
  }
}

