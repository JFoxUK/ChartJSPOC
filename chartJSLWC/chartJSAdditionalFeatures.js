/**
 * @description       : 
 * @author            : Jonathan Fox
 * @group             : 
 * @last modified on  : 20-08-2021
 * @last modified by  : Jonathan Fox
**/
import { LightningElement, api, track } from 'lwc';
import chartjs from '@salesforce/resourceUrl/chartjs_v3';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import zoomPlugin from '@salesforce/resourceUrl/chartjs_zoom_plugin';


 
export default class ChartGenLWC extends LightningElement {
    chartConfiguration;
    chartContext;
    chartArea;
    
    isChartJsInitialized;
    
    @track chartTrack;
    sliderValue = 60;

    buttonStatefulState = 'clickState';

    chartData;

    allButtonClass;
    
    connectedCallback(){
        
        Promise.all([loadScript(this, chartjs), loadScript(this, zoomPlugin)])
            .then(() => {
            
                //this.chartData = result;
                this.chartData = [{"closePrice": 1000,"fundDate": "2020-09-21","Contribution": 2000},{"closePrice": 2000,"fundDate":"2021-06-02","Contribution":3000},{"closePrice":3000,"fundDate":"2020-09-26","Contribution":5000},{"closePrice": 4000,"fundDate":"2020-10-18","Contribution":6000},{"closePrice": 5000,"fundDate": "2020-06-11","Contribution":8000},{"closePrice": 6000,"fundDate":"2021-06-25","Contribution":9000},{"closePrice":7000,"fundDate":"2020-12-23","Contribution":11000},{"closePrice":8000,"fundDate":"2020-04-03","Contribution":12000},{"closePrice":9000,"fundDate":"2020-06-04","Contribution":14000},{"closePrice":10000,"fundDate":"2020-09-10","Contribution":15000}];
                this.isChartJsInitialized = true;
                const ctx = this.template.querySelector('canvas.lineChart').getContext('2d');
                
                this.chartContext = ctx;
                
                this.getChartConfig();
                this.chart = new window.Chart(ctx, JSON.parse(JSON.stringify(this.chartConfiguration)));
                
                // ******* Need to register plugins ??HOW IN LWC?
                //Chart.register(zoomPlugin);
                //Chart.pluginService.register(zoomPlugin);
                //this.chart.register(zoomPlugin);
                //this.chart.pluginService.register(zoomPlugin);


                this.chartTrack = this.chart;
                this.chartArea = this.chartTrack.chartArea;
                
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error loading Chart',
                        message: error.message,
                        variant: 'error',
                    })
                );
            });
    }

    getChartConfig(){
        let chartClosePrice = [];
        let chartFundDate = [];
        let chartContribution = [];

        console.table(this.chartData);
        this.chartData.forEach(rec => { 
            chartClosePrice.push(rec.closePrice);
            chartFundDate.push(rec.fundDate); 
            chartContribution.push(rec.Contribution); 
        });
        
        this.chartConfiguration = {
            type: 'line',  
            data: {
                labels: chartFundDate,                
                datasets: [
                    {
                        label: "Close Price",
                        data: chartClosePrice,
                        borderColor: "#006EA9",
                        backgroundColor: "rgba(255, 255, 255,0.0)",
                    },
                    {
                        label: "Contribution",
                        data: chartContribution,
                        borderColor: "#006EA9",
                        backgroundColor: "rgba(255, 255, 255,0.0)",
                    },
                  ]
            },
            options: {     
                legend:{
                    display:true
                },
                           
                elements: {
                    point:{
                        radius: 2
                    }
                },
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                stacked: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Chart.js Line Chart - Multi Axis'
                    },
                    zoom: {
                        zoom: {
                          wheel: {
                            enabled: true,
                          },
                          pinch: {
                            enabled: true
                          },
                          mode: 'xy',
                        }
                    }
                },
                tooltips: {
                    mode: 'index',
                    intersect: false
                 },
                 hover: {
                    mode: 'index',
                    intersect: false
                 },
                scales: {
                    xAxes: [{
                        gridLines: {
                            display:false                           
                        },
                        type: 'time',
                        position: 'bottom',
                        time: {
                          displayFormats: {'day': 'MM/YY'},
                          tooltipFormat: 'DD/MM/YY',
                          unit: 'month',
                         }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: "#DFE5EA;",
                            lineWidth:"1",                           
                            borderDash: [6, 2],
                        },
                    }]
                }
            },
        };
    }
}