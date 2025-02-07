import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageThumbnailComponent } from './image-thumbnail/image-thumbnail.component';



@NgModule({
  declarations: [
    ImageThumbnailComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[ImageThumbnailComponent]
})
export class SharedModule { }
