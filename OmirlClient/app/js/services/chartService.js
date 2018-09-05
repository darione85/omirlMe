/**
 * Created by p.campanella on 30/05/2014.
 */

'use strict';

angular.module('omirl.chartService', ['omirl.ConstantsService']).
service('ChartService', ['$http', 'ConstantsService',  function ($http, oConstantsService) {

    this.m_oHttp = $http;
    this.m_oConstantsService = oConstantsService;

    this.m_aoCharts = [];

    this.setChart  = function(sCode, oChart) {

        for (var iCount = 0; iCount<this.m_aoCharts.length; iCount++) {
            var oChartReference = this.m_aoCharts[iCount];
            if (angular.isDefined(oChartReference)) {
                if (oChartReference.sCode == sCode) {
                    oChartReference.oChart = oChart;
                    break;
                }
            }
        }
    }

    this.addChart  = function(sCode, oChart) {
        var oChartReference = {};

        oChartReference.sCode = sCode;
        oChartReference.oChart = oChart;

        this.m_aoCharts.push(oChartReference);
    }

    this.getChart = function(sCode) {
        for (var iCount = 0; iCount<this.m_aoCharts.length; iCount++) {
            var oChartReference = this.m_aoCharts[iCount];
            if (angular.isDefined(oChartReference)) {
                if (oChartReference.sCode == sCode) {
                    return oChartReference.oChart;
                }
            }
        }

        return null;
    }

    this.removeChart = function(sCode) {
        for (var iCount = 0; iCount<this.m_aoCharts.length; iCount++) {
            var oChartReference = this.m_aoCharts[iCount];
            if (angular.isDefined(oChartReference)) {
                if (oChartReference.sCode == sCode) {
                    this.m_aoCharts.splice(iCount,1);
                    return;
                }
            }
        }
    }

    this.getStationChart = function(sSensorCode, sChart, bIsDavis) {
        if ( sChart == 'Vento'){
            sChart = 'Vento2';
        }else {if ( sChart == 'Vento2'){
                sChart = 'Vento';
            }
        }
        var sAPIURL =(bIsDavis)?this.m_oConstantsService.getDEVISSTATIONAPIURL():this.m_oConstantsService.getAPIURL();

        return this.m_oHttp.get(sAPIURL + '/charts/'+sSensorCode+'/'+sChart);
    }

    this.getSectionChart = function(sSectionCode, sModel, sSubFolder) {
        var sAPIURL = this.m_oConstantsService.getAPIURL();
        return this.m_oHttp.get(sAPIURL + '/charts/sections/'+ sSectionCode+'/'+ sModel);
    }

    this.exportCsvStationChart = function(sSensorCode, sChart) {
        var sAPIURL = this.m_oConstantsService.getAPIURL();
        //return this.m_oHttp.get(sAPIURL + '/charts/csv/'+sSensorCode+'/'+sChart);
        return sAPIURL + '/charts/csv/'+sSensorCode+'/'+sChart;
    }

    this.isStockChart = function(sSensorType) {
        if (sSensorType == 'Pluvio') return false;
        if (sSensorType == 'PluvioNative') return false;
        if (sSensorType == 'Pluvio30') return false;
        if (sSensorType == 'Pluvio7') return false;
        if (sSensorType == 'Vento') return false;
        if (sSensorType == 'Vento2') return false;

        return true;
    },

        this.loadFloodProofsCompatibles = function (url) {
            return this.m_oHttp.get(this.m_oConstantsService.buildDDSURL("floodproof/compatibles/"+url))
        },
        this.getSeriesDirect = function (server, serieId, featureId) {

            if(this.m_oConstantsService.getReferenceDate() != ""){
                var to = moment.utc(this.m_oConstantsService.getReferenceDate(),'DD/MM/YYYY HH:mm').valueOf()/1000;
                var from =moment.utc(this.m_oConstantsService.getReferenceDate(),'DD/MM/YYYY HH:mm').subtract(24,"hours").valueOf()/1000
            }else {
                var to = moment.utc(new Date()).valueOf()/1000;
                var from =moment.utc(new Date()).subtract(24,"hours").valueOf()/1000
            }

            var o = {
                id: serieId,
                feature : featureId,
                from : from,
                to : to
            };
            return this.m_oHttp.post(this.m_oConstantsService.buildDDSURL("ddsserie/"+server+"/series/"),o);
        }


}]);

