export interface EncyclopediaReference {
  title: string;
  url?: string;
}

export interface EncyclopediaArticle {
  id: string; // UUID
  title: string;
  slug: string;
  category?: 'deity' | 'prasadam' | 'ritual' | 'architecture' | 'geography' | 'culture';
  keywords?: string[];
  content: string;
  summary?: string;
  coverImage?: string;
  references?: EncyclopediaReference[];
  relatedTemples?: string[]; // IDs
  relatedArticles?: string[]; // UUIDs
  isActive?: boolean;
  createdAt?: string;
}
