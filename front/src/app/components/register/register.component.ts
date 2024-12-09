import { Component } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { TaskService } from '../../api.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  constructor(private api: TaskService, private router: Router) {}

  register() {
    this.api.register(this.username, this.password).subscribe({
      next: () => {
        // this.snackBar.open('Registration success', 'Close', { duration: 6000 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        // this.snackBar.open(`Register fail: ${error}`, 'Close', {
        //   duration: 6000,
        // });
      },
    });
  }
}
