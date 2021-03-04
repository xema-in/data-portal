import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppState } from './interfaces/app-state';
import { Credentials } from './interfaces/credentials';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  private baseUrl: string;
  private token: string;

  public appState = new BehaviorSubject<AppState>({ state: 'Unknown' });

  constructor(private remote: HttpClient) { }

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

  ping(baseUrl: string) {
    return this.remote.get(baseUrl + '/api/Setup/Ping');
  }

  generateAuthToken(baseUrl: string, credentials: Credentials) {
    return this.remote.post(baseUrl + '/api/Account/LoginAgent2', credentials);
  }

  setupConnection(baseUrl: string, token: string) {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  disconnect() {
    this.token = null;
  }

  cdrslist(param) {
    return this.remote.post(this.baseUrl + '/api/SearchCallRecording', param);
  }

  downloadfile(callId) {
    return this.remote.get(this.baseUrl + '/api/DownloadCallRecording/' + callId, { responseType: 'blob' });
  }

  getwavfile(callId) {
    return this.remote.get(this.baseUrl + '/api/CallRecordingPlayBack/' + callId, { responseType: 'blob' });
  }

  cdrDownload(param: any) {
    return this.remote.post(this.baseUrl + '/api/SimpleCdrReports/GetFormattedReport', param, { responseType: 'blob' });
  }

}
