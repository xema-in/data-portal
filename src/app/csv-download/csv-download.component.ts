import { saveAs } from 'file-saver';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-csv-download',
  templateUrl: './csv-download.component.html',
  styleUrls: ['./csv-download.component.scss']
})
export class CsvDownloadComponent implements OnInit {

  groupId: number;
  reportId: number;

  reportConfig: any = {};

  searchForm = new FormGroup({});

  enabledFilterControls = {
    agentId: false,
    phoneId: false,
    fromDate: false,
    toDate: false,
    download: false,
  };

  permissions: { scope: string, name: string }[] = [];

  constructor(private route: ActivatedRoute, private service: BackendService) {
    this.route.params.subscribe(params => {
      this.groupId = params.groupId;
      this.reportId = params.reportId;

      this.service.getReportConfig(this.reportId).subscribe((config) => {
        this.reportConfig = config;

        // process filter options
        const filterOptions: string[] = this.reportConfig.filterOptions?.toUpperCase().split(';');

        if (filterOptions.lastIndexOf('AGENT-ID') >= 0) {
          this.searchForm.addControl('agentId', new FormControl(''));
          this.enabledFilterControls.agentId = this.enabledFilterControls.download = true;
        }

        if (filterOptions.lastIndexOf('PHONE-ID') >= 0) {
          this.searchForm.addControl('phoneId', new FormControl(''));
          this.enabledFilterControls.phoneId = this.enabledFilterControls.download = true;
        }

        if (filterOptions.lastIndexOf('FROM-DATE') >= 0) {
          this.searchForm.addControl('fromDate', new FormControl('', Validators.required));
          this.enabledFilterControls.fromDate = this.enabledFilterControls.download = true;
        }

        if (filterOptions.lastIndexOf('TO-DATE') >= 0) {
          this.searchForm.addControl('toDate', new FormControl('', Validators.required));
          this.enabledFilterControls.toDate = this.enabledFilterControls.download = true;
        }

        // evaluate permissions
        this.permissions = [];
        const perms: string[] = this.reportConfig.permissions?.split(';');
        perms.forEach((perm) => {
          const parts: string[] = perm.split(':');
          if (parts.length === 2) {
            let scope: string;
            if (parts[0].toUpperCase() === 'OWNER') { scope = 'owner'; }
            else if (parts[0].toUpperCase() === 'USER') { scope = 'user'; }
            else if (parts[0].toUpperCase() === 'ROLE') { scope = 'group'; }
            this.permissions.push({ scope, name: parts[1] });
          }
        });

      });

    });
  }

  ngOnInit(): void {
  }

  fetchData(): void {

    const fileName = 'csv-' + this.reportId + '-' + new Date().valueOf() + '.csv';
    this.service
      .getCsvReport(this.reportId, this.searchForm.value).subscribe((resp: any) => {
        saveAs(resp, fileName);
      });

  }

}
