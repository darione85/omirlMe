/**
 * Created by p.campanella on 02/06/2014.
 */


/**
 * Created by p.campanella on 30/05/2014.
 */

'use strict';
angular.module('omirl.chartDirective', []).
    directive('omirlHighChart', ['ChartService',  function (oChartService) {

        var m_oChartService = oChartService;

        return {
            restrict: 'EA',
            priority: -10,
            link: function (scope, elem, attrs) {

                var oChartOptions = {

                    chart: {
                        renderTo: elem[0]
                    },

                    rangeSelector: {
                        inputEnabled: true,
                        selected: 4
                    },

                    yAxis: {
                        labels: {
                            formatter: function() {
                                return (this.value > 0 ? '+' : '') + this.value + 'mm';
                            }
                        },
                        plotLines: [{
                            value: 0,
                            width: 2,
                            color: 'silver'
                        }]
                    },

                    plotOptions: {
                        series: {
                            compare: 'percent'
                        }
                    },

                    tooltip: {
                        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>',
                        valueDecimals: 2
                    }
                };

                var oChart =  new Highcharts.StockChart(oChartOptions);

                m_oChartService.addChart(attrs.omirlHighChart, oChart);
            }
        };
    }]);

