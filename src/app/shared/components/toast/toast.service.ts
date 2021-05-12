import { Injectable, TemplateRef } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}): any {
    const toast = { textOrTpl, ...options };
    this.toasts.push(toast);
    return toast;
  }

  showStandard(textOrTpl: string | TemplateRef<any>): any {
    return this.show(textOrTpl);
  }

  showSuccess(textOrTpl: string | TemplateRef<any>, delay: number = 10000): any {
    return this.show(textOrTpl, { classname: 'bg-success text-light', delay });
  }

  showDanger(textOrTpl: string | TemplateRef<any>, delay: number = 15000): any {
    return this.show(textOrTpl, { classname: 'bg-danger text-light', delay });
  }

  showInfo(textOrTpl: string | TemplateRef<any>, delay: number = 10000): any {
    return this.show(textOrTpl, { classname: 'bg-info text-light', delay });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
