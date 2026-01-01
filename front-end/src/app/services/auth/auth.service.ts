import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string; // optionnel selon ton modèle
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = 'http://localhost:8000/api';
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient, private router: Router) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

 register(data: FormData) {
  return this.http.post('http://localhost:8000/api/register', data);
}


  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.api}/login`, data).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this.loggedIn.next(true);

        // Si tu reçois des infos utilisateur, tu peux aussi les stocker
        if (res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        }

        // Redirection après connexion
        this.router.navigate(['/accueil']); // à adapter
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    this.router.navigate(['/connexion']);
  }

  checkToken(): void {
    const tokenExists = !!localStorage.getItem('token');
    this.loggedIn.next(tokenExists);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  get isLoggedIn$(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getProfile(): Observable<any> {
    return this.http.get<any>(`${this.api}/profile`);
  }

  updateProfile(data: FormData | any): Observable<any> {
    const request$ = data instanceof FormData
      ? (() => {
          // Pour les fichiers, on utilise un POST avec _method=PUT pour que Laravel gère correctement le multipart
          if (!data.has('_method')) {
            data.append('_method', 'PUT');
          }
          return this.http.post<any>(`${this.api}/profile`, data);
        })()
      : this.http.put<any>(`${this.api}/profile`, data);

    return request$.pipe(
      tap((user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
      })
    );
  }
}
