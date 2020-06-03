import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { FileUpload } from '@app/core/upload/fileupload.model';
import { UploadService } from '@app/core/upload/upload.service';

import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  fileUploads: FileUpload[] = [];
  fileUploadsSub: Subscription;
  fileUploadsLoading: boolean = true;

  constructor(
    private _uploadService: UploadService,
  ) { }

  ngOnInit(): void {
    this.getUploadedFiles();
  }

  ngOnDestroy(): void {
    this.fileUploadsSub.unsubscribe();
  }

  getUploadedFiles() {
    this.fileUploadsSub = this._uploadService.getFileUploads().subscribe((data: any) => {
      this.fileUploadsLoading = false;

      data.forEach(element => {
        element.getMetadata().then((metadata) => {
          element.originalName = metadata.customMetadata.originalName;
        })
      });
      this.fileUploads = data;
    });
  }

}
