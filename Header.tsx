
import React from 'react';

interface HeaderProps {
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const titles: Record<string, string> = {
    workflows: 'Workflow Orchestration',
    imagemagic: 'Nano Banana AI Image Editor',
    dashboard: 'Analytics Dashboard'
  };

  return (
    <header className="h-20 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-lg font-semibold text-white">{titles[activeTab]}</h2>
        <p className="text-xs text-slate-400">Automate complex tasks with intelligent logic.</p>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors">
          <i className="fa-regular fa-bell text-xl"></i>
        </button>
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-slate-700"></div>
      </div>
    </header>
  );
};
