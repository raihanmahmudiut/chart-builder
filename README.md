# Vue Dashboard Builder

A powerful drag-and-drop dashboard builder built with Vue 3, Nuxt 3, Vuetify, and Tailwind CSS.

## Features

- 🎨 Drag and drop widgets from palette to canvas
- 📏 Resize widgets with 8-directional handles
- 🎯 Snap-to-grid positioning
- 📊 Multiple widget types (Charts, KPI cards, etc.)
- 💾 Auto-save to localStorage
- ⚡ Built with modern Vue 3 Composition API
- 🎭 Vuetify components + Tailwind utility classes

## Tech Stack

- **Nuxt 3** - Vue framework with SSR
- **Vue 3** - Composition API
- **Vuetify 3** - Material Design components
- **Tailwind CSS** - Utility-first CSS
- **Pinia** - State management
- **VueUse** - Composition utilities
- **Chart.js** - Charting library

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
vue-dashboard-builder/
├── components/
│   ├── builder/
│   │   ├── DashboardCanvas.vue
│   │   ├── WidgetPalette.vue
│   │   ├── WidgetWrapper.vue
│   │   ├── PropertyEditor.vue
│   │   └── MinimizedWidgetsContainer.vue
│   └── widgets/
│       ├── ChartWidget.vue
│       ├── KpiCard.vue
│       └── WidgetFactory.vue
├── composables/
│   ├── useDraggable.ts
│   ├── useDroppable.ts
│   └── useResizable.ts
├── stores/
│   └── dashboard.ts
├── types/
│   ├── widgets.ts
│   └── layouts.ts
├── pages/
│   └── index.vue
└── plugins/
    └── vuetify.ts
```

## Core Functionality

### Drag & Drop

- Drag widgets from palette to canvas
- Reposition existing widgets
- Visual feedback during drag operations

### Resize

- 8-directional resize handles
- Snap to grid
- Minimum/maximum size constraints

### State Management

- Centralized Pinia store
- Auto-save to localStorage
- Undo/redo support (coming soon)

### Widget Types

- Line Chart
- Bar Chart
- Pie Chart
- KPI Card
- Data Table (coming soon)
- Text Block (coming soon)
- Image (coming soon)

## License

MIT
