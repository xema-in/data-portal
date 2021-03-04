import { Injectable } from '@angular/core';
import { Rxios } from 'rxios';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppState } from './interfaces/app-state';
import { CallRecordParameters } from './interfaces/callrecord-parameters';
import { Credentials } from './interfaces/credentials';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private remote: Rxios;
  public appState = new BehaviorSubject<AppState>({ state: 'Unknown' });

  constructor() { }

  setAppState(state: AppState): void {
    this.appState.next(state);
  }

  getBackendUrl(): string | null {
    {
      let url = environment.backend;
      if (url !== null && url !== undefined && url !== '') return url;
    } {
      let url = localStorage.getItem('backend');
      if (url !== null && url !== undefined && url !== '') return url;
    }
    return null;
  }

  saveBackendUrl(url: string) {
    localStorage.setItem('backend', url);
  }

  ping(url: string) {
    const remote = new Rxios({
      baseURL: url,
    });
    return remote.get('/api/Setup/Ping');
  }

  getAuthToken(url: string, credentials: Credentials) {
    const remote = new Rxios({
      baseURL: url,
    });
    return remote.post('/api/Account/LoginAgent2', credentials);
  }

  setupConnection(url: string, token: string) {
    this.remote = new Rxios({
      baseURL: url,
      headers: {
        common: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }

  disconnect() {
    this.remote = null;
  }

  public endcall(param: any) {
    return this.remote.post("/api/Call/HangupCall", param);
  }

  cdrslist(param) {
    return this.remote.post(environment.backend + '/api/Cdrs', param);
  }

  getrecordedfile(param: CallRecordParameters) {
    return this.remote.post(environment.backend + '/api/CallRecords/Download', param);
  }


}
