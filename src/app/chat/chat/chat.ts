import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { IChatResponse, IHttpResponse, ISource } from '@shared/resources';
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
  sessionId!: string;
  messages = signal<{ role: 'user' | 'ai'; text: string; sources?: ISource[] }[]>([]);
  userInput = signal('');
  isTyping = signal(false);
  workspaceId: string;

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    console.log(this.activatedRoute.snapshot.params);
    this.sessionId = this.activatedRoute.snapshot.params['chatId'];
    this.workspaceId = this.router.url.split('/')[2];
    this.getChat();
  }

  async sendMessage() {
    if (!this.userInput().trim()) return;

    const query = this.userInput();
    this.messages.update((prev) => [...prev, { role: 'user', text: query }]);
    this.userInput.set('');
    this.isTyping.set(true);
    this.chatService
      .chat(this.sessionId, {
        question: query,
        workspaceId: this.workspaceId,
      })
      .subscribe({
        next: (res: IHttpResponse<IChatResponse>) => {
          this.messages.update((prev) => [
            ...prev,
            {
              role: 'ai',
              text: res.data.answer,
              sources: res.data.sources, // Chunks from document_chunks table
            },
          ]);
          console.log('GOT ANSWER', res);
          this.isTyping.set(false);
        },
      });
  }

  clearChat() {}

  getChat() {
    this.chatService.getChatById(this.sessionId).subscribe({
      next: (res) => {
        console.log(res);
      },
    });
  }
}
