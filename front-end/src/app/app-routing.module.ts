import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProduitComponent } from './pages/produits/produit/produit.component';
import { HomeComponent } from './pages/home/home.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { AuthGuard } from './guards/auth.guard'; 
import { ProduitAjoutComponent } from './pages/produits/produit-ajout/produit-ajout.component';
import {ProduitEditionComponent} from './pages/produits/produit-edition/produit-edition.component'
import { ProductDetailComponent } from './pages/produits/detail-produit/detail-produit.component';
import { PanierComponent } from './pages/panier/panier/panier.component';
import { NotFoundComponent } from './utils/not-found/not-found.component';
import { CommandeComponent } from './pages/commande/commande.component'; 
import { MesCommandesComponent } from './pages/commande/mes-commandes/mes-commandes.component';
import { ConfirmationComponent } from './confirmation/confirmation.component'; 
import { CategorieComponent } from './pages/categorie/categorie/categorie.component'; 
 import { DetailCategorieComponent } from './pages/categorie/detail-categorie/detail-categorie.component';
import { ProfilComponent } from './pages/profil/profil.component';


const routes: Routes = [
    { path: '', component: HomeComponent }, // page login
  { path: 'produits', component: ProduitComponent, canActivate: [AuthGuard] }, // protégé
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
   { path: 'home', component: HomeComponent },
    { path: 'produits/ajouter', component: ProduitAjoutComponent },
  { path: 'produits/modifier/:id', component: ProduitEditionComponent },
  {path: 'produits/:id', component: ProductDetailComponent},
  { path: 'panier', component: PanierComponent, canActivate: [AuthGuard] },
  { path: 'commande/:id', component: CommandeComponent, canActivate: [AuthGuard] }, // page détail / livraison commande
  { path: 'mes-commandes', component: MesCommandesComponent, canActivate: [AuthGuard] }, // liste des commandes du client
  { path: 'confirmation', component: ConfirmationComponent },
  {path: 'categories', component: CategorieComponent, canActivate: [AuthGuard] }, // page des catégories, protégée
  {path: 'categories/:id', component: DetailCategorieComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  {path: '**', component: NotFoundComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
