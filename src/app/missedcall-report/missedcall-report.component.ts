import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { BackendService } from '../backend.service';
import * as XLSX from 'xlsx';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ElementRef } from '@angular/core';


@Component({
  selector: 'app-missedcall-report',
  templateUrl: './missedcall-report.component.html',
  styleUrls: ['./missedcall-report.component.scss']
})
export class MissedcallReportComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;
  busy = false;

  searchForm = this.fb.group({
    fromDate: [null, Validators.required],
    toDate: [null, Validators.required],
    agentId: [null],
  });

  dataSource: any;

  displayedColumns = [
    // 'date',
    'agentId',
    'phoneId',
    'originNumber',
    'dialledNumber',
    'queueName',
    'callId',
    'channel',
    'timestamp',
  ];
  constructor(private service: BackendService, private fb: FormBuilder) {
    let defaultFromDate = new Date();
    // if (!environment.production) defaultFromDate.setDate(defaultFromDate.getDate() - 10);
    defaultFromDate.setHours(0, 0, 0);
    this.searchForm.controls['fromDate'].setValue(defaultFromDate);
    this.searchForm.controls['toDate'].setValue(defaultFromDate);
    this.searchForm.controls['agentId'].setValue(null);
  }
  ngOnInit(): void {
    this.fetchData();
  }
  fetchData() {
    this.busy = true;
    this.service
      .missedcallsDownload(this.searchForm.value).subscribe((resp: any) => {
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.busy = false;
      });

  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(
      this.table.nativeElement
    );
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    /* save to file */
    XLSX.writeFile(wb, 'Missed Calls-' + new Date().valueOf() + '.xlsx');
  }
}
