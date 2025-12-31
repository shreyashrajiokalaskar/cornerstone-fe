import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DocumentUpload, IHttpResponse, ISignedUrl, IUploadPayload } from '@shared/resources';
import { ToastrService } from 'ngx-toastr';
import { sha256 } from '../../shared/utils/common.utils';
import { DocumentList } from '../document-list/document-list';
import { IDocument, IWorkspaceDetails } from '../workspace.interface';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-workspace-details',
  imports: [DocumentUpload, DocumentList, CommonModule, MatSlideToggleModule, MatIconModule, RouterLink],
  templateUrl: './workspace-details.html',
  styleUrl: './workspace-details.scss',
})
export class WorkspaceDetails {
  workspace$ = signal<IWorkspaceDetails>({} as IWorkspaceDetails);
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
    this.workspaceService.getWorkspaceById(this.workspaceId);
    this.workspace$ = this.workspaceService.workspaceDetails;
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
        this.workspaceService.getWorkspaceById(this.workspaceId);

      },
      error: () => {
        this.uploadProgress.set(0);
        this.resetTrigger.update((prev) => prev + 1);

        this.toastrService.error('Upload failed');
      },
    });
  }

  updateStatus(status: boolean) {
    this.workspaceService.updateWorkspace(this.workspaceId, { active: status }).subscribe({
      next: () => {
        this.toastrService.success('Workspace status updated successfully');
        this.workspaceService.getWorkspaceById(this.workspaceId);
      },
      error: () => {
        this.toastrService.error('Failed to update workspace status');
        this.workspaceService.getWorkspaceById(this.workspaceId);
      },
    });
  }

  getStatus(documentId: string) {
    this.workspaceService.getDocumentById(documentId).subscribe({
      next: (response: IHttpResponse<any>) => {
        this.workspace$().documents.forEach((doc: IDocument) => {
          if (doc.id === documentId) {
            doc.status = response.data.status;
            this.toastrService.success(`Fetched latest status for document: ${doc.name}`);
          }
        })
      }
    })
  }

  viewDocument(documentId: string) {
    this.workspaceService.viewDocumentById(documentId).subscribe({
      next: (response: IHttpResponse<ISignedUrl>) => {
        console.log(response)
        window.open(response.data.url, '_blank');
      }
    })
  }
  deleteDocument(documentId: string) {
    this.workspaceService.deleteDocumentById(documentId).subscribe({
      next: (response: IHttpResponse<any>) => {
        console.log(response)
        this.toastrService.success(`Document deleted successfully`);
        this.workspaceService.getWorkspaceById(this.workspaceId);
      }
    })
  }

}
