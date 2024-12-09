import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../api.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tasks',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    MatListItem,
    MatIconModule,
  ],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  userId: string | null = null;
  tasks: any[] = [];

  constructor(private api: TaskService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.decodeJwt();
    this.fetchTasks();
  }

  decodeJwt() {
    const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage

    this.userId = jwtDecode(token!);
  }

  fetchTasks() {
    this.api.getUserTasks(this.userId!).subscribe({
      next: (res) => {
        this.tasks = res.tasks;
      },
      error: (error) => {
        this.snackBar.open(`Error fetching tasks: ${error}`, 'Close', {
          duration: 6000,
        });
      },
    });
  }

  deleteTask(taskId: string) {
    this.api.deleteTask(this.userId!, taskId).subscribe({
      next: () => {
        this.snackBar.open('Task delete success', 'Close', { duration: 6000 });
        this.fetchTasks();
      },
      error: (error) => {
        this.snackBar.open('Error deleting task', 'Close', { duration: 6000 });
      },
    });
  }
}
