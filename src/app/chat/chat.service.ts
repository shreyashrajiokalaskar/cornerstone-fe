import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_ENDPOINTS, CommonHttpService, IChatResponse, IHttpResponse } from '@shared/resources';
import { Observable } from 'rxjs';
import { IAllChats, IChatSessionResponse } from './chat.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  workspaceId: string;
  constructor(private commonHttpService: CommonHttpService, private router: Router) {
    this.workspaceId = '';
  }

  createChat(workspaceId: string): Observable<IHttpResponse<{ id: string }>> {
    return this.commonHttpService.post<IHttpResponse<{ id: string }>>(API_ENDPOINTS.chat.session, {
      workspaceId,
    });
  }

  getChats(workspaceId: string): Observable<IHttpResponse<IAllChats[]>> {
    return this.commonHttpService.get<IHttpResponse<IAllChats[]>>(
      API_ENDPOINTS.chat.getChats(workspaceId)
    );
  }

  getChatById(chatId: string) {
    return this.commonHttpService.get<IHttpResponse<IChatSessionResponse>>(
      API_ENDPOINTS.chat.getChat(chatId)
    );
  }

  chat(payload: any, sessionId: string) {
    return this.commonHttpService.post<IHttpResponse<IChatResponse>>(
      API_ENDPOINTS.chat.create(sessionId),
      payload
    );
  }

  deleteChat(chatId: string) {
    return this.commonHttpService.delete<IHttpResponse<null>>(API_ENDPOINTS.chat.getChat(chatId));
  }
}
