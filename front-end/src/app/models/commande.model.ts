import { Produit } from './produit';
export interface Commande {
  id: number;
  reference: string;
  total: number;
  statut: string;
  date_commande: string;
  items: CommandeItem[];
}

export interface CommandeItem {
  produit: Produit;
  quantite: number;
  prix_unitaire: number;
}
