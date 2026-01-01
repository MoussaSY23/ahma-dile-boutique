import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Categorie } from '../../models/categorie';

@Injectable({ providedIn: 'root' })
export class CategorieService {
  private apiUrl = `http://localhost:8000/api/categories`;

  constructor(private http: HttpClient) { }

  private addImageUrl(categorie: Categorie): Categorie {
    return {
      ...categorie,
      imageUrl: categorie.image ? `http://localhost:8000/storage/${categorie.image}` : undefined
    };
  }

  getAll(): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(this.apiUrl).pipe(
      map(categories => categories.map(c => this.addImageUrl(c)))
    );
  }

  getById(id: number): Observable<Categorie> {
    return this.http.get<Categorie>(`${this.apiUrl}/${id}`).pipe(
      map(c => this.addImageUrl(c))
    );
  }

  create(formData: FormData): Observable<Categorie> {
    return this.http.post<Categorie>(this.apiUrl, formData).pipe(
      map(c => this.addImageUrl(c))
    );
  }

  update(id: number, formData: FormData): Observable<Categorie> {
    return this.http.put<Categorie>(`${this.apiUrl}/${id}`, formData).pipe(
      map(c => this.addImageUrl(c))
    );
  }

  getByType(type: string): Observable<Categorie[]> {
    return this.http.get<Categorie[]>(`${this.apiUrl}/type/${type}`).pipe(
      map(categories => categories.map(c => this.addImageUrl(c))))
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<Categorie[]> {
    return this.getAll();
  }

  getCategoriesByType(type: 'tissu' | 'mercerie'): Observable<Categorie[]> {
    return this.getByType(type);
  }
}