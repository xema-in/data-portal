import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
      const url = environment.backend;
      if (url !== null && url !== undefined && url !== '') {
        return url;
      }
    }
    {
      const url = localStorage.getItem('backend');
      if (url !== null && url !== undefined && url !== '') {
        return url;
      }
    }
    return null;
  }

  saveBackendUrl(url: string): void {
    localStorage.setItem('backend', url);
  }

  ping(baseUrl: string): Observable<any> {
    return this.remote.get(baseUrl + '/api/Setup/Ping');
  }

  generateAuthToken(baseUrl: string, credentials: Credentials): Observable<any> {
    return this.remote.post(baseUrl + '/api/Account/LoginAgent2', credentials);
  }

  setupConnection(baseUrl: string, token: string): void {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  disconnect(): void {
    this.token = null;
  }

  getReportGroups(): Observable<any> {
    return this.remote.get(this.baseUrl + '/api/Reports/ReportGroups');
  }

  getEnabledReports(): Observable<any> {
    return this.remote.get(this.baseUrl + '/api/Reports/Reports');
  }

  getReportConfig(id: number): Observable<any> {
    return this.remote.get(this.baseUrl + '/api/Reports/ReportConfig/' + id);
  }

  getJsonReport(id: number, params: any): Observable<any> {
    return this.remote.post(this.baseUrl + '/api/Reports/JsonReport/' + id, params);
  }

  cdrslist(param: any): Observable<any> {
    return this.remote.post(this.baseUrl + '/api/SearchCallRecording', param);
  }

  downloadfile(callId): Observable<any> {
    return this.remote.get(this.baseUrl + '/api/DownloadCallRecording/' + callId, { responseType: 'blob' });
  }

  getwavfile(callId): Observable<any> {
    return this.remote.get(this.baseUrl + '/api/CallRecordingPlayBack/' + callId, { responseType: 'blob' });
  }

  cdrDownload(param: any): Observable<any> {
    return this.remote.post(this.baseUrl + '/api/SimpleCdrReports/GetFormattedReport', param, { responseType: 'blob' });
  }

  missedcallsDownload(param: any): Observable<any> {
    return this.remote.post(this.baseUrl + '/api/MissedCallReport', param);
  }

}
