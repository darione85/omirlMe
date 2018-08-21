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

        // scope:{
        //     onload:
        // }
    };
}]);

