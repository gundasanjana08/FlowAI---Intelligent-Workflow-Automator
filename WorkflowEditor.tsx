
import React, { useState } from 'react';
import { Workflow, WorkflowNode, NodeType } from '../types';
import { NodeCard } from './NodeCard';
import { processText } from '../services/geminiService';

interface WorkflowEditorProps {
  workflow: Workflow;
  onSave: (workflow: Workflow) => void;
}

export const WorkflowEditor: React.FC<WorkflowEditorProps> = ({ workflow, onSave }) => {
  const [nodes, setNodes] = useState<WorkflowNode[]>(workflow.nodes);
  const [isRunning, setIsRunning] = useState(false);

  const addNode = (type: NodeType) => {
    const newNode: WorkflowNode = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      title: `${type.replace('_', ' ')} Node`,
      description: 'Configure this step to automate your logic.',
      config: type === NodeType.REST_API ? { url: '', method: 'GET' } : { prompt: '' },
      status: 'idle',
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
  };

  const updateNodeConfig = (id: string, config: any) => {
    setNodes(nodes.map(n => n.id === id ? { ...n, config } : n));
  };

  const runWorkflow = async () => {
    setIsRunning(true);
    let context = ""; // Result from previous nodes passed down
    
    const updatedNodes = [...nodes];
    
    for (let i = 0; i < updatedNodes.length; i++) {
      const node = updatedNodes[i];
      updatedNodes[i] = { ...node, status: 'running' };
      setNodes([...updatedNodes]);

      try {
        if (node.type === NodeType.AI_TEXT) {
          const result = await processText(`${node.config.prompt}\n\nContext:\n${context}`);
          updatedNodes[i] = { ...updatedNodes[i], status: 'success', lastResult: result };
          context = result || "";
        } else if (node.type === NodeType.REST_API) {
          // Simulated API call for demo
          await new Promise(r => setTimeout(r, 1500));
          const mockResult = `Fetched data from ${node.config.url}`;
          updatedNodes[i] = { ...updatedNodes[i], status: 'success', lastResult: mockResult };
          context = mockResult;
        } else {
          await new Promise(r => setTimeout(r, 1000));
          updatedNodes[i] = { ...updatedNodes[i], status: 'success' };
        }
      } catch (err) {
        updatedNodes[i] = { ...updatedNodes[i], status: 'error' };
        setIsRunning(false);
        setNodes([...updatedNodes]);
        return;
      }
      setNodes([...updatedNodes]);
    }

    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">{workflow.name}</h1>
          <p className="text-slate-400 mt-1">{workflow.description}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={runWorkflow}
            disabled={isRunning || nodes.length === 0}
            className="px-6 py-2.5 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-green-900/20"
          >
            <i className={`fa-solid ${isRunning ? 'fa-spinner fa-spin' : 'fa-play'}`}></i>
            {isRunning ? 'Running...' : 'Run Flow'}
          </button>
          <button 
            onClick={() => onSave({ ...workflow, nodes })}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-700/50 -translate-x-1/2"></div>
        
        <div className="flex flex-col items-center gap-12 relative z-10">
          {nodes.map((node, index) => (
            <React.Fragment key={node.id}>
              <NodeCard 
                node={node} 
                onRemove={() => removeNode(node.id)}
                onUpdate={(config) => updateNodeConfig(node.id, config)}
              />
              {index < nodes.length - 1 && (
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500">
                  <i className="fa-solid fa-arrow-down"></i>
                </div>
              )}
            </React.Fragment>
          ))}

          <div className="w-full flex justify-center mt-4">
            <div className="bg-slate-800 p-2 rounded-2xl border border-slate-700 flex gap-2">
              <button 
                onClick={() => addNode(NodeType.REST_API)}
                className="px-4 py-2 hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-300 flex flex-col items-center gap-1 transition-colors"
              >
                <i className="fa-solid fa-cloud-arrow-down text-blue-400 text-lg"></i>
                API Call
              </button>
              <button 
                onClick={() => addNode(NodeType.AI_TEXT)}
                className="px-4 py-2 hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-300 flex flex-col items-center gap-1 transition-colors"
              >
                <i className="fa-solid fa-brain text-purple-400 text-lg"></i>
                AI Process
              </button>
              <button 
                onClick={() => addNode(NodeType.CONDITION)}
                className="px-4 py-2 hover:bg-slate-700 rounded-xl text-xs font-medium text-slate-300 flex flex-col items-center gap-1 transition-colors"
              >
                <i className="fa-solid fa-code-branch text-amber-400 text-lg"></i>
                Condition
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
