import { IChat } from '../../chat/chat.interface';

export interface IHttpResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
}

export interface IUserDetails {
  name: string;
  email: string;
  image?: string;
  token?: string;
  refreshToken?: string;
  role?: string;
}

export interface IUploadPayload {
  name: string;
  contentType: string;
  workspaceId: string;
  size: number;
  checksum: string;
}

export interface ISignedUrl {
  key: string;
  url: string;
}

export interface IChatResponse {
  answer: string;
  chat: IChat;
  sources?: ISource[];
}

export interface ISource {
  documentId: string;
  documentName: string;
  index: number;
  preview: string;
}
