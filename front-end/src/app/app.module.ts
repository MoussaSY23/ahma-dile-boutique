import { NgModule } from '@angular/core';
        import { BrowserModule } from '@angular/platform-browser';
        import { FormsModule } from '@angular/forms';

        import { AppRoutingModule } from './app-routing.module';
        import { AppComponent } from './app.component';
        import { ProduitComponent } from './pages/produits/produit/produit.component';
        import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { NotFoundComponent } from './utils/not-found/not-found.component';
import { PanierComponent } from './pages/panier/panier/panier.component';
import { MatCardModule } from '@angular/material/card';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BanniereComponent } from './shared/banniere/banniere.component';
import { FooterComponent } from './shared/footer/footer.component';
import { CardProduitComponent } from './shared/card-produit/card-produit.component';
import { SectionStatsComponent } from './shared/section-stats/section-stats.component';
import { ProduitAjoutComponent } from './pages/produits/produit-ajout/produit-ajout.component';
import { ProduitEditionComponent } from './pages/produits/produit-edition/produit-edition.component';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { ProductDetailComponent } from './pages/produits/detail-produit/detail-produit.component';
import { CommandeComponent } from './pages/commande/commande.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import { CategorieComponent } from './pages/categorie/categorie/categorie.component';
import { DetailCategorieComponent } from './pages/categorie/detail-categorie/detail-categorie.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProfilComponent } from './pages/profil/profil.component';
import { MesCommandesComponent } from './pages/commande/mes-commandes/mes-commandes.component';

@NgModule({
  declarations: [
    AppComponent,
    ProduitComponent,
    NavbarComponent,
    ConnexionComponent,
    InscriptionComponent,
    HomeComponent,
    NotFoundComponent,
    PanierComponent,
    BanniereComponent,
    FooterComponent,
    CardProduitComponent,
    SectionStatsComponent,
    ProduitAjoutComponent,
    ProduitEditionComponent,
    TruncatePipe,
    ProductDetailComponent,
    CommandeComponent,
    ConfirmationComponent,
    CategorieComponent,
    DetailCategorieComponent,
    ProfilComponent,
    MesCommandesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    CommonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [{ 
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
  }, provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }