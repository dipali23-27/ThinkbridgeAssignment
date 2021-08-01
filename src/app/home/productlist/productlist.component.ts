import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { GetsetService } from 'src/app/Shared/Services/getset.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.css']
})
export class ProductlistComponent implements OnInit {

  @Input() productData: any = null;
  productList: any[] = [];
  displayedColumns: string[] = ['itemId', 'itemName', 'itemDescription', 'price', 'approvedBy','availableQuantity','itemWeight','action'];
  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort)
  sort!: MatSort;

  constructor(private helperService: GetsetService, public route: Router) {}

  ngOnInit(): void {
    if (localStorage.getItem('data') !== null) {
      this.productList = this.helperService.getData() as Array<any>;
      this.dataSource = new MatTableDataSource(this.productList);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort
  }

  ngOnChanges(): void {
    if (this.productData !== null) {
      if (localStorage.getItem('data') != null) {
        this.productList = this.helperService.getData() as Array<any>;
        const index = this.productList.findIndex(
          (product) => product.Id === this.productData?.Id
        );
        if (index !== -1) {
          this.productList.splice(index, 1, this.productData);
        } else {
          this.productList.push(this.productData);
        }
      } else {
        this.productList.push(this.productData);
      }
      this.helperService.setData(this.productList);
      this.dataSource = new MatTableDataSource(this.productList);
      this.dataSource.paginator = this.paginator;
    }
  }

  public updateproduct(productData: any): void {
    this.route.navigate(['/home/add']);
    this.helperService.setdItemData(productData);
  }

  public deleteproduct(productData: any): void {
    if (this.productList.length === 1) {
      this.productList = [];
      localStorage.clear();
      this.dataSource = new MatTableDataSource(this.productList);
      this.dataSource.paginator = this.paginator;
      return;
    } else {
      let index = this.productList.findIndex( el => el.itemId === productData.itemId )
      this.productList.splice(index, 1);
    }
    this.helperService.setData(this.productList);
    this.dataSource = new MatTableDataSource(this.productList);
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}


