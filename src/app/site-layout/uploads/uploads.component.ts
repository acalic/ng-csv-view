import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { UploadService } from '@app/core/upload/upload.service';
import { FileUpload } from '@app/core/upload/fileupload.model';
import { CsvOperationsService } from '@app/core/csv.service';

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

  uploadError: string = '';

  fileUploads: FileUpload[] = [];
  fileUploadsSub: Subscription;
  fileUploadsLoading: boolean = true;

  closeResult: string = '';
  fileNameDelete: string = '';

  fileData: string;

  @ViewChild('errorModal') private errorModal;

  constructor(
    private _csvOperations: CsvOperationsService,
    private _uploadService: UploadService,
    private _modalService: NgbModal,
    private _cd: ChangeDetectorRef,
    private _http: HttpClient,
    public modal: NgbActiveModal,
  ) {}

  ngOnInit() {
    this.getUploadedFiles();
  }  

  ngOnDestroy(): void {
    //this.uploadProgressSub.unsubscribe();
    //this.uploadStateSub.unsubscribe();
    this.fileUploadsSub.unsubscribe();
  }

  getUploadedFiles() {
    this.fileUploadsLoading = true;
    this.fileUploadsSub = this._uploadService.getFileUploads().subscribe((data: FileUpload[]) => {
      this.fileUploads = data;
      this.fileUploadsLoading = false;

      this.fileUploads.forEach(element => {
        element.getMetadata().then((metadata) => {
          element.originalName = metadata.customMetadata.originalName;
        })
      });

      //this._cd.markForCheck();
    });
  }

  uploadFile(event) {
    let file = event.target.files[0];
    
    this._csvOperations.validateCsvFormat(file).then((isValidFile) => {
      if(isValidFile){
        this._uploadService.uploadFile(file);
        this.uploadProgressSub = this._uploadService.getUploadProgress().subscribe((res) => {
          this.uploadProgress = res;
          if(this.uploadProgress == 100) {
            this.getUploadedFiles();
          }
        });
        this.uploadStateSub = this._uploadService.getUploadState().subscribe((res) => {
          this.uploadState = res;
        });
      }else {
        this.uploadError = 'Invalid file content! The file must be in CSV format.';
        this.openErrorModal();
      }
    });
  }

  openErrorModal() {
    this._modalService.open(this.errorModal);
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
      this.closeResult = 'dismissed: ' + reason;
    });
  }

  readCSV(file: any) {
    this.fileData = null;

    file.getDownloadURL().then((url: string) => {
      this._http.get(url, {responseType: 'text'}).toPromise().then((data: string) => {
        this.fileData = data;
      });
    });
  }
}
