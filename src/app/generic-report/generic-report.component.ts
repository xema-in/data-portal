import * as XLSX from 'xlsx';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-generic-report',
  templateUrl: './generic-report.component.html',
  styleUrls: ['./generic-report.component.scss']
})
export class GenericReportComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('TABLE') table: ElementRef;

  groupId: number;
  reportId: number;

  reportConfig: any = {};
  columnAltNames: any = {};

  searchForm = new FormGroup({});

  enabledFilterControls = {
    agentId: false,
    phoneId: false,
    fromDate: false,
    toDate: false,
    search: false,
  };

  dataSource: any;
  displayedColumns = [];

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

      });

    });
  }

  ngOnInit(): void {
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

      if (resp.length > 0) {
        this.displayedColumns = Object.keys(resp[0]);

        // read column alt names
        Object.keys(resp[0]).forEach((colName) => {
          this.columnAltNames[colName] = colName.toUpperCase();
        });

        const columnAltNames: string[] = this.reportConfig.columnAltNames?.split(';');
        if (columnAltNames !== undefined) {
          columnAltNames.forEach((altName) => {
            const parts: string[] = altName.split(':');
            if (parts.length === 2) {
              this.columnAltNames[parts[0]] = parts[1];
            }
          });
        }
      }

    });
  }

  exportToExcel(): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
    XLSX.utils.book_append_sheet(wb, ws, this.reportConfig.name);
    XLSX.writeFile(wb, this.reportConfig.name + '-' + new Date().valueOf() + '.xlsx');
  }


}
