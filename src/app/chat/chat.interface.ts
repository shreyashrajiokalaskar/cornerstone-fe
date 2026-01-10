export interface IAllChats {
  id: string;
  title?: string;
  userId: string;
  workspaceId: string;
}

export interface IChat {
  id: string;
  workspaceId: string;
  userId: string;
  title: string | null;
}

export interface IChatMessage {
  id: string;
  role: string;
  content: string;
  documents: IChatDocs[];
}

export interface IChatDocs {
  id: string;
  name: string;
  content: string;
}

export interface IChatSessionResponse {
  chat: IChat;
  messages: IChatMessage[];
}

// {
// }
