import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductdetailsComponent } from './home/productdetails/productdetails.component';
import { ProductlistComponent } from './home/productlist/productlist.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
      path: 'home',
      component: HomeComponent,
      children:[{
        path: '',
        redirectTo: 'view',
        pathMatch: 'full'
      },
      {
        path: 'view',
        component: ProductlistComponent
      },
      {
        path: 'add',
        component: ProductdetailsComponent
      },
     
    ]
    },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
