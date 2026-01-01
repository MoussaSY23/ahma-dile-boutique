// connexion.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http'; // Import pour les erreurs HTTP

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent {
  form: FormGroup;
  apiError = ''; // Renommé 'erreur' en 'apiError' pour distinguer les erreurs API des erreurs de validation de champ
  isLoading = false; // Pour gérer l'état de chargement du bouton de soumission

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]] // Ajout minLength pour le mot de passe
    });
  }

  // --- Getters pour un accès facile aux contrôles du formulaire dans le template ---
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  // --- Méthodes de gestion du formulaire ---
  onSubmit() {
    this.apiError = ''; // Réinitialiser les erreurs API
    if (this.form.invalid) {
      // Marquer tous les champs comme 'touched' pour afficher les messages de validation
      this.form.markAllAsTouched();
      return; // Empêcher la soumission si le formulaire est invalide
    }

    this.isLoading = true; // Activer l'état de chargement

    this.auth.login(this.form.value).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/produits']); // Rediriger après succès
        this.isLoading = false; // Désactiver l'état de chargement
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false; // Désactiver l'état de chargement
        // Gérer les messages d'erreur spécifiques de l'API
        if (err.status === 401) { // Unauthorized, généralement identifiants incorrects
          this.apiError = 'Identifiants incorrects. Veuillez vérifier votre email et mot de passe.';
        } else if (err.status === 400) { // Bad Request, ex: données manquantes ou mal formatées
            this.apiError = 'Requête invalide. Veuillez vérifier les informations fournies.';
        } else {
          this.apiError = 'Une erreur est survenue. Veuillez réessayer plus tard.';
        }
        console.error('Erreur de connexion API:', err);
      }
    });
  }

  onGoogleSignIn() {
    // Logique de connexion Google à implémenter
    console.log('Connexion Google');
    this.apiError = 'La connexion Google n\'est pas encore implémentée.';
  }

  clearError() {
    this.apiError = ''; // Efface le message d'erreur API lors de la saisie
  }
}