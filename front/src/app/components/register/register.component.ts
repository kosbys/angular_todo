import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TaskService } from '../../api.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private api: TaskService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  register() {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;

      this.api.register(username, password).subscribe({
        next: () => {
          this.router.navigate(['/login']);
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
