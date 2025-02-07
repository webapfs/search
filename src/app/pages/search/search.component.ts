import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, interval, Subject, Observable, BehaviorSubject, } from "rxjs";
import { take, takeUntil, tap, takeWhile, map, filter } from "rxjs/operators";
import { ActivatedRoute, Router } from '@angular/router';

declare var bootstrap:any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [FormBuilder]
})
export class SearchComponent implements OnInit, AfterViewInit {

  searchKeyword = "Aqua-Pure";
  products:any = [];
  productsStream:any = [];
  //selectedProductStream:any = [];
  loading  = false;
  buttonLabel = "Search";

  keyword = new FormControl('', [
      Validators.required,
      Validators.minLength(2)
  ])

  selectAll = false;

  searchForm = this.formBuilder.group({
    keyword: this.keyword
  });


  catControl = new FormControl('', [
      Validators.required,
      Validators.minLength(2)
  ])


  importedFilterLabel = "All Products";
  importedBuyLineLabel = "All BuyLines";
  filters:any = {}

  buyLines:any = {}

  categories:any = [];

  catForm:any = this.formBuilder.group({
    categories: this.catControl
  });

  selectedCategories:any = [];

  canImportFalse = false;
  isImporting = false;
  importBtnLabel = "Import Products"

  unfilteredProductCount:any;

  @ViewChild('categoryModal', {read: ElementRef}) categoryModal:ElementRef;


  max:any = 50;
  index:any = 0;

  pageCount:any;

  currentPage:any = 1;

  paramsSubscription : any;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private cd:ChangeDetectorRef, private route: ActivatedRoute, private router: Router) {
    this.filters["imported"] = null;
    this.filters["BuyLine"] = null;



    this.getCategoies().subscribe( (res:any) => {



      this.categories = res.map( (cat:any) => {
        return Object.assign(cat, {selected:false})
      });     

      this.catForm = this.formBuilder.group({
        categories: this.buildCategories()
      });

    })

  }

  buildCategories() {
    const arr = this.categories.map( (cat:any) => {
      return this.formBuilder.control(cat.selected);
    })
    return this.formBuilder.array(arr);
  }

  categoryInputChange(e:any) {
   


    if(this.catForm.value['categories'].includes(true)) {
      this.canImportFalse = true;
    }else{
      this.canImportFalse = false;
    } 
  }

  ngAfterViewInit() {
    this.categoryModal.nativeElement.addEventListener('shown.bs.modal', () => {
      this.selectedCategories = [];
    })

    this.categoryModal.nativeElement.addEventListener('hidden.bs.modal', () => {
      this.catForm.reset();
    })

  }

  ngOnInit(): void {
    this.searchByPage();
  }


  setMinMaxQueries() {
    //const max = this.max * 
  }

 get categoriesControls() {
  return this.catForm?.get('categories');
}


 

 searchByPage(page?:any) {
      
     const { currentPage, max, s } = this.route.snapshot.queryParams

      if(page >= 0) {
        this.currentPage = parseInt(page);
      }else{
        this.currentPage = parseInt(currentPage || this.currentPage);
      }

      if(this.currentPage <= 0) {
        this.currentPage = 1;
      }

      this.index = this.max * (this.currentPage - 1);

      console.log("Page param:", page);
      console.log("Page: ", this.currentPage);
      console.log("Index: ", this.index);
      console.log("Max: ", this.max);

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          s:s,
          page:this.currentPage,
          max:this.max
          },
          queryParamsHandling: 'merge',
          // preserve the existing query params in the route
          skipLocationChange: false
          // do not trigger navigation
      });
      if(s) {
        this.searchRequest(s)
        this.searchForm.controls['keyword'].setValue(s);
      }  

 }



submit() {
  this.selectedCategories = [];
  this.categories.forEach( (v:any,i:any) => {
    this.categories[i].selected = this.catForm.value['categories'][i];
  })
  
  this.categories.forEach(async (cat:any, i:any) => {
    if(cat.selected){
      this.selectedCategories.push(cat['cat_ID'])
    }
  });
  
}


  selectAllProducts(products:any) {
    this.productsStream.forEach( (product:any) => product["selected"] = !product["selected"] );

    //this.selectedProductStream = this.getSelectProducts();

    this.selectAll = !this.selectAll;
  }

  onSelect(product:any) {
    //this.selectedProductStream = this.getSelectProducts();
  }

  getSelectProducts() {
    return this.productsStream.filter( (product:any) => { return product["selected"] == true });;
  }

  showImportBtn() {
    //const selectedProducts = this.productsStream.filter( (product:any) => { return product["selected"] == true });
    return this.getSelectProducts().length;
  }

  importSingleProduct(product:any) {
        const description  = product.Description;
        const price  = product.Pricing.ListPrice;
        const productImages = product.RichContentList.RichContentItem;
        const sku = product.PartIdentifiers.EclipsePartNumber;
        var images:any = [];
        for(var i = 0; i < productImages.length; i++) {
          const URL = productImages[i].Value;
          images.push(URL);
        }
        const payload = {
            "title": description,
            "description":description,
            "price":price ,
            "category_ids":[127],
            "quantity":100,
            "status":"publish",
            "sku":sku,
            "images":images 
        }
    const data = JSON.stringify(payload);
      this.http.post('https://apfs.com/wp-admin/admin-ajax.php?action=create_product', data, {}).subscribe( (res:any) => {
        console.log(res)
        alert(`Successfully imported into Woo Commerce`);
      }, err => console.log(err));
  }

  importProducts() {

  }

  runActionOnSelected(action:any) {
    this.submit()
    
    if(!this.selectedCategories){
      alert('You need to select categories for this import.');
      return;
    }

    const pro = this.getSelectProducts();


    if(action && pro.length) {
      var jsonData = pro.map( (product:any) => {
        const description  = product.Description;
        const price  = product.Pricing.ListPrice;
        const productImages = product.RichContentList?.RichContentItem || "";
        const sku = product.PartIdentifiers.EclipsePartNumber;
        var images:any = [];
        for(var i = 0; i < productImages.length; i++) {
          const URL = productImages[i].Value;
          images.push(URL);
        }
        return {
    
            "title": description,
            "description":description,
            "price":price ,
            "category_ids":this.selectedCategories,
            "quantity":100,
            "status":"publish",
            "sku":sku,
            "images":images 
        }
      })
      const data = JSON.stringify(jsonData);
      let reqHeaders = new HttpHeaders().set('Content-Type', 'application/json');


      this.isImporting = true;
      this.importBtnLabel = "Importing..."

      this.http.post('https://apfs.com/wp-admin/admin-ajax.php?action=create_product_bulk', data, {}).subscribe( (res:any) => {
        const importedIds = res.length;
        this.isImporting = false;
        this.importBtnLabel = "Import Products"
        $(this.categoryModal.nativeElement).modal('hide');

        this.productsStream.forEach( (p:any) => p.selected = false);

        alert(`Successfully imported ${importedIds} into Woo Commerce`);
      }, err => {
        this.isImporting = false;
        this.importBtnLabel = "Import Products"
      });
    }
  }

  resetSelectAll() {
    this.productsStream.forEach( (product:any) => product["selected"] = false );
    this.selectAll = false;
  }

  search(e:any) {
    if(this.searchForm.valid) {
      this.searchRequest(this.searchForm.value.keyword);
    }
  }

  resetFilters() {
    this.productsStream = this.products;
    this.importedFilterLabel = "All Products";
    this.importedBuyLineLabel = "All BuyLines";
    this.filters["imported"] = null;
    this.filters["BuyLine"] = null;
    this.resetSelectAll();
  }


  //filters = {}

  filterImported(filters:any) {
    this.filters["imported"] = filters["imported"];
    this.importedFilterLabel = filters["imported"] ? "In WooCommerce" : "Not in WooCommerce";
    this.productsStream = this.products.filter( (product:any) => this.filterProducts(product) );
    this.resetSelectAll();
    return false;
  }

  filterBuyLine(filters:any) {
    this.filters["BuyLine"] = filters["BuyLine"];
    this.importedBuyLineLabel = filters["BuyLine"];

    this.productsStream = this.products.filter( (product:any) => this.filterProducts(product) )
    this.resetSelectAll();
    return false;
  }

  filterProducts(product:any) {

    var isImported;
    var buyLine;
    var filter = true;

    if(this.filters["imported"] != null) {
      isImported = product["imported"] == this.filters["imported"];
      filter = isImported;
    } 

    if(this.filters["BuyLine"] != null) {
      buyLine = product["BuyLine"] == this.filters["BuyLine"];
      filter = buyLine;
    } 

    if(this.filters["imported"] != null && this.filters["BuyLine"] != null) {
      isImported = product["imported"] == this.filters["imported"];
      buyLine = product["BuyLine"] == this.filters["BuyLine"];
      filter = isImported && buyLine;
    } 

    return filter; 
  }





  importedFilter() {

  }



  isString(val:any) {
    return typeof val == "string"
  }

  buyLineType() {
    return Object.keys(this.buyLines);
  }

  getCategoies() {
    return this.http.get('https://apfs.com/wp-admin/admin-ajax.php?action=get_all_categories')
  }

  goToNextPage(e:any) {
    e.preventDefault();
    console.log('next page')
  }

  productPagination(response:any) {
    var json = JSON.parse(response);
    const unfilteredProductCount = json["MassProductInquiryResponse"]["UnfilteredProductCount"];
    const pageCount = unfilteredProductCount / this.max;

    this.unfilteredProductCount = unfilteredProductCount;
    this.pageCount = Math.ceil(pageCount);
    
  }

  goToPage(e:any,index:any) {
    e.preventDefault();
    this.searchByPage(index);
  }

  productSearchSuccess(result:any) {
        this.loading = false;
        this.buttonLabel = "Search";
        var json = JSON.parse(result);
        const success = json["MassProductInquiryResponse"]["StatusResult"]["@attributes"]["Success"];
        
        if(success == "No") {
          throw json;
        }

        const products = json["MassProductInquiryResponse"]["ProductList"]["Product"];
        
        this.products = products;

        var single = this.products.length > 1 ? false : true;

        if(single) {
          this.products = [this.products];
          this.productsStream = [products]
        }else{
           this.productsStream = this.products;
        }

        this.products.forEach( (product:any) => {
          this.addBuyLine(product);
        })
  }

  searchRequest(keyword:string) {
    this.loading = true;
    this.buttonLabel = "Searching..."
    var index = 0;
    var max = 20;

    var requestOptions:any = {
      method: 'POST',
      redirect: 'follow'
    };

    var url = `https://apfs.com/wp-admin/admin-ajax.php?action=search_products&s=${keyword}`;


    if(this.index >= 0) {
      url = url + `&index=${this.index}`;
    }

    if(this.max) {
      url = url + `&max=${this.max}`;
    }

    
     this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        s: keyword,
        page:this.currentPage,
        max:this.max
      },
      queryParamsHandling: 'merge',
      // preserve the existing query params in the route
      skipLocationChange: false
      // do not trigger navigation
    });

    this.productsStream = [];
    this.products = [];
     
    fetch(url, requestOptions)
      .then(response => response.text())
      .then(result => {
        this.productSearchSuccess(result);
        this.productPagination(result);
      })
      .catch(error => {

        this.loading = false;
        this.buttonLabel = "Search";
        const e = JSON.stringify(error);
        alert(`Error e`);

        //const errorMessage = error["MassProductInquiryResponse"]["StatusResult"]["ErrorMessageList"]["ErrorMessage"]["Description"]

      });
  }


  addBuyLine(product:any) {
    this.buyLines[product.BuyLine] = product.BuyLine;
  }



}
