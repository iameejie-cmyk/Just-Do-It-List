export type CategoryId = 'work' | 'personal' | 'shopping';

export interface Task {
  id: string;
  categoryId: CategoryId;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface CategoryConfig {
  id: CategoryId;
  title: string;
  subtitle: string;
  iconName: 'briefcase' | 'heart' | 'shopping-basket';
}

export interface AchievementItem {
  id: string;
  taskId: string;
  taskTitle: string;
  category: CategoryId;
  completedAt: string;
}

export interface MilestoneBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}
