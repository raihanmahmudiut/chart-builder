# Drag & Drop Fix

## Problem
Widgets weren't being added when dragged from the palette to the canvas.

## Root Cause
The composables (`useDraggable` and `useDroppable`) were using Vue's lifecycle hooks (`onMounted`) which created a timing issue - the composable's `onMounted` was running but not properly attaching event listeners to the DOM elements.

## Solution
Replaced the composable-based approach with direct DOM event listener setup in the component's `onMounted` hook.

### Changes Made

#### 1. WidgetPalette.vue
- Removed `useDraggable` composable
- Added direct `dragstart` event listeners
- Used `nextTick()` to ensure DOM is ready
- Manually set `draggable="true"` attribute
- Create ghost image for drag feedback

#### 2. DashboardCanvas.vue  
- Removed `useDroppable` composable
- Added direct `dragover`, `dragleave`, and `drop` event listeners
- Properly handle `event.preventDefault()` for drop zone
- Calculate drop coordinates relative to canvas

## How It Works Now

1. **Palette Items**: Each widget type has `draggable="true"` and a `dragstart` listener that:
   - Sets `widget-type` in `dataTransfer`
   - Creates a ghost image for visual feedback
   - Sets `effectAllowed` to `'copy'`

2. **Canvas Drop Zone**: The canvas has three listeners:
   - `dragover`: Prevents default and shows drop feedback
   - `dragleave`: Removes drop feedback
   - `drop`: Gets widget type, calculates position, creates widget

3. **Widget Creation**: When dropped:
   - Extracts `widget-type` from `dataTransfer`
   - Calculates grid position from mouse coordinates
   - Creates new widget with demo data
   - Adds to Pinia store

## Testing
1. Open `http://localhost:3000`
2. Drag any widget from left palette
3. Drop on canvas
4. Widget should appear at drop location

## Status
✅ Fixed and verified

