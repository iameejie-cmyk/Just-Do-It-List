import React, { useState } from 'react';
import { CategoryConfig, Task } from '../types';
import { Briefcase, Heart, ShoppingBasket, Trash2, Check } from 'lucide-react';

interface TaskColumnProps {
  category: CategoryConfig;
  tasks: Task[];
  onAddTask: (categoryId: CategoryConfig['id'], title: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string, isAutoDeleteFromDone?: boolean) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  category,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [completingIds, setCompletingIds] = useState<string[]>([]);
  const [animatingOutIds, setAnimatingOutIds] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onAddTask(category.id, trimmed);
    setNewTitle('');
  };

  const handleDelete = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Trigger smooth exit animation before removing
    setDeletingId(taskId);
    setTimeout(() => {
      onDeleteTask(taskId, false);
      setDeletingId(null);
    }, 240);
  };

  // Once marked done, celebrate, show strikethrough, then auto-delete from list
  const handleToggle = (taskId: string) => {
    if (completingIds.includes(taskId) || animatingOutIds.includes(taskId)) return;

    // 1. Immediately show marked done state on the row and span
    setCompletingIds((prev) => [...prev, taskId]);

    // Notify parent to record achievement and update stats
    onToggleTask(taskId);

    // 2. Allow user to view satisfying strikethrough and checkmark for 700ms
    setTimeout(() => {
      // 3. Begin smooth exit animation
      setAnimatingOutIds((prev) => [...prev, taskId]);

      // 4. Once exit animation settles, auto-delete from the task list
      setTimeout(() => {
        onDeleteTask(taskId, true);
        setCompletingIds((prev) => prev.filter((id) => id !== taskId));
        setAnimatingOutIds((prev) => prev.filter((id) => id !== taskId));
      }, 280);
    }, 700);
  };

  // Select appropriate icon
  const renderIcon = () => {
    switch (category.iconName) {
      case 'briefcase':
        return <Briefcase className="w-4 h-4 stroke-[2.2]" />;
      case 'heart':
        return <Heart className="w-4 h-4 stroke-[2.2]" />;
      case 'shopping-basket':
        return <ShoppingBasket className="w-4 h-4 stroke-[2.2]" />;
      default:
        return <Briefcase className="w-4 h-4 stroke-[2.2]" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-7 flex flex-col justify-between shadow-xs border border-[#e8e7e1] transition-all hover:border-[#dedcd2]">
      <div>
        {/* Column Header */}
        <div className="mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#e6ebe0] text-[#42503d] flex items-center justify-center mb-3">
            {renderIcon()}
          </div>
          <h3 className="font-serif-title text-xl font-bold text-[#1a1d18]">
            {category.title}
          </h3>
          <p className="text-xs text-[#71736b] mt-1">{category.subtitle}</p>
        </div>

        {/* Task Items List */}
        <div className="space-y-0">
          {tasks.length === 0 ? (
            <div className="py-6 text-center border-t border-[#f2f0e8]">
              <p className="text-xs text-[#9a9d94] italic">No tasks yet in {category.title}.</p>
            </div>
          ) : (
            tasks.map((task) => {
              const isDeleting = deletingId === task.id;
              const isCompleting = completingIds.includes(task.id) || task.completed;
              const isAnimatingOut = animatingOutIds.includes(task.id) || isDeleting;

              return (
                <div
                  key={task.id}
                  className={`group flex items-start justify-between gap-3 py-3.5 border-t border-[#f2f0e8] first:border-t transition-all duration-280 ease-out ${
                    isAnimatingOut
                      ? 'opacity-0 -translate-x-4 scale-[0.98] max-h-0 py-0 overflow-hidden border-transparent pointer-events-none'
                      : isCompleting
                      ? 'bg-[#f7f8f4]/90 px-2 -mx-2 rounded-xl'
                      : 'opacity-100 translate-x-0'
                  }`}
                >
                  {/* Custom Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggle(task.id)}
                    aria-label={isCompleting ? `Mark ${task.title} as incomplete` : `Mark ${task.title} as complete`}
                    className={`mt-0.5 w-[18px] h-[18px] rounded-[5px] border flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer ${
                      isCompleting
                        ? 'bg-[#455240] border-[#455240] text-white scale-105 shadow-2xs'
                        : 'border-[#c2c0b6] bg-white hover:border-[#8f9288]'
                    }`}
                  >
                    {isCompleting && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>

                  {/* Task Title with Enhanced Style Changes */}
                  <div
                    onClick={() => handleToggle(task.id)}
                    className="flex-1 cursor-pointer select-none"
                  >
                    <span
                      className={`text-sm leading-snug transition-all duration-300 block ${
                        isCompleting
                          ? 'line-through text-[#8a8d83] decoration-[#455240] decoration-[1.5px] italic opacity-75'
                          : 'text-[#1f221e] hover:text-black font-normal'
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  {/* Delete button (matches screenshot trash icon) */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(task.id, e)}
                    className="group/btn p-1.5 text-[#a5a79f] hover:text-[#b43838] hover:bg-[#fbf1f1] active:text-[#992a2a] active:scale-90 transition-all rounded-lg opacity-80 group-hover:opacity-100 cursor-pointer"
                    title="Remove task"
                    aria-label={`Remove task ${task.title}`}
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.8] transition-transform group-hover/btn:scale-110" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Task Form (bottom of each card) */}
      <form onSubmit={handleSubmit} className="mt-5 pt-3 flex items-center gap-2">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder=""
          aria-label={`Add new task to ${category.title}`}
          className="flex-1 min-w-0 h-10 rounded-xl border border-[#dedcd2] bg-white px-3.5 text-sm text-[#1f221e] focus:outline-none focus:border-[#455240] focus:ring-1 focus:ring-[#455240] transition-colors"
        />
        <button
          type="submit"
          className="h-10 bg-[#455240] hover:bg-[#384333] active:bg-[#2e372a] text-white text-xs font-semibold rounded-xl px-4 transition-all whitespace-nowrap active:scale-[0.98] shadow-xs cursor-pointer"
        >
          Add task
        </button>
      </form>
    </div>
  );
};
