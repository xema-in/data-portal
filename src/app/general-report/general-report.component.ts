import * as XLSX from 'xlsx';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-general-report',
  templateUrl: './general-report.component.html',
  styleUrls: ['./general-report.component.scss']
})
export class GeneralReportComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  groupId: number;
  reportId: number;

  reportConfig: any = {};

  searchForm = new FormGroup({});

  enabledFilterControls = {
    agentId: false,
    phoneId: false,
    fromDate: false,
    toDate: false,
    search: false,
  };

  permissions: { scope: string, name: string }[] = [];

  dataSource: any;
  displayedColumns = [];

  constructor(private route: ActivatedRoute, private service: BackendService) {
    this.route.params.subscribe(params => {
      this.groupId = params.groupId;
      this.reportId = params.reportId;
    });
  }

  ngOnInit(): void {
    this.service.getReportConfig(this.reportId).subscribe((config) => {
      this.reportConfig = config;

      // process filter options
      const filterOptions: string[] = this.reportConfig.filterOptions?.toUpperCase().split(';');

      if (filterOptions.lastIndexOf('AGENT-ID') >= 0) {
        this.searchForm.addControl('agentId', new FormControl(''));
        this.enabledFilterControls.agentId = this.enabledFilterControls.search = true;
      }

      if (filterOptions.lastIndexOf('PHONE-ID') >= 0) {
        this.searchForm.addControl('phoneId', new FormControl(''));
        this.enabledFilterControls.phoneId = this.enabledFilterControls.search = true;
      }

      if (filterOptions.lastIndexOf('FROM-DATE') >= 0) {
        this.searchForm.addControl('fromDate', new FormControl('', Validators.required));
        this.enabledFilterControls.fromDate = this.enabledFilterControls.search = true;
      }

      if (filterOptions.lastIndexOf('TO-DATE') >= 0) {
        this.searchForm.addControl('toDate', new FormControl('', Validators.required));
        this.enabledFilterControls.toDate = this.enabledFilterControls.search = true;
      }

      // evaluate permissions
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
  }

  applyFilter(event: any): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  fetchData(): void {
    this.service.getJsonReport(this.reportId, this.searchForm.value).subscribe((resp: any[]) => {
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayedColumns = Object.keys(resp[0]);
    });
  }

  exportToExcel(): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    XLSX.utils.book_append_sheet(wb, ws, this.reportConfig.name);
    XLSX.writeFile(wb, this.reportConfig.name + '-' + new Date().valueOf() + '.xlsx');
  }


}
