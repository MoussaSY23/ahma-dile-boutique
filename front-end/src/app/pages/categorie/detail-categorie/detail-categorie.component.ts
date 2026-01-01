import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CategorieService } from '../../../services/categorie/categorie.service';
import { ProduitService } from '../../../services/produit/produit.service';
import { Categorie } from '../../../models/categorie';
import { Produit } from '../../../models/produit';

@Component({
  selector: 'app-detail-categorie',
  templateUrl: './detail-categorie.component.html',
  styleUrls: ['./detail-categorie.component.css']
})
export class DetailCategorieComponent implements OnInit {
  categorie?: Categorie;
  produits: Produit[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categorieService: CategorieService,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;

    if (!Number.isFinite(id)) {
      this.router.navigate(['/categories']);
      return;
    }

    this.loadCategorieAndProduits(id);
  }

  private loadCategorieAndProduits(categoryId: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.categorieService.getById(categoryId).subscribe({
      next: (categorie) => {
        this.categorie = categorie;

        this.produitService.getProduits().subscribe({
          next: (produits) => {
            this.produits = produits.filter(p => p.categorie_id === categoryId);
            this.isLoading = false;
          },
          error: (error: HttpErrorResponse) => {
            console.error(error);
            this.errorMessage = 'Erreur lors du chargement des produits.';
            this.isLoading = false;
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error(error);
        this.errorMessage = 'Catégorie introuvable.';
        this.isLoading = false;
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/no-image.jpg';
  }

  goToProductDetail(produit: Produit): void {
    if (produit.id) {
      this.router.navigate(['/produits', produit.id]);
    }
  }
}
