import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IUser } from "@cornerstone/shared";
import { NxWelcome } from './nx-welcome';

@Component({
  imports: [NxWelcome, RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'frontend';
  user?: IUser;
}
