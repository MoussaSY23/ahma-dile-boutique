import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProduitComponent } from './pages/produits/produit/produit.component';
import { HomeComponent } from './pages/home/home.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { AuthGuard } from './guards/auth.guard'; 
import { AdminGuard } from './guards/admin.guard';
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
import { AdminLayoutComponent } from './pages/admin/admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { AdminCommandesComponent } from './pages/admin/admin-commandes/admin-commandes.component';
import { AdminCommandeDetailComponent } from './pages/admin/admin-commande-detail/admin-commande-detail.component';
import { AdminUsersComponent } from './pages/admin/admin-users/admin-users.component';
import { AdminUserDetailComponent } from './pages/admin/admin-user-detail/admin-user-detail.component';
import { AdminProduitsComponent } from './pages/admin/admin-produits/admin-produits.component';
import { AdminCategoriesComponent } from './pages/admin/admin-categories/admin-categories.component';
import { AdminCategorieDetailComponent } from './pages/admin/admin-categorie-detail/admin-categorie-detail.component';
import { AdminProfilComponent } from './pages/admin/admin-profil/admin-profil.component';


const routes: Routes = [
    { path: '', component: HomeComponent }, // page login
  { path: 'produits', component: ProduitComponent, canActivate: [AuthGuard] }, // protégé
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
   { path: 'home', component: HomeComponent },
  {path: 'produits/:id', component: ProductDetailComponent},
  { path: 'panier', component: PanierComponent, canActivate: [AuthGuard] },
  { path: 'commande/:id', component: CommandeComponent, canActivate: [AuthGuard] }, // page détail / livraison commande
  { path: 'mes-commandes', component: MesCommandesComponent, canActivate: [AuthGuard] }, // liste des commandes du client
  { path: 'confirmation', component: ConfirmationComponent },
  {path: 'categories', component: CategorieComponent, canActivate: [AuthGuard, AdminGuard] }, // gestion catégories réservée admin
  {path: 'categories/:id', component: DetailCategorieComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'produits', component: AdminProduitsComponent },
      { path: 'produits/ajouter', component: ProduitAjoutComponent },
      { path: 'produits/modifier/:id', component: ProduitEditionComponent },
      { path: 'categories', component: AdminCategoriesComponent },
      { path: 'categories/:id', component: AdminCategorieDetailComponent },
      { path: 'commandes', component: AdminCommandesComponent },
      { path: 'commandes/:id', component: AdminCommandeDetailComponent },
      { path: 'utilisateurs', component: AdminUsersComponent },
      { path: 'utilisateurs/:id', component: AdminUserDetailComponent },
      { path: 'profil', component: AdminProfilComponent },
    ],
  },
  {path: '**', component: NotFoundComponent},




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
