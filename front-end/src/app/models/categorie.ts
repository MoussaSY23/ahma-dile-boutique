export interface Categorie {
  id?: number;
  nom: string;
  type: 'tissu' | 'mercerie';
  image?: string;
  imageUrl?: string;
  description?: string;
  active?: boolean;
  ordre?: number;
}
