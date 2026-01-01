import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrl: './app.component.css',

  
})
export class AppComponent {
  title = 'front-end';
   showNav = true;
  showFooter = true;

   constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentUrl = event.urlAfterRedirects;
        this.showNav = !['/connexion', '/inscription'].includes(currentUrl);
        this.showFooter = !['/connexion', '/inscription'].includes(currentUrl);
      }
    });
  }
}
