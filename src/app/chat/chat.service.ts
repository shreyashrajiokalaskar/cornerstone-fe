import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_ENDPOINTS, CommonHttpService, IChatResponse, IHttpResponse } from '@shared/resources';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { IAllChats, IChatSessionResponse } from './chat.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  workspaceId: string;
  authService = inject(AuthService);

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

  exportChat(chatId: string) {
    return this.commonHttpService.get<IHttpResponse<{ url: string }>>(
      API_ENDPOINTS.chat.export(chatId)
    );
  }

  streamChat(payload: any, sessionId: string): Observable<any> {
    const token = this.authService.token;
    return new Observable((observer) => {
      fetch(`${environment.API_URL}/${API_ENDPOINTS.chat.create(sessionId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }).then(async (response) => {
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        let buffer = '';

        while (true) {
          const { done, value } = await reader!.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // 🔥 Split SSE-style messages
          const parts = buffer.split('\n\n');
          buffer = parts.pop() || '';

          for (const part of parts) {
            if (part.startsWith('data: ')) {
              const json = part.replace('data: ', '');

              if (json === '[DONE]') {
                observer.complete();
                return;
              }

              try {
                observer.next(JSON.parse(json));
              } catch (e) {
                console.error('Parse error', e);
              }
            }
          }
        }

        observer.complete();
      }).catch((err) => observer.error(err));
    });
  }
}
