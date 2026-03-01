import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PropertyService } from 'src/app/shared/property.service';

@Component({
  selector: 'app-manage-units',
  templateUrl: './manage-units.component.html',
  styleUrls: ['./manage-units.component.css'],
})
export class ManageUnitsComponent implements OnInit {
  @Input() unitData: any;
  @Output() closeModal = new EventEmitter<any>();

  unitForm!: FormGroup;

  floorPlanPreview: string | null = null;
  selectedFile: File | null = null;
  isDragging = false;
  unitTypes: any;

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
  ) {}

  ngOnInit(): void {
    this.unitForm = this.fb.group({
      unitName: ['', Validators.required],
      unitSpace: ['', Validators.required],
      unitPrice: ['', Validators.required],
      unitFloorPlan: [null],
    });

    if (this.unitData) {
      this.unitForm.patchValue({
        unitName: this.unitData.unitName,
        unitSpace: this.unitData.unitSpace,
        unitPrice: this.unitData.unitPrice,
      });

      this.floorPlanPreview = this.unitData.floorPlanUrl || null;
    }
    this.getUnitTypes();
  }
  getUnitTypes() {
    this.unitTypes = this.propertyService.getUnitTypes();
  }
  // 📌 Handle File Selection
  handleFile(file: File) {
    if (!file.type.startsWith('image/')) return;

    this.selectedFile = file;

    this.unitForm.patchValue({
      unitFloorPlan: file,
    });

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.floorPlanPreview = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // 📌 Drag Events
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) this.handleFile(file);
  }

  removeImage() {
    this.selectedFile = null;
    this.floorPlanPreview = null;
    this.unitForm.patchValue({ unitFloorPlan: null });
  }

  save() {
    if (this.unitForm.invalid) return;

    this.closeModal.emit({
      ...this.unitForm.value,
      unitFloorPlan: this.selectedFile,
    });
  }

  cancel() {
    this.closeModal.emit(null);
  }
}
