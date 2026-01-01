<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'description',
        'prix',
        'prix_au_metre',
        'quantite',
        'unite',
        'type',
        'categorie_id',
        'image',
        'vendu_au_metre',
        'matiere',
        'couleur',
        'motif',
        'sku',
        'visible',
        'ordre',
        'poids',
        'largeur',
        'origine',
        'en_promotion',
    ];

    /* ================= RELATIONS ================= */

    public function categorie()
    {
        return $this->belongsTo(Categorie::class);
    }

    public function stock()
    {
        return $this->hasOne(Stock::class);
    }

    public function images()
    {
        return $this->hasMany(ProduitImage::class);
    }

    public function avis()
    {
        return $this->hasMany(AvisProduit::class);
    }

    public function favoris()
    {
        return $this->belongsToMany(User::class, 'favoris');
    }

    public function promotions()
    {
        return $this->belongsToMany(Promotion::class);
    }
}
