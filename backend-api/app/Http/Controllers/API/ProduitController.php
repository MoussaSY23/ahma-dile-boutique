<?php


namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\ProduitService;

class ProduitController extends Controller
{
    protected $produitService;

    public function __construct(ProduitService $produitService)
    {
        $this->produitService = $produitService;
    }

    public function index()
    {
        return response()->json($this->produitService->getAll());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'required|numeric',
            'quantite' => 'required|integer|min:0',
            'unite' => 'required|string',
            'type' => 'required|string|in:tissu,mercerie',
            'categorie_id' => 'required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('produits', 'public');
            $validated['image'] = $imagePath;
        }

        $produit = $this->produitService->create($validated);
        return response()->json($produit, 201);
    }

    public function show($id)
    {
        return response()->json($this->produitService->getById($id));
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nom' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'prix' => 'sometimes|required|numeric',
            'quantite' => 'sometimes|required|integer|min:0',
            'unite' => 'sometimes|required|string',
            'type' => 'sometimes|required|string|in:tissu,mercerie',
            'categorie_id' => 'sometimes|required|exists:categories,id',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048'
        ]);
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('produits', 'public');
            $validated['image'] = $imagePath;
        }

        $produit = $this->produitService->update($id, $validated);
        return response()->json($produit);
    }

    public function destroy($id)
    {
        $this->produitService->delete($id);
        return response()->json(['message' => 'Produit supprimé']);
    }
}
