import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { map } from 'rxjs/operators/map';
import { Observable } from 'rxjs';

import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFireDatabase } from '@angular/fire/database';

export class FileUpload {
 
  $key: string;
  name: string;
  url: string;
  file: File;
 
  constructor(file: File) {
    this.file = file;
  }
}

@Component({
  selector: 'app-uploads',
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent implements OnInit {

  uploadProgress: Observable<number>;
  uploadState: Observable<string>;
  fileUploads: any;

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  private basePath = '/csv_uploads';

  constructor(
    private afStorage: AngularFireStorage,
    private db: AngularFireDatabase,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getFileUploads();
    //console.log(this.fileUploads);
  }

  getFileUploads(): any {
    // Create a reference under which you want to list
    let storageRef = this.afStorage.ref(this.basePath);

    storageRef.listAll().toPromise().then(
      r => {
        this.fileUploads = r.items;
        console.log(this.fileUploads);
      }
    ).catch( error => {
        alert('error fetching data: ' + error);
    });

  }

  uploadFile(event) {
    //const id = Math.random().toString(36).substring(2);
    //this.ref = this.afStorage.ref(`${this.basePath}/${id}`);
    this.ref = this.afStorage.ref(`${this.basePath}/${event.target.files[0].name}`);
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  }

}
