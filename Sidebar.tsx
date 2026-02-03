
import React from 'react';

interface SidebarProps {
  activeTab: 'workflows' | 'imagemagic' | 'dashboard';
  onTabChange: (tab: 'workflows' | 'imagemagic' | 'dashboard') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-gauge' },
    { id: 'workflows', label: 'Workflows', icon: 'fa-diagram-project' },
    { id: 'imagemagic', label: 'Image Magic', icon: 'fa-wand-magic-sparkles' },
  ];

  return (
    <aside className="w-64 bg-[#1e293b] border-r border-slate-700 flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
          <i className="fa-solid fa-bolt text-white"></i>
        </div>
        <h1 className="text-xl font-bold tracking-tight">FlowAI</h1>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fa-solid ${item.icon}`}></i>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-700">
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Usage</p>
          <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div className="w-[65%] h-full bg-blue-500"></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">650 / 1000 AI Credits used</p>
        </div>
      </div>
    </aside>
  );
};
