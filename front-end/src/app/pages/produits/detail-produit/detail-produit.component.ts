// src/app/product-detail/product-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../../services/produit/produit.service'; // Ajustez le chemin si nécessaire
import { Produit } from '../../../models/produit'; // Ajustez le chemin si nécessaire
import { switchMap, catchError } from 'rxjs/operators'; // Importez catchError
import { of } from 'rxjs';
import { PanierService } from '../../../services/panier/panier.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: 'detail-produit.component.html',
  styleUrls: ['detail-produit.component.css']
})
export class ProductDetailComponent implements OnInit {
  produit: Produit | undefined;
  quantity: number = 1;
  activeTab: string = 'description'; // Onglet actif par défaut
  currentImageIndex: number = 0;

  // Pour l'instant, nous n'allons pas récupérer les produits similaires du backend
  // pour simplifier. Nous utilisons un tableau vide ou des données factices très basiques.
  // Vous pourrez implémenter la logique de récupération des produits similaires plus tard.
  relatedProducts: Produit[] = []; // Initialisez avec un tableau vide pour l'instant

  constructor(
    private route: ActivatedRoute, // Pour accéder aux paramètres de l'URL
    private router: Router,       // Pour la navigation (ex: redirection si produit non trouvé)
    private produitService: ProduitService, // Votre service pour interagir avec l'API
    private panierService: PanierService   // ✅ AJOUT

  ) {}

  ngOnInit(): void {
    // Récupère l'ID du produit depuis l'URL
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id'); // Récupère le paramètre 'id' de l'URL
        if (id) {
          // Si un ID est présent, appelle le service pour récupérer le produit
          return this.produitService.getProduit(+id).pipe( // Le '+' convertit la chaîne en nombre
            catchError(error => {
              console.error('Erreur lors de la récupération du produit:', error);
              // En cas d'erreur (ex: produit non trouvé), redirige vers la liste des produits
              this.router.navigate(['/produits']);
              return of(undefined); // Retourne un Observable de undefined pour continuer le flux
            })
          );
        } else {
          // Si aucun ID n'est présent dans l'URL, affiche une erreur et redirige
          console.error('ID du produit non trouvé dans l\'URL.');
          this.router.navigate(['/produits']);
          return of(undefined); // Retourne un Observable de undefined
        }
      })
    ).subscribe(
      produit => {
        this.produit = produit; // Assigne le produit récupéré à la propriété 'produit'
        if (!this.produit) {
          // Si le produit est undefined après l'appel (ex: 404 du backend), redirige
          console.warn('Produit non trouvé pour l\'ID donné.');
          this.router.navigate(['/produits']);
        }
      }
    );
  }

  setActiveImage(index: number): void {
    if (!this.produit || !this.produit.images) {
      return;
    }
    if (index >= 0 && index < this.produit.images.length) {
      this.currentImageIndex = index;
    }
  }

  // Incrémente la quantité, en s'assurant de ne pas dépasser le stock disponible
  incrementQuantity(): void {
    if (this.produit && this.quantity < this.produit.quantite) {
      this.quantity++;
    } else if (this.produit && this.quantity >= this.produit.quantite) {
      console.warn('Quantité maximale en stock atteinte.');
    }
  }

  // Décrémente la quantité, en s'assurant qu'elle ne soit pas inférieure à 1
  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Simule l'ajout au panier
addToCart(): void {
  if (!this.produit) {
    return;
  }

  if (this.quantity < 1) {
    alert('Quantité invalide');
    return;
  }

  this.panierService
    .ajouterProduit(this.produit.id, this.quantity)
    .subscribe({
      next: () => {
        alert(`✅ ${this.quantity} × ${this.produit!.nom} ajouté au panier`);
      },
      error: (err) => {
        console.error('Erreur ajout panier :', err);

        if (err.status === 401) {
          alert('Veuillez vous connecter pour ajouter au panier');
          this.router.navigate(['/login']);
        } else {
          alert(err.error?.message || 'Erreur lors de l’ajout au panier');
        }
      }
    });
}


  // Simule l'achat immédiat
  buyNow(): void {
    if (this.produit) {
      console.log(`Achat de ${this.quantity} de ${this.produit.nom} en cours.`);
      // Ici, vous intégreriez la logique réelle d'achat
      alert(`Achat de ${this.quantity} de ${this.produit.nom} en cours !`); // Utilisez un modal personnalisé en production
    }
  }

  // Formate le prix en XOF
  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(price);
  }

  // Gère les erreurs de chargement d'image en affichant une image de fallback
  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/no-image.jpg'; // Assurez-vous que ce chemin est valide
  }

  // Navigue vers la page de détail d'un autre produit (pour les produits similaires)
  goToProductDetail(produitId: number): void {
    this.router.navigate(['/produits', produitId]);
  }

  // Définit l'onglet actif pour la section des détails supplémentaires
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }

  // Vérifie si le produit est en rupture de stock
  isOutOfStock(quantity: number): boolean {
    return quantity <= 0;
  }
}
