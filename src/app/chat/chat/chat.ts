import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IHttpResponse } from '@shared/resources';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { IChatMessage, IChatSessionResponse } from '../chat.interface';
import { ChatService } from '../chat.service';
@Component({
  selector: 'app-chat',
  imports: [
    FormsModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  sessionId = signal('');

  messages = signal<IChatMessage[]>([]);
  userInput = signal('');
  isTyping = signal(false);
  workspaceId: string;
  subscription: Subscription;

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.sessionId.set(this.activatedRoute.snapshot.params['chatId']);
    this.workspaceId = this.router.url.split('/')[2];

    this.subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.sessionId.set(this.router.url.split('/chat/')[1]);
      }
    });
    effect(() => {
      // console.log(this.sessionId());
      this.getChat();
    });
  }

  async sendMessage() {
    if (!this.userInput().trim()) return;
    const tempId = crypto.randomUUID();
    const query = this.userInput();
    this.messages.update((prev) => [
      ...prev,
      { role: 'user', content: query, id: '346622', documents: [] as any },
      {
        role: 'ai',
        content: '',
        documents: [],
        id: tempId,
      },
    ]);
    this.userInput.set('');
    this.isTyping.set(true);
    this.chatService
      .streamChat(
        {
          question: query,
          workspaceId: this.workspaceId,
        },
        this.sessionId() ?? ''
      )
      .subscribe({
        next: (event) => {
          let buffer = '';
          switch (event.type) {
            case 'token':
              buffer += event.content;
              console.log('TOKEN CONTENT', buffer)
              const chunk = buffer;
              buffer = '';

              this.messages.update((prev) =>
                prev.map((msg) =>
                  msg.id === tempId
                    ? { ...msg, content: msg.content + chunk }
                    : msg
                )
              );
              break;

            case 'sources':
              console.log('DOCUMENTS', event.data);
              this.messages.update((prev) =>
                prev.map((msg) =>
                  msg.id === tempId
                    ? { ...msg, documents: event.data }
                    : msg
                )
              );
              break;

            case 'chat_meta':
              console.log('chat_meta', event.data);

              this.router.navigateByUrl(`/workspace/${this.workspaceId}/chat/${event.chatId}`);
              break;

            case 'done':
              console.log('Completed', this.messages);
              this.isTyping.set(false);

              break;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.isTyping.set(false);
          this.toastrService.error(error.error?.message ?? 'Something went wrong!');
          console.error(error)
        }
      });

  }

  clearChat() {
    this.chatService.deleteChat(this.sessionId() ?? '').subscribe({
      next: (res: IHttpResponse<null>) => {
        this.messages.set([]);
        this.router.navigateByUrl(`/workspace/${this.workspaceId}/chat`);
      },
    });
  }

  getChat() {
    if (!this.sessionId()) {
      return;
    }
    this.chatService.getChatById(this.sessionId()).subscribe({
      next: (res: IHttpResponse<IChatSessionResponse>) => {
        this.messages.set(res.data.messages);
      },
    });
  }

  exportChat() {
    this.chatService.exportChat(this.sessionId() ?? '').subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}
