import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-image-thumbnail',
  host:{
    '[style.width]' : "'100%'"
  },
  templateUrl: './image-thumbnail.component.html',
  styleUrls: ['./image-thumbnail.component.css']
})
export class ImageThumbnailComponent implements OnInit {

  @Input() id:any;
  url:any;

  constructor() { }

  ngOnInit(): void {

    var raw = "";
    var requestOptions:any = {
      method: 'POST',
      body: raw,
      redirect: 'follow'
    };

    fetch(`https://apfs.com/wp-admin/admin-ajax.php?action=get_product_imageURL&image_id=${this.id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        this.url = result[0];

        console.log(this.url);
      })
      .catch(error => console.log('error', error));


  }

}
