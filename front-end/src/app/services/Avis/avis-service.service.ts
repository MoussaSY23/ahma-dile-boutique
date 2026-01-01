import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AvisService {
  private apiUrl = 'http://localhost:8000/api/avis';

  constructor(private http: HttpClient) {}

  ajouterAvis(data: {
    produit_id: number;
    note: number;
    commentaire?: string;
  }): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }
}

