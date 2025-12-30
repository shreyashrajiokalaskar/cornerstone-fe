import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentUpload, IHttpResponse, ISignedUrl, IUploadPayload } from '@shared/resources';
import { ToastrService } from 'ngx-toastr';
import { map, of } from 'rxjs';
import { sha256 } from '../../shared/utils/common.utils';
import { DocumentList } from '../document-list/document-list';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-workspace-details',
  imports: [DocumentUpload, DocumentList, AsyncPipe, CommonModule],
  templateUrl: './workspace-details.html',
  styleUrl: './workspace-details.scss',
})
export class WorkspaceDetails {
  workspace$;
  documents$ = of([]);
  workspaceId: string = '';
  file!: File;
  uploadProgress = signal(0);
  resetTrigger = signal(0);

  constructor(
    private workspaceService: WorkspaceService,
    private route: ActivatedRoute,
    private toastrService: ToastrService
  ) {
    this.workspaceId = this.route.snapshot.params['id'];
    this.workspace$ = this.workspaceService.getWorkspaceById(this.workspaceId);
    this.documents$ = this.workspaceService
      .getAllDocsByWorkspace(this.workspaceId)
      .pipe(map((docs) => docs ?? []));
  }

  uploadFile(url: string, file: File, payload: IUploadPayload & { key: string }) {
    this.workspaceService.upload(url, file, payload.checksum).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress.set(Math.round((100 * event.loaded) / event.total));
        }

        if (event.type === HttpEventType.Response) {
          this.uploadProgress.set(0);
          this.fileUploaded(payload);
        }
      },
      error: () => {
        this.uploadProgress.set(0);
        this.resetTrigger.update((prev) => prev + 1);

        this.toastrService.error('Upload failed');
      },
    });
  }

  async getPresignedUrl(file: File) {
    this.file = file;
    const checksum = await sha256(file);
    const payload: IUploadPayload = {
      name: file.name,
      contentType: file.type,
      workspaceId: this.workspaceId,
      size: file.size,
      checksum,
    };
    this.workspaceService.getPresignedUrl(payload).subscribe({
      next: (response: IHttpResponse<ISignedUrl>) => {
        console.log(response);
        this.uploadFile(response.data.url, file, { ...payload, key: response.data.key });
      },
      error: (err: HttpErrorResponse) => {
        this.toastrService.error(err.error.message);
        this.uploadProgress.set(0);
        this.resetTrigger.update((prev) => prev + 1);
      },
    });
  }

  fileUploaded(payload: IUploadPayload & { key: string }) {
    this.workspaceService.fileUploaded(payload).subscribe({
      next: () => {
        this.resetTrigger.update((prev) => prev + 1);
      },
      error: () => {
        this.uploadProgress.set(0);
        this.resetTrigger.update((prev) => prev + 1);

        this.toastrService.error('Upload failed');
      },
    });
  }
}
