
export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: string;
  imageUrl?: string;
  audioUrl?: string;
  instructor: string;
  tags: string[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
