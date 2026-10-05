import React from 'react';

interface ProgressCardProps {
  completedCount: number;
  totalCount: number;
  progressPercentage?: number;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  completedCount,
  totalCount,
  progressPercentage,
}) => {
  const isAllCompleted = totalCount === 0 || (totalCount > 0 && completedCount >= totalCount);

  const percentage =
    progressPercentage !== undefined
      ? progressPercentage
      : totalCount === 0
      ? 100
      : Math.round((completedCount / totalCount) * 100);

  // Thoughtful status message matching the tranquil vibe
  let statusMessage = 'Your list is ready when you are.';
  if (isAllCompleted) {
    statusMessage = 'All tasks complete! Outstanding work today.';
  } else if (percentage >= 75) {
    statusMessage = 'Almost there! The finish line is in sight.';
  } else if (percentage >= 50) {
    statusMessage = 'More than halfway through. Keep the steady momentum.';
  } else if (percentage > 0) {
    statusMessage = 'Off to a thoughtful start. Keep moving forward.';
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-[#e8e7e1] transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Column: Heading and Counts */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold tracking-widest text-[#7b7e75] uppercase block">
            Today's Progress
          </span>
          <h2 className="font-serif-title text-2xl md:text-3xl font-bold text-[#1a1d18] tracking-tight transition-all duration-300">
            {isAllCompleted ? (
              'No Outstanding Task'
            ) : (
              <>
                <span className="tabular-nums font-mono font-semibold">{completedCount}</span> of{' '}
                <span className="tabular-nums font-mono font-semibold">{totalCount}</span> tasks complete
              </>
            )}
          </h2>
          <p className="text-sm text-[#6c6e66] transition-colors">{statusMessage}</p>
        </div>

        {/* Right Column: Progress Bar */}
        <div className="w-full md:w-80 lg:w-96 flex flex-col justify-center">
          {/* Track and Bar */}
          <div
            className="w-full h-2.5 bg-[#e8e6df] rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Daily task progress"
          >
            <div
              className="h-full bg-[#455240] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
            />
          </div>

          {/* Percentage */}
          <div className="flex justify-end mt-2">
            <span className="text-xs font-semibold text-[#5a5c54] tabular-nums font-mono">
              {percentage}% complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
