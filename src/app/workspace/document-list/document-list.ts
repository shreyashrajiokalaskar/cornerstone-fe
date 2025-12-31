import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { IDocument } from '../workspace.interface';

@Component({
  selector: 'app-document-list',
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './document-list.html',
  styleUrl: './document-list.scss',
})
export class DocumentList {
  @Input() documents?: IDocument[];
  @Output() getStatus = new EventEmitter<string>();
  @Output() deleteDocument = new EventEmitter<string>();
  @Output() viewDocument = new EventEmitter<string>();

}
