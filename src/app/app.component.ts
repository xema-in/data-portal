import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BackendService } from './backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'data-portal';

  constructor(service: BackendService, private router: Router) {
    service.appState.subscribe((state: any) => {

      if (!environment.production) {
        console.log(state);
      }

      switch (state.state) {

        case 'Unknown': {
          this.router.navigateByUrl('/a/server');
          break;
        }

        case 'ServerFound': {
          this.router.navigateByUrl('/a/login');
          break;
        }

        case 'LoggedIn': {
          this.router.navigateByUrl('');
          break;
        }

        default: {
          console.log('Unhandled App State: ' + state.state);
          break;
        }
      }
    });
  }

}
