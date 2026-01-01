import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // Votre service d'authentification
import { PanierService } from '../../services/panier/panier.service'; // Votre service de panier
import { Subscription } from 'rxjs'; // Pour gérer les désabonnements


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileMenuOpen = false;
  isLoggedIn = false;
  cartItemCount: number = 0;
  isUserDropdownOpen: boolean = false; // Nouveau: pour contrôler l'ouverture du menu déroulant utilisateur
  navSearchTerm: string = '';
  userName: string | null = null;

  private authSubscription: Subscription | undefined;
  private panierSubscription: Subscription | undefined;

  @ViewChild('userDropdown') userDropdownRef: ElementRef | undefined; // Référence au div du menu déroulant

  constructor(
    private router: Router,
    private authService: AuthService,
    private panierService: PanierService,
    private elementRef: ElementRef // Pour détecter les clics en dehors du composant
  ) {}

  ngOnInit(): void {
    // 1. Souscription à l'état de connexion de l'utilisateur
    this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      if (status) {
        const user = this.authService.getCurrentUser();
        this.userName = user?.name || null;
      } else {
        this.userName = null;
      }
      this.getCartItemCount(); // Met à jour le panier si l'état de connexion change
    });

    // 2. Souscription aux changements du panier pour mettre à jour le badge
    this.panierSubscription = this.panierService.getPanier().subscribe(panierData => {
      this.cartItemCount = panierData.items ? panierData.items.reduce((sum: number, item: any) => sum + item.quantite, 0) : 0;
    }, error => {
      console.error('Erreur lors de la récupération des données du panier:', error);
      this.cartItemCount = 0;
    });

    // 3. Appel initial pour obtenir le nombre d'articles du panier au chargement
    this.getCartItemCount();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.panierSubscription) {
      this.panierSubscription.unsubscribe();
    }
  }

  // Méthode pour obtenir le nombre d'articles du panier
  getCartItemCount(): void {
    this.panierService.getPanier().subscribe(panierData => {
      this.cartItemCount = panierData.items ? panierData.items.reduce((sum: number, item: any) => sum + item.quantite, 0) : 0;
    }, error => {
      console.error('Erreur lors de la récupération du nombre d\'articles du panier:', error);
      this.cartItemCount = 0;
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    // Ferme le menu déroulant utilisateur si le menu mobile est ouvert/fermé
    this.isUserDropdownOpen = false;
  }

  // Nouveau: Bascule l'état du menu déroulant utilisateur
  toggleUserDropdown(event: Event): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
    event.stopPropagation(); // Empêche le clic de se propager au document et de fermer immédiatement
  }

  // Nouveau: Navigue vers la page de profil
  goToProfile(): void {
    this.router.navigate(['/profil']); // Assurez-vous que cette route existe
    this.isUserDropdownOpen = false; // Ferme le menu déroulant
    this.mobileMenuOpen = false; // Ferme le menu mobile si ouvert
  }

  goToOrders(): void {
    this.router.navigate(['/mes-commandes']);
    this.isUserDropdownOpen = false;
    this.mobileMenuOpen = false;
  }

  goToLogin(): void {
    this.router.navigate(['/connexion']);
    this.mobileMenuOpen = false;
    this.isUserDropdownOpen = false;
  }

  goToRegister(): void {
    this.router.navigate(['inscription']);
    this.mobileMenuOpen = false;
    this.isUserDropdownOpen = false;
  }

  openHelp(): void {
    // Redirige vers la page de contact comme centre d'aide
    this.router.navigate(['/contact']);
    this.mobileMenuOpen = false;
    this.isUserDropdownOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.mobileMenuOpen = false;
    this.isUserDropdownOpen = false;
  }

  onSearchSubmit(): void {
    const q = this.navSearchTerm.trim();

    this.router.navigate(['/produits'], {
      queryParams: q ? { q } : {}
    });

    this.mobileMenuOpen = false;
    this.isUserDropdownOpen = false;
  }

  // Nouveau: Ferme le menu déroulant si l'utilisateur clique en dehors
  @HostListener('document:click', ['$event'])
  onClick(event: Event): void {
    // Vérifie si le clic n'est pas à l'intérieur du composant de la navbar
    // et si le menu déroulant est ouvert
    if (this.isUserDropdownOpen && this.userDropdownRef && !this.userDropdownRef.nativeElement.contains(event.target)) {
      this.isUserDropdownOpen = false;
    }
  }
}
