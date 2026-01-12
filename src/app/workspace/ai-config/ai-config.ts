import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ToastrService } from 'ngx-toastr';
import { IWorkspaceDetails } from '../workspace.interface';
import { WorkspaceService } from '../workspace.service';
@Component({
  selector: 'app-ai-config',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatSliderModule,
    ReactiveFormsModule,
    MatInputModule,
    CommonModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './ai-config.html',
  styleUrl: './ai-config.scss',
})
export class AiConfig implements OnChanges {
  @Output() onWorkspaceConfigUpdated = new EventEmitter<void>();
  @Input({ required: true }) workspaceDetails!: IWorkspaceDetails;

  // Loading state signal
  isSaving = signal(false);

  // Define Form
  configForm = new FormGroup({
    temperature: new FormControl(0.7, [Validators.min(0), Validators.max(1)]),
    topK: new FormControl(5, [Validators.min(1), Validators.max(20)]),
    systemPrompt: new FormControl('', [Validators.maxLength(1000)]),
  });

  constructor(private toastr: ToastrService, private workspaceService: WorkspaceService) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.loadCurrentConfig();
    console.log(this.configForm);
  }

  loadCurrentConfig() {
    // Logic to fetch existing config from NestJS via a service
    // this.workspaceService.getConfig(this.workspaceId()).subscribe(config => {
    //   this.configForm.patchValue(config);
    // });
    this.configForm.patchValue({
      temperature: this.workspaceDetails.temperature,
      topK: this.workspaceDetails.topK,
      systemPrompt: this.workspaceDetails.systemPrompt,
    });
    console.log('Loaded AI Config for Workspace:', this.workspaceDetails);
  }

  saveConfig() {
    if (this.configForm.invalid) return;

    this.isSaving.set(true);
    const payload = this.configForm.value;

    console.log('Saving AI Config for Workspace:', this.workspaceDetails.id, payload);

    // Mocking API call
    setTimeout(() => {
      this.isSaving.set(false);
      this.toastr.success('AI Configuration updated successfully!', 'Success');
    }, 1000);
  }

  // Helper for Template to show slider value
  get tempValue() {
    return this.configForm.get('temperature')?.value ?? 0.7;
  }

  updateConfig() {
    this.workspaceService
      .updateWorkspace(this.workspaceDetails.id, {
        systemPrompt: this.configForm.get('systemPrompt')?.value as string,
        temperature: this.configForm.get('temperature')?.value as number,
        topK: this.configForm.get('topK')?.value as number,
      })
      .subscribe({
        next: () => {
          this.toastr.success('AI Configuration updated successfully!', 'Success');
          this.onWorkspaceConfigUpdated.emit();
        },
        error: () => {
          this.toastr.error('Failed to update AI Configuration.', 'Error');
          this.configForm.reset();
          this.configForm.patchValue({
            temperature: this.workspaceDetails.temperature,
            topK: this.workspaceDetails.topK,
            systemPrompt: this.workspaceDetails.systemPrompt,
          });
        },
      });
  }
}
