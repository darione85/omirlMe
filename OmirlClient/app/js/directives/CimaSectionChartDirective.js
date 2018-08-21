/**
 * Created by drubado
 */


'use strict';
angular.module('omirl.cimaSectionchartDirective', []).
directive('cimaSectionHighChart', ['ChartService','_',  function (oChartService,_) {

    var m_oChartService = oChartService;

    // var dictConfigChart = {
    //     'MaximumHydrogramChart' : {
    //         envelop_series_name:"Q(env c.i. 100%)",
    //         max_series_name:"Q(max)",
    //         obs_series_name:"Q(obs)",
    //         envelop80_series_name:"Q(env c.i. 80%)",
    //         envelop50_series_name:"Q(env c.i. 50%)",
    //         envelopMean_series_name:"Q(Median)",
    //         yAxis_labels_x: 30,
    //         yAxis_title:'<p style="color: blue">Q [m<sup>3</sup>s<sup>-1</sup>]</p>',
    //         unit_of_measure:'m<sup>3</sup>s<sup>-1</sup>'
    //     },
    //
    //     'ProbabilisticHydrogramChart' : {
    //         max_series_name:"(Q, P[Qmax > Q])",
    //         yAxis_labels_x: 5,
    //         yAxis_tickInterval: 0.1,
    //         yAxis_title:'<p style="color: blue">Q [m<sup>3</sup>s<sup>-1</sup>]</p>',
    //         unit_of_measure:'m<sup>3</sup>s<sup>-1</sup>'
    //     }};

    var oChartSettings = {
        envelop_series_name:"Q(env c.i. 100%)",
        max_series_name:"Q(max)",
        obs_series_name:"Q(obs)",
        envelop80_series_name:"Q(env c.i. 80%)",
        envelop50_series_name:"Q(env c.i. 50%)",
        envelopMean_series_name:"Q(Median)",
        yAxis_labels_x: 30,
        yAxis_title:'<p style="color: blue">Q [m<sup>3</sup>s<sup>-1</sup>]</p>',
        unit_of_measure:'m<sup>3</sup>s<sup>-1</sup>'
    };




    return {
        restrict: 'EA',
        priority: -10,
        controller:function(scope){
            console.log(scope)
        },
        link: function (scope, elem, attrs) {

            var oChartOptions;


            scope.$watch('m_oController.m_oScope',function (newValue) {
                console.log("changed");

                m_oChartService.addChart(attrs.omirlHighChart, oChart);

                var oChart =  new Highcharts.Chart(oChartOptions);
            });

            if (scope.m_oController.m_oDialogModel.isStock) {
                var oChartOptions = {

                    chart: {
                        renderTo: elem[0],
                        alignTicks: false,
                        zoomType: 'xy',


                    },
                    options: {
                        global: {
                            useUTC: true
                        },
                        chart : {
                            backgroundColor:'rgba(255, 255, 255, 1)'
                        }
                    },
                    tooltip: {
                        useHTML: true,
                        shared: true,
                        crosshairs: true,
                        formatter: function() {

                            var s = '<div style="font-family:\'Open Sans\', sans-serif;font-size: 11px;color: #000000">Ore ' + moment.utc(this.x/1000, 'X').format('HH:mm') + '</div><br>';

                            if (this.points) {

                                this.points.forEach(function(item) {
                                    if (item.y > -9998) {

                                        if (item.series.name.indexOf('env')> -1 && item.series.name.indexOf('Median')< 0) {

                                            s += '<div style="font-family:\'Open Sans\', sans-serif;font-size: 12px;color: #000000">'
                                                + '<div>' + item.series.name+' : min = ' + item.point.low.toFixed(1) + ', max = ' + item.point.high.toFixed(1)
                                                + (oChartSettings.isVolume? (' x 10<sup>6</sup>') : '') + ' [' + oChartSettings.unit_of_measure + ']</div></div><br>';

                                        } else {

                                            s += '<div style="font-family:\'Open Sans\', sans-serif;font-size: 12px;color: #000000">'
                                                + '<div>' + item.series.name + ' = ' + item.y.toFixed(1)
                                                + (oChartSettings.isVolume? (' x 10<sup>6</sup>') : '')
                                                + ' [' + oChartSettings.unit_of_measure + ']</div></div><br>';

                                        }

                                    }

                                });

                            } else if (this.point) {

                                s += '<div style="font-family:\'Open Sans\', sans-serif;font-size: 12px;color: #000000">'
                                    + '<div>' + this.point.series.name + ' = ' + this.point.y.toFixed(1)
                                    + (oChartSettings.isVolume? (' x 10<sup>6</sup>') : '')
                                    + ' [' + oChartSettings.unit_of_measure + ']</div></div><br>';

                            }

                            return s;

                        }
                    },
                    credits: {
                        enabled: false
                    },
                    legend: {
                        enabled: true,
                        useHTML: true
                    },

                    series: [

                        // Q(Envelope)
                        {
                            name: oChartSettings.envelop_series_name,
                            type: 'arearange',
                            color: '#76C4FF',
                            zIndex: 0,
                            lineWidth: 1,
                            lineColor: '#76C4FF',
                            fillOpacity: 0.3,
                            threshold: null,
                            data: [],
                            showInLegend: true
                        },
                        // Q(Envelope 80)
                        {
                            name: oChartSettings.envelop80_series_name,
                            type: 'arearange',
                            color: '#39AAFF',
                            zIndex: 0,
                            lineWidth: 1,
                            lineColor: '#39AAFF',
                            fillOpacity: 0.3,
                            threshold: null,
                            data: [],
                            showInLegend: true

                        },
                        // Q(Envelope 50)
                        {
                            name: oChartSettings.envelop50_series_name,
                            type: 'arearange',
                            color: '#0091FF',
                            zIndex: 0,
                            lineWidth: 1,
                            lineColor: '#0091FF',
                            fillOpacity: 0.3,
                            threshold: null,
                            data: [],
                            showInLegend: true

                        },
                        // Q(MEAN)
                        {
                            name: oChartSettings.envelopMean_series_name,
                            type: 'line',
                            dashStyle: 'dash',
                            threshold: null,
                            data: [],
                            color: 'purple',
                            showInLegend: true
                        },
                        // Q(max)
                        {
                            name: oChartSettings.max_series_name,
                            type:  'scatter',
                            color: '#0000FF',
                            marker: {
                                radius: 3,
                                symbol: 'triangle'
                            },
                            data:[],
                            useHTML: true,
                            showInLegend: true
                        },
                        // Q(oss)
                        {
                            name: oChartSettings.obs_series_name,
                            type: 'line',
                            threshold: null,
                            data: [],
                            color: '#000000',
                            showInLegend: true
                        }

                    ],
                    exporting: {
                        chartOptions: {
                            rangeSelector: {
                                enabled: false
                            },
                            navigator: {
                                enabled: false
                            }
                        }

                    },
                    navigator: {

                        //series: {
                        //    type: 'arearange',
                        //    fillOpacity: 0.3
                        //},
                        enabled: false

                    },
                    scrollbar: {
                        enabled: false
                    },

                    xAxis: {

                        ordinal: false,
                        type: 'datetime',
                        min : moment.utc(hydrogram.timeline[0]).valueOf(),
                        max : moment.utc(hydrogram.timeline[hydrogram.timeline.length - 1]).valueOf(),
                        //range:  24 * 3600 * 1000,                                    // one day
                        minRange: 1 * 3600 * 1000,                                   // one hour
                        tickPixelInterval: 50,
                        lineWidth: 2,
                        gridLineWidth: 2,
                        lineColor: 'black',
                        title: {
                            margin: 0,
                            text: 'Time UTC',
                            style: {
                                fontWeight : 'bold',
                                fontFamily: 'Open Sans'
                            }
                        },
                        labels: {
                            style: {
                                fontFamily: 'Open Sans',
                                textTransform: 'lowercase',
                                fontSize: '14px'
                            },
                            formatter: function () {
                                var oDate = new Date(this.value);
                                if ((oDate.getUTCHours() == 0) && (oDate.getUTCMinutes() == 0))
                                    return '<b>' + Highcharts.dateFormat('%d %b', this.value) + '</b>';
                                else
                                    return Highcharts.dateFormat('%H:%M', this.value);
                            }

                        }


                    },
                    plotOptions: {
                        series: {
                            dataGrouping: {
                                enabled: true,
                                approximation :"high"
                            },
                            animation: false
                        },
                        line: {
                            marker: {
                                enabled: true,
                                radius: 1
                            }
                        },
                        area: {
                            marker: {
                                enabled: true,
                                radius: 1
                            }
                        },
                        scatter: {
                            marker: {
                                enabled: true,
                                radius: 1
                            },
                            events:{
                                click:function (event) {
                                    console.log(event)
                                }
                            }
                        },
                    },
                    rangeSelector : {
                        enabled : false
                    },
                    yAxis: [{ // Primary yAxis
                        ordinal: false,

                        min : 0,
                        // min : oChartSettings.yAxisExtremes.min,
                        // max : oChartSettings.yAxisExtremes.max,
                        // min : (oChartSettings.isVolume? null : 0),
                        //max : getQMax(),
                        //tickInterval: oChartSettings.yAxis_tickInterval,
                        showLastLabel : true,
                        allowDecimals: true,
                        alternateGridColor: 'rgba(0, 144, 201, 0.1)',
                        labels: {
                            x: oChartSettings.yAxis_labels_x,
                            y: 5,
                            format: (oChartSettings.isVolume? '{value:.2f}' : '{value:.1f}'),
                            style: {
                                color: 'blue',
                                fontFamily: 'Open Sans',
                                textTransform: 'lowercase',
                                fontSize: '14px'
                            }
                        },
                        title: {
                            rotation: 270,
                            margin: 0,
                            offset: (oChartSettings.yAxis_labels_x + 10),
                            useHTML:true,
                            text: oChartSettings.yAxis_title,
                            style: {
                                fontWeight : 'bold',
                                fontFamily: 'Open Sans'
                            }
                        },
                        opposite: true
                    }],

                    loading: false

                }


            }


            /**
             * Restituisce i valori max e min tra tutti gli idrogrammi ad un istante temporale
             * @param hydrogram
             * @param index
             * @return
             */
            var getMinAndMax = function(hydrogram, index) {

                var val, max = -Number.MAX_VALUE, min = Number.MAX_VALUE;

                for (var k = (oChartSettings.hydrogramsIndexOffset + 1); k < hydrogram.values.length; k++) {

                    val = parseFloat(hydrogram.values[k][index]);

                    if (val >= 0) {

                        if (val < min) min = val;
                        if (val > max) max = val;

                    }
                }

                return ((min != Number.MAX_VALUE)? { 'min' : min, 'max' : max } : { 'min' : null, 'max' : null });

            };
            /**
             * Restituisce la coppia (time, value) relativa al max di un idrogramma
             * @param hydrogram
             * @param index
             * @param minTime
             * @param maxTime
             * @return
             */

            var getMaximumValue = function(hydrogram, index, minTime, maxTime) {

                var dt, val, series, maximumTime = 0, maximumValue = -Number.MAX_VALUE;

                for (var k = 0; k < hydrogram.timeline.length; k++) {

                    dt = moment.utc(hydrogram.timeline[k]).valueOf();

                    if ((dt >= minTime) && (dt <= maxTime)) {
                        val = parseFloat(hydrogram.values[index][k]);
                        if ((val >= 0) && (val > maximumValue)) {

                            maximumTime = dt;
                            maximumValue = val;

                        }
                    }

                }

                return { 'time' : maximumTime, 'value' : maximumValue, 'scenario':index};

            };

            /**
             * building ordered matrix
             * @param hydrogram
             */
            var orderMatrix = function (hydrogram) {

                var unorderedMatrix = []
                var orderedMatrix =[]

                for (var k = 0; k < hydrogram.timeline.length; k++) {
                    unorderedMatrix[k] = []
                    hydrogram.values.forEach(function (val, index, array) {
                        // salto la prima timeline perche è l'osservato'
                        if (index != 0) unorderedMatrix[k].push(oChartSettings.isVolume? val[k]/1000000 : val[k])

                    })
                }

                for(var i = 0;i < unorderedMatrix.length; i++){
                    orderedMatrix[i] = []
                    orderedMatrix[i] = _.sortBy(unorderedMatrix[i],function(num){return parseFloat(num)})
                }

                return orderedMatrix;
            };





            var fasciaConfidenza = function (orderedMatrix,percentage) {

                percentage = 100- percentage;

                var index = (percentage/100)*orderedMatrix[0].length;
                //sopra e sotto quidni divido per due
                index= Math.round(index/2)

                var series=[];

                for (var i = 0; i < hydrogram.timeline.length; i++) {

                    var dt = moment.utc(hydrogram.timeline[i]).valueOf();

                    series.push([dt, parseFloat(orderedMatrix[i][index]), parseFloat(orderedMatrix[i][orderedMatrix[i].length - index])]);

                }
                series = _.sortBy(series,function(p){return p[0]});
                return series;

            };

            var matrixMean = function(orderedMatrix){
                var series = [];
                var QMean;


                for (var i = 0; i < hydrogram.timeline.length; i++) {

                    var dt = moment.utc(hydrogram.timeline[i]).valueOf();

                    var array = _.filter(orderedMatrix[i],function (num) {
                        return(parseFloat(num) >= 0);
                    });

                    QMean = _.reduce(array,function (memo, num) {return parseFloat(memo) + parseFloat(num)});

                    QMean = QMean/array.length;

                    series.push([dt, QMean]);

                }

                return series;
            };






            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            Highcharts.setOptions({
                lang: {
                    months: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
                    weekdays: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
                    noData: ['Non ci sono dati disponibili'],
                    printChart: ['Stampa'],
                    shortMonths: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',  'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
                    contextButtonTitle: ['Esporta Grafico'],
                    downloadJPEG: ['Scarica JPEG'],
                    downloadPDF: ['Scarica PDF'],
                    downloadPNG: ['Scarica PNG'],
                    downloadSVG: ['Scarica SVG'],
                    rangeSelectorFrom: ['Da'],
                    rangeSelectorTo: ['A']
                }
            });

            // var oChart =  new Highcharts.Chart(oChartOptions);

            // m_oChartService.addChart(attrs.omirlHighChart, oChart);
        },
        // scope:{
        //     onload:
        // }
    };
}]);

