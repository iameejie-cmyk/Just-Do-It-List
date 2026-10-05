import React from 'react';
import { LayoutGrid, CheckCheck, Award, CheckSquare, X } from 'lucide-react';

export type NavTab = 'overview' | 'my-tasks' | 'achievements';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  completedCount: number;
  totalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  completedCount,
  totalCount,
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutGrid className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'my-tasks',
      label: 'My tasks',
      icon: <CheckCheck className="w-4 h-4 shrink-0" />,
      badge: `${totalCount - completedCount}`,
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: <Award className="w-4 h-4 shrink-0" />,
      badge: completedCount > 0 ? `${completedCount}` : undefined,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#f8f7f4] border-r border-[#e8e6dd] flex flex-col justify-between p-6 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:static md:shadow-none'
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#222722] text-[#f4f3ec] flex items-center justify-center shadow-xs">
                <CheckSquare className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-serif-title font-bold text-lg text-[#1f221e] tracking-tight">
                Daymark
              </span>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-[#73756e] hover:bg-[#eae8df] transition-colors"
              aria-label="Close navigation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Section Heading */}
          <div className="mb-3 px-2">
            <span className="text-[11px] font-semibold tracking-wider text-[#8b8d84] uppercase">
              Workspace
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#e2e6d8] text-[#252c22] font-semibold'
                      : 'text-[#585a53] hover:bg-[#eeece3] hover:text-[#1f221e]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? 'text-[#252c22]' : 'text-[#72756d]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-md tabular-nums font-mono ${
                        isActive
                          ? 'bg-[#d3dbc7] text-[#222722]'
                          : 'bg-[#e9e7de] text-[#71736b]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Thought Card */}
        <div className="mt-auto pt-6">
          <div className="rounded-2xl border border-[#e1dfd5] bg-[#f2f1eb]/60 p-4 text-[13px] text-[#63665e] leading-relaxed">
            Small, intentional steps add up to a meaningful day.
          </div>
        </div>
      </aside>
    </>
  );
};
