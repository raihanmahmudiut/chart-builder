# Quick Start Guide

Get up and running with the Vue Dashboard Builder in 5 minutes!

## 🚀 Installation

```bash
# 1. Navigate to the project directory
cd vue-dashboard-builder

# 2. Install dependencies (choose one)
npm install
# or
yarn install
# or
pnpm install

# 3. Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open your browser to `http://localhost:3000`

## 📖 Basic Usage

### Adding Widgets

1. **Drag from Palette**: Drag any widget from the left sidebar to the canvas
2. **Drop on Canvas**: Release to place the widget
3. **Auto-Select**: The widget is automatically selected

### Moving Widgets

1. **Click and Drag**: Click anywhere on a widget and drag it
2. **Grid Snap**: Widget snaps to the grid automatically
3. **Release**: Drop the widget in the new position

### Resizing Widgets

1. **Select Widget**: Click on a widget to select it
2. **Grab Handle**: Hover over the edges/corners to see resize handles
3. **Drag Handle**: Drag to resize in any of 8 directions
4. **Release**: Widget snaps to grid size

### Editing Properties

1. **Select Widget**: Click on a widget
2. **Right Sidebar**: See the Property Editor
3. **Edit Fields**: Change title, position (X, Y), or size (Width, Height)
4. **Auto-Update**: Changes apply immediately

### Minimizing Widgets

1. **Click Minimize**: Click the minus icon in the widget header
2. **View Minimized**: See minimized widgets in the right sidebar
3. **Restore**: Click on a minimized widget chip to restore it

### Deleting Widgets

1. **Select Widget**: Click on a widget
2. **Click Delete**: Click the trash icon in the widget header
3. **Confirm**: Widget is removed immediately (no undo yet)

### Saving Dashboard

1. **Click Save**: Click the "Save" button in the header
2. **Auto-Save**: Dashboard is automatically saved to localStorage
3. **Persistent**: Reload the page to see your saved dashboard

### Clearing Dashboard

1. **Click Clear**: Click the "Clear" button in the header
2. **Confirm**: Confirm the action in the dialog
3. **Reset**: All widgets are removed

## 🎨 Available Widgets

### Line Chart
- **Purpose**: Time series data visualization
- **Demo Data**: 6 months of revenue data
- **Features**: Smooth curves, tooltips, legend

### Bar Chart
- **Purpose**: Comparison data visualization
- **Demo Data**: Quarterly performance data
- **Features**: Vertical bars, tooltips, legend

### Pie Chart
- **Purpose**: Proportion data visualization
- **Demo Data**: Revenue breakdown by category
- **Features**: Percentage labels, color-coded segments

### KPI Card
- **Purpose**: Key performance indicators
- **Demo Data**: Revenue with target and trend
- **Features**: Large value, target, trend indicator

## 🎯 Tips & Tricks

### Keyboard Shortcuts
- **Delete**: Select a widget and press Delete key (not implemented yet)
- **Escape**: Deselect widget (not implemented yet)
- **Ctrl+Z**: Undo (not implemented yet)

### Grid System
- **12 Columns**: Canvas has 12 columns
- **Cell Height**: Each row is 40px
- **Gap**: 4px between cells
- **Snap**: Widgets snap to grid automatically

### Best Practices
1. **Organize**: Group related widgets together
2. **Spacing**: Leave space between widgets for clarity
3. **Size**: Make charts at least 4x3 for readability
4. **KPIs**: Keep KPI cards small (3x1 or 4x2)
5. **Save Often**: Click save after major changes

### Common Issues

**Widget won't drop?**
- Make sure you're dropping inside the canvas area
- Check that the canvas is visible and not covered

**Widget disappeared?**
- Check if it was minimized (right sidebar)
- Check if it's off-screen (scroll or adjust position)

**Charts not rendering?**
- Refresh the page
- Check browser console for errors
- Make sure widget is large enough (min 200px height)

**Changes not saving?**
- Check browser localStorage is enabled
- Open DevTools → Application → Local Storage
- Look for `dashboard-builder-state` key

## 📁 Project Structure (Simplified)

```
vue-dashboard-builder/
├── components/
│   ├── builder/          # Dashboard builder UI
│   │   ├── DashboardCanvas.vue      # Main canvas
│   │   ├── WidgetPalette.vue        # Widget list
│   │   ├── WidgetWrapper.vue        # Widget container
│   │   ├── PropertyEditor.vue       # Property panel
│   │   └── MinimizedWidgetsContainer.vue
│   └── widgets/          # Widget implementations
│       ├── ChartWidget.vue          # Line/Bar/Pie charts
│       ├── KpiCard.vue              # KPI widget
│       └── WidgetFactory.vue        # Widget router
├── composables/          # Reusable logic
│   ├── useDraggable.ts             # Drag functionality
│   ├── useDroppable.ts             # Drop functionality
│   └── useResizable.ts             # Resize functionality
├── stores/
│   └── dashboard.ts      # State management
├── types/
│   ├── widgets.ts        # Widget types
│   └── layouts.ts        # Layout types
└── pages/
    └── index.vue         # Main page
```

## 🔧 Configuration

### Change Grid Size
Edit `stores/dashboard.ts`:
```typescript
gridSize: 12  // Change to 16, 24, etc.
```

### Change Cell Height
Edit `components/builder/DashboardCanvas.vue`:
```typescript
const cellHeight = ref(40)  // Change to 50, 60, etc.
```

### Change Theme Colors
Edit `plugins/vuetify.ts`:
```typescript
colors: {
  primary: '#3b82f6',  // Change to your color
  // ...
}
```

### Add New Widget Type
1. Add type to `types/widgets.ts`
2. Create widget component in `components/widgets/`
3. Add to `WidgetFactory.vue`
4. Add to palette in `WidgetPalette.vue`

## 🐛 Debugging

### Enable Vue DevTools
1. Install Vue DevTools browser extension
2. Open DevTools → Vue tab
3. Inspect components, state, events

### Check Store State
```javascript
// In browser console
$pinia.state.value.dashboard
```

### Check LocalStorage
```javascript
// In browser console
localStorage.getItem('dashboard-builder-state')
```

### Clear Cache
```javascript
// In browser console
localStorage.clear()
location.reload()
```

## 📚 Next Steps

1. **Read FEATURES.md** - See all implemented features
2. **Read SETUP.md** - Detailed setup instructions
4. **Explore Code** - Dive into the implementation
5. **Customize** - Make it your own!

## 🎓 Learning Path

### Beginner
1. Use the dashboard builder as-is
2. Add and arrange widgets
3. Save and load dashboards
4. Experiment with different layouts

### Intermediate
1. Modify existing widgets
2. Change colors and styles
3. Add new widget types
4. Customize grid settings

### Advanced
1. Add data source integration
2. Implement backend persistence
3. Add user authentication
4. Build custom widgets with complex logic

## 💡 Ideas for Extension

### Easy
- [ ] Add more demo data to widgets
- [ ] Change color schemes
- [ ] Add more widget icons
- [ ] Customize grid appearance

### Medium
- [ ] Add undo/redo functionality
- [ ] Implement dashboard templates
- [ ] Add widget settings panel
- [ ] Create custom widget types

### Hard
- [ ] Connect to real APIs
- [ ] Add real-time data updates
- [ ] Implement collaborative editing
- [ ] Build mobile-responsive layout

## 🤝 Getting Help

### Resources
- **Vue 3 Docs**: https://vuejs.org
- **Nuxt 3 Docs**: https://nuxt.com
- **Vuetify Docs**: https://vuetifyjs.com
- **Chart.js Docs**: https://www.chartjs.org

### Common Questions

**Q: Can I use this in production?**
A: Yes! The core functionality is production-ready. Add authentication and backend persistence for a complete solution.

**Q: How do I add my own data?**
A: Modify the demo data in widget components or implement data source connections.

**Q: Can I customize the look?**
A: Absolutely! Edit Vuetify theme, Tailwind config, and component styles.

**Q: Is it mobile-friendly?**
A: Partially. Drag and drop works on touch devices but may need optimization.

**Q: How do I deploy it?**
A: Run `npm run build` then deploy the `.output` directory to any Node.js host.

## 🎉 You're Ready!

Start building your dashboard now. Drag, drop, resize, and create something amazing!

**Happy Building! 🚀**

