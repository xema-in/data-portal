import { saveAs } from 'file-saver'
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-cdr-download',
  templateUrl: './cdr-download.component.html',
  styleUrls: ['./cdr-download.component.scss']
})
export class CdrDownloadComponent {

  groupId!: number;
  reportId!: number;

  reportConfig: any = {};

  searchForm = new FormGroup({
    fromDate: new FormControl('', Validators.required),
    toDate: new FormControl('', Validators.required)
  });

  constructor(private route: ActivatedRoute, private service: BackendService) {
    this.route.params.subscribe((params: any) => {
      this.groupId = params.groupId;
      this.reportId = params.reportId;

      this.service.getReportConfig(this.reportId).subscribe((config) => {
        this.reportConfig = config;
      });

    });
  }

  fetchData(): void {

    const fileName = 'cdr-' + this.reportId + '-' + new Date().valueOf() + '.csv';
    this.service
      .downloadCdr(this.reportId, this.searchForm.value).subscribe((resp: any) => {
        saveAs(resp, fileName);
      });

  }

}
