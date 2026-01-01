import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommandeService } from '../../services/commande/commande.service';
import { Commande } from '../../models/commande.model';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  commande?: Commande;
  livraisonForm: FormGroup;
  isLoading = false;
  isSaving = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private commandeService: CommandeService
  ) {
    this.livraisonForm = this.fb.group({
      nom_client: ['', Validators.required],
      telephone: ['', Validators.required],
      adresse: ['', Validators.required],
      ville: ['', Validators.required],
      instructions: ['']
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/panier']);
      return;
    }
    this.chargerCommande(id);
  }

  chargerCommande(id: number): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.commandeService.getCommande(id).subscribe({
      next: (commande) => {
        this.isLoading = false;
        this.commande = commande;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Erreur chargement commande :', error);
        this.errorMessage = error?.error?.message || 'Erreur lors du chargement de la commande.';
      }
    });
  }

  onSubmit(): void {
    if (!this.commande || this.livraisonForm.invalid) {
      this.livraisonForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.commandeService
      .creerOuMettreAJourLivraison(this.commande.id, this.livraisonForm.value)
      .subscribe({
        next: () => {
          this.isSaving = false;
          this.successMessage = 'Informations de livraison enregistrées. Vous recevrez un email avec le récapitulatif de votre commande.';
        },
        error: (error) => {
          this.isSaving = false;
          console.error('Erreur enregistrement livraison :', error);
          this.errorMessage = error?.error?.message || 'Erreur lors de l\'enregistrement des informations de livraison.';
        }
      });
  }

  retournerAuCatalogue(): void {
    this.router.navigate(['/produits']);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/no-image.jpg';
  }
}
