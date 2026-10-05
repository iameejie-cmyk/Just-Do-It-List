import React from 'react';
import { AchievementItem } from '../types';
import { Award, CheckCircle2, ChevronRight } from 'lucide-react';

interface AchievementsCardProps {
  completedTasks: AchievementItem[];
  onViewAllAchievements: () => void;
}

export const AchievementsCard: React.FC<AchievementsCardProps> = ({
  completedTasks,
  onViewAllAchievements,
}) => {
  const hasAchievements = completedTasks.length > 0;
  const recentAchievements = completedTasks.slice(0, 3);

  return (
    <div className="bg-white rounded-3xl p-7 md:p-8 flex flex-col justify-between shadow-xs border border-[#e8e7e1]">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="font-serif-title text-2xl font-bold text-[#1a1d18]">
            Achievements
          </h2>
          {hasAchievements && (
            <button
              onClick={onViewAllAchievements}
              className="text-xs text-[#525e4c] hover:text-[#252c22] font-semibold flex items-center gap-1 transition-colors"
            >
              <span>View all ({completedTasks.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-sm text-[#6c6e66] mt-1">
          A quiet record of the tasks you have finished.
        </p>

        {/* Content State */}
        {!hasAchievements ? (
          <div className="mt-8 pt-2">
            <p className="italic text-sm text-[#7c7f76]">
              Complete a task to earn your first achievement.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-2.5">
            {recentAchievements.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[#f9f8f5] border border-[#f0eee6]"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#455240] shrink-0" />
                  <span className="font-medium text-[#2b2d28] truncate">
                    {item.taskTitle}
                  </span>
                </div>
                <span className="text-[11px] text-[#86887e] shrink-0 uppercase tracking-wider font-mono">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasAchievements && (
        <div className="mt-4 pt-3 border-t border-[#f0eee6] flex items-center justify-between text-xs text-[#6e7168]">
          <span className="flex items-center gap-1.5 font-medium">
            <Award className="w-3.5 h-3.5 text-[#455240]" />
            <span>
              {completedTasks.length} {completedTasks.length === 1 ? 'task' : 'tasks'} marked complete
            </span>
          </span>
          <span className="text-[11px] text-[#8a8d83]">Keep going</span>
        </div>
      )}
    </div>
  );
};
