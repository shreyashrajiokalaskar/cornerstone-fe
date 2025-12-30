// workspaces.model.ts
export interface IWorkspace {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: Date;
}

export interface IWorkspaceDetails {}
