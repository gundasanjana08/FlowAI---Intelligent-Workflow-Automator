
import React, { useState, useEffect } from 'react';
import { WorkflowEditor } from './components/WorkflowEditor';
import { ImageMagic } from './components/ImageMagic';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Workflow } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'imagemagic' | 'dashboard'>('workflows');
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: '1',
      name: 'E-commerce Auto-Processor',
      description: 'Fetch order data and generate marketing copy.',
      nodes: []
    }
  ]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header activeTab={activeTab} />
        
        <main className="flex-1 overflow-y-auto p-6 bg-[#0f172a]">
          {activeTab === 'workflows' && (
            <div className="max-w-6xl mx-auto">
              <WorkflowEditor 
                workflow={workflows[0]} 
                onSave={(updated) => setWorkflows([updated])}
              />
            </div>
          )}
          
          {activeTab === 'imagemagic' && (
            <div className="max-w-5xl mx-auto">
              <ImageMagic />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="flex items-center justify-center h-full text-slate-400">
              <div className="text-center">
                <i className="fa-solid fa-chart-line text-6xl mb-4 opacity-20"></i>
                <h2 className="text-2xl font-semibold">Analytics Dashboard Coming Soon</h2>
                <p className="mt-2">Monitor your workflow performance in real-time.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
