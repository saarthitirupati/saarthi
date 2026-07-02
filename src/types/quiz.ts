export interface QuizOption {
  id: string; // "A", "B", "C", "D"
  text: string;
}

export interface Quiz {
  id: string; // UUID
  question: string;
  difficulty?: 'beginner' | 'intermediate' | 'expert';
  category?: 'tirumala' | 'temples' | 'mythology' | 'culture' | 'festivals' | 'architecture' | 'history';
  image?: string;
  options: QuizOption[];
  correctAnswer: string;
  explanation?: string;
  relatedStory?: string; // UUID string
  relatedTemple?: string; // place id
  xpReward?: number;
  isActive?: boolean;
  createdAt?: string;
}
