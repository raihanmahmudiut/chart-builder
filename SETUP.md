# Setup Guide - Vue Dashboard Builder

## Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm package manager

## Installation Steps

### 1. Navigate to the project directory

```bash
cd vue-dashboard-builder
```

### 2. Install dependencies

Choose your preferred package manager:

```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### 3. Start the development server

```bash
# Using npm
npm run dev

# Using yarn
yarn dev

# Using pnpm
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
vue-dashboard-builder/
├── assets/                    # CSS and SCSS files
│   ├── main.css              # Main styles
│   ├── tailwind.css          # Tailwind imports
│   └── settings.scss         # Vuetify settings
├── components/
│   ├── builder/              # Dashboard builder components
│   │   ├── DashboardCanvas.vue
│   │   ├── WidgetPalette.vue
│   │   ├── WidgetWrapper.vue
│   │   ├── PropertyEditor.vue
│   │   └── MinimizedWidgetsContainer.vue
│   └── widgets/              # Widget implementations
│       ├── ChartWidget.vue
│       ├── KpiCard.vue
│       └── WidgetFactory.vue
├── composables/              # Vue composables
│   ├── useDraggable.ts      # Drag functionality
│   ├── useDroppable.ts      # Drop functionality
│   └── useResizable.ts      # Resize functionality
├── pages/                    # Nuxt pages
│   └── index.vue            # Main dashboard page
├── plugins/                  # Nuxt plugins
│   └── vuetify.ts           # Vuetify configuration
├── stores/                   # Pinia stores
│   └── dashboard.ts         # Dashboard state management
├── types/                    # TypeScript types
│   ├── widgets.ts           # Widget type definitions
│   └── layouts.ts           # Layout type definitions
├── app.vue                   # Root app component
├── nuxt.config.ts           # Nuxt configuration
├── tailwind.config.js       # Tailwind configuration
└── package.json             # Dependencies
```

## Core Features Implemented

### ✅ Drag & Drop
- Drag widgets from the palette to the canvas
- Reposition widgets on the canvas
- Visual feedback during drag operations
- Snap-to-grid positioning

### ✅ Resize
- 8-directional resize handles (N, S, E, W, NE, NW, SE, SW)
- Minimum and maximum size constraints
- Grid-based resizing

### ✅ State Management
- Centralized Pinia store
- Auto-save to localStorage
- Persistent state across page reloads

### ✅ Widget Types
- **Line Chart** - Time series data visualization
- **Bar Chart** - Comparison data visualization
- **Pie Chart** - Proportion data visualization
- **KPI Card** - Key performance indicators with trends

### ✅ Property Editor
- Edit widget title
- Adjust position (X, Y)
- Adjust size (Width, Height)
- View widget type

### ✅ Widget Management
- Minimize/restore widgets
- Delete widgets
- Select widgets for editing
- Clear entire dashboard

## Technology Stack

### Core Framework
- **Nuxt 3** - Vue framework with SSR, file-based routing, and auto-imports
- **Vue 3** - Composition API for reactive components
- **TypeScript** - Type-safe development

### UI Libraries
- **Vuetify 3** - Material Design component library
- **Tailwind CSS** - Utility-first CSS framework
- **Material Design Icons** - Icon set

### State & Utilities
- **Pinia** - State management
- **VueUse** - Composition utilities (ResizeObserver, etc.)
- **Chart.js** - Charting library

## Key Differences from Svelte Version

### 1. **Reactivity System**
- **Svelte**: Compiler-based reactivity with `$:` syntax
- **Vue**: Composition API with `ref()`, `computed()`, `watch()`

### 2. **Component Structure**
- **Svelte**: `<script>`, `<template>`, `<style>` (script first)
- **Vue**: `<template>`, `<script setup>`, `<style>` (template first)

### 3. **State Management**
- **Svelte**: Svelte stores with `writable()`
- **Vue**: Pinia stores with `defineStore()`

### 4. **Actions/Directives**
- **Svelte**: Custom actions with `use:action`
- **Vue**: Composables with lifecycle hooks

### 5. **Event Handling**
- **Svelte**: `on:event` syntax
- **Vue**: `@event` syntax

### 6. **Conditional Rendering**
- **Svelte**: `{#if}...{/if}` blocks
- **Vue**: `v-if`, `v-else`, `v-for` directives

## Configuration Notes

### Vuetify + Tailwind Coexistence
The project is configured to use both Vuetify and Tailwind:
- Vuetify provides Material Design components (cards, buttons, inputs)
- Tailwind provides utility classes for custom styling
- Tailwind's preflight is disabled to avoid conflicts

### Auto-imports
Nuxt 3 auto-imports:
- Vue composables (`ref`, `computed`, `watch`, etc.)
- Nuxt composables (`useHead`, `navigateTo`, etc.)
- Components from `components/` directory
- Composables from `composables/` directory

## Development Tips

### 1. Hot Module Replacement (HMR)
Nuxt 3 has excellent HMR. Changes to components, pages, and stores will update instantly.

### 2. Type Safety
The project uses TypeScript. Run type checking with:
```bash
npm run check
```

### 3. Linting
Format code with:
```bash
npm run format
```

Lint code with:
```bash
npm run lint
```

### 4. Building for Production
```bash
npm run build
npm run preview
```

## Troubleshooting

### Issue: Drag and drop not working
- Ensure the browser supports HTML5 drag and drop API
- Check browser console for errors
- Verify composables are properly initialized

### Issue: Widgets not saving
- Check browser localStorage is enabled
- Open DevTools → Application → Local Storage
- Look for `dashboard-builder-state` key

### Issue: Charts not rendering
- Ensure Chart.js is properly installed
- Check canvas element is mounted
- Verify widget data is properly formatted

### Issue: Vuetify components not styled
- Ensure Vuetify plugin is loaded
- Check `@mdi/font` is installed
- Verify `vuetify/styles` is imported

## Next Steps

To extend the dashboard builder:

1. **Add more widget types**
   - Data tables
   - Text blocks
   - Image widgets
   - Custom widgets

2. **Implement data sources**
   - API connections
   - CSV import
   - Real-time data updates

3. **Add advanced features**
   - Undo/redo
   - Dashboard templates
   - Export to PDF/PNG
   - Multi-dashboard management
   - User authentication

4. **Backend integration**
   - Save dashboards to database
   - Share dashboards
   - Collaborative editing

5. **Performance optimization**
   - Virtual scrolling for large dashboards
   - Lazy loading widgets
   - Optimize chart rendering

## Support

For issues or questions:
1. Check this documentation
2. Review the original Svelte implementation
3. Check Nuxt 3, Vuetify, and Vue documentation

## License

MIT

