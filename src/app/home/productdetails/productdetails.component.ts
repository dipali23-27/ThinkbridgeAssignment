import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GetsetService } from 'src/app/Shared/Services/getset.service';
import * as data from '../../../assets/data.json';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent implements OnInit {

  productForm: FormGroup;
  submitted = false;
  productData: any = null;
  productList: any[] = [];
  currentIndex = 0;
  imageSrc: string = '';
  totalproducts: any[] = (data as any).default;
  @ViewChild('formDirective')
  formDirective!: NgForm;
  openpanel: boolean = true;
  isNumber: boolean = false;
  @ViewChild('UploadFileInput')
  uploadFileInput!: ElementRef;
  myfilename = 'Select File';
  imgBase64Path: string | ArrayBuffer | null = '';
  isUpdate: boolean = false;
  selproduct: any;

  constructor(private fb: FormBuilder, private helperService: GetsetService,public route: Router) {
    this.productForm = this.fb.group({
      itemId: ['', [Validators.required]],
      itemName: ['', [Validators.required]],
      availableQuantity: ['', [Validators.required]],
      itemDescription: ['', [Validators.required]],
      itemWeight: ['', [Validators.required]],
      approvedBy: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });
  }

  get f() {
    return this.productForm.controls;
  }

  ngOnInit(): void {
    if (localStorage.getItem('data') !== null) {
      this.productList = this.helperService.getData() as Array<any>;
    } else {
      this.productList = [];
    }
    this.currentIndex = this.productList.length;
    this.helperService.userinformation.subscribe(data => {
      if (data != "") {
        this.isUpdate = true;
        this.selproduct = data;
        this.setFormValue(data);
      }
    })
  }

  public onFormSubmit(): void {
    this.submitted = true;
    if (this.productForm.valid) {
      const data = {
        itemId: this.productForm.value.itemId,
        itemName: this.productForm.value.itemName,
        availableQuantity: this.productForm.value.availableQuantity,
        itemDescription: this.productForm.value.itemDescription,
        itemWeight: this.productForm.value.itemWeight,
        approvedBy: this.productForm.value.approvedBy,
        price: this.productForm.value.price,
        Image: this.imgBase64Path
      };
      this.productData = data;
      if (this.isUpdate == true) {
        this.productList.forEach((element, idx) => {
          if (element.itemId == this.selproduct.itemId) {
            let index = this.productList.findIndex((x) => x.itemId == this.selproduct.itemId);
            this.productList[index] = this.productData;
            this.helperService.setData(this.productList)
          }
        });
        this.helperService.setdItemData("");
        this.route.navigate(['/home/view']);
      } else {
        this.productList.push(data);
        this.helperService.setData(this.productList)
      }
      this.resetForm();
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  toggleEventHander($event: any) {
    this.openpanel = $event;
  }

  public resetForm(): void {
    this.productForm.reset();
    this.submitted = false;
    this.productList = this.helperService.getData() as Array<any>;
    this.currentIndex = this.productList.length;
  }

  public setFormValue(data: any): void {
    this.currentIndex = data.Id;
    this.productForm.patchValue({
      itemId: data.itemId,
      itemName: data.itemName,
      availableQuantity: data.availableQuantity,
      itemDescription: data.itemDescription,
      itemWeight: data.itemWeight,
      approvedBy: data.approvedBy,
      price: data.price
    });
  }

  numberOnly(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      this.isNumber = true;
      return false;
    }
    this.isNumber = false;
    return true;
  }
}
