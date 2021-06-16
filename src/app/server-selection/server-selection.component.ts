import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-server-selection',
  templateUrl: './server-selection.component.html',
  styleUrls: ['./server-selection.component.scss']
})
export class ServerSelectionComponent implements OnInit {

  public serverSelectionForm: FormGroup = new FormGroup({
    serverIp: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  });

  constructor(private service: BackendService) {
  }

  ngOnInit(): void {

    const url = this.service.getBackendUrl();
    if (url !== null) {
      this.service.setAppState({ state: 'ServerFound' });
    }
    else {
      const detectedServerName = location.hostname + (location.port ? ':' + location.port : '');
      const detectedProtocol = location.protocol;

      this.service.ping(detectedProtocol + '//' + detectedServerName).subscribe(() => {
        this.serverSelectionForm.controls.serverIp.setValue(detectedServerName);
      });
    }

  }

  public hasError = (controlName: string, errorName: string) => {
    return this.serverSelectionForm.controls[controlName].hasError(errorName);
  }

  saveIpAddress(): void {
    let url = this.serverSelectionForm.value.serverIp;

    if (!url.startsWith('http:') && !url.startsWith('https:')) {
      url = location.protocol + '//' + url;
    }

    this.service.saveBackendUrl(url);
    this.service.setAppState({ state: 'ServerFound' });
  }

}
