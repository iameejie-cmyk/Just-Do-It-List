import React, { useState, useMemo } from 'react';
import { CategoryConfig, CategoryId, Task } from '../types';
import { Search, Plus, Check, Trash2, CheckCircle2, RotateCcw } from 'lucide-react';

interface MyTasksViewProps {
  categories: CategoryConfig[];
  tasks: Task[];
  onAddTask: (categoryId: CategoryId, title: string) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onClearCompleted: () => void;
  onResetDefault: () => void;
}

export const MyTasksView: React.FC<MyTasksViewProps> = ({
  categories,
  tasks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onClearCompleted,
  onResetDefault,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('work');

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchCat = selectedCategory === 'all' || task.categoryId === selectedCategory;
      const matchStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'completed' && task.completed) ||
        (selectedStatus === 'pending' && !task.completed);
      const matchQuery =
        !searchQuery.trim() ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchCat && matchStatus && matchQuery;
    });
  }, [tasks, selectedCategory, selectedStatus, searchQuery]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(newCategory, newTitle.trim());
    setNewTitle('');
  };

  const getCategoryName = (id: CategoryId) => {
    return categories.find((c) => c.id === id)?.title || id;
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-[#7a7b74] uppercase block">
            WORKSPACE DIRECTORY
          </span>
          <h1 className="font-serif-title text-3xl font-bold text-[#1a1d18]">
            My Tasks
          </h1>
          <p className="text-sm text-[#6c6e66] mt-1">
            Search, filter, and organize your tasks across all work streams.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="text-xs font-medium px-3 py-2 rounded-xl bg-white border border-[#dedcd2] text-[#6b6e65] hover:text-[#b43838] hover:border-[#b43838]/40 transition-colors cursor-pointer"
            >
              Clear completed ({completedCount})
            </button>
          )}
          <button
            onClick={onResetDefault}
            className="text-xs font-medium px-3 py-2 rounded-xl bg-white border border-[#dedcd2] text-[#6b6e65] hover:text-[#1f221e] transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Reset to the 6 default tasks from the screenshot"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 md:p-6 shadow-xs border border-[#e8e7e1] space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8b8d84] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#dedcd2] focus:border-[#455240] focus:ring-1 focus:ring-[#455240] outline-hidden transition-colors"
            />
          </div>

          {/* Quick Add In-line */}
          <form onSubmit={handleQuickAdd} className="flex items-center gap-2 flex-1 md:max-w-md">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as CategoryId)}
              aria-label="Category"
              className="h-10 px-3 text-xs font-semibold rounded-xl border border-[#dedcd2] bg-[#f9f8f5] text-[#2a2d26] focus:border-[#455240] outline-hidden cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Quick add task..."
              className="flex-1 h-10 px-3 text-sm rounded-xl border border-[#dedcd2] focus:border-[#455240] focus:ring-1 focus:ring-[#455240] outline-hidden"
            />
            <button
              type="submit"
              className="h-10 px-3.5 bg-[#455240] text-white rounded-xl hover:bg-[#384333] transition-colors flex items-center gap-1 text-xs font-semibold shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </form>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f2f0e8] text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[#84877e] mr-1 font-medium">Category:</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#e2e6d8] text-[#242b20] font-semibold'
                  : 'text-[#6e7168] hover:bg-[#f2f1ea]'
              }`}
            >
              All ({tasks.length})
            </button>
            {categories.map((cat) => {
              const count = tasks.filter((t) => t.categoryId === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#e2e6d8] text-[#242b20] font-semibold'
                      : 'text-[#6e7168] hover:bg-[#f2f1ea]'
                  }`}
                >
                  {cat.title} ({count})
                </button>
              );
            })}
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#84877e] mr-1 font-medium">Status:</span>
            {(['all', 'pending', 'completed'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-colors cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-[#222722] text-[#f4f3ec]'
                    : 'text-[#6e7168] hover:bg-[#f2f1ea]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-[#e8e7e1]">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="w-8 h-8 text-[#a3a69c] mx-auto mb-2 opacity-50" />
            <p className="font-serif-title text-lg font-semibold text-[#252822]">
              No tasks found
            </p>
            <p className="text-xs text-[#7c7f76] mt-1">
              Try adjusting your filters or search terms.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f2f0e8]">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="group flex items-center justify-between py-3.5 transition-colors gap-3"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className={`w-5 h-5 rounded-[5px] border flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                      task.completed
                        ? 'bg-[#455240] border-[#455240] text-white'
                        : 'border-[#c2c0b6] bg-white hover:border-[#8f9288]'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div
                    onClick={() => onToggleTask(task.id)}
                    className="flex-1 min-w-0 cursor-pointer select-none"
                  >
                    <p
                      className={`text-sm ${
                        task.completed
                          ? 'line-through text-[#8c8e86]'
                          : 'text-[#1f221e] font-normal'
                      }`}
                    >
                      {task.title}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#f2f1ea] text-[#555850] font-mono uppercase tracking-wider">
                    {getCategoryName(task.categoryId)}
                  </span>

                  <button
                    type="button"
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1 text-[#a5a79f] hover:text-[#b43838] transition-colors rounded-md hover:bg-[#f6f5f0]"
                    title="Remove task"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.8]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
