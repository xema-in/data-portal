import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {


  loginForm = new FormGroup({
    username: new FormControl('', [
      Validators.required, Validators.maxLength(60),
      // Validators.pattern('[a-zA-Z1-9]*')
    ]),
    password: new FormControl('', [Validators.required, Validators.maxLength(100)])
  });

  manager: string;

  constructor(private service: BackendService) {
    this.manager = service.getBackendUrl() ?? '';
  }

  ngOnInit(): void {
    if (!environment.production) {
      this.loginForm.controls.username.setValue(environment.dev.username);
      this.loginForm.controls.password.setValue(environment.dev.password);
      this.submit();
    }
  }

  public hasError = (controlName: string, errorName: string) => {
    // return this.loginForm.controls[controlName].hasError(errorName);
    return false;
  }

  submit(): void {

    this.service.generateAuthToken(this.manager, {
      username: this.loginForm.value.username ?? '',
      password: this.loginForm.value.password ?? '',
    }).subscribe(
      (data: any) => {
        this.service.setupConnection(this.manager, data.auth_token);
        this.service.setAppState({ state: 'LoggedIn' });
      },
      err => {
        if (err.response !== undefined) { err = err.response; }
        if (err.status === 401) {
          Swal.fire({
            icon: 'error',
            title: 'Authentication failed!',
            text: 'It seems you haven\'t entered valid credentials. Check your User Name and Password!'
          });
        } else {
          Swal.fire({ icon: 'error', title: 'Oops...', text: err.message });
        }
      }
    );

  }
}
