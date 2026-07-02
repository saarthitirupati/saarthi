export interface UserEvent {
  id: string; // UUID
  sessionId: string; // Anonymous session id
  eventType: 'viewed_temple' | 'read_story' | 'completed_quiz' | 'saved_temple' | 'shared_story' | 'visited_temple' | 'generated_plan' | 'clicked_navigation';
  entityType?: 'temple' | 'story' | 'quiz' | 'festival' | 'plan';
  entityId?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
}
