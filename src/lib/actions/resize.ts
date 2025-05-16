export function resizable(node: HTMLElement, options: { 
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    grid?: { width: number; height: number };
    aspectRatio?: boolean;
    onResize?: (dimensions: { width: number; height: number }) => void;
    onResizeStart?: () => void;
    onResizeEnd?: (dimensions: { width: number; height: number }) => void;
  } = {}) {
    const minWidth = options.minWidth || 50;
    const minHeight = options.minHeight || 50;
    const maxWidth = options.maxWidth || Infinity;
    const maxHeight = options.maxHeight || Infinity;
    const grid = options.grid || { width: 1, height: 1 };
    const aspectRatio = options.aspectRatio || false;
    
    // Create resize handles
    const handles = ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'].map(position => {
      const handle = document.createElement('div');
      handle.className = `resize-handle resize-handle-${position}`;
      handle.style.position = 'absolute';
      handle.style.width = '10px';
      handle.style.height = '10px';
      handle.style.backgroundColor = 'transparent';
      handle.style.zIndex = '1';
      
      // Position the handle
      switch (position) {
        case 'se': // bottom-right
          handle.style.bottom = '0';
          handle.style.right = '0';
          handle.style.cursor = 'nwse-resize';
          break;
        case 'sw': // bottom-left
          handle.style.bottom = '0';
          handle.style.left = '0';
          handle.style.cursor = 'nesw-resize';
          break;
        case 'ne': // top-right
          handle.style.top = '0';
          handle.style.right = '0';
          handle.style.cursor = 'nesw-resize';
          break;
        case 'nw': // top-left
          handle.style.top = '0';
          handle.style.left = '0';
          handle.style.cursor = 'nwse-resize';
          break;
        case 'n': // top
          handle.style.top = '0';
          handle.style.left = '50%';
          handle.style.transform = 'translateX(-50%)';
          handle.style.cursor = 'ns-resize';
          break;
        case 's': // bottom
          handle.style.bottom = '0';
          handle.style.left = '50%';
          handle.style.transform = 'translateX(-50%)';
          handle.style.cursor = 'ns-resize';
          break;
        case 'e': // right
          handle.style.right = '0';
          handle.style.top = '50%';
          handle.style.transform = 'translateY(-50%)';
          handle.style.cursor = 'ew-resize';
          break;
        case 'w': // left
          handle.style.left = '0';
          handle.style.top = '50%';
          handle.style.transform = 'translateY(-50%)';
          handle.style.cursor = 'ew-resize';
          break;
      }
      
      return { element: handle, position };
    });
    
    // Make sure the node is positioned relatively or absolutely
    const computedStyle = window.getComputedStyle(node);
    if (computedStyle.position === 'static') {
      node.style.position = 'relative';
    }
    
    // Append handles to the node
    handles.forEach(({ element }) => {
      node.appendChild(element);
    });
    
    // Store the original dimensions
    let originalWidth: number;
    let originalHeight: number;
    let originalX: number;
    let originalY: number;
    let startX: number;
    let startY: number;
    let activeHandle: string | null = null;
    
    // Handle resize start
    function handleResizeStart(e: MouseEvent, position: string) {
      e.preventDefault();
      e.stopPropagation();
      
      // Get current dimensions
      const rect = node.getBoundingClientRect();
      originalWidth = rect.width;
      originalHeight = rect.height;
      originalX = rect.left;
      originalY = rect.top;
      startX = e.clientX;
      startY = e.clientY;
      activeHandle = position;
      
      // Add event listeners for drag
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
      
      // Call the onResizeStart callback if provided
      if (options.onResizeStart) {
        options.onResizeStart();
      }
      
      // Add resizing class to body for cursor handling
      document.body.classList.add('resizing');
    }
    
    // Handle resize
    function handleResize(e: MouseEvent) {
      if (!activeHandle) return;
      
      let width = originalWidth;
      let height = originalHeight;
      let dx = e.clientX - startX;
      let dy = e.clientY - startY;
      
      // Calculate new dimensions based on drag direction
      switch (activeHandle) {
        case 'se': // bottom-right
          width += dx;
          height += dy;
          break;
        case 'sw': // bottom-left
          width -= dx;
          height += dy;
          break;
        case 'ne': // top-right
          width += dx;
          height -= dy;
          break;
        case 'nw': // top-left
          width -= dx;
          height -= dy;
          break;
        case 'n': // top
          height -= dy;
          break;
        case 's': // bottom
          height += dy;
          break;
        case 'e': // right
          width += dx;
          break;
        case 'w': // left
          width -= dx;
          break;
      }
      
      // Apply grid snapping if specified
      if (grid) {
        width = Math.round(width / grid.width) * grid.width;
        height = Math.round(height / grid.height) * grid.height;
      }
      
      // Apply min/max constraints
      width = Math.max(minWidth, Math.min(maxWidth, width));
      height = Math.max(minHeight, Math.min(maxHeight, height));
      
      // Apply aspect ratio if needed
      if (aspectRatio) {
        const ratio = originalWidth / originalHeight;
        if (width / height > ratio) {
          width = height * ratio;
        } else {
          height = width / ratio;
        }
      }
      
      // Update element dimensions
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      
      // Call the onResize callback if provided
      if (options.onResize) {
        options.onResize({ width, height });
      }
    }
    
    // Handle resize end
    function handleResizeEnd() {
      activeHandle = null;
      
      // Remove event listeners
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
      
      // Get final dimensions
      const rect = node.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      // Call the onResizeEnd callback if provided
      if (options.onResizeEnd) {
        options.onResizeEnd({ width, height });
      }
      
      // Remove resizing class from body
      document.body.classList.remove('resizing');
    }
    
    // Add event listeners to handles
    handles.forEach(({ element, position }) => {
      element.addEventListener('mousedown', (e) => handleResizeStart(e, position));
    });
    
    return {
      destroy() {
        // Clean up event listeners
        window.removeEventListener('mousemove', handleResize);
        window.removeEventListener('mouseup', handleResizeEnd);
        
        // Remove handles
        handles.forEach(({ element }) => {
          if (node.contains(element)) {
            node.removeChild(element);
          }
        });
      },
      update(newOptions: typeof options) {
        // Update options if needed
        Object.assign(options, newOptions);
      }
    };
  }