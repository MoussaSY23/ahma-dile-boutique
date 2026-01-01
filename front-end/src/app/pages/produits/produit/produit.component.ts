import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Produit } from '../../../models/produit';
import { ProduitService } from '../../../services/produit/produit.service';
import { CategorieService } from '../../../services/categorie/categorie.service';
import { AuthService } from '../../../services/auth/auth.service';

import { Categorie } from '../../../models/categorie';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { PanierService } from '../../../services/panier/panier.service';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('stagger', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('0.5s ease', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('fadeInGrow', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('0.5s ease-out', 
          style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.4s ease-out', 
          style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ProduitComponent implements OnInit, OnDestroy {
  produits: Produit[] = [];

  filteredProduits: Produit[] = [];
  featuredCategories: Categorie[] = [];
  categories: Categorie[] = [];
  cart: { [key: number]: { product: Produit, quantity: number } } = {};
  cartCount: number = 0;
  quantityInputs: { [key: number]: number } = {};
  
  searchTerm: string = '';
  activeFilter: string = 'all';
  activeCategoryId: 'all' | number = 'all';
  sortOption: string = 'default';
  inStockOnly: boolean = false;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  currentPage: number = 1;
  pageSize: number = 12;

  // Images pour le carrousel de la bannière (3 images distantes)
  heroSlides: string[] = [
    'https://i.pinimg.com/736x/ac/74/ea/ac74ea792943fbac91129d6f7f827d65.jpg',
    'https://i.pinimg.com/736x/38/86/c6/3886c6ed92d3f9cb6b5d05e37f465ea8.jpg',
    'https://i.pinimg.com/1200x/e3/fd/32/e3fd320a822b101e5b50131796b98ea4.jpg'
  ];

  currentHeroIndex: number = 0;
  private heroIntervalId: any;

  isLoading: boolean = true;
  isLoadingCategories: boolean = true;
  errorMessage: string = '';
  showFilters: boolean = false;
  isAdmin: boolean = false;

  quickInfos = [
    { icon: 'fa-truck', text: 'Livraison 48h ' },
    { icon: 'fa-undo', text: 'Retour facile ' },
    { icon: 'fa-certificate', text: 'Qualité premium ' }
  ];

  constructor(
    private produitService: ProduitService,
    private categorieService: CategorieService,
    private route: ActivatedRoute,
    private router: Router,
    private viewportScroller: ViewportScroller,
    private panierService: PanierService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.isAdmin = !!user && user.role === 'admin';

    this.route.queryParamMap.subscribe(params => {
      const q = params.get('q');
      if (q != null) {
        this.searchTerm = q;
        this.filterProducts();
      }
    });

    this.loadProduits();
    this.loadCategories();
    this.loadAllCategories();
    this.startHeroCarousel();
  }

  ngOnDestroy(): void {
    if (this.heroIntervalId) {
      clearInterval(this.heroIntervalId);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const backToTop = document.querySelector('.back-to-top');
    if (window.pageYOffset > 300) {
      backToTop?.classList.add('visible');
    } else {
      backToTop?.classList.remove('visible');
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  get totalPages(): number {
    if (this.filteredProduits.length === 0) {
      return 1;
    }
    return Math.ceil(this.filteredProduits.length / this.pageSize);
  }

  get paginatedProduits(): Produit[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredProduits.slice(start, start + this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  private loadProduits(): void {
    this.isLoading = true;
    this.produitService.getProduits().subscribe({
      next: (produits) => {
        this.produits = produits;
        this.filteredProduits = produits;
        this.initializeQuantities();
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Erreur lors du chargement des produits';
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  private loadCategories(): void {
    this.isLoadingCategories = true;
    this.categorieService.getByType('tissu').subscribe({
      next: (categories) => {
        this.featuredCategories = categories.slice(0, 3);
        this.isLoadingCategories = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des catégories:', error);
        this.isLoadingCategories = false;
      }
    });
  }

  private loadAllCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Erreur lors du chargement de toutes les catégories:', error);
      }
    });
  }

  public filterProducts(): void {
    let filtered = this.produits.filter(p => 
      p.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      p.description?.toLowerCase().includes(this.searchTerm.toLowerCase()) || false
    );

    if (this.activeCategoryId !== 'all') {
      filtered = filtered.filter(p => p.categorie_id === this.activeCategoryId);
    }

    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(p => p.type === this.activeFilter);
    }

    if (this.inStockOnly) {
      filtered = filtered.filter(p => p.quantite > 0);
    }

    if (this.minPrice != null && !Number.isNaN(this.minPrice)) {
      filtered = filtered.filter(p => p.prix >= this.minPrice!);
    }

    if (this.maxPrice != null && !Number.isNaN(this.maxPrice)) {
      filtered = filtered.filter(p => p.prix <= this.maxPrice!);
    }

    switch (this.sortOption) {
      case 'name': filtered.sort((a, b) => a.nom.localeCompare(b.nom)); break;
      case 'price-low': filtered.sort((a, b) => a.prix - b.prix); break;
      case 'price-high': filtered.sort((a, b) => b.prix - a.prix); break;
      default: filtered.sort((a, b) => a.id! - b.id!);
    }

    this.filteredProduits = filtered;
    this.currentPage = 1;
  }

  onSearchChange(): void {
    this.filterProducts();
  }

  onSortChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.sortOption = selectElement.value;
    this.filterProducts();
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
    this.filterProducts();
  }

  setCategory(categoryId: 'all' | number): void {
    this.activeCategoryId = categoryId;
    this.filterProducts();
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const value = select.value;

    if (value === 'all') {
      this.setCategory('all');
      return;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return;
    }

    this.setCategory(parsed);
  }

  hasActiveFilters(): boolean {
    return (
      this.searchTerm.trim().length > 0 ||
      this.activeFilter !== 'all' ||
      this.activeCategoryId !== 'all' ||
      this.sortOption !== 'default' ||
      this.inStockOnly ||
      this.minPrice != null ||
      this.maxPrice != null
    );
  }

  scrollToProducts(): void {
    this.viewportScroller.scrollToAnchor('products-section');
  }

  private showAddToCartFeedback(productId: number): void {
    const button = document.querySelector(`.add-btn-${productId}`);
    if (button) {
      button.classList.add('added');
      setTimeout(() => button.classList.remove('added'), 1000);
    }
  }

  goToProductDetail(produit: Produit): void {
    if (produit.id) {
      this.router.navigate(['/produits', produit.id]);
    }
  }

  quickView(produit: Produit): void {
    console.log('Quick view:', produit.nom);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.activeFilter = 'all';
    this.activeCategoryId = 'all';
    this.sortOption = 'default';
    this.inStockOnly = false;
    this.minPrice = null;
    this.maxPrice = null;
    this.filterProducts();
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  }

  getUniqueTypes(): string[] {
    return [...new Set(this.produits.map(p => p.type).filter(Boolean))];
  }

  isLowStock(quantite: number): boolean {
    return quantite < 10 && quantite > 0;
  }

  isOutOfStock(quantite: number): boolean {
    return quantite === 0;
  }

  trackByFn(index: number, item: Produit): number {
    return item.id || index;
  }

  private initializeQuantities(): void {
    this.produits.forEach(produit => {
      if (produit.id && !this.quantityInputs[produit.id]) {
        this.quantityInputs[produit.id] = 1;
      }
    });
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/no-image.jpg';
  }

  addToCart(produit: Produit, quantite: number = 1): void {
    if (!produit.id) return;

    this.panierService.ajouterProduit(produit.id, quantite).subscribe({
      next: () => {
        this.showAddToCartFeedback(produit.id);
      },
      error: (error) => {
        console.error('Erreur ajout panier :', error);
        const message = error?.error?.message || 'Erreur lors de l\'ajout au panier (vérifiez que vous êtes bien connecté).';
        alert(message);
      }
    });
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.scrollToTop();
  }

  prevPage(): void {
    this.setPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.setPage(this.currentPage + 1);
  }

  /* ============ HERO CAROUSEL ============ */

  private startHeroCarousel(): void {
    if (this.heroIntervalId) {
      clearInterval(this.heroIntervalId);
    }
    this.heroIntervalId = setInterval(() => {
      this.nextHeroSlide();
    }, 5000);
  }

  nextHeroSlide(): void {
    if (!this.heroSlides.length) return;
    this.currentHeroIndex = (this.currentHeroIndex + 1) % this.heroSlides.length;
  }

  prevHeroSlide(): void {
    if (!this.heroSlides.length) return;
    this.currentHeroIndex =
      (this.currentHeroIndex - 1 + this.heroSlides.length) % this.heroSlides.length;
  }

  goToHeroSlide(index: number): void {
    if (index >= 0 && index < this.heroSlides.length) {
      this.currentHeroIndex = index;
      this.startHeroCarousel();
    }
  }
}