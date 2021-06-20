import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Swal from 'sweetalert2';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-report-header',
  templateUrl: './report-header.component.html',
  styleUrls: ['./report-header.component.scss']
})
export class ReportHeaderComponent implements OnChanges {

  @Input() reportConfig: any;

  permissions: { scope: string, name: string }[] = [];


  constructor(private service: BackendService) { }

  ngOnChanges(changes: SimpleChanges): void {

    // evaluate permissions
    this.permissions = [];
    const perms: string[] = changes.reportConfig.currentValue.permissions?.split(';');

    if (perms === undefined) {
      return;
    }

    perms.forEach((perm) => {
      const parts: string[] = perm.split(':');
      if (parts.length === 2) {
        let scope: string;
        if (parts[0].toUpperCase() === 'OWNER') { scope = 'Owner'; }
        else if (parts[0].toUpperCase() === 'USER') { scope = 'User'; }
        else if (parts[0].toUpperCase() === 'ROLE') { scope = 'Role'; }
        this.permissions.push({ scope, name: parts[1] });
      }
    });

  }

  removePermission({ scope, name }): void {
    console.log(scope, name);
    console.log(this.reportConfig);

    this.service.removePermission(this.reportConfig.id, { scope, name }).subscribe(() => {
      this.permissions = this.permissions.filter(x => x.scope !== scope && x.name !== name);
    }, err => {
      Swal.fire({ icon: 'error', title: 'Oops...', text: err.message });
    });

  }



}
