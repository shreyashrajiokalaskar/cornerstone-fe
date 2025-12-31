import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  API_ENDPOINTS,
  CommonHttpService,
  IHttpResponse,
  ISignedUrl,
  IUploadPayload,
} from '@shared/resources';
import { IWorkspace, IWorkspaceDetails } from './workspace.interface';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  workspaces = signal<IWorkspace[]>([]);
  workspaceEndpoint = `${API_ENDPOINTS.workspace}`;
  workspaceDetails = signal<IWorkspaceDetails>({} as IWorkspaceDetails);

  constructor(private commonHttpService: CommonHttpService, private httpClient: HttpClient) { }

  getWorkspaces() {
    this.commonHttpService.get<IHttpResponse<IWorkspace[]>>(this.workspaceEndpoint).subscribe({
      next: (workspaceData: IHttpResponse<IWorkspace[]>) => {
        this.workspaces.set(workspaceData.data);
      },
    });
  }

  getWorkspaceById(workspaceId: string) {
    this.commonHttpService
      .get<IHttpResponse<IWorkspaceDetails>>(`${this.workspaceEndpoint}/${workspaceId}`)
      .subscribe({
        next: (workspaceData: IHttpResponse<IWorkspaceDetails>) => {
          this.workspaceDetails.set(workspaceData.data);
        },
      });
  }

  deleteWorkspace(workspaceId: string) {
    return this.commonHttpService.delete<IHttpResponse<IWorkspace[]>>(
      `${this.workspaceEndpoint}/${workspaceId}`
    );
  }

  updateWorkspace(workspaceId: string, body: Partial<IWorkspace>) {
    return this.commonHttpService.patch<IHttpResponse<IWorkspace[]>>(
      `${this.workspaceEndpoint}/${workspaceId}`,
      body
    );
  }

  createWorkspace(body: Partial<IWorkspace>) {
    return this.commonHttpService.post<IHttpResponse<IWorkspace[]>>(
      `${this.workspaceEndpoint}`,
      body
    );
  }

  upload(url: string, file: File, checksum: string) {
    return this.httpClient.put(url, file, {
      headers: {
        'Content-Type': file.type,
        'x-amz-checksum-sha256': checksum,
      },
      reportProgress: true,
      observe: 'events',
    });
  }

  getPresignedUrl(payload: IUploadPayload) {
    return this.commonHttpService.post<IHttpResponse<ISignedUrl>>(
      `${API_ENDPOINTS.documents.upload}`,
      payload
    );
  }

  fileUploaded(payload: IUploadPayload & { key: string }) {
    return this.commonHttpService.post<IHttpResponse<any>>(
      `${API_ENDPOINTS.documents.uploaded}`,
      payload
    );
  }

  getDocumentById(documentId: string) {
    return this.commonHttpService.get<IHttpResponse<any>>(API_ENDPOINTS.documents.getById(documentId))
  }

  deleteDocumentById(documentId: string) {
    return this.commonHttpService.delete<IHttpResponse<any>>(API_ENDPOINTS.documents.getById(documentId))
  }

  viewDocumentById(documentId: string) {
    return this.commonHttpService.get<IHttpResponse<ISignedUrl>>(API_ENDPOINTS.documents.viewDocById(documentId))
  }
}
