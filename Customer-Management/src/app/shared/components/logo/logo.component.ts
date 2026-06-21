import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

export type LogoVariant = 'solid' | 'soft' | 'ghost';
export type LogoTone = 'violet' | 'white' | 'slate';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [NgClass],
  template: `
    <span class="inline-flex items-center gap-2.5 select-none" [class.flex-col]="stacked">
      <svg
        [attr.width]="size"
        [attr.height]="size"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        [attr.aria-label]="ariaLabel"
        role="img">
        <!-- Rounded square plate -->
        <rect x="2" y="2" width="44" height="44" rx="12"
              [attr.fill]="plateFill" />

        <!-- Three connected nodes (team / customer / collaboration) -->
        <g [attr.stroke]="lineColor" stroke-width="1.6" stroke-linecap="round" fill="none" opacity="0.55">
          <path d="M19 14 L13 31"/>
          <path d="M29 14 L35 31"/>
          <path d="M19 14 L29 14"/>
        </g>

        <!-- Outer nodes -->
        <circle cx="19" cy="14" r="3.2" [attr.fill]="nodeColor"/>
        <circle cx="29" cy="14" r="3.2" [attr.fill]="nodeColor"/>
        <circle cx="13" cy="31" r="3"   [attr.fill]="nodeColor"/>
        <circle cx="35" cy="31" r="3"   [attr.fill]="nodeColor"/>

        <!-- Center hub (the "Sideboard" core) -->
        <circle cx="24" cy="24" r="5.2" [attr.fill]="hubColor"/>
        <circle cx="24" cy="24" r="2"   [attr.fill]="hubInner"/>
      </svg>

      <span *ngIf="showText"
        [ngClass]="textClass"
        class="font-display font-bold tracking-tight whitespace-nowrap">
        SIDEBOARD
      </span>
    </span>
  `,
  styles: [`
    :host { display: inline-flex; line-height: 0; }
  `],
})
export class LogoComponent {
  @Input() size: number = 40;
  @Input() showText: boolean = false;
  @Input() stacked: boolean = false;
  @Input() variant: LogoVariant = 'solid';
  @Input() tone: LogoTone = 'violet';
  @Input() textClass: string = 'text-xl text-violet-600';
  @Input() ariaLabel: string = 'Sideboard logo';

  get plateFill(): string {
    if (this.variant === 'ghost') return 'transparent';
    return this.tone === 'white' ? '#ffffff' : '#7c3aed';
  }

  get lineColor(): string {
    return this.tone === 'white' ? '#ffffff' : '#a78bfa';
  }

  get nodeColor(): string {
    if (this.variant === 'ghost') return this.tone === 'white' ? '#ffffff' : '#7c3aed';
    return this.tone === 'white' ? '#ede9fe' : '#c4b5fd';
  }

  get hubColor(): string {
    return this.tone === 'white' ? '#ffffff' : '#ffffff';
  }

  get hubInner(): string {
    return this.tone === 'white' ? '#7c3aed' : '#7c3aed';
  }
}
