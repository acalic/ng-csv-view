import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { UploadService } from '@app/core/upload/upload.service';
import { FileUpload } from '@app/core/upload/fileupload.model';
import { Subscription } from 'rxjs';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  closeResult: string = '';
  fileNameDelete: string = '';

  constructor(
    private _uploadService: UploadService,
    private _modalService: NgbModal,
    private _cd: ChangeDetectorRef,
    public modal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.getUploadedFiles();
  }  

  ngOnDestroy(): void {
    //this.uploadProgressSub.unsubscribe();
    //this.uploadStateSub.unsubscribe();
    this.fileUploadsSub.unsubscribe();
  }
 
  uploadFile(event) {
    this._uploadService.uploadFile(event.target.files[0]);
    this.uploadProgressSub = this._uploadService.getUploadProgress().subscribe((res) => {
      this.uploadProgress = res;
      if(this.uploadProgress == 100) {
        this.getUploadedFiles();
      }
    });
    this.uploadStateSub = this._uploadService.getUploadState().subscribe((res) => {
      this.uploadState = res;
    });
  }

  getUploadedFiles() {
    this.fileUploadsSub = this._uploadService.getFileUploads().subscribe((data) => {
      this.fileUploads = data;
      this._cd.markForCheck();
    });
  }

  openConfirmDeleteModal(content: any, file: any) {
    this.fileNameDelete = file.name;
    this._modalService.open(content).result.then((result) => {
      this.closeResult = result;
      if(this.closeResult == 'confirm') {
        this._uploadService.deleteFile(file).then(() => {
          this.getUploadedFiles();
        });
      }
    }, (reason) => {
      this.closeResult = 'dismissed';
    });
  }
}
