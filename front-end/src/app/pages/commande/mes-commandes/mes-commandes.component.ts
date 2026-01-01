import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommandeService } from '../../../services/commande/commande.service';
import { Commande } from '../../../models/commande.model';

@Component({
  selector: 'app-mes-commandes',
  templateUrl: './mes-commandes.component.html',
  styleUrls: ['./mes-commandes.component.css']
})
export class MesCommandesComponent implements OnInit {
  commandes: Commande[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private commandeService: CommandeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerMesCommandes();
  }

  chargerMesCommandes(): void {
    this.isLoading = true;
    this.errorMessage = null;

    this.commandeService.getMesCommandes().subscribe({
      next: (data) => {
        this.commandes = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement commandes client :', error);
        this.errorMessage = error?.error?.message || 'Impossible de charger vos commandes pour le moment.';
        this.isLoading = false;
      }
    });
  }

  getStatutLabel(statut: string): string {
    switch ((statut || '').toLowerCase()) {
      case 'en_attente':
      case 'en attente':
        return 'En attente de traitement';
      case 'confirmee':
      case 'confirmée':
        return 'Confirmée / En préparation';
      case 'expediee':
      case 'expédiée':
        return 'Expédiée';
      case 'livree':
      case 'livrée':
        return 'Livrée';
      case 'annulee':
      case 'annulée':
        return 'Annulée';
      default:
        return statut || 'En cours';
    }
  }

  getEtapeDescription(statut: string): string {
    const s = (statut || '').toLowerCase();
    if (s.startsWith('en_attente') || s.startsWith('en attente')) {
      return 'Nous avons bien reçu votre commande et elle sera bientôt prise en charge par notre équipe.';
    }
    if (s.startsWith('confirmee') || s.startsWith('confirmée')) {
      return 'Votre commande est confirmée. Nous préparons vos tissus et organisons la livraison.';
    }
    if (s.startsWith('expediee') || s.startsWith('expédiée')) {
      return 'Votre colis est en route vers vous. Le livreur vous contactera pour la remise.';
    }
    if (s.startsWith('livree') || s.startsWith('livrée')) {
      return 'Commande livrée. Merci pour votre confiance !';
    }
    if (s.startsWith('annulee') || s.startsWith('annulée')) {
      return 'Cette commande a été annulée.';
    }
    return 'Votre commande est en cours de traitement.';
  }

  voirDetails(commande: Commande): void {
    if (!commande?.id) {
      return;
    }
    this.router.navigate(['/commande', commande.id]);
  }
}
