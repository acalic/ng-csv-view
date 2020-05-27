import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/http';

enum DataDelimiters {
  Semicolon = ';',
  Colon = ','
}

@Injectable({
  providedIn: 'root'
})

export class CsvOperationsService {

  constructor(
    private _http: HttpClient,
  ) { }

  getDelimiter(str: string) {
    let a = str.split(DataDelimiters.Semicolon)
    let b = str.split(DataDelimiters.Colon)

    if(a.length == b.length) return 0;

    return a.length > b.length ? DataDelimiters.Semicolon : DataDelimiters.Colon;
  }

  validateCsvFormat(file: File): Promise<boolean> {
    let fileContent = new FileReader();
    fileContent.readAsText(file);

    return new Promise((resolve, reject)=>{
      fileContent.onload = () => {
        let text = fileContent.result.toString();
        let allText = text.split(/\r\n|\n/);
        let delimiter = this.getDelimiter(allText[0]);

        if (delimiter) {
          resolve(true);
        }
        resolve(false);
      };
    });
  }

  getCsvDataByColumnName(content: string, column: string): any[] {
    let allTextLines = content.split(/\r\n|\n/);
    let delimiter = this.getDelimiter(allTextLines[0]).toString();
    let headers = allTextLines[0].split(delimiter);

    var columnIndex = headers.findIndex(p => p == column)

    if(columnIndex == -1) return [null];

    let lines = [];

    for ( let i = 1; i < allTextLines.length; i++) {
      let data = allTextLines[i].split(delimiter);

      for ( let j = 0; j < headers.length; j++) {
        if(j == columnIndex) lines.push(data[j]);
      }
    }
    return lines;
  };

  getTotalRecords(content: string) {
    let allTextLines = content.split(/\r\n|\n/);
    return allTextLines.length - 1;
  }

}
