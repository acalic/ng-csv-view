export class FileUpload { 
    $key: string;
    name: string;
    originalName: string;
    url: string;
    file: File;
   
    constructor(file: File) {
      this.file = file;
    }
  }