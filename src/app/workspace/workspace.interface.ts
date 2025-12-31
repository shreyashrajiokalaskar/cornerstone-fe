// workspaces.model.ts
export interface IWorkspace {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: Date;
}

export interface IWorkspaceDetails {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  active: boolean;
  documents: IDocument[];
}

export interface IDocument {
  id: string;
  name: string;
  key: string;
  status: string;
}
