import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
{
  path:'', loadChildren: () => import('./pages/search/search.module').then(m => m.SearchModule),
}, 
{ 
  path:'product/:sku', loadChildren: () => import('./pages/product-detail-page/product-detail-page.module').then(m => m.ProductDetailPageModule) 
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
