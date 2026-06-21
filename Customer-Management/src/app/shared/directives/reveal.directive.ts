import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'fade' | 'zoom';

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements OnInit, OnDestroy {
  @Input('appReveal') direction: RevealDirection = 'up';
  @Input() revealDelay = 0;
  @Input() revealThreshold = 0.15;

  private host = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private observer?: IntersectionObserver;

  ngOnInit(): void {
    const el = this.host.nativeElement;
    this.renderer.addClass(el, 'reveal');
    this.renderer.addClass(el, `reveal-${this.direction}`);

    if (!('IntersectionObserver' in window)) {
      this.renderer.addClass(el, 'revealed');
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.style.transitionDelay = `${this.revealDelay}ms`;
            target.classList.add('revealed');
            this.observer?.unobserve(target);
          }
        }
      },
      { threshold: this.revealThreshold, rootMargin: '0px 0px -40px 0px' },
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
