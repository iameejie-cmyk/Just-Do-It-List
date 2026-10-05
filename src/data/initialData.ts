import { CategoryConfig, MilestoneBadge, Task } from '../types';

export const INITIAL_CATEGORIES: CategoryConfig[] = [
  {
    id: 'work',
    title: 'Work',
    subtitle: 'Protect time for focused progress.',
    iconName: 'briefcase',
  },
  {
    id: 'personal',
    title: 'Personal',
    subtitle: 'Make room for what matters most.',
    iconName: 'heart',
  },
  {
    id: 'shopping',
    title: 'Shopping',
    subtitle: 'Keep the practical details in one place.',
    iconName: 'shopping-basket',
  },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-w1',
    categoryId: 'work',
    title: 'Prepare notes for the team check-in',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-w2',
    categoryId: 'work',
    title: 'Finish the project outline',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-p1',
    categoryId: 'personal',
    title: 'Take a 20-minute walk',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-p2',
    categoryId: 'personal',
    title: 'Call Mum',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-s1',
    categoryId: 'shopping',
    title: 'Fresh fruit and vegetables',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-s2',
    categoryId: 'shopping',
    title: 'Coffee beans',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

export const DAILY_QUOTES = [
  'Small steps every day lead to big results.',
  'Focus on progress, not perfection.',
  'A clear plan clears the mind.',
  'One quiet achievement at a time.',
  'Notice how good it feels to finish what you start.',
];

export const INITIAL_BADGES: MilestoneBadge[] = [
  {
    id: 'first-step',
    title: 'First Step',
    description: 'Complete your first task of the day',
    icon: '🌱',
    unlocked: false,
  },
  {
    id: 'halfway',
    title: 'Halfway Mark',
    description: 'Reach 50% completion on today’s list',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'trio-master',
    title: 'Balanced Life',
    description: 'Complete at least one task in Work, Personal, and Shopping',
    icon: '⚖️',
    unlocked: false,
  },
  {
    id: 'grand-slam',
    title: 'Flawless Finish',
    description: 'Complete 100% of all tasks',
    icon: '🏆',
    unlocked: false,
  },
];
