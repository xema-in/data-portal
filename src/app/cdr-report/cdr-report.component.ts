import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { BackendService } from '../backend.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-cdr-report',
  templateUrl: './cdr-report.component.html',
  styleUrls: ['./cdr-report.component.scss']
})
export class CdrReportComponent implements OnInit {

  searchForm = this.fb.group({
    fromDate: [null, Validators.required],
    toDate: [null, Validators.required],
  });

  constructor(private service: BackendService, private fb: FormBuilder) {
    let defaultFromDate = new Date();
    if (!environment.production) defaultFromDate.setDate(defaultFromDate.getDate() - 10);
    defaultFromDate.setHours(0, 0, 0);
    this.searchForm.controls['fromDate'].setValue(defaultFromDate);
    this.searchForm.controls['toDate'].setValue(defaultFromDate);
  }

  ngOnInit(): void {
  }

  fetchData(event: any) {
    const button = event.target as HTMLButtonElement;
    button.disabled = true;

    let fileName = '';

    // this.service
    //   .cdrDownload(this.searchForm.value).subscribe((resp: any) => {
    //     saveAs(resp, fileName);
    //     setTimeout(function () {
    //       button.disabled = false;
    //     }, 30000);
    //   });

  }

}
