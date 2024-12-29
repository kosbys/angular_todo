import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
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

  constructor(private router: Router, private jwtHelper: JwtHelperService) {
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
    if (token) {
      this.user = this.jwtHelper.decodeToken(token);
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
