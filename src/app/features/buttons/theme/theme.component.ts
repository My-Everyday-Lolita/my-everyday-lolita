import { Component, OnInit, TemplateRef, ViewChild, Input, OnDestroy, HostListener, HostBinding } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from '../../theme/theme.service';

@Component({
  selector: 'app-theme, [theme-button]',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
})
export class ThemeComponent implements OnInit, OnDestroy {

  @Input() theme?: string;

  icon?: TemplateRef<any>;

  @HostBinding('class.current')
  current?: boolean;

  @ViewChild('sweet', { static: true }) sweetIcon: any;
  @ViewChild('gothic', { static: true }) gothicIcon: any;
  @ViewChild('classic', { static: true }) classicIcon: any;

  private unsubscriber = new Subject();

  constructor(
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.current = this.themeService.theme === this.theme;
    this.themeService.theme$.pipe(takeUntil(this.unsubscriber)).subscribe(theme => {
      this.current = this.theme === theme;
    });
    if (this.theme) {
      switch (this.theme) {
        case 'sweet':
          this.icon = this.sweetIcon;
          break;
        case 'gothic':
          this.icon = this.gothicIcon;
          break;
        case 'classic':
          this.icon = this.classicIcon;
          break;

        default:
          break;
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscriber.next();
    this.unsubscriber.complete();
  }

  @HostListener('click')
  onClick(): void {
    if (this.theme) {
      this.themeService.setTheme(this.theme);
    }
  }

}
