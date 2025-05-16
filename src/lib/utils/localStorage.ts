import { browser } from '$app/environment';
import type { DashboardConfig } from '$lib/types/layouts';

const DASHBOARD_STORAGE_KEY = 'dashboard-builder-state';
const DASHBOARD_VERSION_KEY = 'dashboard-builder-version';
const CURRENT_VERSION = '1.0.0'; // Increment whenever there's a breaking change in data structure

/**
 * Save dashboard to local storage
 */
export function saveDashboard(dashboard: DashboardConfig): void {
  if (!browser) return;
  
  try {
    localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(dashboard));
    localStorage.setItem(DASHBOARD_VERSION_KEY, CURRENT_VERSION);
  } catch (err) {
    console.error('Failed to save dashboard to localStorage:', err);
  }
}

/**
 * Load dashboard from local storage
 */
export function loadDashboard(): DashboardConfig | null {
  if (!browser) return null;
  
  try {
    const version = localStorage.getItem(DASHBOARD_VERSION_KEY);
    const savedData = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    
    if (!savedData) return null;
    
    // Check version compatibility
    if (version !== CURRENT_VERSION) {
      console.warn(`Dashboard version mismatch. Stored: ${version}, Current: ${CURRENT_VERSION}`);
      // In a real app, you might implement migration logic here
    }
    
    return JSON.parse(savedData) as DashboardConfig;
  } catch (err) {
    console.error('Failed to load dashboard from localStorage:', err);
    return null;
  }
}

/**
 * Clear dashboard from local storage
 */
export function clearSavedDashboard(): void {
  if (!browser) return;
  
  try {
    localStorage.removeItem(DASHBOARD_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear dashboard from localStorage:', err);
  }
}

/**
 * Export dashboard to JSON file
 */
export function exportDashboard(dashboard: DashboardConfig): void {
  if (!browser) return;
  
  try {
    const dashboardJSON = JSON.stringify(dashboard, null, 2);
    const blob = new Blob([dashboardJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dashboard.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to export dashboard:', err);
  }
}

/**
 * Import dashboard from JSON file
 */
export function importDashboard(file: File): Promise<DashboardConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const dashboard = JSON.parse(event.target?.result as string) as DashboardConfig;
        resolve(dashboard);
      } catch (err) {
        reject(new Error('Invalid dashboard file format'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read dashboard file'));
    };
    
    reader.readAsText(file);
  });
}