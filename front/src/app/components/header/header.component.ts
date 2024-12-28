import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

type User = { user_id: string; username: string } | null;

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  user: User;

  constructor(private router: Router) {
    this.user = null;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkLoggedStatus();
      }
    });
  }

  checkLoggedStatus() {
    const token = localStorage.getItem('token');

    this.user = token ? jwtDecode(token) : null;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
