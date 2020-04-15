import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { RoutePath, RouteInfo } from './variables/icommon';
import { browser, Browser } from 'protractor';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private path: RouteInfo[] = [];
  constructor(
    private router: Router,
    private location: Location,
  ) { }
  @HostListener('window:unload', ['$event'])
  unloadHandler(event) {
    // browser.getAllWindowHandles().then(
    //   result => {
    //     console.log(result);
    //   }
    // );
    // localStorage.clear();
    // let gettingAll = browser.windows.getAll({ populate: true });

  }
  // ngOnChanges() {
  //   console.log(this.router.url);
  // }

  ngOnInit() {
    this.path = RoutePath;
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        // if (
        //   event.id === 1 &&
        //   event.url === event.urlAfterRedirects
        // )
        if (event.url === event.urlAfterRedirects) {
          if (!localStorage.getItem('permission')) {
            this.router.navigateByUrl('', { replaceUrl: true });
          } else {
            if (this.path.filter(
              x => x.permission === localStorage.getItem('permission') && x.path === this.router.url
            ).length === 0) {
              this.router.navigateByUrl('**', { replaceUrl: true });
            }
          }
        }
      });
  }

  ngOnDestroy() {
    // console.log(this.router.url);
  }

}
