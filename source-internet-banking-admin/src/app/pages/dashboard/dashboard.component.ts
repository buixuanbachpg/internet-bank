import { Component, OnInit, OnDestroy } from '@angular/core';
import Chart from 'chart.js';

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from '../../variables/charts';
import { ActivatedRoute } from '@angular/router';
import { DatasharelocalService } from '../../data/datasharelocal.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  datasets: any;
  data: any;
  salesChart;
  clicked = true;
  clicked1 = false;
  private queryParam: any;
  constructor(
    private route: ActivatedRoute,
    private dataUser: DatasharelocalService
  ) { }

  ngOnInit() {
    this.queryParam = this.route.queryParamMap.subscribe(params => {
      this.dataUser.changeData(params.get('userid') || 'FAKED USER');
    });

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


    const chartOrders = document.getElementById('chart-orders');

    parseOptions(Chart, chartOptions());


    const ordersChart = new Chart(chartOrders, {
      type: 'bar',
      options: chartExample2.options,
      data: chartExample2.data
    });

    const chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
      type: 'line',
      options: chartExample1.options,
      data: chartExample1.data
    });
  }

  ngOnDestroy() {
    this.queryParam.unsubscribe();
    this.dataUser.clearAll();
  }





  updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
