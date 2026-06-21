import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  inject,
} from '@angular/core';

@Directive({
  selector: '[appCountUp]',
  standalone: true,
})
export class CountUpDirective implements OnInit, OnDestroy {
  @Input('appCountUp') target = 0;
  @Input() countDuration = 1500;
  @Input() countPrefix = '';
  @Input() countSuffix = '';

  private host = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private observer?: IntersectionObserver;
  private hasAnimated = false;

  ngOnInit(): void {
    const el = this.host.nativeElement;
    this.renderer.setProperty(el, 'textContent', `${this.countPrefix}0${this.countSuffix}`);

    if (!('IntersectionObserver' in window)) {
      this.run(el, 0, this.target);
      return;
    }

    this.observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.hasAnimated = true;
            this.run(entry.target as HTMLElement, 0, this.target);
            this.observer?.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.4 },
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private run(el: HTMLElement, from: number, to: number): void {
    const start = performance.now();
    const duration = Math.max(this.countDuration, 200);
    const isInt = Number.isInteger(to);

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      const value = isInt ? Math.round(current).toString() : current.toFixed(1);
      el.textContent = `${this.countPrefix}${value}${this.countSuffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
}
