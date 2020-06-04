import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { CsvOperationsService } from '@app/core/csv.service';
import { UploadService } from '@app/core/upload/upload.service';

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts/public_api';

@Component({
  selector: 'app-stats-item',
  templateUrl: './stats-item.component.html',
  styleUrls: ['./stats-item.component.scss']
})
export class StatsItemComponent implements OnInit {

  totalRecords: number;
  totalAverageAge: number;
  totalEmptyStateVals: number = 0;

  isLoading: boolean = false;

  supportedHeaders: string[] = ['guid', 'name', 'first', 'last', 'email', 'value', 'date', 'phone', 'age', 'state', 'street'];
  fileData: string = '';
  error: string = '';

  lastDate: Date;

  @ViewChild('errorModal') private errorModal;

  /* Bar chart */
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

  /* Pie chart */
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        },
      },
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];

  constructor(
    private _http: HttpClient,
    private _uploadService: UploadService,
    private _csvOperations: CsvOperationsService,
    private _modalService: NgbModal,
    private _route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    let fileName = this._route.snapshot.params.name;
    this.buildReports(fileName);
  }

  buildReports(fileName: string) {

    this.isLoading = true;

    this._uploadService.getFileDownloadUrlByName(fileName).toPromise().then((url: string) => {
      this._http.get(url, { responseType: 'text' }).toPromise().then((data: string) => {
        this.fileData = data;
        this.isLoading = false;

        let rowsByState = this._csvOperations.getCsvDataByColumnName(this.fileData, 'state');
        let rowsByAge = this._csvOperations.getCsvDataByColumnName(this.fileData, 'age');
        let rowsByDate = this._csvOperations.getCsvDataByColumnName(this.fileData, 'date');

        if (!rowsByState[0] || !rowsByAge[0] || !rowsByDate[0]) {
          this.error = 'The reports only work for CSV files that have these columns: ' + this.supportedHeaders.map(elt => String(elt));
          this.openErrorModal();
        } else {
          this.totalRecords = this._csvOperations.getTotalRecords(this.fileData);
          this.totalAverageAge = this.avg(rowsByAge);

          rowsByDate = rowsByDate.map(function (x) {
            return new Date(x);
          })

          this.lastDate = this.maxDate(rowsByDate);

          let totalsByState = this.uniqueCount(rowsByState);
          let totalsByStateSorted = this.objSort(totalsByState, 10);

          this.renderBarChart("Top 10 number of records by state", "states", Object.keys(totalsByStateSorted), Object.values(totalsByStateSorted));
          this.renderPieChart(['Empty state records', 'Records with state value'], [this.totalEmptyStateVals, this.totalRecords - this.totalEmptyStateVals])
        }

      });
    }).catch(error => {
      console.log(error.message);
    });
  }

  renderBarChart(title: string, label: string, x: any, y: any, ) {
    this.barChartOptions.title.text = title;
    this.barChartLabels = x;
    this.barChartData[0].data = y;
    this.barChartData[0].label = label;
  }

  renderPieChart(labels: string[], data: number[]) {
    this.pieChartLabels = labels;
    this.pieChartData = data;
  }

  uniqueCount(array: string[]) {
    let count = {};
    array.forEach((i) => {
      if (i == '') {
        i = 'BLANK';
      }
      count[i] = (count[i] || 0) + 1;
    });

    this.totalEmptyStateVals = count['BLANK'] ? count['BLANK'] : 0;
    return count;
  }

  avg(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      if (!isNaN(parseFloat(array[i]))) {
        sum = sum + parseFloat(array[i]);
      }
    }
    return sum / array.length;
  }

  objSort(obj: Object, sliceLength?: number) {
    var sortable = [];
    for (var item in obj) {
      sortable.push([item, obj[item]]);
    }

    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });

    if(sliceLength) { sortable = sortable.slice(0, sliceLength) }

    var objSorted = {}
    sortable.forEach(function (item) {
      objSorted[item[0]] = item[1]
    })

    return objSorted;
  }

  maxDate(datesArr: Date[]) {
    var max_dt = datesArr[0],
      max_dtObj = new Date(datesArr[0]);
    datesArr.forEach(function (dt, index) {
      if (new Date(dt) > max_dtObj) {
        max_dt = dt;
        max_dtObj = new Date(dt);
      }
    });
    return max_dt;
  }

  openErrorModal() {
    this._modalService.open(this.errorModal);
  }

}
