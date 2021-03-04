import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'data-portal';

  constructor(service: BackendService, private router: Router) {
    service.appState.subscribe((state) => {
      switch (state.state) {

        case "Unknown": {
          this.router.navigateByUrl("/server");
          break;
        }

        case "ServerFound": {
          this.router.navigateByUrl("/login");
          break;
        }

        case "LoggedIn": {
          this.router.navigateByUrl("/recordings/search");
          break;
        }

        default: {
          console.log("Unhandled App State: " + state.state);
          break;
        }
      }
    });
  }

}
