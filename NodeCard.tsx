
import React from 'react';
import { WorkflowNode, NodeType } from '../types';

interface NodeCardProps {
  node: WorkflowNode;
  onRemove: () => void;
  onUpdate: (config: any) => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({ node, onRemove, onUpdate }) => {
  const getIcon = () => {
    switch (node.type) {
      case NodeType.REST_API: return 'fa-cloud-arrow-down text-blue-400';
      case NodeType.AI_TEXT: return 'fa-brain text-purple-400';
      case NodeType.CONDITION: return 'fa-code-branch text-amber-400';
      case NodeType.AI_IMAGE: return 'fa-image text-emerald-400';
      default: return 'fa-cube text-slate-400';
    }
  };

  const getStatusColor = () => {
    switch (node.status) {
      case 'running': return 'border-blue-500 shadow-blue-500/20';
      case 'success': return 'border-green-500 shadow-green-500/10';
      case 'error': return 'border-red-500 shadow-red-500/10';
      default: return 'border-slate-700 shadow-none';
    }
  };

  return (
    <div className={`w-full max-w-xl glass-card rounded-2xl p-6 border-2 transition-all ${getStatusColor()} group`}>
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-2xl">
            <i className={`fa-solid ${getIcon()}`}></i>
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">{node.title}</h3>
            <p className="text-slate-400 text-sm">{node.description}</p>
          </div>
        </div>
        <button 
          onClick={onRemove}
          className="text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <i className="fa-solid fa-trash-can"></i>
        </button>
      </div>

      <div className="space-y-4">
        {node.type === NodeType.REST_API && (
          <div className="grid grid-cols-4 gap-3">
            <select 
              value={node.config.method}
              onChange={(e) => onUpdate({ ...node.config, method: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <input 
              type="text"
              placeholder="https://api.example.com/data"
              value={node.config.url}
              onChange={(e) => onUpdate({ ...node.config, url: e.target.value })}
              className="col-span-3 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {node.type === NodeType.AI_TEXT && (
          <textarea
            placeholder="AI Prompt (e.g. 'Summarize this data into 3 bullet points')"
            rows={3}
            value={node.config.prompt}
            onChange={(e) => onUpdate({ ...node.config, prompt: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        )}

        {node.type === NodeType.CONDITION && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">If result contains:</span>
            <input 
              type="text"
              placeholder="e.g. 'error'"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            />
          </div>
        )}
      </div>

      {node.lastResult && (
        <div className="mt-6 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Output</p>
          <div className="text-sm text-slate-300 font-mono line-clamp-4">
            {typeof node.lastResult === 'string' ? node.lastResult : JSON.stringify(node.lastResult, null, 2)}
          </div>
        </div>
      )}

      {node.status === 'running' && (
        <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-medium">
          <i className="fa-solid fa-circle-notch fa-spin"></i>
          <span>Processing Step...</span>
        </div>
      )}
    </div>
  );
};
