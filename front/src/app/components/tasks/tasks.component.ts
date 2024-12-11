import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../api.service';
import { CommonModule } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import flatpickr from 'flatpickr';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-tasks',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css',
})

// replace snackbar with toast, make a form and map tasks and enable task crud
export class TasksComponent implements OnInit {
  dialog: HTMLDialogElement | null;
  taskForm: FormGroup;
  editTaskForm: FormGroup;
  userId: string | null = null;
  taskEditId: string | null = null;
  tasks: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private api: TaskService,
    private jwtHelper: JwtHelperService
  ) {
    this.dialog = null;
    this.taskForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      due: ['', [Validators.required]],
    });

    this.editTaskForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      due: ['', [Validators.required]],
      done: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.dialog = document.getElementById(
      'edit-task-dialog'
    ) as HTMLDialogElement;
    this.decodeJwt();
    this.fetchTasks();
    flatpickr('#datepicker', {
      dateFormat: 'Y-m-d',
    });

    flatpickr('#datepickerEdit', {
      dateFormat: 'Y-m-d',
      static: true,
    });
  }

  decodeJwt() {
    const token = localStorage.getItem('token');
    if (token) {
      this.userId = this.jwtHelper.decodeToken(token).user_id;
    }
  }

  openEditModal(task: any) {
    this.taskEditId = task;
    this.api.getTask(this.userId!, task).subscribe({
      next: (res) => {
        this.editTaskForm.setValue({
          title: res.task.title,
          description: res.task.description,
          due: new Date(res.task.due).toISOString().split('T')[0],
          done: res.task.done,
        });
      },
      error: (err) => {
        console.error(err);
      },
    });

    this.dialog?.showModal();
  }

  fetchTasks() {
    this.api.getUserTasks(this.userId!).subscribe({
      next: (res) => {
        this.tasks = res.tasks;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  addTask() {
    if (this.taskForm.valid) {
      this.api.addTask(this.userId!, this.taskForm.value).subscribe({
        next: (res) => {
          console.log(res.message);
          this.fetchTasks();
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  deleteTask(taskId: string) {
    this.api.deleteTask(this.userId!, taskId).subscribe({
      next: (res) => {
        console.log(res.message);

        this.fetchTasks();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  editTask(taskId: string) {
    if (this.editTaskForm.valid) {
      this.api
        .updateTask(this.userId!, taskId, this.editTaskForm.value)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.fetchTasks();
            this.dialog!.close();
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }
}
