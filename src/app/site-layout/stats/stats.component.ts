import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { FileUpload } from '@app/core/upload/fileupload.model';
import { UploadService } from '@app/core/upload/upload.service';

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
    private _uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.getUploadedFiles();
  }

  ngOnDestroy(): void {
    this.fileUploadsSub.unsubscribe();
  }

  getUploadedFiles() {
    this.fileUploadsSub = this._uploadService.getFileUploads().subscribe((data: FileUpload[]) => {
      this.fileUploads = data;
      this.fileUploadsLoading = false;
    });
  }

}
