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
