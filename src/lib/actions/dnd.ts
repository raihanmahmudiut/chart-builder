export function draggable(node: HTMLElement, data: any) {
    let state = data;
  
    function handleDragStart(event: DragEvent) {
      if (!event.dataTransfer) return;
      
      // Set the data being dragged
      for (const [key, value] of Object.entries(state)) {
        event.dataTransfer.setData(key, String(value));
      }
      
      // Set a visual drag image if needed
      // If we're dragging from a palette, we might want a ghost image
      if (state.fromPalette && node.parentElement) {
        const rect = node.getBoundingClientRect();
        const ghostNode = node.cloneNode(true) as HTMLElement;
        
        // Style the ghost
        ghostNode.style.width = `${rect.width}px`;
        ghostNode.style.height = `${rect.height}px`;
        ghostNode.style.opacity = '0.7';
        ghostNode.style.position = 'absolute';
        ghostNode.style.top = '-1000px';
        ghostNode.style.backgroundColor = 'rgba(59, 130, 246, 0.5)';
        
        // Append to body, set as drag image, then remove
        document.body.appendChild(ghostNode);
        event.dataTransfer.setDragImage(ghostNode, rect.width / 2, rect.height / 2);
        setTimeout(() => document.body.removeChild(ghostNode), 0);
      }
  
      // Set the effectAllowed based on the source
      event.dataTransfer.effectAllowed = state.fromPalette ? 'copy' : 'move';
    }
  
    function handleDragEnd(event: DragEvent) {
      // Handle any cleanup needed after drag ends
    }
  
    node.setAttribute('draggable', 'true');
    node.addEventListener('dragstart', handleDragStart);
    node.addEventListener('dragend', handleDragEnd);
  
    return {
      update(newData: any) {
        state = newData;
      },
      destroy() {
        node.removeEventListener('dragstart', handleDragStart);
        node.removeEventListener('dragend', handleDragEnd);
      }
    };
  }
  
  export function droppable(node: HTMLElement, options = { accept: () => true }) {
    let state = options;
  
    function handleDragOver(event: DragEvent) {
      if (!event.dataTransfer) return;
      
      // Prevent default to allow drop
      event.preventDefault();
      
      // Set dropEffect based on what we're accepting
      event.dataTransfer.dropEffect = event.dataTransfer.effectAllowed === 'copy' ? 'copy' : 'move';
      
      // Add visual indication that item can be dropped
      node.classList.add('drop-active');
    }
  
    function handleDragEnter(event: DragEvent) {
      if (!event.dataTransfer) return;
      node.classList.add('drop-over');
    }
  
    function handleDragLeave(event: DragEvent) {
      node.classList.remove('drop-over');
    }
  
    function handleDrop(event: DragEvent) {
      event.preventDefault();
      
      // Remove visual indication
      node.classList.remove('drop-active');
      node.classList.remove('drop-over');
      
      // Create a custom event with the data
      const dropEvent = new CustomEvent('drop-item', {
        detail: {
          originalEvent: event,
          // Helper to extract data from dataTransfer
          getData: (key: string) => event.dataTransfer?.getData(key) || null,
          // Store drop coordinates relative to the container
          x: event.offsetX,
          y: event.offsetY
        }
      });
      
      // Dispatch the custom event
      node.dispatchEvent(dropEvent);
    }
  
    node.addEventListener('dragover', handleDragOver);
    node.addEventListener('dragenter', handleDragEnter);
    node.addEventListener('dragleave', handleDragLeave);
    node.addEventListener('drop', handleDrop);
  
    return {
      update(newOptions: any) {
        state = newOptions;
      },
      destroy() {
        node.removeEventListener('dragover', handleDragOver);
        node.removeEventListener('dragenter', handleDragEnter);
        node.removeEventListener('dragleave', handleDragLeave);
        node.removeEventListener('drop', handleDrop);
      }
    };
}
  
export interface DropItemEventDetail {
    originalEvent: DragEvent;
    getData: (key: string) => string | null;
    x: number;
    y: number;
  }