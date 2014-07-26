/**
 * Created by p.campanella on 30/05/2014.
 */


var ChartController = (function() {
    function ChartController($scope, dialogService, oChartService, $timeout) {
        this.m_oScope = $scope;
        this.m_oScope.m_oController = this;
        this.m_oDialogService = dialogService;
        this.m_oChartService = oChartService;
        this.m_aoOtherCharts = [];

        this.oChartVM = [];

        this.m_sStationCode = this.m_oScope.model.stationCode;
        this.m_sChartType = this.m_oScope.model.chartType;

        var oControllerVar = this;

        oControllerVar.oChartVM = oControllerVar.m_oChartService.getStationChart(this.m_sStationCode,this.m_sChartType).success(function(data,status) {
            oControllerVar.oChartVM = data;

            if(angular.isDefined(oControllerVar.oChartVM.otherChart)) {

                oControllerVar.oChartVM.otherChart.forEach(function(sType){
                    var oOtherChartLink = {};
                    oOtherChartLink.sensorType = sType;
                    oControllerVar.m_aoOtherCharts.push(oOtherChartLink);
                });


            }

            oControllerVar.addSeriesToChart();
        }).error(function(data,status){
            alert('Error Contacting Omirl Server');
        });

    }

    ChartController.prototype.getOtherLinks = function() {
        return this.m_aoOtherCharts;
    }

    ChartController.prototype.otherLinkClicked = function(oOtherLink) {

        var oControllerVar = this;
        oControllerVar.oChartVM = oControllerVar.m_oChartService.getStationChart(this.m_sStationCode,oOtherLink.sensorType).success(function(data,status) {

            oControllerVar.oChartVM = data;
            oControllerVar.m_sChartType = oOtherLink.sensorType;

            oControllerVar.m_aoOtherCharts = [];

            if(angular.isDefined(oControllerVar.oChartVM.otherChart)) {

                oControllerVar.oChartVM.otherChart.forEach(function(sType){
                    var oOtherChartLink = {};
                    oOtherChartLink.sensorType = sType;
                    oControllerVar.m_aoOtherCharts.push(oOtherChartLink);
                });


            }

            oControllerVar.addSeriesToChart();
        }).error(function(data,status){
            alert('Error Contacting Omirl Server');
        });

    }


    ChartController.prototype.addSeriesToChart = function () {

        // Get Chart reference for this Chart
        var oChart = this.m_oChartService.getChart(this.m_sStationCode);

        if (oChart != null) {

            var bColumnChart = false;

            // For each time Serie
            this.oChartVM.dataSeries.forEach(function(oSerie) {
                if (oSerie.type == "column") bColumnChart = true;
            });


            // Get Back the options
            var oChartOptions = oChart.options;

            // Add Value Suffix
            oChartOptions.tooltip.valueSuffix = this.oChartVM.tooltipValueSuffix;

            if (bColumnChart) {
                oChartOptions.plotOptions.series.dataGrouping.enabled = false;
            }

            // Create chart again
            oChart = new Highcharts.Chart(oChartOptions);
            this.m_oChartService.setChart(this.m_sStationCode,oChart);


            oChart.setTitle({text: this.oChartVM.title}, {text: this.oChartVM.subtitle},true);


            if (angular.isDefined(oChart.yAxis[0])) {

                var oPlotLines = undefined;

                if (this.oChartVM.axisYTickInterval==0) this.oChartVM.axisYTickInterval = 1;

                if (angular.isDefined(this.oChartVM.horizontalLines)) {
                    if (this.oChartVM.horizontalLines.length > 0) {
                        oPlotLines = [];

                        this.oChartVM.horizontalLines.forEach(function(oHorizontalLine){
                            var oLine = {};
                            oLine.color = oHorizontalLine.color;
                            oLine.width = 2;
                            oLine.value = oHorizontalLine.value;

                            oPlotLines.push(oLine);
                        });
                    }
                }

                var oYAxisOptions = {
                    min: this.oChartVM.axisYMinValue,
                    max: this.oChartVM.axisYMaxValue,
                    tickInterval: this.oChartVM.axisYTickInterval,
                    title: {
                        text: this.oChartVM.axisYTitle
                    },
                    opposite: false,
                    plotLines: oPlotLines
                };


                //oChart.xAxis[0].options.tickPixelInterval = 50;

                oChart.yAxis[0].setOptions(oYAxisOptions);

            }

            // For each time Serie
            this.oChartVM.dataSeries.forEach(function(oSerie) {

                // Check if exists
                if (oSerie==null) return;
                if (oSerie.data==null) return;

                // I need at least two points
                if (oSerie.data.length>1)
                {
                    // Get the two last elements
                    var oSecondToLastElement = oSerie.data[oSerie.data.length-2];
                    var oLastElement = oSerie.data[oSerie.data.length-1];
                    // Obtain time step
                    var iTimeDelta = oLastElement[0]-oSecondToLastElement[0];

                    // Get N hours offset
                    var iHoursOffset = 21600000 * 2;

                    // Compute max steps
                    var iMaxSteps = iHoursOffset/iTimeDelta;

                    // Add null values
                    for (var iSteps = 1; iSteps<=iMaxSteps; iSteps ++)
                    {
                        var oNullValue = [];

                        oNullValue[0] = oLastElement[0] + iSteps*iTimeDelta;
                        oNullValue[1] = null;

                        oSerie.data.push(oNullValue);
                    }
                }

                oChart.addSeries(oSerie);
            });

        }
    }

    ChartController.$inject = [
        '$scope',
        'dialogService',
        'ChartService',
        '$timeout'
    ];
    return ChartController;
}) ();

