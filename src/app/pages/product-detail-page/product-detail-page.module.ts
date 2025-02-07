import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductDetailPageRoutingModule } from './product-detail-page-routing.module';
import { ProductDetailPageComponent } from './product-detail-page.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    ProductDetailPageComponent
  ],
  imports: [
    CommonModule,
    ProductDetailPageRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  exports:[ProductDetailPageComponent]
})
export class ProductDetailPageModule { }
