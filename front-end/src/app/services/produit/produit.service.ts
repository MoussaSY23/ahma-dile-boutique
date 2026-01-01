import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit, ProduitImage } from '../../models/produit';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://127.0.0.1:8000/api/produits';

  constructor(private http: HttpClient) {}

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  getProduit(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  // Accepte maintenant un FormData (avec ou sans image)
  createProduit(formData: FormData): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, formData);
  }

  updateProduit(id: number, formData: FormData): Observable<Produit> {
    return this.http.post<Produit>(`${this.apiUrl}/${id}?_method=PUT`, formData);
    // Laravel accepte _method=PUT via POST
  }

  uploadProduitImage(id: number, file: File): Observable<ProduitImage> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<ProduitImage>(`${this.apiUrl}/${id}/images`, formData);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
