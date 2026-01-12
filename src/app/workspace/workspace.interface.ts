// workspaces.model.ts
export interface IWorkspace {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: Date;
  temperature: number;
  systemPrompt: string;
  topK: number;
}

export interface IWorkspaceDetails {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  active: boolean;
  documents: IDocument[];
  temperature: number;
  systemPrompt: string;
  topK: number;
}

export interface IDocument {
  id: string;
  name: string;
  key: string;
  status: string;
}
