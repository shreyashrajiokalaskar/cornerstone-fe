import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import {
  API_ENDPOINTS,
  CommonHttpService,
  IHttpResponse,
  ISignedUrl,
  IUploadPayload,
} from '@shared/resources';
import { Observable } from 'rxjs';
import { IWorkspace } from './workspace.interface';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  workspaces = signal<IWorkspace[]>([]);
  workspaceEndpoint = `${API_ENDPOINTS.workspace}`;
  // workspaceDetails = signal<>();

  constructor(private commonHttpService: CommonHttpService, private httpClient: HttpClient) {}

  getWorkspaces() {
    this.commonHttpService.get<IHttpResponse<IWorkspace[]>>(this.workspaceEndpoint).subscribe({
      next: (workspaceData: IHttpResponse<IWorkspace[]>) => {
        this.workspaces.set(workspaceData.data);
      },
    });
  }

  getWorkspaceById(workspaceId: string) {
    return this.commonHttpService.get<IHttpResponse<any[]>>(
      `${this.workspaceEndpoint}/${workspaceId}`
    );
  }

  getAllDocsByWorkspace(workspaceId: string): Observable<any> {
    return this.commonHttpService.get<any>(
      `${API_ENDPOINTS.documents.getAllByWorkspace}/${workspaceId}`
    );
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
}
