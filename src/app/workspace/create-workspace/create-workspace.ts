import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { IWorkspace } from '../workspace.interface';
import { WorkspaceService } from '../workspace.service';

@Component({
  selector: 'app-create-workspace',
  imports: [
    MatDialogModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './create-workspace.html',
  styleUrl: './create-workspace.scss',
})
export class CreateWorkspace {
  workspaceForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
  });

  public data: {
    name: string;
    description?: string;
    id: string; // Include ID if you plan to update
  } = inject(MAT_DIALOG_DATA, { optional: true });

  constructor(
    private workspaceService: WorkspaceService,
    private dialogRef: MatDialogRef<CreateWorkspace>
  ) {
    if (this.data?.id) {
      this.workspaceForm.controls['name'].setValue(this.data.name);
      if (this.data.description) {
        this.workspaceForm.controls['description'].setValue(this.data.description);
      }
    }
  }

  submit() {
    if (this.workspaceForm.valid) {
      this.workspaceService
        .createWorkspace(this.workspaceForm.value as Partial<IWorkspace>)
        .subscribe({
          next: () => this.dialogRef.close(true),
          error: (err) => console.error('Upload failed', err),
        });
    }
  }
}
