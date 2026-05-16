import { Injectable, signal, effect, computed } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  id: ThemeMode;
  name: string;
  icon: string;
  sidebarBg: string;
  sidebarText: string;
  sidebarHover: string;
  sidebarActive: string;
  contentBg: string;
  headerBg: string;
  cardBg: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  inputBg: string;
  placeholderColor: string;
  dropdownBg: string;
  tableHeaderBg: string;
  tableRowBg: string;
  tableRowHover: string;
  chartGridColor: string;
  statCardBg: string;
  statCardBorder: string;
}

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  light: {
    id: 'light',
    name: 'Light',
    icon: '☀️',
    sidebarBg: 'bg-slate-900',
    sidebarText: 'text-slate-300',
    sidebarHover: 'hover:bg-slate-700',
    sidebarActive: 'bg-gradient-to-r from-sky-500 to-sky-400 text-white shadow-lg shadow-sky-500/30',
    contentBg: 'bg-slate-100',
    headerBg: 'bg-white border-slate-200',
    cardBg: 'bg-white',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-500',
    borderColor: 'border-slate-200',
    inputBg: 'bg-white',
    placeholderColor: 'placeholder:text-slate-400',
    dropdownBg: 'bg-white',
    tableHeaderBg: 'bg-slate-50',
    tableRowBg: 'bg-white',
    tableRowHover: 'hover:bg-slate-50',
    chartGridColor: 'rgba(148, 163, 184, 0.1)',
    statCardBg: 'bg-white',
    statCardBorder: 'border-slate-200'
  },
  dark: {
    id: 'dark',
    name: 'Dark',
    icon: '🌙',
    sidebarBg: 'bg-slate-950',
    sidebarText: 'text-slate-300',
    sidebarHover: 'hover:bg-slate-800',
    sidebarActive: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30',
    contentBg: 'bg-slate-900',
    headerBg: 'bg-slate-900 border-slate-700',
    cardBg: 'bg-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    borderColor: 'border-slate-700',
    inputBg: 'bg-slate-700',
    placeholderColor: 'placeholder:text-slate-500',
    dropdownBg: 'bg-slate-800',
    tableHeaderBg: 'bg-slate-800',
    tableRowBg: 'bg-slate-800',
    tableRowHover: 'hover:bg-slate-700',
    chartGridColor: 'rgba(148, 163, 184, 0.1)',
    statCardBg: 'bg-slate-800',
    statCardBorder: 'border-slate-700'
  }
};

const STORAGE_KEY = 'app_theme_preference';

@Injectable({
  providedIn: 'root'
})
export class PreferenceService {
  private _theme = signal<ThemeMode>(this.loadTheme());

  readonly theme = this._theme.asReadonly();
  readonly themeConfig = computed(() => THEMES[this._theme()]);
  readonly availableThemes = computed(() => Object.values(THEMES));

  constructor() {
    effect(() => {
      localStorage.setItem(STORAGE_KEY, this._theme());
      document.body.className = document.body.className
        .replace(/theme-\w+/g, '')
        .trim() + ` theme-${this._theme()}`;
    });
  }

  private loadTheme(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && stored in THEMES) {
      return stored as ThemeMode;
    }
    return 'light';
  }

  setTheme(theme: ThemeMode): void {
    this._theme.set(theme);
  }

  getThemes(): ThemeConfig[] {
    return Object.values(THEMES);
  }
}