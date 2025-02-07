import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: '[app-tr]',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent implements OnInit {

  @Input() product:any
  @Input() i:any;
  existInWooCommerce:any;
  existInMongoDB:any;
  mongodbData:any;
  @Output() onClickImport:EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelect:EventEmitter<any> = new EventEmitter<any>();


  constructor() {

  }

  toggleSelect() {
    this.product["selected"] = !this.product["selected"];
    this.onSelect.emit(this.product);
  }

  importAction() {
    this.onClickImport.emit(this.product);
  }

  ngOnInit(): void {
    this.product["selected"] = false;


    if(this.product.PartIdentifiers) {

      const upcList = this.product.PartIdentifiers.UPCList;
        if(upcList) {

          if(typeof upcList.UPC === "string") {
            this.isProductMongoDB(upcList.UPC);
          }else{
            this.isProductMongoDB(upcList.UPC[0]);
          }
        }else{
          console.log('none: ', upcList);
        }

    }

    this.isProductExistOnWooCommerce();
  }

  isString(val:any) {
    return typeof val == "string"
  }


  importMongoIntoWoo(e:any) {

    const sku = this.product.PartIdentifiers.EclipsePartNumber;
    const description = this.product.Description;

    console.log(this.mongodbData)
    console.log(description)
    
    
    if(!this.product){ alert('No product from Eclipse API') }
    if(!this.mongodbData){ alert('No mongodo data') }
    if(!sku){ alert('No SKU (part number) from Eclipse API') }

    this.mongodbData.partNumber = sku;  

    if(description) {
      this.mongodbData.productName = description;  
    }

    

    if(this.mongodbData) {
      
      var raw = "";
      var requestOptions:any = {
        method: 'POST',
        body: JSON.stringify(this.mongodbData),
        redirect: 'follow'
      };

      fetch(`https://apfs.com/wp-admin/admin-ajax.php?action=import_product`, requestOptions)
        .then(response => response.json())
        .then(result => {
          this.product["imported"] = this.existInWooCommerce;
        })
        .catch(error => console.log('error', error));      
    }
    e.preventDefault();
  }

  isProductMongoDB(upc:any) {
    var raw = "";
    var requestOptions:any = {
      method: 'GET',
      redirect: 'follow'
    };

    fetch(`https://apfs-products.herokuapp.com/product?upc=${upc}`)
      .then(response => response.json())
      .then(result => {
        if(result) {
          this.mongodbData = result;
          this.existInMongoDB = true;
        }else{
          this.existInMongoDB = false;
        }
      })
      .catch(error => console.log('error', error));
  }


  isProductExistOnWooCommerce() {
    var raw = "";
    var requestOptions:any = {
      method: 'POST',
      body: raw,
      redirect: 'follow'
    };

    fetch(`https://apfs.com/wp-admin/admin-ajax.php?action=does_product_exist&sku=${this.product.PartIdentifiers.EclipsePartNumber}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.existInWooCommerce = result['exist'];
        this.product["imported"] = this.existInWooCommerce;
      })
      .catch(error => console.log('error', error));
  }



}
