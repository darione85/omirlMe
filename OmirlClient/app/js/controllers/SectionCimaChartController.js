/**
 * Created by p.campanella on 23/03/2015.
 */
var SectionCimaChartController = (function() {
    function SectionCimaChartController($scope, dialogService, oChartService, $timeout, oConstantsService, $log, $translate) {
        this.m_oScope = $scope;
        this.m_oScope.m_oController = this;
        this.m_oDialogService = dialogService;
        this.m_oChartService = oChartService;
        this.m_oConstantsService = oConstantsService;
        this.m_aoOtherCharts = [];
        this.m_bLoading = true;
        this.m_oLog = $log;
        this.m_oTranslateService = $translate;
        this.m_oDialogModel = this.m_oScope.model;
        this.m_sDialogTitle = "";

        this.oChartVM = [];

        this.m_sImageLink = "img/nodata.jpg";

        this.m_sDDSserieId = this.m_oScope.model.ddsSerieId;
        this.m_sSectionCode = this.m_oScope.model.sectionCode;
        this.m_sChartType = this.m_oScope.model.chartType;
        this.m_sSubFolder = this.m_oScope.model.subFolder;



        this.m_oScope.aoHydrograms=[];
        this.m_oScope.bChartLoader = false;

        this.m_iHeight = 600;
        this.m_iWidth = 750;

        var oControllerVar = this;

        oControllerVar.LoadData();

    }


    SectionCimaChartController.prototype.aoHydrograms = [];



    SectionCimaChartController.prototype.getImageLink = function() {
        //return this.m_sImageLink;

        var sBaseAddress = this.m_oConstantsService.getURL();

        return sBaseAddress + '/' + this.m_sImageLink;
    }

    SectionCimaChartController.prototype.chartId =function(){
        return "chart-"+this.m_sSectionCode;
    };

    SectionCimaChartController.prototype.chartType = function (id) {
        this.m_sChartType = id;
    };


    SectionCimaChartController.prototype.dict = function(sChartType){

        var oConfig = {
            'MaximumHydrogramChart':{
                'loader':showMaximumHydrogramChart,
                'settings':{
                    envelop_series_name:"Q(env c.i. 100%)",
                    max_series_name:"Q(max)",
                    obs_series_name:"Q(obs)",
                    envelop80_series_name:"Q(env c.i. 80%)",
                    envelop50_series_name:"Q(env c.i. 50%)",
                    envelopMean_series_name:"Q(Median)",
                    yAxis_labels_x: 30,
                    yAxis_title:'<p style="color: blue">Q [m<sup>3</sup>s<sup>-1</sup>]</p>',
                    unit_of_measure:'m<sup>3</sup>s<sup>-1</sup>',
                    hydrogramsIndexOffset:0
                }
            },
            'ProbabilisticHydrogramChart':{
                'loader': showProbabilisticHydrogramChart,
                'settings':{
                    max_series_name:"(Q, P[Qmax > Q])",
                    yAxis_labels_x: 5,
                    yAxis_tickInterval: 0.1,
                    yAxis_title:'<p style="color: blue">Q [m<sup>3</sup>s<sup>-1</sup>]</p>',
                    unit_of_measure:'m<sup>3</sup>s<sup>-1</sup>',
                    hydrogramsIndexOffset:0,
                }
            }
        }
        return oConfig[sChartType]


    };

    SectionCimaChartController.prototype.loadChart = function (sChartType) {

        var oControllerVar = this;

        if(angular.isUndefined(sChartType)){
            sChartType = (oControllerVar.m_oScope.aoHydrograms.length> 0)?oControllerVar.m_oScope.aoHydrograms[0].type:'MaximumHydrogramChart'
        }

        var oChartSettings = oControllerVar.dict(sChartType).settings;

        oChartSettings.htmlDiv = "chart-"+oControllerVar.m_sSectionCode;

        if (!angular.isUndefined(oControllerVar.chartLoaded)) oControllerVar.chartLoaded.chart.destroy();

        oControllerVar.m_oScope.aoHydrograms.forEach(function (h) {
            if (h.type == sChartType){
                oControllerVar.chartLoaded =oControllerVar.dict(sChartType).loader(h,400,oChartSettings)
            }
        })





        // showMaximumHydrogramChart(oControllerVar.m_oScope.aoHydrograms[0], 400,oChartSettings)

    };

    SectionCimaChartController.prototype.onChartTypeClick = function(sChartType){
        var oControllerVar = this;
        console.log("Load : "+sChartType);

        oControllerVar.loadChart(sChartType);

    };

    SectionCimaChartController.prototype.LoadData = function () {
        var oControllerVar = this;

        //comunege.idro.probabilisticlami
        oControllerVar.m_oChartService.loadFloodProofsCompatibles('1/'+this.m_oDialogModel.ddsSerieId+"/").success(function (data) {
            // console.log(data)
            // data[0].type = "MaximumHydrogramChart;ProbabilisticHydrogramChart";
            var counter = 0;
            oControllerVar.m_oScope.model[data[0].fidField];


            data.forEach(function (hydrogram) {
                var aChartType = hydrogram.type.split(';');
                aChartType.forEach(function (sHydrogramType) {

                    oControllerVar.m_oChartService.getSeriesDirect('1',oControllerVar.m_sDDSserieId,oControllerVar.m_sSectionCode).success(function (hydrogramData){

                        var aResult = [];
                        var aValues = []

                        if (!hydrogramData[0]) aResult.push(hydrogramData);
                        else aResult= hydrogramData;

                        var aTitle = aResult[0].title.split(";");

                        // $scope.chartSubTitle = moment.utc(aTitle[3], "YYYYMMDDHHmm").format('DD/MM/YYYY HH:mm');

                        aResult.forEach(function(h) {
                            aValues.push(h.values)
                        });

                        var thrs = [];
                        if(oControllerVar.m_oDialogModel.feature.attributes.Q_ALLARME){
                            thrs.push({ name : 'Thr1(ALLARME)', value : oControllerVar.m_oDialogModel.feature.attributes.Q_ALLARME })
                            thrs.push({ name : 'Thr2(ALLERTA)', value : oControllerVar.m_oDialogModel.feature.attributes.Q_ALLERTA })
                        }


                        if(oControllerVar.m_oConstantsService.getReferenceDate() != ""){
                            var to = moment.utc(oControllerVar.m_oConstantsService.getReferenceDate(),'DD/MM/YYYY HH:mm').valueOf()/1000;
                            var from =moment.utc(oControllerVar.m_oConstantsService.getReferenceDate(),'DD/MM/YYYY HH:mm').subtract(24,"hours").valueOf()/1000
                        }else {
                            var to = moment.utc(new Date()).valueOf()/1000;
                            var from =moment.utc(new Date()).subtract(24,"hours").valueOf()/1000
                        }



                        oControllerVar.m_oScope.aoHydrograms.push({
                            type:sHydrogramType,
                            feature:oControllerVar.m_oDialogModel.feature.attributes.sezione,
                            section:oControllerVar.m_oDialogModel.feature.attributes.sezione,
                            area:oControllerVar.m_oDialogModel.feature.attributes.area,
                            basin:oControllerVar.m_oDialogModel.feature.attributes.basin,
                            thresholds:thrs,
                            dateRef:moment.utc(aTitle[3], "YYYYMMDDHHmm").valueOf(),
                            now:to*1000,
                            timeline:aResult[aResult.length - 1].timeline,
                            values:aValues,
                            enabled :false,
                            title :sHydrogramType,
                            hydrogramData: hydrogramData,
                            hydroId : ""
                        })
                        counter++;
                        if (counter == data.length) oControllerVar.loadChart() 

                    }).error(function (err) {
                        console.log(err)
                        console.log(aChartType);
                        counter++;
                        if (counter == data.length) oControllerVar.loadChart()

                    })
                })
            })

        });

        // getSeriedirect 1 ,comunege.idro.probabilisticlami, polc00(sezione?),from,to
        // var hydrogramData = {
        //     id :sectionData.prop.id,
        //     feature:sectionData.section.DATI_DA,
        //     section : sectionData.section.SEZIONE,
        //     area : sectionData.section.AREA,
        //     basin : sectionData.section.NOME_BACIN,
        //     thresholds : thrs,
        //     procedure : '',
        //     scenario : '',
        //     dateRef : moment.utc(title_tokens[3], "YYYYMMDDHHmm").valueOf(),
        //     now : menuService.getDateToUTCSecond() * 1000,
        //     timeline : res[res.length - 1].timeline,
        //     values : values,
        //     isRealTime : menuService.isRealTime(),
        //     yRuler:null
        // };

        // oControllerVar.m_oChartService.getSectionChart(this.m_sSectionCode,this.m_sChartType).success(function(data,status) {
        //
        //     if (!angular.isDefined(data)){
        //         oControllerVar.m_oTranslateService('SECTIONCHART_NODATA', {value: oControllerVar.m_sSectionCode}).then(function(msg)
        //         {
        //             vex.dialog.alert({
        //                 message: msg
        //             });
        //             oControllerVar.m_bLoading = false;
        //             return;
        //
        //         });
        //         //alert('Impossibile caricare il grafico della sezione ' + oControllerVar.m_sSectionCode);
        //     }
        //     if (data=="") {
        //         oControllerVar.m_oTranslateService('SECTIONCHART_NODATA', {value: oControllerVar.m_sSectionCode}).then(function(msg)
        //         {
        //             vex.dialog.alert({
        //                 message: msg
        //             });
        //             oControllerVar.m_bLoading = false;
        //             return;
        //
        //         });
        //         //alert('Impossibile caricare il grafico della sezione ' + oControllerVar.m_sSectionCode);
        //         //oControllerVar.m_bLoading = false;
        //         //return;
        //     }
        //
        //     oControllerVar.oChartVM = data;
        //     oControllerVar.m_aoOtherCharts = [];
        //     oControllerVar.m_sImageLink = data.imageLink;
        //
        //     var oDialog = oControllerVar.m_oDialogService.getExistingDialog(oControllerVar.m_sSectionCode);
        //
        //     if(angular.isDefined(oControllerVar.oChartVM.otherChart)) {
        //
        //         oControllerVar.oChartVM.otherChart.forEach(function(sType){
        //             var oOtherChartLink = {};
        //             oOtherChartLink.sensorType = sType;
        //
        //             if (oControllerVar.m_sChartType == sType)
        //             {
        //                 oOtherChartLink.isActive = true;
        //             }
        //             else
        //             {
        //                 oOtherChartLink.isActive = false;
        //             }
        //
        //             var oHydroLink = oControllerVar.m_oConstantsService.getFlattedHydroLinkByType(sType);
        //
        //             if (oHydroLink != null)
        //             {
        //                 oOtherChartLink.description = oHydroLink.description;
        //                 oOtherChartLink.imageLinkOff = oHydroLink.link;
        //             }
        //
        //             oControllerVar.m_aoOtherCharts.push(oOtherChartLink);
        //         });
        //
        //     }
        //
        //
        //     oControllerVar.m_bLoading = false;
        // }).error(function(data,status){
        //     oControllerVar.m_oLog.error('Error Contacting Omirl Server');
        // });
    }


    SectionCimaChartController.prototype.isLoadingVisibile = function () {
        return this.m_bLoading;
    }

    SectionCimaChartController.prototype.getOtherLinks = function() {
        return this.m_aoOtherCharts;
    }

    SectionCimaChartController.prototype.otherLinkClicked = function(oOtherLink) {

        var oControllerVar = this;
        this.m_bLoading = true;


        oControllerVar.m_oChartService.getSectionChart(this.m_sSectionCode,oOtherLink.sensorType).success(function(data,status) {

            if (!angular.isDefined(data)){
                oControllerVar.m_oTranslateService('SECTIONCHART_NODATA', {value: oControllerVar.m_sSectionCode}).then(function(msg)
                {
                    vex.dialog.alert({
                        message: msg
                    });
                    oControllerVar.m_bLoading = false;
                    return;

                });
                //alert('Impossibile caricare il grafico della sezione ' + oControllerVar.m_sSectionCode);
                //oControllerVar.m_bLoading = false;
                //return;
            }
            if (data=="") {
                oControllerVar.m_oTranslateService('SECTIONCHART_NODATA', {value: oControllerVar.m_sSectionCode}).then(function(msg)
                {
                    vex.dialog.alert({
                        message: msg
                    });
                    oControllerVar.m_bLoading = false;
                    return;

                });
                //alert('Impossibile caricare il grafico della sezione ' + oControllerVar.m_sSectionCode);
                //oControllerVar.m_bLoading = false;
                //return;
            }

            oControllerVar.oChartVM = data;
            oControllerVar.m_aoOtherCharts = [];
            oControllerVar.m_sImageLink = data.imageLink;

            var oDialog = oControllerVar.m_oDialogService.getExistingDialog(oControllerVar.m_sSectionCode);

            if(angular.isDefined(oControllerVar.oChartVM.otherChart)) {

                oControllerVar.oChartVM.otherChart.forEach(function(sType){
                    var oOtherChartLink = {};
                    oOtherChartLink.sensorType = sType;

                    if (oOtherLink.sensorType == sType)
                    {
                        oOtherChartLink.isActive = true;
                    }
                    else
                    {
                        oOtherChartLink.isActive = false;
                    }

                    var oHydroLink = oControllerVar.m_oConstantsService.getFlattedHydroLinkByType(sType);

                    if (oHydroLink != null)
                    {
                        oOtherChartLink.description = oHydroLink.description;
                        oOtherChartLink.imageLinkOff = oHydroLink.link;
                    }

                    oControllerVar.m_aoOtherCharts.push(oOtherChartLink);
                });
            }

            oControllerVar.m_bLoading = false;
        }).error(function(data,status){
            oControllerVar.m_oLog.error('Error Contacting Omirl Server');
        });

    }

    SectionCimaChartController.prototype.getHeight = function() {
        return this.m_iHeight.toString() + "px";
    }

    SectionCimaChartController.prototype.getMinWidth = function() {
        return "310px";
    }

    SectionCimaChartController.prototype.getWidth = function() {
        return this.m_iWidth.toString() + "px";
    }

    SectionCimaChartController.prototype.zoomIn = function() {
        var oDialog = this.m_oDialogService.getExistingDialog(this.m_sSectionCode);
        if (angular.isDefined(oDialog)) {
            this.m_iHeight *= 1.1;
            this.m_iWidth *= 1.1;
            oDialog.ref.dialog("option", "height", this.m_iHeight);
            oDialog.ref.dialog("option", "width", this.m_iWidth);

        }
    }

    SectionCimaChartController.prototype.zoomOut = function() {
        var oDialog = this.m_oDialogService.getExistingDialog(this.m_sSectionCode);
        if (angular.isDefined(oDialog)) {
            this.m_iHeight /= 1.1;
            this.m_iWidth /= 1.1;
            oDialog.ref.dialog("option", "height", this.m_iHeight);
            oDialog.ref.dialog("option", "width", this.m_iWidth);

        }
    }


    SectionCimaChartController.$inject = [
        '$scope',
        'dialogService',
        'ChartService',
        '$timeout',
        'ConstantsService',
        '$log',
        '$translate'
    ];
    return SectionCimaChartController;
}) ();

