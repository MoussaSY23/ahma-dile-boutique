// src/app/services/commande.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Commande } from '../../models/commande.model';

@Injectable({ providedIn: 'root' })
export class CommandeService {
  private apiUrl = 'http://localhost:8000/api/commandes';

  constructor(private http: HttpClient) {}

  creerCommande(): Observable<any> {
    return this.http.post(this.apiUrl, {});
  }

  getMesCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }

  getCommande(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }
  creerOuMettreAJourLivraison(commandeId: number, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${commandeId}/livraison`, data);
  }
}

