import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { IHttpResponse } from '@shared/resources';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-start-chat',
  imports: [MatButtonModule],
  templateUrl: './start-chat.html',
  styleUrl: './start-chat.scss',
})
export class StartChat {
  workspaceId: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private chatService: ChatService,
    private router: Router
  ) {
    this.workspaceId = this.activatedRoute.snapshot.params['workspaceId'];
  }
  createChat() {
    this.chatService.createChat(this.workspaceId).subscribe({
      next: (res: IHttpResponse<{ id: string }>) => {
        console.log(res);
        this.router.navigate([`/workspace/${this.workspaceId}/chat/${res.data.id}`]);
      },
    });
  }
}
