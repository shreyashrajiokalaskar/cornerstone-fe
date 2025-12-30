import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-document-list',
  imports: [CommonModule],
  templateUrl: './document-list.html',
  styleUrl: './document-list.scss',
})
export class DocumentList {
  @Input() documents?: any[];
}
