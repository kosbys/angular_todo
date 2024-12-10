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

  addTask(user: userJwt, task: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${user.user_id}/task`, task);
  }

  updateTask(user: userJwt, taskId: string, task: any): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/users/${user.user_id}/tasks/${taskId}`,
      task
    );
  }

  deleteTask(userId: string, taskId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}/tasks/${taskId}`);
  }
}
