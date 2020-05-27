import { HttpClient } from '@angular/common/http/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { FileUpload } from '@app/core/upload/fileupload.model';
import { UploadService } from '@app/core/upload/upload.service';
import { CsvOperationsService } from '@app/core/csv.service';

import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts/public_api';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  fileData: string = '';

  fileUploads: FileUpload[] = [];
  fileUploadsSub: Subscription;
  fileUploadsLoading: boolean = true;

  isLoading: boolean = false;

  supportedHeaders: string[] = ['guid','name','first','last','email','value','date','phone','age','state','street'];

  error: string = '';

  totalRecords: number;
  totalAverageAge: number;

  @ViewChild('errorModal') private errorModal;

  public barChartOptions: ChartOptions = {
    title: {
      text: '',
      display: true
    },
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: '' }
  ];

  constructor(
    private _uploadService: UploadService,
    private _http: HttpClient,
    private _csvOperations: CsvOperationsService,
    private _modalService: NgbModal,
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

  buildReports(file: any) {
    this.isLoading = true;
    file.selected = true;

    file.getDownloadURL().then((url: string) => {
      this._http.get(url, {responseType: 'text'}).toPromise().then((data: string) => {
        this.fileData = data;
        this.isLoading = false;
        file.selected = false;

        let rowsByState = this._csvOperations.getCsvDataByColumnName(this.fileData, 'state');
        let rowsByAge = this._csvOperations.getCsvDataByColumnName(this.fileData, 'age');

        this.totalRecords = this._csvOperations.getTotalRecords(this.fileData);
        this.totalAverageAge = this.avg(rowsByAge);

        let totalsByState = this.uniqueCount(rowsByState);

        //console.log(this.totalAverageAge);
      
        if(rowsByState[0] == null) {
          this.error = 'The reports only work for CSV files that have these columns: ' + this.supportedHeaders.map(elt => String(elt));
          this.openErrorModal();
        }else {
          this.renderBarChart(Object.keys(totalsByState), Object.values(totalsByState), "Number of records sorted by state", "States");
        }

      });
    });
  }

  renderBarChart(x: any, y: any, title: string, label: string) {
    this.barChartOptions.title.text = title;
    this.barChartLabels = x;
    this.barChartData[0].data = y;
    this.barChartData[0].label = label;
  }

  openErrorModal() {
    this._modalService.open(this.errorModal);
  }

  uniqueCount(array: string[]) {
    let count = {};
    array.forEach(function(i) {
      count[i] = (count[i] || 0) + 1;
    });
    return count;
  }

  avg(array) {
    var i = 0, sum = 0, len = array.length;
    while (i < len) {
      sum = sum + parseFloat(array[i++]);
    }
    return sum / len;
  }

}
