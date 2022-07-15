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

  private baseUrl!: string;
  private token!: string | null;
  private userId!: string;

  public appState = new BehaviorSubject<AppState>({ state: 'Unknown' });

  constructor(private remote: HttpClient) { }

  setAppState(state: AppState): void {
    this.appState.next(state);
  }

  getBackendUrl(): string | null {

    if (!environment.production) {
      const url = environment.dev.server;
      if (url !== null && url !== undefined && url !== '') {
        return url;
      }
    }

    if (true) {
      const url = environment.backend;
      if (url !== null && url !== undefined && url !== '') {
        return url;
      }
    }

    if (true) {
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
    this.userId = credentials.username;
    return this.remote.post(baseUrl + '/api/Account/LoginAgent2', credentials);
  }

  setupConnection(baseUrl: string, token: string): void {
    this.baseUrl = baseUrl;
    this.token = token;
  }

  getToken(): string | null {
    return this.token;
  }

  getCurrentUserId(): string {
    return this.userId;
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

  getCsvReport(reportId: number, param: any): Observable<any> {
    return this.remote.post(this.baseUrl + '/api/Reports/CsvReport/' + reportId, param, { responseType: 'blob' });
  }

  downloadCallRecording(reportId: number, callId: string): Observable<any> {
    return this.remote.get(this.baseUrl + '/api/Reports/DownloadCallRecording/' + reportId + '/' + callId, { responseType: 'blob' });
  }

  getPlaybackWavFile(reportId: number, callId: string): Observable<any> {
    return this.remote.get(this.baseUrl + '/api/Reports/CallRecordingPlayBack/' + reportId + '/' + callId, { responseType: 'blob' });
  }

  downloadCdr(reportId: number, param: any): Observable<any> {
    return this.remote.post(this.baseUrl + '/api/Reports/CdrDownload2/' + reportId, param, { responseType: 'blob' });
  }

  removePermission(id: number, params: { scope: string, name: string }): Observable<any> {
    return this.remote.post(this.baseUrl + '/api/Reports/RemovePermission/' + id, params);
  }

  addPermission(id: number, params: { scope: string, name: string }): Observable<any> {
    return this.remote.post(this.baseUrl + '/api/Reports/AddPermission/' + id, params);
  }

}
