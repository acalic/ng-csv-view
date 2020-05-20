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

  uploadProgress: Observable<number>
  uploadState: Observable<string>

  fileUploadsNum: number;

  private basePath = '/csv_uploads';
  private storageRef = this.afStorage.ref(this.basePath);

  constructor(
    private afStorage: AngularFireStorage
  ) {}

  getFileUploads(): Observable<any> {
    return this.storageRef.listAll().map(res => {
      return res.items;
    })
  }

  getFileUploadsNumber(): Observable<number> {
    return this.storageRef.listAll().map(res => {
      this.fileUploadsNum = res.items.length;
      return this.fileUploadsNum;
    })
  }

  uploadFile(fileUpload: FileUpload) {
    //const id = Math.random().toString(36).substring(2);
    //this.ref = this.afStorage.ref(`${this.basePath}/${id}`);
    this.ref = this.afStorage.ref(`${this.basePath}/${fileUpload.name}`);
    this.task = this.ref.put(fileUpload);
    this.uploadProgress = this.task.percentageChanges();
    this.uploadState = this.task.snapshotChanges().pipe(map(s => s.state));
  }

  deleteFile(file: any) {
    return file.delete();
  }

  getUploadProgress(): Observable<number> {
    return this.uploadProgress;
  }

  getUploadState(): Observable<string> {
    return this.uploadState;
  }
}
