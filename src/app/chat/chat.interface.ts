export interface IAllChats {
  id: string;
  title?: string;
  userId: string;
  workspaceId: string;
}

export interface IChatMessage {
  chatId: string;
  content: string;
  id: string;
  role: string;
}
