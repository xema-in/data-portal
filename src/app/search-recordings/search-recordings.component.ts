import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { BackendService } from '../backend.service';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { RecordingsPlaybackDialogComponent } from '../recordings-playback-dialog/recordings-playback-dialog.component';

@Component({
  selector: 'app-search-recordings',
  templateUrl: './search-recordings.component.html',
  styleUrls: ['./search-recordings.component.scss']
})
export class SearchRecordingsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  searchForm = this.fb.group({
    originNumber: null,
    dialledNumber: null,
    agentId: null,
    phoneId: null,
    fromDate: [null, Validators.required],
  });

  dataSource: any;

  displayedColumns = [
    'originNumber',
    'dialledNumber',
    'agentId',
    'phoneId',
    'startTimestamp',
    'totalTime',
    'agentTime',
    'recorded',
  ];

  constructor(private service: BackendService, private fb: FormBuilder, public dialog: MatDialog) {
    let defaultFromDate = new Date();
    if (!environment.production) defaultFromDate.setDate(defaultFromDate.getDate() - 10);
    defaultFromDate.setHours(0, 0, 0);
    this.searchForm.controls['fromDate'].setValue(defaultFromDate);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.service.cdrslist(this.searchForm.value).subscribe(
      (data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err) => {
        Swal.fire({ icon: 'error', title: 'Oops...', text: err.statusText });
      }
    );
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  downloadFile(call: any) {
    this.service
      .downloadfile(call.callId)
      .subscribe(
        (res: any) => {
          saveAs(res,
            call.originNumber + '_'
            + call.dialledNumber + '_'
            + call.agentId + '_'
            + call.phoneId + '_'
            + call.startTimestamp
            + '.gsm');
        },
        (err) => {
          console.log(err);
          Swal.fire({ icon: 'error', title: 'Oops...', text: err.statusText });
        }
      );
  }

  playbackFile(call: any) {
    const dialogRef = this.dialog.open(RecordingsPlaybackDialogComponent, {
      width: '500px',
      data: call,
    });
  }

}
