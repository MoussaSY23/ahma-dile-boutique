import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Component({ 
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
})
export class AdminDashboardComponent implements OnInit {
  isLoading = false;
  apiError: string | null = null;

  stats = {
    nombreProduits: 0,
    nombreCommandes: 0,
    nombreClients: 0,
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading = true;
    this.http
      .get<{
        nombreProduits: number;
        nombreCommandes: number;
        nombreClients: number;
      }>('http://localhost:8000/api/dashboard')
      .subscribe({
        next: (data) => {
          this.stats = data;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.apiError = 'Erreur lors du chargement des statistiques du tableau de bord';
          this.isLoading = false;
        },
      });
  }
}
