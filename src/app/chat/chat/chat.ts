import { CommonModule } from '@angular/common';
import { Component, effect, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { IChatResponse, IHttpResponse } from '@shared/resources';
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

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.sessionId.set(this.activatedRoute.snapshot.params['chatId']);
    this.workspaceId = this.router.url.split('/')[2];

    this.router.events.subscribe((event) => {
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

    const query = this.userInput();
    this.messages.update((prev) => [
      ...prev,
      { role: 'user', content: query, id: '124455', documents: [] as any },
    ]);
    this.userInput.set('');
    this.isTyping.set(true);
    this.chatService
      .chat(
        {
          question: query,
          workspaceId: this.workspaceId,
        },
        this.sessionId() ?? ''
      )
      .subscribe({
        next: (res: IHttpResponse<IChatResponse>) => {
          this.messages.update((prev) => [
            ...prev,
            {
              role: 'ai',
              content: res.data.answer,
              documents: [] as any,
              id: '124456',
            },
          ]);
          this.isTyping.set(false);
          this.router.navigateByUrl(`/workspace/${this.workspaceId}/chat/${res.data.chat.id}`);
        },
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
