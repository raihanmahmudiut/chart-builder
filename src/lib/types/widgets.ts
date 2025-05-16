export type WidgetType = 
  | 'line-chart'  
  | 'bar-chart'
  | 'pie-chart'
  | 'kpi-card'
  | 'data-table'
  | 'text-block'
  | 'image';
  
export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  dataSource?: string; // ID of the data source
  dataMapping: Record<string, string>; // Maps widget fields to data source fields
  settings: Record<string, any>; // Widget-specific settings
  xAxis?: string;
  yAxis?: string;
  labelField?: string;
  valueField?: string;
  [key: string]: string | number | boolean | Record<string, any> | undefined;
}

export const DEFAULT_WIDGET_HEIGHTS: Record<WidgetType, number> = {
  'line-chart': 10,
  'bar-chart': 3,
  'pie-chart': 2,
  'kpi-card': 1,
  'data-table': 4,
  'text-block': 2,
  'image': 2
};

export const DEFAULT_WIDGET_WIDTHS: Record<WidgetType, number> = {
  'line-chart': 6,
  'bar-chart': 6,
  'pie-chart': 4,
  'kpi-card': 3,
  'data-table': 6,
  'text-block': 4,
  'image': 3
};

export function getWidgetIcon(type: WidgetType): string {
  switch (type) {
    case 'line-chart': return 'line-chart';
    case 'bar-chart': return 'bar-chart-2';
    case 'pie-chart': return 'pie-chart';
    case 'kpi-card': return 'trending-up';
    case 'data-table': return 'table';
    case 'text-block': return 'text';
    case 'image': return 'image';
    default: return 'square';
  }
}

export function getWidgetLabel(type: WidgetType): string {
  return type.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}