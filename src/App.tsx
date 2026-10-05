/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { CategoryId, Task, AchievementItem, MilestoneBadge } from './types';
import { INITIAL_CATEGORIES, INITIAL_TASKS, INITIAL_BADGES } from './data/initialData';
import { Sidebar, NavTab } from './components/Sidebar';
import { ProgressCard } from './components/ProgressCard';
import { DailyReminderCard } from './components/DailyReminderCard';
import { AchievementsCard } from './components/AchievementsCard';
import { TaskColumn } from './components/TaskColumn';
import { MyTasksView } from './components/MyTasksView';
import { AchievementsView } from './components/AchievementsView';
import { triggerTaskCelebration, triggerGrandCelebration } from './utils/confetti';
import { Menu, RotateCcw } from 'lucide-react';

const STORAGE_KEYS = {
  TASKS: 'daymark_tasks_v1',
  ACHIEVEMENTS: 'daymark_achievements_v1',
  BADGES: 'daymark_badges_v1',
};

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tasks State initialized from localStorage or default screenshot tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_TASKS;
  });

  // Completed achievements record
  const [achievements, setAchievements] = useState<AchievementItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return [];
  });

  // Milestone Badges
  const [badges, setBadges] = useState<MilestoneBadge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BADGES);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_BADGES;
  });

  // Undo Toast state for deletions
  const [undoToast, setUndoToast] = useState<{
    task: Task;
    index: number;
    timerId: ReturnType<typeof setTimeout>;
    wasCompleted?: boolean;
  } | null>(null);

  // Sync tasks to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  // Sync achievements to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  }, [achievements]);

  // Sync badges to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BADGES, JSON.stringify(badges));
  }, [badges]);

  // Compute live counts:
  // The total number of tasks at the top strictly matches the number of activity tasks at the bottom
  const totalTasks = tasks.length;
  const completedInList = tasks.filter((t) => t.completed).length;
  const completedCount = completedInList;

  // Track daily completion progress percentage
  const totalHandled = tasks.length + achievements.length;
  const progressPercentage =
    tasks.length === 0
      ? 100
      : totalHandled === 0
      ? 0
      : Math.round((achievements.length / totalHandled) * 100);

  // Evaluate milestone badges whenever tasks or achievements change
  useEffect(() => {
    setBadges((prevBadges) => {
      const hasFirst = achievements.length > 0;
      const hasHalfway =
        achievements.length > 0 && (tasks.length === 0 || achievements.length >= tasks.length);
      const hasWork = achievements.some((a) => a.category === 'work');
      const hasPersonal = achievements.some((a) => a.category === 'personal');
      const hasShopping = achievements.some((a) => a.category === 'shopping');
      const hasTrio = hasWork && hasPersonal && hasShopping;
      const hasAll = achievements.length > 0 && tasks.length === 0;

      return prevBadges.map((badge) => {
        let isEarned = false;
        if (badge.id === 'first-step') isEarned = hasFirst;
        if (badge.id === 'halfway') isEarned = hasHalfway;
        if (badge.id === 'trio-master') isEarned = hasTrio;
        if (badge.id === 'grand-slam') isEarned = hasAll;

        return {
          ...badge,
          unlocked: isEarned,
          unlockedAt: isEarned ? badge.unlockedAt || new Date().toISOString() : undefined,
        };
      });
    });
  }, [tasks, achievements]);

  // Handlers for Task Actions
  const handleAddTask = (categoryId: CategoryId, title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      categoryId,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    // Adding a task automatically updates tasks and recalculates progress bar
    setTasks((prev) => [...prev, newTask]);
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // Trigger celebratory confetti feedback
    triggerTaskCelebration();

    // Check if this was the last remaining active task
    const remainingAfterThis = tasks.filter((t) => t.id !== taskId).length;
    if (remainingAfterThis === 0 && (tasks.length + achievements.length) > 0) {
      setTimeout(triggerGrandCelebration, 500);
    }

    const nowFormatted = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Record in achievements log
    setAchievements((prevAch) => [
      {
        id: `ach-${Date.now()}`,
        taskId: task.id,
        taskTitle: task.title,
        category: task.categoryId,
        completedAt: nowFormatted,
      },
      ...prevAch.filter((a) => a.taskId !== task.id),
    ]);

    // Mark task completed in state
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, completed: true, completedAt: new Date().toISOString() }
          : t
      )
    );
  };

  const handleDeleteTask = (taskId: string, isAutoDeleteFromDone = false) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (undoToast?.timerId) {
      clearTimeout(undoToast.timerId);
    }

    if (taskToDelete) {
      const timerId = setTimeout(() => {
        setUndoToast(null);
      }, 5000);

      setUndoToast({
        task: taskToDelete,
        index: taskIndex >= 0 ? taskIndex : 0,
        timerId,
        wasCompleted: isAutoDeleteFromDone,
      });
    }

    // Removing task from active list automatically updates progress bar
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    // If manual removal via trash can (not completed), also remove from achievements
    if (!isAutoDeleteFromDone) {
      setAchievements((prev) => prev.filter((a) => a.taskId !== taskId));
    }
  };

  const handleUndoDelete = () => {
    if (!undoToast) return;
    if (undoToast.timerId) clearTimeout(undoToast.timerId);

    const { task, index, wasCompleted } = undoToast;
    setTasks((prev) => {
      const next = [...prev];
      next.splice(index, 0, { ...task, completed: false });
      return next;
    });

    // If it was auto-deleted from completion, undoing removes it from achievements
    if (wasCompleted) {
      setAchievements((prev) => prev.filter((a) => a.taskId !== task.id));
    }

    setUndoToast(null);
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const handleClearAchievementsHistory = () => {
    setAchievements([]);
  };

  const handleResetToScreenshotDefault = () => {
    setTasks(INITIAL_TASKS);
    setAchievements([]);
    setBadges(INITIAL_BADGES);
  };

  return (
    <div className="min-h-screen bg-[#f3f2ec] text-[#1f221e] flex flex-col md:flex-row font-sans selection:bg-[#475342]/15 selection:text-[#1a1d18]">
      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        completedCount={completedCount}
        totalCount={totalTasks}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Mobile Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-[#f8f7f4] border-b border-[#e8e6dd]">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-xl text-[#4a4c45] hover:bg-[#eae8df] transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-serif-title font-bold text-lg text-[#1f221e]">
            Daymark
          </span>
          <button
            onClick={handleResetToScreenshotDefault}
            className="p-2 rounded-xl text-[#7c7e75] hover:text-[#1f221e]"
            title="Reset to default screenshot data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex-1 p-5 md:p-10 lg:p-12 max-w-[1360px] mx-auto w-full">
          {currentTab === 'overview' && (
            <div className="space-y-6 md:space-y-7">
              {/* Daily Focus Header */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold tracking-widest text-[#7a7b74] uppercase block">
                    Your Daily Focus
                  </span>
                  <h1 className="font-serif-title text-3xl md:text-4xl font-bold text-[#1a1d18] tracking-tight mt-1">
                    Achievement To-Do List
                  </h1>
                </div>

                <button
                  onClick={handleResetToScreenshotDefault}
                  className="hidden md:flex items-center gap-1.5 text-xs text-[#75776d] hover:text-[#1f221e] px-3 py-1.5 rounded-xl border border-[#dedcd2] bg-white/70 hover:bg-white transition-all shadow-2xs cursor-pointer"
                  title="Restore initial state from screenshot"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Demo</span>
                </button>
              </div>

              {/* Today's Progress Card (Auto updates on add/remove/toggle) */}
              <ProgressCard
                completedCount={completedCount}
                totalCount={totalTasks}
                progressPercentage={progressPercentage}
              />

              {/* Middle Row: Daily Reminder & Achievements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DailyReminderCard />
                <AchievementsCard
                  completedTasks={achievements}
                  onViewAllAchievements={() => setCurrentTab('achievements')}
                />
              </div>

              {/* Bottom Row: 3 Category Columns (Work, Personal, Shopping) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {INITIAL_CATEGORIES.map((category) => (
                  <TaskColumn
                    key={category.id}
                    category={category}
                    tasks={tasks.filter((t) => t.categoryId === category.id)}
                    onAddTask={handleAddTask}
                    onToggleTask={handleToggleTask}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
              </div>
            </div>
          )}

          {currentTab === 'my-tasks' && (
            <MyTasksView
              categories={INITIAL_CATEGORIES}
              tasks={tasks}
              onAddTask={handleAddTask}
              onToggleTask={handleToggleTask}
              onDeleteTask={handleDeleteTask}
              onClearCompleted={handleClearCompleted}
              onResetDefault={handleResetToScreenshotDefault}
            />
          )}

          {currentTab === 'achievements' && (
            <AchievementsView
              completedTasks={achievements}
              badges={badges}
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onClearHistory={handleClearAchievementsHistory}
            />
          )}
        </div>

        {/* Floating Undo Toast for Task Deletion */}
        {undoToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="bg-[#222722] text-[#f4f3ec] px-4 py-3 rounded-2xl shadow-lg border border-[#353e34] flex items-center gap-3.5 text-xs">
              <span className="text-[#d8ded4]">
                {undoToast.wasCompleted ? '✓ Completed & archived' : 'Deleted'}{' '}
                <strong className="font-medium text-white truncate max-w-[180px] inline-block align-bottom">
                  {undoToast.task.title}
                </strong>
              </span>
              <button
                type="button"
                onClick={handleUndoDelete}
                className="bg-[#455240] hover:bg-[#52634d] text-white font-semibold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
              >
                Undo
              </button>
              <button
                type="button"
                onClick={() => setUndoToast(null)}
                className="text-[#9fa59b] hover:text-white transition-colors cursor-pointer"
                aria-label="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
