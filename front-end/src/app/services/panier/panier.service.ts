import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PanierService {
  private apiUrl = 'http://localhost:8000/api/panier';

  constructor(private http: HttpClient) {}

  getPanier() {
    return this.http.get<any>(this.apiUrl);
  }

  ajouterProduit(produit_id: number, quantite: number) {
    return this.http.post(this.apiUrl, { produit_id, quantite });
  }

  updateQuantite(itemId: number, quantite: number) {
    return this.http.put(`${this.apiUrl}/${itemId}`, { quantite });
  }

  supprimerItem(itemId: number) {
    return this.http.delete(`${this.apiUrl}/${itemId}`);
  }

  viderPanier() {
    return this.http.delete(this.apiUrl);
  }
}


