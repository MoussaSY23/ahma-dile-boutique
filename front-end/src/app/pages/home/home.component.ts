import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home/home.service';
import { Produit } from '../../models/produit';
import { Categorie } from '../../models/categorie';
import { CategorieService } from '../../services/categorie/categorie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

  produitsRecents: Produit[] = [];
  categories: Categorie[] = [];

  loadingProduits = false;
  loadingCategories = false;

  constructor(
    private homeService: HomeService,
    private categorieService: CategorieService
  ) {}

  ngOnInit(): void {
    this.loadProduitsRecents();
    this.loadCategories();
  }

  loadProduitsRecents(): void {
    this.loadingProduits = true;
    this.homeService.getProduitsRecents().subscribe({
      next: (data) => {
        this.produitsRecents = data;
        this.loadingProduits = false;
      },
      error: () => this.loadingProduits = false
    });
  }

  loadCategories(): void {
    this.loadingCategories = true;
    this.categorieService.getCategories().subscribe({
      next: (data) => {
        this.categories = data;
        this.loadingCategories = false;
      },
      error: () => this.loadingCategories = false
    });
  }

  image(url?: string): string {
    return url || 'assets/images/placeholder.jpg';
  }
}
