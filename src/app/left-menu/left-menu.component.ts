import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {
  groups: Array<any> = [];
  reports: Array<any> = [];

  constructor(private service: BackendService) { }

  ngOnInit(): void {
    this.service.getReportGroups().subscribe((groups: any) => { this.groups = groups; })
    this.service.getEnabledReports().subscribe((reports: any) => { this.reports = reports; })
  }

  groupHasReports(groupId): boolean {
    if (this.reports.find(x => x.reportGroupId === groupId)) return true;
    return false;
  }

  getFilteredReports(groupId) {
    return this.reports.filter((r) => {
      return r.reportGroupId === groupId;
    })
  }

}
