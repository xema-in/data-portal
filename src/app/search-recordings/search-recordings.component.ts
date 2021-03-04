import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { BackendService } from '../backend.service';
import { QueryParameters } from '../interfaces/query-parameters';
import { FormBuilder, Validators } from '@angular/forms';

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
  fileName: any;

  displayedColumns = [
    'originNumber',
    'dialledNumber',
    'agentId',
    'phoneId',
    'startTimestamp',
    'totalTime',
    'recordingFileName',
  ];

  constructor(private service: BackendService, private fb: FormBuilder) {
    let defaultFromDate = new Date();
    // defaultFromDate.setDate(defaultFromDate.getDate() - 10);
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

  downloadFile(fileName: string) {
    this.fileName = fileName.split('/');
    this.service
      .getrecordedfile({
        filename: fileName,
      })
      .subscribe(
        (res: any) => {
          var blob = this.base64ToBlob(res, 'text/plain');
          saveAs(blob, this.fileName[this.fileName.length - 1]);
        },
        (err) => {
          console.log(err);
          Swal.fire({ icon: 'error', title: 'Oops...', text: err.statusText });
        }
      );
  }

  base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

}
