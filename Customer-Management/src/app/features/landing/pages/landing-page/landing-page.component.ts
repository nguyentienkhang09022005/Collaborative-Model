import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { RevealDirective } from '../../../../shared/directives/reveal.directive';
import { CountUpDirective } from '../../../../shared/directives/count-up.directive';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink, RevealDirective, CountUpDirective, LogoComponent],
  templateUrl: './landing-page.html',
  styleUrls: ['./landing-page.css'],
})
export class LandingPageComponent implements AfterViewInit, OnDestroy {
  private zone = inject(NgZone);
  private host = inject(ElementRef<HTMLElement>);

  private parallaxEls: HTMLElement[] = [];
  scrolled = signal(false);

  features = [
    {
      icon: 'M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z',
      title: 'Phân Tích Doanh Thu',
      desc: 'Dashboard realtime theo dõi MRR, churn rate và pipeline value với biểu đồ tương tác.',
    },
    {
      icon: 'M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z',
      title: 'AI Phân Loại Lead',
      desc: 'Tự động chấm điểm chất lượng lead và đề xuất hành động tiếp theo cho sales.',
    },
    {
      icon: 'M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941',
      title: 'Workflow Tự Động',
      desc: 'Trigger email, giao task, cập nhật trạng thái deal — tất cả tự động theo rule bạn đặt ra.',
    },
    {
      icon: 'M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z',
      title: 'Cộng Tác Thời Gian Thực',
      desc: 'Nhiều người cùng chỉnh sửa deal, comment, ghim task — không lo lệch version hay trùng lặp.',
    },
    {
      icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5',
      title: 'Lịch Hẹn Thông Minh',
      desc: 'Đồng bộ Google Calendar, gửi reminder tự động, tránh double-booking cho cả team.',
    },
    {
      icon: 'M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z',
      title: 'Bảo Mật Cấp Enterprise',
      desc: 'Mã hóa AES-256, SSO/SAML, audit log đầy đủ và tuân thủ GDPR, SOC 2 Type II.',
    },
  ];

  stats = [
    { value: 2500, suffix: '+', label: 'Đội nhóm đang dùng' },
    { value: 98, suffix: '%', label: 'Khách hàng hài lòng' },
    { value: 35, suffix: '%', label: 'Tăng conversion rate' },
    { value: 99.9, suffix: '%', label: 'Uptime SLA' },
  ];

  steps = [
    {
      num: '01',
      title: 'Kết nối dữ liệu',
      desc: 'Đồng bộ email, calendar, các nguồn lead chỉ trong vài cú click. Không cần dev.',
    },
    {
      num: '02',
      title: 'Thiết lập pipeline',
      desc: 'Kéo thả các cột Kanban, định nghĩa stage và rule tự động hoá theo cách làm việc của bạn.',
    },
    {
      num: '03',
      title: 'Vận hành & mở rộng',
      desc: 'Theo dõi dashboard, để AI đề xuất hành động, scale đội nhóm không cần đổi công cụ.',
    },
  ];

  integrations = [
    'Gmail', 'Outlook', 'Slack', 'Notion', 'Stripe',
    'HubSpot', 'Zapier', 'Google Calendar', 'Salesforce', 'Meta Ads',
  ];

  trustedBy = ['NORTHWIND', 'ACME CO', 'VERTEX', 'LUMINA', 'ORBIT', 'QUANTA'];

  private rafId: number | null = null;
  private ticking = false;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (this.ticking) return;
    this.ticking = true;
    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame(() => {
        const y = window.scrollY;
        this.zone.run(() => this.scrolled.set(y > 20));
        this.updateParallax(y);
        this.ticking = false;
      });
    });
  }

  ngAfterViewInit(): void {
    const nodes = this.host.nativeElement.querySelectorAll('.parallax');
    this.parallaxEls = Array.from(nodes) as HTMLElement[];
    this.parallaxEls.forEach(el => {
      el.style.transform = 'translate3d(0,0,0)';
    });
  }

  ngOnDestroy(): void {
    if (this.rafId !== null) cancelAnimationFrame(this.rafId);
  }

  private updateParallax(scrollY: number): void {
    this.parallaxEls.forEach(el => {
      const speed = Number(el.dataset['speed'] || '0');
      if (!speed) return;
      const offset = scrollY * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    });
  }
}
