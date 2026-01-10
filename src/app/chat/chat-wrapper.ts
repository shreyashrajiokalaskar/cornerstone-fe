import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { IHttpResponse } from '@shared/resources';
import { IAllChats } from './chat.interface';
import { ChatService } from './chat.service';
@Component({
  selector: 'app-chat-wrapper',
  imports: [
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    CommonModule,
    RouterModule,
  ],
  templateUrl: './chat-wrapper.html',
  styleUrl: './chat-wrapper.scss',
})
export class ChatWrapper {
  sessionId = '';
  sessions = [];
  workspaceId: string;
  chats = signal<IAllChats[]>([]);

  getIds() {}

  constructor(
    private chatService: ChatService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.workspaceId = this.activatedRoute.snapshot.params['workspaceId'];
    this.sessionId = this.router.url.split('/chat/')[1];
    console.log(this.router.url);

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.workspaceId = this.activatedRoute.snapshot.params['workspaceId'];
        this.sessionId = this.router.url.split('/chat/')[1];
        this.getChats();
      }
    });
  }

  getChats() {
    this.chatService.getChats(this.workspaceId).subscribe({
      next: (res: IHttpResponse<IAllChats[]>) => {
        this.chats.set(res.data);
      },
    });
  }

  // create(workspaceId: string) {
  //   // return this.http.post<any>(`/api/workspaces/${workspaceId}/chat/sessions`, {});
  // }

  ngOnInit() {
    // this.workspaceId = this.route.snapshot.paramMap.get('id')!;
    // this.load();
  }

  load() {
    // this.service.list(this.workspaceId).subscribe((s) => {
    //   this.sessions = s;
    //   if (!this.sessionId && s.length) {
    //     this.open(s[0].id);
    //   }
    // });
  }

  create() {
    // this.service.create(this.workspaceId).subscribe((s) => {
    //   this.sessions.unshift(s);
    //   this.open(s.id);
    // });
  }

  open(id: string) {
    this.sessionId = id;
  }

  getBackRoute() {
    return `/workspace/${this.workspaceId}/chat`;
  }
}
