
export enum NodeType {
  TRIGGER = 'TRIGGER',
  REST_API = 'REST_API',
  AI_TEXT = 'AI_TEXT',
  AI_IMAGE = 'AI_IMAGE',
  CONDITION = 'CONDITION'
}

export interface WorkflowNode {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  config: any;
  status: 'idle' | 'running' | 'success' | 'error';
  lastResult?: any;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNode[];
}

export interface RestApiConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers: Record<string, string>;
  body?: string;
}

export interface AiTextConfig {
  prompt: string;
  model: string;
}

export interface AiImageConfig {
  prompt: string;
  image?: string; // base64
}
