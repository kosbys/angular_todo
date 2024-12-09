import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../api.service';

@Component({
  selector: 'app-register',
  imports: [
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  constructor(
    private api: TaskService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  register() {
    this.api.register(this.username, this.password).subscribe({
      next: () => {
        this.snackBar.open('Registration success', 'Close', { duration: 6000 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.snackBar.open(`Register fail: ${error}`, 'Close', {
          duration: 6000,
        });
      },
    });
  }
}
