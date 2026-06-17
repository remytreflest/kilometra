import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-mpi-ring',
  standalone: true,
  template: `
    <svg [attr.viewBox]="'0 0 ' + (size) + ' ' + size" [attr.width]="size" [attr.height]="size"
         role="img" [attr.aria-label]="'Michelin Performance Index : ' + score + ' sur 1000'">
      <!-- Track -->
      <circle
        [attr.cx]="cx" [attr.cy]="cy" [attr.r]="r"
        fill="none"
        [attr.stroke]="trackColor"
        [attr.stroke-width]="strokeWidth"
      />
      <!-- Fill -->
      <circle
        [attr.cx]="cx" [attr.cy]="cy" [attr.r]="r"
        fill="none"
        stroke="var(--color-yellow)"
        [attr.stroke-width]="strokeWidth"
        stroke-linecap="round"
        [attr.stroke-dasharray]="circumference"
        [attr.stroke-dashoffset]="dashOffset"
        [attr.transform]="'rotate(-90 ' + cx + ' ' + cy + ')'"
      />
      <!-- Score -->
      <text
        [attr.x]="cx" [attr.y]="cy - 6"
        text-anchor="middle"
        font-family="Montserrat, sans-serif"
        font-weight="900"
        [attr.font-size]="scoreFontSize"
        fill="#ffffff"
      >{{ score }}</text>
      <!-- Label -->
      <text
        [attr.x]="cx" [attr.y]="cy + labelOffset"
        text-anchor="middle"
        font-family="Noto Sans, sans-serif"
        font-weight="600"
        [attr.font-size]="labelFontSize"
        fill="var(--color-blue-200)"
      >/ 1000</text>
    </svg>
  `
})
export class MpiRingComponent implements OnChanges {
  @Input() score = 0;
  @Input() size = 140;
  @Input() strokeWidth = 12;
  @Input() trackColor = 'rgba(255,255,255,0.15)';

  cx = 70; cy = 70; r = 58;
  circumference = 0;
  dashOffset = 0;
  scoreFontSize = 30;
  labelFontSize = 11;
  labelOffset = 20;

  ngOnChanges() {
    this.cx = this.size / 2;
    this.cy = this.size / 2;
    this.r = this.size / 2 - this.strokeWidth;
    this.circumference = 2 * Math.PI * this.r;
    const pct = Math.min(Math.max(this.score / 1000, 0), 1);
    this.dashOffset = this.circumference * (1 - pct);
    this.scoreFontSize = Math.round(this.size * 0.215);
    this.labelFontSize = Math.round(this.size * 0.079);
    this.labelOffset = Math.round(this.size * 0.143);
  }
}
