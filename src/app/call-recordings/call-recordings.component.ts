import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BackendService } from '../backend.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { RecordingsPlaybackDialogComponent } from '../recordings-playback-dialog/recordings-playback-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-call-recordings',
  templateUrl: './call-recordings.component.html',
  styleUrls: ['./call-recordings.component.scss']
})
export class CallRecordingsComponent {

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
    ani: false,
    dni: false,
    fromDate: false,
    toDate: false,
    search: false,
  };

  permissions: { scope: string, name: string }[] = [];

  dataSource: any;
  displayedColumns = [];

  constructor(private route: ActivatedRoute, private service: BackendService, public dialog: MatDialog) {
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

        if (filterOptions.lastIndexOf('ANI') >= 0) {
          this.searchForm.addControl('ani', new FormControl(''));
          this.enabledFilterControls.ani = this.enabledFilterControls.search = true;
        }

        if (filterOptions.lastIndexOf('DNI') >= 0) {
          this.searchForm.addControl('dni', new FormControl(''));
          this.enabledFilterControls.dni = this.enabledFilterControls.search = true;
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
        this.displayedColumns = Object.keys(resp[0]).filter(x => x !== 'CallId');

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

  downloadFile(call: any): void {
    if (!environment.production) {
      console.log(call);
    }

    this.service
      .downloadCallRecording(this.reportId, call.CallId)
      .subscribe(
        (res: any) => {
          saveAs(res,
            call.OriginNumber + '_'
            + call.DialledNumber + '_'
            + call.AgentId + '_'
            + call.PhoneId + '_'
            + call.StartTimestamp
            + '.gsm');
        },
        (err) => {
          console.log(err);
          Swal.fire({ icon: 'error', title: 'Oops...', text: err.statusText });
        }
      );
  }

  playbackFile(call: any): void {
    call.reportId = this.reportId;
    const dialogRef = this.dialog.open(RecordingsPlaybackDialogComponent, {
      width: '500px',
      data: call,
      panelClass: 'my-dialog',
    });
  }


}
