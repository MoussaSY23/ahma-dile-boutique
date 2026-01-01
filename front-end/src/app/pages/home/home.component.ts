/* home.component.ts */
import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home/home.service';
import { Produit } from '../../models/produit';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  nombreProduits = 0;
  nombreCommandes = 0;
  nombreClients = 0;
  produitsRecents: Produit[] = [];
  isLoading: boolean = false;

  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.getStats();
    this.getProduitsRecents();
  }

  getStats(): void {
    this.homeService.getStats().subscribe(data => {
      this.nombreProduits = data.nombreProduits;
      this.nombreCommandes = data.nombreCommandes;
      this.nombreClients = data.nombreClients;
    });
  }

  getProduitsRecents(): void {
    this.isLoading = true;
    this.homeService.getProduitsRecents().subscribe(
      data => {
        this.produitsRecents = data;
        this.isLoading = false;
      },
      error => {
        console.error('Erreur lors de la récupération des produits récents', error);
        this.isLoading = false;
      }
    );
  }
}
