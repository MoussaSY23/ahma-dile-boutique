import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Categorie } from '../../../models/categorie';
import { Produit } from '../../../models/produit';
import { CategorieService } from '../../../services/categorie/categorie.service';
import { ProduitService } from '../../../services/produit/produit.service';

@Component({
  selector: 'app-admin-categorie-detail',
  templateUrl: './admin-categorie-detail.component.html',
  styleUrls: ['./admin-categorie-detail.component.css'],
})
export class AdminCategorieDetailComponent implements OnInit {
  categorie: Categorie | null = null;
  produits: Produit[] = [];
  isLoading = false;
  apiError: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categorieService: CategorieService,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.apiError = 'Catégorie introuvable';
      return;
    }
    this.loadCategorieEtProduits(id);
  }

  loadCategorieEtProduits(id: number): void {
    this.isLoading = true;
    this.apiError = null;

    this.categorieService.getById(id).subscribe({
      next: (data) => {
        this.categorie = data;

        // Charger ensuite les produits et filtrer par categorie_id
        this.produitService.getProduits().subscribe({
          next: (produits) => {
            this.produits = produits.filter(p => p.categorie_id === id);
            this.isLoading = false;
          },
          error: (err) => {
            console.error('Erreur chargement produits de la catégorie (admin)', err);
            this.produits = [];
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Erreur chargement catégorie admin', err);
        this.apiError = err?.error?.message || 'Impossible de charger la catégorie.';
        this.isLoading = false;
      },
    });
  }

  getTypeLabel(type: string | undefined): string {
    if (!type) { return '—'; }
    return type === 'tissu' ? 'Tissu' : 'Mercerie';
  }

  revenirAListe(): void {
    this.router.navigate(['/admin/categories']);
  }
}
