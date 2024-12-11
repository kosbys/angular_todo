import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

type userJwt = {
  user_id: string;
  username: string;
  iat: number;
  exp: number;
};

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password });
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  getUserTasks(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/tasks`);
  }

  getTask(userId: string, taskId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${userId}/${taskId}`);
  }

  addTask(user: string, task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${user}/task`, task);
  }

  updateTask(user: string, taskId: string, task: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${user}/tasks/${taskId}`, task);
  }

  deleteTask(userId: string, taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}/tasks/${taskId}`);
  }
}
