import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AudioPlayerComponent, Track } from '@xema/audio-player';
import Swal from 'sweetalert2';
import { BackendService } from '../backend.service';
import { KeyValuePair } from '../interfaces/key-value-pair';

@Component({
  selector: 'app-recordings-playback-dialog',
  templateUrl: './recordings-playback-dialog.component.html',
  styleUrls: ['./recordings-playback-dialog.component.scss'],
  providers: [DatePipe]
})
export class RecordingsPlaybackDialogComponent implements OnInit, AfterViewInit {
  @ViewChild(AudioPlayerComponent, { static: false }) player!: AudioPlayerComponent;

  values: KeyValuePair[] = [];

  hasFile = false;
  playlist: Track[] = [{
    link: '',
    title: 'Call Audio',
  }];

  constructor(
    public dialogRef: MatDialogRef<RecordingsPlaybackDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: BackendService,
    private sanitizer: DomSanitizer,
    private datepipe: DatePipe) {

    this.values = [
      { name: 'ANI', value: data?.OriginNumber },
      { name: 'DNI', value: data?.DialledNumber },
      { name: 'Agent Id', value: data?.AgentId },
      { name: 'Phone Id', value: data?.PhoneId },
      { name: 'Start Time', value: this.datepipe.transform(data?.StartTimestamp, 'dd/MM/yyyy HH:mm:ss') },
    ];

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.player.repeat = 'none';

    this.service
      .getPlaybackWavFile(this.data.reportId, this.data.CallId)
      .subscribe(
        (res: any) => {
          const link: any = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(res));
          this.player.audioPlayerService.setPlaylist([{
            link,
            title: 'Call Audio',
          }]);
          this.hasFile = true;
        },
        (err) => {
          console.log(err);
          Swal.fire({ icon: 'error', title: 'Oops...', text: err.statusText });
        }
      );

  }

  onEnded(event: any): void {
  }

  onClose(): void {
    this.dialogRef.close();
  }

}
