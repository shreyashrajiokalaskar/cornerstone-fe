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
