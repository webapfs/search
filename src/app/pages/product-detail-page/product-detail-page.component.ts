import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-detail-page',
  templateUrl: './product-detail-page.component.html',
  styleUrls: ['./product-detail-page.component.css'],
  providers:[HttpClient]
})
export class ProductDetailPageComponent implements OnInit {

  product:any;
  images_results:any;
  loadingProduct:any = false;
  loadingImages:any = false;

  constructor(private http:HttpClient, private router:ActivatedRoute) { }

  ngOnInit(): void {

    this.router.params.subscribe( (params:any) => {
      const { sku } = params;
      this.getProductBySku(sku);
    })
  }

  addToProduct(url:any) {
    this.router.params.subscribe( (params:any) => {
      const { sku } = params;
      this.getImageToProduct(sku, url);
    })
    return false;
  }

  getImageToProduct(sku:any, url:any) {
     var raw = "";
    var requestOptions:any = {
      method: 'POST',
      body: raw,
      redirect: 'follow'
    };

    fetch(`https://apfs.com/wp-admin/admin-ajax.php?action=add_image_to_product&sku=${sku}&imageURL=${url}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.getProductBySku(sku);
        alert('Image added to product');
      })
      .catch(error => {
        alert('Error adding image to product');
      });   
  }

  getProductBySku(sku:any) {
     var raw = "";
    var requestOptions:any = {
      method: 'POST',
      body: raw,
      redirect: 'follow'
    };

    this.loadingProduct = true;
    fetch(`https://apfs.com/wp-admin/admin-ajax.php?action=get_product_wc&sku=${sku}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.product = result;
        console.log(this.product);
        this.getGoogleSearch(this.product.name);
        console.log(this.product)
        this.loadingProduct = false;
      })
      .catch(error => {
        this.loadingProduct = false;
      });   
  }

  getGoogleSearch(val:any) {
    var raw = "";
    var requestOptions:any = {
      method: 'POST',
      body: raw,
      redirect: 'follow'
    };
    this.loadingImages = true;
    fetch(`https://apfs.com/wp-admin/admin-ajax.php?action=search_google&s=${val}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.images_results = result.images_results;
        console.log(this.images_results);
        this.loadingImages = false;
      })
      .catch(error => {
        this.loadingImages = false;
      });   
  }

}


