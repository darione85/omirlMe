/**
 * Created by Dario Rubado on 13/08/18.
 */

/**
 * Deterministic Hydrograms chart wrapper
 */
function showMaximumHydrogramChart(hydrogram, iChartHeight, oChartSettings, $sce,rasorService) {

    var chart = null;
    var thrs_colors = ['yellow', 'red'];
    var plotLines = [];

    var initChart = function() {

        if (chart) chart.destroy();

        chart = new Highcharts.StockChart({

            chart: {
                renderTo: oChartSettings.htmlDiv,
                alignTicks: false,
                zoomType: 'xy',
                height : iChartHeight

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
                            // event.point.index //numero serie
                            // hydrogram.values[event.point.index]

                            if (hydrogram.id == "italy.floodproofs.wrfwsm6")rasorService.rasorDamageLayerLoader(hydrogram, event.point.scenario);
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
                // max : oChartSettings.max,
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

        });

    };

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

            dt = moment.utc(hydrogram.timeline[i]).valueOf();

            series.push([dt, parseFloat(orderedMatrix[i][index]), parseFloat(orderedMatrix[i][orderedMatrix[i].length - index])]);

        }
        series = _.sortBy(series,function(p){return p[0]});
        return series;

    };

    var matrixMean = function(orderedMatrix){
        var series = [];
        var QMean;


        for (var i = 0; i < hydrogram.timeline.length; i++) {

            dt = moment.utc(hydrogram.timeline[i]).valueOf();

            var array = _.filter(orderedMatrix[i],function (num) {
                return(parseFloat(num) >= 0);
            });

            QMean = _.reduce(array,function (memo, num) {return parseFloat(memo) + parseFloat(num)});

            QMean = QMean/array.length;

            series.push([dt, QMean]);

        }

        return series;
    };

    var matrixMedian = function (orderedMatrix) {
        var series = [];

        var QMedian;

        for (var i = 0; i < hydrogram.timeline.length; i++) {

            dt = moment.utc(hydrogram.timeline[i]).valueOf();

            var array = _.filter(orderedMatrix[i],function (num) {
                return(parseFloat(num) >= 0);
            });

            QMedian = array[Math.round((array.length - 1) / 2)];

            series.push([dt, parseFloat(QMedian)]);

        }

        return series;
    }

    if (!hydrogram) return;

    //se ci sono i dati construisco la matrice ordinata
    var orderedMatrix = orderMatrix(hydrogram)

    if (!chart) initChart();

    //setto i due oggetti per modificare i dati e le label
    var seriesArray = chart.series;

    chart.xAxis[0].removePlotLine('dtref');
    chart.xAxis[0].removePlotLine('now');

    // chart.xAxis[0].removePlotLine('xRuler');

    chart.xAxis[0].addPlotLine(
        {
            id : 'dtref',
            value : hydrogram.dateRef,
            color : '#00C8DC',
            width : 2,
            zIndex: 5,
            label : {
                text : 'DateRef'
            }
        });

    chart.xAxis[0].addPlotLine(
        {
            id : 'now',
            value : hydrogram.now,
            color : '#A52A2A',
            width : 2,
            zIndex: 5,
            label : {
                text : (hydrogram.isRealTime? 'Now' : 'Now deferred')
            }
        });

    //righello X

    // if (oChartSettings.XYRulerVPopover.xLine != null){
    //     chart.xAxis[0].addPlotLine(
    //         {
    //             id : 'xRuler',
    //             value : parseFloat(oChartSettings.XYRulerVPopover.xLine),
    //             color : '#000000',
    //             width : 2,
    //             zIndex: 5,
    //             label : {
    //                 text : "Ruler"
    //             }
    //         });
    // }


    // thresholds
    for (var i = 0; i < plotLines.length; i++) {
        chart.yAxis[0].removePlotLine(plotLines[i].id);
    }
    plotLines = [];

    //console.log("Numero soglie: " + hydrogram.thresholds.length)

    for (var i = 0; i < hydrogram.thresholds.length; i++) {

        if (hydrogram.thresholds[i].value > 0) {

            var p = {
                id : 'thr_' + i,
                value : (oChartSettings.isVolume? hydrogram.thresholds[i].value/1000000 : hydrogram.thresholds[i].value),
                color : thrs_colors[i],
                width : 2,
                zIndex: 4,
                label : {
                    text : hydrogram.thresholds[i].name
                }
            };

            chart.yAxis[0].addPlotLine(p);
            plotLines.push(p);

        }

    }

    //yRuler

    // if (oChartSettings.XYRulerVPopover.yLine != null){
    //     chart.yAxis[0].addPlotLine(
    //         {
    //             id : 'yRuler',
    //             value : parseFloat(oChartSettings.XYRulerVPopover.yLine),
    //             color : '#000000',
    //             width : 2,
    //             zIndex: 5,
    //             label : {
    //                 text : "Ruler"
    //             }
    //         });
    // }


    var dtmin = moment.utc(hydrogram.timeline[0]).valueOf(),
        dtmax = moment.utc(hydrogram.timeline[hydrogram.timeline.length - 1]).valueOf();

    var objMinMax, minValues = [], maxValues = [];
    for (var i = 0; i < hydrogram.timeline.length; i++) {

        objMinMax = getMinAndMax(hydrogram, i);
        minValues.push((oChartSettings.isVolume? objMinMax.min/1000000 : objMinMax.min));
        maxValues.push((oChartSettings.isVolume? objMinMax.max/1000000 : objMinMax.max));

    }

    var dt, envValues = [];
    for (var i = 0; i < hydrogram.timeline.length; i++) {

        dt = moment.utc(hydrogram.timeline[i]).valueOf();
        envValues.push([dt, minValues[i], maxValues[i]])

    }
    seriesArray[0].id = hydrogram.section + '_Qenv';
    seriesArray[0].setData(envValues);


    //fascia confidenza 75
    if (orderedMatrix[0].length >= 6){
        var enValues80 = fasciaConfidenza(orderedMatrix, 80)
        seriesArray[1].id = hydrogram.section + '_Qenv_80%';
        seriesArray[1].setData(enValues80);
    }else{
        seriesArray[1].setVisible(false);
    }


    //75 end

    //fascia confidenza 50
    if (orderedMatrix[0].length >= 6){
        var enValues50 = fasciaConfidenza(orderedMatrix, 50)

        seriesArray[2].id = hydrogram.section + '_Qenv_50%';
        seriesArray[2].setData(enValues50);
    }else{
        seriesArray[2].setVisible(false);
    }


    //50 end

    //Mean

    var mean = matrixMean(orderedMatrix)


    seriesArray[3].id = hydrogram.section + '_Qenv_Median';
    seriesArray[3].setData(mean);

    //Mean end


    //Qmax
    maxValues = [];
    var dTime, objMax, maxTimeline = [];
    for (var i = (oChartSettings.hydrogramsIndexOffset + 1); i < hydrogram.values.length; i++) {

        objMax = getMaximumValue(hydrogram, i, hydrogram.dateRef, dtmax);
        dTime = objMax.time;

        if (dTime > 0) {

            while (maxTimeline.indexOf(dTime) >= 0) {
                dTime += 60000;
            }
            maxTimeline.push(dTime);

            maxValues.push({"max":objMax.value,"scenario":i });


        }

    }

    var maxItems = [];
    for (var i = 0; i < maxTimeline.length; i++) {

        maxItems.push({"x":maxTimeline[i], "y":(oChartSettings.isVolume? maxValues[i].max/1000000 : maxValues[i].max),"scenario":maxValues[i].scenario});
    }
    seriesArray[4].id = hydrogram.section + '_Qmax';
    seriesArray[4].setData(maxItems);


    var val, obsItems = [];

    // Q(oss)
    for (var i = 0; i < hydrogram.timeline.length; i++) {

        var date = moment.utc(hydrogram.timeline[i]).valueOf();
        val = parseFloat(hydrogram.values[oChartSettings.hydrogramsIndexOffset][i]);

        if ((date >= dtmin) && (date <= dtmax) && (val > -9998)) {

            obsItems.push([date, (oChartSettings.isVolume? val/1000000 : val)])

        }

    }
    seriesArray[5].id = hydrogram.section + '_Q(oss)';
    seriesArray[5].setData(obsItems);


    //percentuale superamento soglie

    function labelSuperamenti(orderedMatrix){

        //console.log(orderedMatrix);

        //var maxValues = [];

        var scenari = null;

        var thr = [];

        if(hydrogram.thresholds.length<1) return"";

        if (hydrogram.thresholds.length){
            for (var i = 0; i < hydrogram.thresholds.length; i++) {
                thr.push({
                    id : 'thr_' + i,
                    thr:i,
                    value : (oChartSettings.isVolume? hydrogram.thresholds[i].value/1000000 : hydrogram.thresholds[i].value),
                    color : thrs_colors[i],
                    name : hydrogram.thresholds[i].name,
                    count :0
                });
            }
        }

        // for(var x= 0;x< orderedMatrix.length;x++){
        //
        //     if(scenari == null) scenari = orderedMatrix[0].length;
        //     //prendo l'ultimo-
        //     var maxvalue = parseFloat(orderedMatrix[x].slice(-1)[0]);
        //     //compongo array di massimi
        //     if (maxvalue > -1 ){maxValues.push(maxvalue)}
        //
        // }

        if(scenari == null) scenari = orderedMatrix[0].length;

        if(maxValues.length > 1 && thr.length >1){
            maxValues.forEach(function (value) {
                thr.forEach(function (thrValue) {
                    if (value.max > thrValue.value) thrValue.count =thrValue.count+1;
                })
            })
        }else return "";


        //console.log(maxValues);
        var labelThr = "<div><ul><li>Numero scenari: "+scenari+"</li>";

        thr.forEach(function (t) {
            var perc = ((t.count*100)/29)
            labelThr +=  "<li>Sup "+t.name+":"+perc.toFixed(1)+"%</li>";
        });

        return labelThr +="</ul></div>";


    }

    //adding label superamenti high sx
    chart.renderer.label(labelSuperamenti(orderedMatrix),0,10,null,null,null,true).css({color:'black'}).add();

    //percentuale superamento soglie end


    // La prima volta imposta quelli generato dal chart
    // if (!oChartSettings.yAxisExtremes.min) {
    //
    //     var volExtremes = chart.yAxis[0].getExtremes();
    //     oChartSettings.yAxisExtremes.min = volExtremes.min;
    //     oChartSettings.yAxisExtremes.max = volExtremes.max;
    //
    // }

    //soglie invasi

    function soglieInvasi() {
        var oFirstElement = moment.utc(hydrogram.timeline[0]).valueOf();
        var oLastDate = moment.utc(hydrogram.timeline[hydrogram.timeline.length -1]).valueOf();
        oFirstElement.month();
        oLastDatemo
    }

    return{
        chart:chart
    }

}


/**
 * Deterministic Hydrograms chart wrapper
 */
function showProbabilisticHydrogramChart(hydrogram, iChartHeight, oChartSettings ) {

    var chart = null;
    var thrs_colors = ['yellow', 'red'];
    var plotLines = [];


    var getQMax = function() {

        var maxQ = -1, Qmod;
        // Thresholds
        for (var i = 0; i < hydrogram.thresholds.length; i++) {

            if (hydrogram.thresholds[i].value > maxQ) maxQ = hydrogram.thresholds[i].value;

        }
        if ((hydrogram.area > 0) && (maxQ < 0)) maxQ = 20*Math.pow(hydrogram.area, 0.6);

        // Q
        var aoMax = getMaximumValues(hydrogram);

        if (aoMax[aoMax.length - 1].value > maxQ) maxQ = aoMax[aoMax.length - 1].value;

        return (maxQ * 1.1)/(oChartSettings.isVolume? 1000000 : 1);

    };

    var initChart = function() {

        if (chart) chart.destroy();

        chart = new Highcharts.Chart({

            chart: {
                renderTo: oChartSettings.htmlDiv,
                alignTicks: false,
                zoomType: 'xy',
                height : iChartHeight

            },
            options: {
                chart : {
                    backgroundColor:'rgba(255, 255, 255, 1)'
                }
            },

            title: {
                text: null
            },

            tooltip: {
                useHTML: true,
                shared: true,
                crosshairs: true,
                formatter: function() {


                    if (this.point) {

                        var s = '<div style="font-family:\'Open Sans\', sans-serif;font-size: 12px;color: #000000">' + oChartSettings.max_series_name
                            + ': (' + this.point.x.toFixed(2) + (oChartSettings.isVolume? (' x 10<sup>6</sup>') : '') + '; ' + this.point.y.toFixed(1) + ')</div><br>';

                        return s;

                    } else return null;

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

                // max
                {
                    name: oChartSettings.max_series_name,
                    type:  'scatter',
                    color: '#0000FF',
                    marker: {

                        radius: 3,
                        symbol: 'square'

                    },
                    events:{
                        click:function (event) {
                            // rasorService.rasorDamageLayerLoader(hydrogram, event.point.scenario);
                        }
                    },
                    data:[],
                    useHTML: true,
                    showInLegend: true
                }

            ],
            xAxis: {

                ordinal: false,
                min : (oChartSettings.isVolume? null : 0),
                max : getQMax(),
                tickPixelInterval: 50,
                lineWidth: 2,
                gridLineWidth: 2,
                lineColor: 'black',
                title: {
                    margin: 0,
                    text: oChartSettings.yAxis_title,
                    useHTML:true,
                    style: {
                        fontWeight : 'bold',
                        fontFamily: 'Open Sans'
                    }
                },
                labels: {
                    format: (oChartSettings.isVolume? '{value:.2f}' : '{value:.1f}'),
                    style: {
                        fontFamily: 'Open Sans',
                        textTransform: 'lowercase',
                        fontSize: '14px'
                    }

                    //,formatter: function () {
                    //    var oDate = new Date(this.value);
                    //    if ((oDate.getUTCHours() == 0) && (oDate.getUTCMinutes() == 0))
                    //        return '<b>' + Highcharts.dateFormat('%d %b', this.value) + '</b>';
                    //    else
                    //        return Highcharts.dateFormat('%H:%M', this.value);
                    //}

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
                    }
                },
            },
            yAxis: [{ // Primary yAxis
                ordinal: false,
                min : 1,
                max : 95,
                type : 'logarithmic',
                tickInterval: oChartSettings.yAxis_tickInterval,
                showLastLabel : true,
                allowDecimals: false,
                alternateGridColor: 'rgba(0, 144, 201, 0.1)',
                labels: {
                    x: oChartSettings.yAxis_labels_x,
                    y: 5,
                    format: '{value:.0f}',
                    style: {
                        color: 'blue',
                        fontFamily: 'Open Sans',
                        textTransform: 'lowercase'
                    }
                },
                title: {
                    rotation: 270,
                    margin: 0,
                    offset: (oChartSettings.yAxis_labels_x + 30),
                    useHTML:true,
                    text: 'P',
                    style: {
                        fontWeight : 'bold',
                        fontFamily: 'Open Sans',
                        fontSize: '14px'
                    }
                },
                opposite: true
            }],

            loading: false

        });

    };

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

        var dt, val, maximumTime = 0, maximumValue = -Number.MAX_VALUE;

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

        return { 'time' : maximumTime, 'value' : maximumValue };

    };

    var getMaximumValues = function(hydrogram /* , hydrogType, excludePattern */ ) {

        var objMax;
        var voMax = [];

        for (var i = (oChartSettings.hydrogramsIndexOffset + 1); i < hydrogram.values.length; i++) {

            //if ((hydrogram.m_aeType[i] == hydrogType) && ((excludePattern == null) || (hydrogram.m_asDescr[i].indexOf(excludePattern) < 0))) {

            objMax = getMaximumValue(hydrogram, i, Number.MIN_VALUE, Number.MAX_VALUE);

            if (objMax.value >= 0) voMax.push({"value":objMax.value,"scenario":i});
            // if (objMax.value >= 0) voMax.push(objMax.value);

            //}

        }

        function sortNumber2(a,b) {
            return a.value - b.value;
        }

        function sortNumber(a,b) {
            return a- b;
        }

        voMax.sort(sortNumber2);

        return voMax;

    }

    if (!hydrogram) return;

    if (!chart) initChart();

    //setto i due oggetti per modificare i dati e le label
    var seriesArray = chart.series;

    // thresholds
    for (var i = 0; i < plotLines.length; i++) {
        chart.xAxis[0].removePlotLine(plotLines[i].id);
    }
    plotLines = [];

    for (var i = 0; i < hydrogram.thresholds.length; i++) {

        if (hydrogram.thresholds[i].value > 0) {

            var p = {
                id : 'thr_' + i,
                value : (oChartSettings.isVolume? hydrogram.thresholds[i].value/1000000 : hydrogram.thresholds[i].value),
                color : thrs_colors[i],
                width : 2,
                zIndex: 4,
                label : {
                    text : hydrogram.thresholds[i].name
                }
            };

            chart.xAxis[0].addPlotLine(p);
            plotLines.push(p);

        }

    }

    var aoMax = getMaximumValues(hydrogram);
    var maxValues = [];
    var num = aoMax.length;

    for (var i = 0; i < num; i++) {
        maxValues.push({"x":(oChartSettings.isVolume? aoMax[i].value/1000000 : aoMax[i].value),"y": ((num - i)/(num + 1)) * 100,"scenario":aoMax[i].scenario});
        // maxValues.push([(oChartSettings.isVolume? aoMax[i]/1000000 : aoMax[i]), ((num - i)/(num + 1)) * 100])
    }
    seriesArray[0].id = hydrogram.section + '_Qmax';
    seriesArray[0].setData(maxValues);

    return{
        chart:chart
    }

}



