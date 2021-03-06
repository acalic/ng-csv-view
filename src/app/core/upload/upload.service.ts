import { Injectable } from '@angular/core';
import { FileUpload } from './fileupload.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/map'

import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})

export class UploadService {

  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;

  uploadProgress$: Observable<number>
  uploadState$: Observable<string>

  fileUploadsNum$: Observable<number>;

  private basePath = '/csv_uploads';
  private storageRef = this.afStorage.ref(this.basePath);

  constructor(
    private afStorage: AngularFireStorage
  ) {
    this.fileUploadsNum$ = this.getFileUploadsNumber().pipe(map(x => x));
  }

  getFileUploads(): Observable<any> {
    return this.storageRef.listAll().map(res => {
      return res.items;
    })
  }

  getFileUploadsNumber(): Observable<any> {
    return this.storageRef.listAll().map(res => {
      return res.items.length;
    })
  }

  getUploadProgress(): Observable<number> {
    return this.uploadProgress$;
  }

  getUploadState(): Observable<string> {
    return this.uploadState$;
  }

  getFileDownloadUrl(file: any): Observable<string> {
    return file.getDownloadURL();
  }

  getFileDownloadUrlByName(fileName: string): Observable<string> {
    return this.afStorage.ref(`${this.basePath}/${fileName}`).getDownloadURL();
  }

  uploadFile(fileUpload: FileUpload) {
    const id = Math.random().toString(36).substring(2);
    this.ref = this.afStorage.ref(`${this.basePath}/${id}`);
    //this.ref = this.afStorage.ref(`${this.basePath}/${fileUpload.name}`);    

    let metadata = {
      customMetadata: {
        'id': id,
        'originalName': fileUpload.name
      }
    }
    
    this.task = this.ref.put(fileUpload, metadata);
    this.uploadProgress$ = this.task.percentageChanges();
    this.uploadState$ = this.task.snapshotChanges().pipe(map(s => s.state));
  }

  deleteFile(file: any) {
    return file.delete();
  }
}
