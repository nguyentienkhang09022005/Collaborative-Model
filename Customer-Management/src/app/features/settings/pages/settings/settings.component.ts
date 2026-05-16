import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferenceService, THEMES, ThemeMode } from '../../../../core/services/preference.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class SettingsComponent {
  private preferenceService = inject(PreferenceService);

  readonly currentTheme = this.preferenceService.theme;
  readonly themeConfig = this.preferenceService.themeConfig;
  readonly themes = Object.values(THEMES);

  selectTheme(theme: ThemeMode): void {
    this.preferenceService.setTheme(theme);
  }

  isSelected(themeId: ThemeMode): boolean {
    return this.currentTheme() === themeId;
  }
}