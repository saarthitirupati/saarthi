export interface Story {
  id: string; // TEXT/UUID
  title: string;
  slug: string;
  category?: 'temple_history' | 'mythology' | 'spiritual_lesson' | 'heritage' | 'hidden_story' | 'saint' | 'festival_origin' | 'architecture' | 'unknown_facts';
  cover_image?: string;
  reading_time?: number; // minutes
  content: string;
  keyTakeaway?: string;
  audioUrl?: string;
  relatedTemple?: string; // temple id
  tags?: string[];
  isActive?: boolean;
  publishDate?: string; // date string
  createdAt?: string;
}
