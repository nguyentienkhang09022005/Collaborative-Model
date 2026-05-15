export class FormatUtils {
  static formatCurrency(amount: number | null | undefined): string {
    if (amount === null || amount === undefined) return '0';

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  }

  static formatNumber(num: number | null | undefined): string {
    if (num === null || num === undefined) return '0';

    return new Intl.NumberFormat('vi-VN').format(num);
  }

  static formatPhone(phone: string | null | undefined): string {
    if (!phone) return '';

    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
  }

  static truncate(text: string | null | undefined, maxLength: number): string {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    return text.slice(0, maxLength) + '...';
  }
}
