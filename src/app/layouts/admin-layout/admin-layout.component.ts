import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import PerfectScrollbar from 'perfect-scrollbar';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
  private _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor(
    public location: Location,
    private router: Router,
    private renderer: Renderer2 // Inyección de Renderer2
  ) {}

  ngOnInit() {
    const isWindows = navigator.platform.indexOf('Win') > -1;

    if (isWindows && !document.body.classList.contains('sidebar-mini')) {
      this.renderer.addClass(document.body, 'perfect-scrollbar-on');
    } else {
      this.renderer.removeClass(document.body, 'perfect-scrollbar-off');
    }

    const elemMainPanel = document.querySelector('.main-panel') as HTMLElement;
    const elemSidebar = document.querySelector('.sidebar .sidebar-wrapper') as HTMLElement;

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url !== this.lastPoppedUrl) {
          this.yScrollStack.push(window.scrollY);
        }
      } else if (event instanceof NavigationEnd) {
        if (event.url === this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else {
          window.scrollTo(0, 0);
        }
      }
    });

    this._router = this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        elemMainPanel.scrollTop = 0;
        elemSidebar.scrollTop = 0;
      });

    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      new PerfectScrollbar(elemMainPanel);
      new PerfectScrollbar(elemSidebar);
    }

    // Additional setup for sidebar color changes and background image changes
    const sidebar = document.querySelector('.sidebar');
    const sidebarResponsive = document.body.querySelector('.navbar-collapse');

    document.querySelectorAll('.fixed-plugin .badge').forEach((badge: HTMLElement) => {
      badge.addEventListener('click', () => {
        const newColor = badge.getAttribute('data-color');
        if (sidebar) {
          this.renderer.setAttribute(sidebar, 'data-color', newColor);
        }
        if (sidebarResponsive) {
          this.renderer.setAttribute(sidebarResponsive, 'data-color', newColor);
        }
      });
    });

    document.querySelectorAll('.fixed-plugin .img-holder').forEach((imgHolder: HTMLElement) => {
      imgHolder.addEventListener('click', () => {
        const newImage = imgHolder.querySelector('img')?.getAttribute('src');
        const sidebarImgContainer = document.querySelector('.sidebar-background') as HTMLElement;
        const fullPageBackground = document.querySelector('.full-page-background') as HTMLElement;

        if (sidebarImgContainer) {
          this.renderer.setStyle(sidebarImgContainer, 'backgroundImage', `url(${newImage})`);
        }
        if (fullPageBackground) {
          this.renderer.setStyle(fullPageBackground, 'backgroundImage', `url(${newImage})`);
        }
        if (sidebarResponsive) {
          this.renderer.setStyle(sidebarResponsive, 'backgroundImage', `url(${newImage})`);
        }
      });
    });
  }

  ngAfterViewInit() {
    this.runOnRouteChange();
  }

  isMaps(path: string): boolean {
    const titlee = this.location.prepareExternalUrl(this.location.path()).slice(1);
    return path !== titlee;
  }

  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = document.querySelector('.main-panel') as HTMLElement;
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }

  isMac(): boolean {
    return /Mac|iPad/.test(navigator.platform);
  }
}
