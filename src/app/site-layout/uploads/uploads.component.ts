import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { UploadService } from '@app/core/upload/upload.service';
import { FileUpload } from '@app/core/upload/fileupload.model';
import { Observable, Subscription } from 'rxjs';
import { AngularFireUploadTask } from '@angular/fire/storage';

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})

export class UploadsComponent implements OnInit {

  uploadProgress: number;
  uploadProgressSub: Subscription;

  uploadState: string;
  uploadStateSub: Subscription;

  fileUploads: FileUpload[] = [];
  fileUploadsSub: Subscription;

  constructor(
    private uploadService: UploadService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getUploadedFiles();
  }  

  ngOnDestroy(): void {
    this.fileUploadsSub.unsubscribe();
  }
 
  uploadFile(event) {
    this.uploadService.uploadFile(event.target.files[0]);
    this.uploadProgressSub = this.uploadService.getUploadProgress().subscribe((res) => {
      this.uploadProgress = res;
      if(this.uploadProgress == 100) {
        this.getUploadedFiles();
      }
    });
    this.uploadStateSub = this.uploadService.getUploadState().subscribe((res) => {
      this.uploadState = res;
    });
  }

  getUploadedFiles() {
    this.fileUploadsSub = this.uploadService.getFileUploads().subscribe((data) => {
      this.fileUploads = data;
    });
  }
}
