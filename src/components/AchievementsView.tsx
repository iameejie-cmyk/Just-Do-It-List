import React from 'react';
import { AchievementItem, MilestoneBadge, Task } from '../types';
import { Award, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface AchievementsViewProps {
  completedTasks: AchievementItem[];
  badges: MilestoneBadge[];
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onClearHistory: () => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  completedTasks,
  badges,
  tasks,
  onToggleTask,
  onClearHistory,
}) => {
  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const percentage = totalTasks === 0 ? 0 : Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-widest text-[#7a7b74] uppercase block">
            QUIET RECOGNITION
          </span>
          <h1 className="font-serif-title text-3xl font-bold text-[#1a1d18]">
            Achievements
          </h1>
          <p className="text-sm text-[#6c6e66] mt-1">
            A quiet record of the tasks you have finished and milestones unlocked.
          </p>
        </div>

        {completedTasks.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs font-medium px-3.5 py-2 rounded-xl bg-white border border-[#dedcd2] text-[#6b6e65] hover:text-[#b43838] transition-colors cursor-pointer self-start md:self-auto"
          >
            Clear Finished Record
          </button>
        )}
      </div>

      {/* Overview Stat Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#e8e7e1] flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#e6ebe0] text-[#455240] flex items-center justify-center font-serif text-xl font-bold">
            {completedCount}
          </div>
          <div>
            <span className="text-xs text-[#7c7f76] font-medium block">Tasks Finished</span>
            <span className="text-base font-semibold text-[#1f221e]">
              {completedCount} of {totalTasks} done today
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e8e7e1] flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#e2e6d8] text-[#343e30] flex items-center justify-center font-serif text-xl font-bold">
            {percentage}%
          </div>
          <div>
            <span className="text-xs text-[#7c7f76] font-medium block">Daily Progress</span>
            <span className="text-base font-semibold text-[#1f221e]">
              {percentage === 100 ? 'All finished!' : `${100 - percentage}% remaining`}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#e8e7e1] flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-[#222722] text-[#e8ece2] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#7c7f76] font-medium block">Badges Unlocked</span>
            <span className="text-base font-semibold text-[#1f221e]">
              {badges.filter((b) => b.unlocked).length} of {badges.length} unlocked
            </span>
          </div>
        </div>
      </div>

      {/* Milestone Badges */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-[#e8e7e1]">
        <h2 className="font-serif-title text-xl font-bold text-[#1a1d18] mb-1">
          Daily Milestones
        </h2>
        <p className="text-xs text-[#70736b] mb-5">
          Reach meaningful targets through intentional daily progress.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all ${
                badge.unlocked
                  ? 'bg-[#f7f9f5] border-[#d8e0d0] shadow-2xs'
                  : 'bg-[#faf9f6]/60 border-[#ece9df] opacity-60'
              }`}
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <h3 className="font-semibold text-sm text-[#1f221e] flex items-center justify-between">
                <span>{badge.title}</span>
                {badge.unlocked && (
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#455240] text-white">
                    Earned
                  </span>
                )}
              </h3>
              <p className="text-xs text-[#6e7168] mt-1 leading-relaxed">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chronological Record of Completed Tasks */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-[#e8e7e1]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-serif-title text-xl font-bold text-[#1a1d18]">
              Completed Tasks Log
            </h2>
            <p className="text-xs text-[#70736b] mt-0.5">
              Reflect on what you have accomplished today.
            </p>
          </div>
        </div>

        {completedTasks.length === 0 ? (
          <div className="py-12 text-center border-t border-[#f2f0e8]">
            <Award className="w-8 h-8 text-[#9ea197] mx-auto mb-2 opacity-40" />
            <p className="italic text-sm text-[#7e8077]">
              Complete a task to earn your first achievement.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#f2f0e8] border-t border-[#f2f0e8]">
            {completedTasks.map((item) => (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <CheckCircle2 className="w-4 h-4 text-[#455240] shrink-0" />
                  <div className="truncate">
                    <span className="text-sm font-medium text-[#222520] block truncate">
                      {item.taskTitle}
                    </span>
                    <span className="text-[11px] text-[#82857c]">
                      Finished at {item.completedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#edf0e8] text-[#414e3b] font-mono uppercase tracking-wider">
                    {item.category}
                  </span>

                  <button
                    onClick={() => onToggleTask(item.taskId)}
                    className="p-1 text-[#82857c] hover:text-[#222520] transition-colors rounded-md hover:bg-[#f3f2eb]"
                    title="Mark task as incomplete again"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
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
