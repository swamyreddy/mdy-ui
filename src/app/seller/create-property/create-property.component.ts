import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AsyncValidatorFn,
  Form,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { CustomValidators } from 'src/app/helpers/validations/custom-validators';
import { PropertyType } from 'src/app/properties/models/property-type.model';
import { UnitType } from 'src/app/properties/models/unit-type.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { Amenitiy } from 'src/app/shared/amenities.model';
import { GlobalModalComponent } from 'src/app/shared/modals/gobal-modal/gobal-modal.component';
import { Property } from 'src/app/shared/property.model';
import { PropertyService } from 'src/app/shared/property.service';
import { ManageUnitsComponent } from '../manage-units/manage-units.component';
import { ModalService } from 'src/app/shared/modal.service';
export enum AreaUnit {
  ACRES = 'ACRES',
  GUNTAS = 'GUNTAS',
  SQ_YARDS = 'SQ_YARDS',
}
@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.css'],
})
export class CreatePropertyComponent implements OnInit, OnDestroy {
  propertyId: string;
  isEditMode: Boolean = false;
  property: Property;
  propertyCreationForm: FormGroup;
  @ViewChild('propertyPhotosInput')
  propertyPhotosInput!: ElementRef<HTMLInputElement>;
  @ViewChild('defaultPic') defaultPic: ElementRef;
  imagePreviews: any[] = [];

  submitted: boolean = false;
  existingProjectTitles = ['test', 'test2'];
  propertyTypes: PropertyType[] = [];
  filteredPropertyTypes: PropertyType[] = [];
  unitTypes: UnitType[] = [];
  numberOfBathrooms: any[] = ['1', '2', '3', '4', '5', '6', '7+'];
  user: import('../../auth/user.model').User;
  isPropertyForSell: boolean = true;
  amenities: Amenitiy[] = [];
  isEditModeEnabled: Observable<boolean>;
  selectedAmenityIds: number[] = [];
  @ViewChild('globalModal', { static: false })
  globalModal: GlobalModalComponent;
  isMultiplePropertiesProject: boolean = false;
  facingOptions: string[] = [];
  areaUnits = Object.values(AreaUnit);
  constructor(
    private propertyService: PropertyService,
    private alertService: AlertService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private modalService: ModalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.route.params.subscribe((params: Params) => {
      (this.propertyCreationForm as FormGroup)?.reset();
      this.propertyPhotos.clear();
      this.propertyId = params['id'];
      this.isEditMode = !!this.propertyId;
      if (this.isEditMode) {
        this.loadPropertyDetails();
      }
    });
    this.propertyCreationForm = new FormGroup({
      isMultipleProperties: new FormControl(false),
      propertyData: new FormGroup({
        title: new FormControl('', [
          Validators.required,
          // this.existingTitles.bind(this),
        ]),
      }),
      builtupArea: new FormControl('', [Validators.required]),
      carpetArea: new FormControl('', [Validators.required]),
      price: new FormControl(null, [
        Validators.required,
        // CustomValidators.numberValidation,
      ]),
      location: new FormControl(null, Validators.required, [
        // this.locationCheck.bind(this) as AsyncValidatorFn,
        CustomValidators.stringLengthValidation.bind(this) as AsyncValidatorFn,
      ]),
      propertyPhotos: new FormArray([]),
      selectedAmenities: new FormArray([]),
      defaultPic: new FormControl(null, Validators.required),
      propertyType: new FormControl(null, Validators.required),
      unitType: new FormControl(null, Validators.required),
      floorPlans: new FormArray([]),
      bathRooms: new FormControl('', Validators.required),
      facing: new FormControl(null, Validators.required),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(20),
        Validators.maxLength(1000),
      ]),
      totalFloors: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(200),
      ]),

      propertyAge: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(100),
      ]),
      projectAreaValue: new FormControl(null, []),
      projectAreaUnit: new FormControl(null),
    });
    this.propertyCreationForm.statusChanges.subscribe((change) => {
      console.log(change);
    });
    this.handleDynamicValidators();

    this.getPropertyTypes();
    this.getUnitTypes();
    this.getAmenities();
    this.getFacings();
  }

  getFacings() {
    this.facingOptions = this.propertyService.getFacings();
  }
  openManageUnitsModal() {
    this.modalService
      .open(ManageUnitsComponent, {
        title: 'Add Unit',
        data: {
          propertId: 1000000,
        },
      })
      .subscribe((data) => {
        if (!data) return;
        this.floorPlans.push(
          new FormGroup({
            unitName: new FormControl(data.unitName),
            unitSpace: new FormControl(data.unitSpace),
            unitPrice: new FormControl(data.unitPrice),
            unitFloorPlan: new FormControl(data.unitFloorPlan),
          }),
        );
      });
    // this.globalModal.openGlobalModal(ManageUnitsComponent, {
    //   title: 'Add Unit',
    //   data: {
    //     propertId: 1000000,
    //   },
    // });
  }

  handleDynamicValidators() {
    const unitTypeControl = this.propertyCreationForm.get('unitType');
    const floorPlansControl = this.propertyCreationForm.get('floorPlans');
    const bathRoomsControl = this.propertyCreationForm.get('bathRooms');
    const carpetAreaControl = this.propertyCreationForm.get('carpetArea');
    const builtupAreaControl = this.propertyCreationForm.get('builtupArea');
    const projectAreaValueControl =
      this.propertyCreationForm.get('projectAreaValue');
    this.propertyCreationForm
      .get('isMultipleProperties')
      ?.valueChanges.subscribe((val) => {
        if (val) {
          this.filteredPropertyTypes = this.propertyTypes.filter(
            (item) => item.name == 'Apartment' || item.name == 'Villa',
          );

          this.isMultiplePropertiesProject = true;
          floorPlansControl?.setValidators(Validators.required);
          bathRoomsControl?.clearValidators();
          carpetAreaControl?.clearValidators();
          builtupAreaControl?.clearValidators();
          unitTypeControl?.clearValidators();
          projectAreaValueControl?.setValidators(Validators.required);
        } else {
          this.filteredPropertyTypes = this.propertyTypes;

          this.isMultiplePropertiesProject = false;
          floorPlansControl?.clearValidators();
          bathRoomsControl?.setValidators(Validators.required);
          unitTypeControl?.setValidators(Validators.required);
          carpetAreaControl?.setValidators(Validators.required);
          builtupAreaControl?.setValidators(Validators.required);
          projectAreaValueControl?.clearValidators();
        }
        bathRoomsControl?.updateValueAndValidity();
        unitTypeControl?.updateValueAndValidity();
        floorPlansControl?.updateValueAndValidity();
        builtupAreaControl?.updateValueAndValidity();
        carpetAreaControl?.updateValueAndValidity();
        projectAreaValueControl?.updateValueAndValidity();
      });
    this.propertyCreationForm
      .get('propertyType')
      ?.valueChanges.subscribe((type) => {
        if (parseInt(type) === 5 || parseInt(type) === 6) {
          // Remove validators for land
          this.isMultiplePropertiesProject
            ? unitTypeControl?.setValidators(Validators.required)
            : unitTypeControl?.clearValidators();
        } else {
          // Add validators for apartment/villa
          this.isMultiplePropertiesProject
            ? unitTypeControl?.clearValidators()
            : unitTypeControl?.setValidators(Validators.required);
        }
        unitTypeControl?.updateValueAndValidity();
      });
  }
  get floorPlans(): FormArray {
    return this.propertyCreationForm.get('floorPlans') as FormArray;
  }
  get propertyPhotos(): FormArray {
    if (!this.propertyCreationForm) return new FormArray([]);
    return this.propertyCreationForm.get('propertyPhotos') as FormArray;
  }
  get selectedAmenities(): FormArray {
    return this.propertyCreationForm.get('selectedAmenities') as FormArray;
  }
  onAmenityChange(event: any) {
    const amenityId = event.target.value;
    const isChecked = event.target.checked;

    if (isChecked) {
      if (!this.selectedAmenityIds.includes(amenityId)) {
        this.selectedAmenityIds.push(amenityId);
      }
    } else {
      console.log(this.selectedAmenityIds, 'selectedAmenitiesfirst');
      this.selectedAmenityIds = this.selectedAmenityIds.filter(
        (id) => id !== parseInt(amenityId),
      );
      console.log(this.selectedAmenityIds, 'selectedAmenities');
    }
  }
  onUploadPhotos(event: any) {
    const photos: File[] = Array.from(event.target.files);
    console.log(photos, 'photos+++');
    photos.forEach((file) => {
      // const duplicate = this.propertyPhotos.some(
      //   (item) => item.name == file.name && item.size == file.size,
      // );
      const duplicate = this.propertyPhotos.value.some(
        (item: any) =>
          item.fileName == file.name && item.file[0].size == file.size,
      );
      if (duplicate) {
        this.alertService.warn('Duplicate file skipped: ' + file.name);
        return;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.propertyPhotos.push(
            new FormGroup({
              fileName: new FormControl(file.name),
              file: new FormControl([file]),
              title: new FormControl([file.name]),
              preview: new FormControl(reader.result),
              existing: new FormControl(false),
            }),
          );
        };
        console.log(this.propertyPhotos, 'this.propertyPhoto12s');
        reader.readAsDataURL(file);
      }
    });
  }
  // onUploadPhotos(event: any, type: string) {
  //   const photos: File[] = Array.from(event.target.files);
  //   photos.forEach((file) => {
  //     this.files.push(
  //       new FormGroup({
  //         file: new FormControl([null]),
  //         title: new FormControl(['']),
  //       }),
  //     );
  //     console.log(this.files, 'files++=');
  //     const isDuplicateFile = this.propertyPhotos.some(
  //       (item) => item.name == file.name && item.size == file.size,
  //     );
  //     if (!isDuplicateFile) this.propertyPhotos.push(file);
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
  //     reader.readAsDataURL(file);
  //   });
  //   console.log(this.propertyPhotos);
  // }
  onUploadPhotosold(event: any, type: string) {
    // const photos: File[] = Array.from(event.target.files);
    // console.log(photos, 'photos+++');
    // photos.forEach((file) => {
    //   const duplicate = this.propertyPhotos.some(
    //     (item) => item.name == file.name && item.size == file.size,
    //   );
    //   if (duplicate) {
    //     this.alertService.warn('Duplicate file skipped: ' + file.name);
    //     return;
    //   } else {
    //     this.propertyPhotos.push(file);
    //     this.files.push(
    //       new FormGroup({
    //         file: new FormControl([file]),
    //         title: new FormControl(['']),
    //       }),
    //     );
    //     console.log(this.propertyPhotos, 'this.propertyPhoto12s');
    //     console.log(this.files, 'this.files.value12');
    //     const reader = new FileReader();
    //     reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
    //     reader.readAsDataURL(file);
    //   }
    // this.files.push(
    //   new FormGroup({
    //     file: new FormControl([null]),
    //     title: new FormControl(['']),
    //   }),
    // );
    // const isDuplicateFile = this.propertyPhotos.some(
    //   (item) => item.name == file.name && item.size == file.size,
    // );
    // if (!isDuplicateFile) this.propertyPhotos.push(file);
    // const reader = new FileReader();
    // reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
    // reader.readAsDataURL(file);
    // });
  }

  isRequired(controlName: string): boolean {
    const control = this.propertyCreationForm.get(controlName);
    if (!control || !control.validator) return false;

    // Check if the control has a required validator
    const validator = control.validator({} as any);
    return validator && validator['required'];
  }
  getUnitTypes() {
    this.unitTypes = this.propertyService.getUnitTypes();
  }
  getPropertyTypes() {
    this.propertyTypes = this.propertyService.getPropertyTypes();
    this.filteredPropertyTypes = this.propertyTypes;
  }
  setValues() {
    // this.propertyCreationForm.form.patchValue({
    //   propertyData:  {
    //     title: "Apartment",
    //     price: "12CR"
    //   }
    // })
  }
  onSubmitTemp() {
    // console.log(form.value, 'form');
    // this.submitted = true;
    // this.propertyDetails  = {
    //   title: this.propertyCreationForm.value.propertyData.title,
    //   price: this.propertyCreationForm.value.propertyData.price,
    //   location: this.propertyCreationForm.value.location,
    //   defaultPic: "",
    //   propertyType: this.propertyCreationForm.value.propertyType,
    //   unitType: this.propertyCreationForm.value.unitType
    // }
    // this.propertyCreationForm.reset();
  }

  uploadFile(evt: Event, fieldName: string) {
    const file = (evt.target as HTMLInputElement).files;
    if (file && file.length == 1) {
      this.propertyCreationForm.patchValue({
        defaultPic: file[0],
      });
      this.propertyCreationForm.updateValueAndValidity();
    }
  }
  removeUnit(index: number): void {
    const item = this.floorPlans.value[index];
    if (item.existing) {
      this.propertyService.deletePropertyUnit(item.id).subscribe(() => {
        this.alertService.success('Unit deleted successfully');
      });
    }
    this.floorPlans.removeAt(index);
  }
  removeSelectedFiles(index: number): void {
    const item = this.propertyPhotos.value[index];
    if (item.existing) {
      this.propertyService.deletePropertyImage(item.id).subscribe(() => {
        this.alertService.success('Image deleted successfully');
      });
    }
    this.propertyPhotos.removeAt(index);
  }
  onSubmit() {
    console.log(this.propertyPhotos, 'this.propertyPhotos');
    console.log(this.propertyCreationForm);
    // const property = new Property(
    //   "3",
    //   this.propertyCreationForm.value.propertyData.title,
    //   this.propertyCreationForm.value.propertyData.category,
    //   this.propertyCreationForm.value.propertyData.price,
    //   this.propertyCreationForm.value.location,
    //   this.propertyCreationForm.value.defaultPic,
    //   "swamy12",
    //   this.propertyCreationForm.value.propertyType,
    //   this.propertyCreationForm.value.unitType

    //   );
    if (this.propertyCreationForm.valid) {
      const formData = new FormData();

      console.log(this.propertyCreationForm.value.defaultPic);

      formData.append(
        'title',
        this.propertyCreationForm.value.propertyData.title,
      );
      formData.append('defaultPic', this.propertyCreationForm.value.defaultPic);
      formData.append(
        'propertyPhotos',
        this.propertyCreationForm.value.propertyPhotos,
      );
      formData.append(
        'isMultipleProperties',
        this.propertyCreationForm.value.isMultipleProperties,
      );
      formData.append('price', this.propertyCreationForm.value.price);
      formData.append('location', this.propertyCreationForm.value.location);
      formData.append(
        'propertyType',
        this.propertyCreationForm.value.propertyType,
      );
      formData.append('unitType', this.propertyCreationForm.value.unitType);
      formData.append('bathRooms', this.propertyCreationForm.value.bathRooms);
      formData.append(
        'builtupArea',
        this.propertyCreationForm.value.builtupArea,
      );
      formData.append(
        'amenities',
        JSON.stringify(this.selectedAmenityIds || []),
      );
      formData.append('carpetArea', this.propertyCreationForm.value.carpetArea);
      formData.append(
        'description',
        this.propertyCreationForm.value.description,
      );
      formData.append(
        'totalFloors',
        this.propertyCreationForm.value.totalFloors,
      );
      formData.append(
        'propertyAge',
        this.propertyCreationForm.value.propertyAge,
      );
      formData.append('facing', this.propertyCreationForm.value.facing);
      formData.append('createdBy', this.user.id);
      formData.append('modifiedBy', this.user.id);

      this.propertyPhotos.value.forEach((control: any, index: any) => {
        if (!control['existing']) {
          formData.append('files', control.file[0]); // Append new files
          formData.append('titles', control['title']); // Append existing photo IDs to keep
        }
      });
      const units = this.floorPlans.controls
        .filter((unit) => !unit.value.existing)
        .map((unit, index) => {
          let unitItem = {};
          if (!unit.value.existing) {
            unitItem = {
              unitName: unit.value.unitName,
              unitSpace: unit.value.unitSpace,
              unitPrice: unit.value.unitPrice,
              fileIndex: index,
            };
          }
          return unitItem;
        });

      formData.append('units', JSON.stringify(units));
      this.floorPlans.controls.forEach((unit) => {
        if (unit.value.unitFloorPlan && !unit.value.existing) {
          formData.append('unitFloorPlans', unit.value.unitFloorPlan);
        }
      });
      const normalizedArea = this.convertToSqYards(
        Number(this.propertyCreationForm.value.projectAreaValue),
        this.propertyCreationForm.value.projectAreaUnit,
      );
      formData.append(
        'projectAreaValue',
        this.propertyCreationForm.value.projectAreaValue,
      );
      formData.append('projectAreaInSqYards', normalizedArea.toString());
      formData.append(
        'projectAreaUnit',
        this.propertyCreationForm.value.projectAreaUnit,
      );
      if (this.isEditMode) {
        formData.append('id', this.propertyId);

        this.propertyService.editProperty(formData).subscribe({
          next: (data: any) => {
            this.propertyPhotos.clear();
            this.clearFormData();
            this.loadPropertyDetails();
            this.propertyService.updateProperty(data.data);

            this.alertService.success('Property Updated Successfully!');
            this.router.navigateByUrl('/seller/my-properties');
          },

          error: (error) => {
            console.error('Update property error:', error);

            const message =
              error?.error?.message ||
              'Failed to update property. Please try again.';

            this.alertService.error(message);
          },
        });
      } else {
        this.propertyService.addProperty(formData).subscribe({
          next: (data: any) => {
            this.selectedAmenities.clear();
            this.propertyPhotos.clear();
            this.clearFormData();

            this.propertyService.updateProperty(data.data);

            this.alertService.success('Property Added Successfully!');
            this.router.navigateByUrl('/seller/my-properties');
          },

          error: (error) => {
            console.error('Add property error:', error);

            const message =
              error?.error?.message ||
              'Failed to add property. Please try again.';

            this.alertService.error(message);
          },
        });
      }
    } else {
      this.alertService.warn('Please fill all required fields!');
    }
  }
  clearFormData() {
    this.defaultPic.nativeElement.value = '';
    this.floorPlans.clear();
    this.propertyCreationForm.reset();
  }

  getAmenities() {
    this.propertyService.getAmenities().subscribe((data: Amenitiy[]) => {
      console.log(data, 'amenities++');
      this.amenities = data;
    });
  }
  bindPropertyDataToCreateForm() {
    this.selectedAmenityIds = this.property.amenities.map((a) => a.id);
    const propertyData = {
      propertyData: {
        title: this.property.title,
      },
      selectedAmenities:
        this.property.amenities?.map((item: Amenitiy) => item.id) || [],
      price: this.property.price,
      location: this.property.location,
      defaultPic: this.property.defaultPic,
      propertyType: this.property.propertyType.toString(),
      isMultipleProperties: this.property.isMultipleProperties,
      unitType: this.property.unitType,
      builtupArea: this.property.builtupArea,
      carpetArea: this.property.carpetArea,
      bathRooms: this.property.bathRooms,
      description: this.property.description,
      totalFloors: this.property.totalFloors,
      propertyAge: this.property.propertyAge,
      facing: this.property.facing,
      projectAreaUnit: this.property.projectAreaUnit,
      projectAreaValue: this.property.projectAreaValue,
      projectAreaInSqYards: this.property.projectAreaInSqYards,
    };
    this.floorPlans.clear();
    this.propertyPhotos.clear();
    this.property.units.forEach((unit: any) => {
      this.floorPlans.push(
        new FormGroup({
          unitName: new FormControl(unit.unitName),
          unitSpace: new FormControl(unit.unitSpace),
          unitPrice: new FormControl(unit.unitPrice),
          unitFloorPlan: new FormControl(unit.unitFloorPlanUrl),
          existing: new FormControl(true),
          id: new FormControl(unit.id),
        }),
      );
    });

    this.property.photos.forEach((file: any) => {
      this.propertyPhotos.push(
        new FormGroup({
          fileName: new FormControl(file.fileName),
          file: new FormControl(null),
          title: new FormControl(file.title),
          preview: new FormControl(file.src),
          existing: new FormControl(true),
          id: new FormControl(file.id),
        }),
      );
      this.imagePreviews.push(file);
      // const reader = new FileReader();
      // reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      // reader.readAsDataURL(file);
    });
    // this.imagePreviews = this.property.photos;

    this.propertyCreationForm.patchValue(propertyData);
  }

  loadPropertyDetails() {
    this.propertyService
      .getPropertyById(parseInt(this.propertyId))
      .subscribe((data: any) => {
        this.property = data;
        this.bindPropertyDataToCreateForm();
        console.log(this.property);
        // Initialize form controls with property details if needed
      });
  }
  private convertToSqYards(value: number, unit: string): number {
    switch (unit) {
      case 'ACRES':
        return value * 4840;
      case 'GUNTAS':
        return value * 121;
      case 'SQ_YARDS':
        return value;
      default:
        return value;
    }
  }

  ngOnDestroy() {
    // Unsubscribe from any subscriptions to prevent memory leaks
    this.propertyCreationForm.reset();
    this.defaultPic.nativeElement.value = '';
    this.propertyPhotos.clear();
  }
}
