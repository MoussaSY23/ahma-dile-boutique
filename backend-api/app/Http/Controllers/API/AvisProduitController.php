<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AvisProduit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvisProduitController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'note' => 'required|integer|min:1|max:5',
            'commentaire' => 'nullable|string'
        ]);

        return AvisProduit::create([
            'produit_id' => $request->produit_id,
            'user_id' => Auth::id(),
            'note' => $request->note,
            'commentaire' => $request->commentaire,
            'valide' => false
        ]);
    }
}
