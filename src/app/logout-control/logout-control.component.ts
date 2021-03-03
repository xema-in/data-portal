import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-logout-control',
  templateUrl: './logout-control.component.html',
  styleUrls: ['./logout-control.component.scss']
})
export class LogoutControlComponent implements OnInit {

  constructor(private service: BackendService) { }

  ngOnInit(): void {
  }

  logoff() {
    this.service.disconnect();
    this.service.setAppState({ state: 'ServerFound' });
  }

}
