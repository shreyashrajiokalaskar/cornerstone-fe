import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, WritableSignal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CreateWorkspace } from './create-workspace/create-workspace';
import { IWorkspace } from './workspace.interface';
import { WorkspaceService } from './workspace.service';

@Component({
  selector: 'app-workspace',
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatMenuModule,
    MatChipsModule,
    MatDialogModule,
  ],
  templateUrl: './workspace.html',
  styleUrl: './workspace.scss',
})
export class Workspace implements OnInit {
  workspaces: WritableSignal<IWorkspace[]>;

  constructor(
    private workspaceService: WorkspaceService,
    private toastrService: ToastrService,
    private dialog: MatDialog
  ) {
    this.workspaces = this.workspaceService.workspaces;
  }

  ngOnInit() {
    this.workspaceService.getWorkspaces();
  }

  deleteWorkspace(workspaceId: string) {
    this.workspaceService.deleteWorkspace(workspaceId).subscribe({
      next: () => {
        this.toastrService.success('Workspace deleted successfully!');
        this.workspaceService.getWorkspaces();
      },
      error: (err: HttpErrorResponse) => {
        this.toastrService.error(err?.error?.message || 'Something went wrong!');
      },
    });
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(CreateWorkspace, {
      width: '450px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh list if a new workspace was created
        this.toastrService.success('Workspace created successfully!');
        this.workspaceService.getWorkspaces();
      }
    });
  }

  toggleActive(workspace: IWorkspace) {
    this.workspaceService
      .updateWorkspace(workspace.id, {
        active: !workspace.active,
      })
      .subscribe({
        next: () => {
          this.toastrService.success('Workspace updated successfully!');
          this.workspaceService.getWorkspaces();
        },
        error: (err: HttpErrorResponse) => {
          this.toastrService.error(err?.error?.message || 'Something went wrong!');
        },
      });
  }

  editWorkspace(workspace: IWorkspace) {
    const dialogRef = this.dialog.open(CreateWorkspace, {
      width: '450px',
      data: {
        name: workspace.name,
        description: workspace.description,
        id: workspace.id, // Include ID if you plan to update
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Refresh list if a new workspace was created
        this.toastrService.success('Workspace created successfully!');
        this.workspaceService.getWorkspaces();
      }
    });
  }
}
