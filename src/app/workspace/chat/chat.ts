import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-chat',
  imports: [FormsModule, MatIconModule, MatButtonModule, CommonModule, MatTooltipModule, MatProgressSpinnerModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  @Input({ required: true }) workspaceId!: string;
  messages = signal<{ role: 'user' | 'ai', text: string, sources?: any[] }[]>([]);
  userInput = signal('');
  isTyping = signal(false);
  // private chatService = inject(ChatService);

  constructor() {

  }

  async sendMessage() {
    if (!this.userInput().trim()) return;

    const query = this.userInput();
    this.messages.update(prev => [...prev, { role: 'user', text: query }]);
    this.userInput.set('');
    this.isTyping.set(true);

    // this.chatService.ask(this.workspaceId, query).subscribe({
    //   next: (res) => {
    //     this.messages.update(prev => [...prev, {
    //       role: 'ai',
    //       text: res.answer,
    //       sources: res.sources // Chunks from document_chunks table
    //     }]);
    //     this.isTyping.set(false);
    //   }
    // });
  }

  clearChat() {

  }
}
