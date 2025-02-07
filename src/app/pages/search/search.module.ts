import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchRoutingModule } from './search-routing.module';
import { SearchComponent } from './search.component';
import { SearchItemComponent } from './search-item/search-item.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from '../../interceptors/error.interceptor';


@NgModule({
  declarations: [
    SearchComponent,
    SearchItemComponent
  ],
  imports: [
    CommonModule,
    SearchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule 
  ],
  exports:[SearchComponent],
  providers:[{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }]
})
export class SearchModule { }
