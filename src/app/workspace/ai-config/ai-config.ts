import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-ai-config',
  imports: [MatCardModule, MatFormFieldModule, MatSliderModule, ReactiveFormsModule, MatInputModule, CommonModule, MatButtonModule, MatSelectModule],
  templateUrl: './ai-config.html',
  styleUrl: './ai-config.scss',
})
export class AiConfig {
  @Input({ required: true }) workspaceId!: string;

  // Loading state signal
  isSaving = signal(false);

  // Define Form
  configForm = new FormGroup({
    temperature: new FormControl(0.7, [Validators.min(0), Validators.max(1)]),
    topK: new FormControl(5, [Validators.min(1), Validators.max(20)]),
    systemPrompt: new FormControl('', [Validators.maxLength(1000)]),
    modelName: new FormControl('gemini-1.5-flash') // Default model
  });

  constructor(private toastr: ToastrService) { }

  ngOnInit() {
    this.loadCurrentConfig();
  }

  loadCurrentConfig() {
    // Logic to fetch existing config from NestJS via a service
    // this.workspaceService.getConfig(this.workspaceId()).subscribe(config => {
    //   this.configForm.patchValue(config);
    // });
  }

  saveConfig() {
    if (this.configForm.invalid) return;

    this.isSaving.set(true);
    const payload = this.configForm.value;

    console.log('Saving AI Config for Workspace:', this.workspaceId, payload);

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
}
