import type { Widget } from './widgets';

export interface DashboardConfig {
  id: string;
  title: string;
  widgets: Widget[];
  selectedWidgetId: string | null;
  gridSize: number;
  snapToGrid: boolean;
  theme: 'light' | 'dark' | 'custom';
}