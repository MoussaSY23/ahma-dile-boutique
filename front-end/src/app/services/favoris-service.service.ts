import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit';

@Injectable({ providedIn: 'root' })
export class FavorisService {
  private apiUrl = 'http://localhost:8000/api/favoris';

  constructor(private http: HttpClient) {}

  toggle(produitId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${produitId}`, {});
  }

  getFavoris(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }
}

