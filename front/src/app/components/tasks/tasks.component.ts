import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule],
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {
  private jwt_secret = environment.jwt_secret;
  userId: string | null = null;
  tasks: any[] = [];

  constructor(private api: TaskService, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    this.decodeJwt();
    this.fetchTasks();
  }

  decodeJwt() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userId = this.jwtHelper.decodeToken(token).user_id;
    }
  }

  fetchTasks() {
    this.api.getUserTasks(this.userId!).subscribe({
      next: (res) => {
        this.tasks = res.tasks;
      },
      error: (error) => {
        // this.snackBar.open(`Error fetching tasks: ${error}`, 'Close', {
        //   duration: 6000,
        // });
      },
    });
  }

  deleteTask(taskId: string) {
    this.api.deleteTask(this.userId!, taskId).subscribe({
      next: () => {
        // this.snackBar.open('Task delete success', 'Close', { duration: 6000 });
        this.fetchTasks();
      },
      error: (error) => {
        // this.snackBar.open('Error deleting task', 'Close', { duration: 6000 });
      },
    });
  }
}
