import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TaskService } from '../../api.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private api: TaskService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.api.login(username, password).subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.log(error.error.error);
          this.errorMessage = error.error.error;
        },
      });
    } else {
      this.errorMessage = 'Do not leave any empty fields';
    }
  }
}
