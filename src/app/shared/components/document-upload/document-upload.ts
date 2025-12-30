import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-document-upload',
  imports: [MatButtonModule, CommonModule, MatProgressBarModule],
  templateUrl: './document-upload.html',
  styleUrl: './document-upload.scss',
})
export class DocumentUpload {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() workspaceId!: string;
  @Input() uploading = signal(0);
  @Output() upload = new EventEmitter();
  @Input() resetTrigger: number = 0;
  file: File | null = null;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('CHANGES', changes);
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
      this.file = null;
    }
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
    if (!this.file) return;
  }
}
