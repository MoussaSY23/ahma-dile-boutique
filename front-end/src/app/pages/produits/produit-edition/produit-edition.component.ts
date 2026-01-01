import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitService } from '../../../services/produit/produit.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-produit-edition',
  templateUrl: './produit-edition.component.html'
})
export class ProduitEditionComponent implements OnInit {
  produit: any;
  selectedFiles: File[] = [];
  produitId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService
  ) {}

  ngOnInit(): void {
    this.produitId = +this.route.snapshot.paramMap.get('id')!;
    this.produitService.getProduit(this.produitId).subscribe(data => {
      this.produit = data;
    });
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedFiles = input.files ? Array.from(input.files) : [];
  }

  modifierProduit() {
    const formData = new FormData();
    for (const key in this.produit) {
      if (this.produit.hasOwnProperty(key)) {
        formData.append(key, this.produit[key]);
      }
    }
    if (this.selectedFiles.length > 0) {
      // La première image devient la nouvelle image principale si fournie
      formData.append('image', this.selectedFiles[0]);
    }

    this.produitService.updateProduit(this.produitId, formData).subscribe((updatedProduit) => {
      if (this.selectedFiles.length > 1) {
        const extraFiles = this.selectedFiles.slice(1);
        const uploads$ = extraFiles.map(file => this.produitService.uploadProduitImage(this.produitId, file));

        forkJoin(uploads$).subscribe({
          next: () => this.router.navigate(['/produits']),
          error: () => this.router.navigate(['/produits'])
        });
      } else {
        this.router.navigate(['/produits']);
      }
    });
  }
}
