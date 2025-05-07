
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon?: string;
  unlocked: boolean;
  progress?: number;
  unlockedDate?: string;
}
