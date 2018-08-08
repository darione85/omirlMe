/**
 * Created by p.campanella on 27/01/14.
 */

'use strict';
angular.module('omirl.mapNavigatorService', ['omirl.ConstantsService']).
    service('MapNavigatorService', ['$http',  'ConstantsService', '$translate', function ($http, oConstantsService, $translate) {

        this.APIURL = oConstantsService.getAPIURL();

        this.m_oConstantsService = oConstantsService;

        this.m_oHttp = $http;

        this.m_oTranslate = $translate;

        this.m_aoMapFirstLevels = [];

        this.m_aoHydroFirstLevels = [];

        this.m_aoRadarFirstLevels = [];

        this.m_aoSatelliteFirstLevels = [];

        this.fetchMapFirstLevels = function() {
            var oServiceVar = this;

            oServiceVar.m_aoMapFirstLevels = [];
            this.m_oHttp.get(this.APIURL + '/mapnavigator/maps')
            .success(function(data,status)
            {
                //******************************************************************
                // Add the flag to indicate the menu link item level and 
                // if the menu link has a sub-level.
                // or not. These parametere should come from server but, at the
                // moment, are initialized here
                for(var key in data)
                {
                    data[key].hasSubLevel = true;
                    data[key].myLevel = 0;
                }
                //******************************************************************
                
                oServiceVar.m_aoMapFirstLevels = data;
            })
            .error(function(data,status)
            {
                oServiceVar.m_oTranslate('ERRORCONTACTSERVER').then(function (error){
                    vex.dialog.alert({
                        message: error,
                    });
                    //alert(error);
                })

            });
        }


        this.getMapFirstLevels = function() {
            return this.m_aoMapFirstLevels;
        }

        this.getMapSecondLevels = function(linkId) {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/maps/'+linkId);
        }

        this.getMapThirdLevel = function(oMapItem) {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/mapsthird/'+oMapItem.linkId);
        }

        this.getSensorFirstLevel = function() {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/sensors');
        }


        this.getStaticLayerLinks = function() {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/statics');
        }

        this.aoCimaSensorsLayer = [{
        "active": false,
        "clickable": true,
        "code": "Pluvio",
        "count": 50,
            "sensorClass":2,
        "description": "OMIRLCONFIG_SENSORPLUVIO",
        "imageLinkInv": "img/sensors/pluviometriInv.png",
        "imageLinkOff": "img/sensors/pluviometriOff.png",
        "imageLinkOn": "img/sensors/pluviometriOn.png",
        "isActive": false,
        "isClickable": true,
        "isVisible": true,
         "linkCode":"cima-sensors",
        "legendLink": "img/sensors/tp01h_pal.png",
        "legends": [
            {
                "clr": "#FEFEFE",
                "lmt": 0.2
            },
            {
                "clr": "#E0EBFF",
                "lmt": 0.5
            },
            {
                "clr": "#B5C9FF",
                "lmt": 1
            },
            {
                "clr": "#8EB2FF",
                "lmt": 2
            },
            {
                "clr": "#7F96FF",
                "lmt": 5
            },
            {
                "clr": "#6370F7",
                "lmt": 10
            },
            {
                "clr": "#009F1E",
                "lmt": 15
            },
            {
                "clr": "#3CBC3D",
                "lmt": 20
            },
            {
                "clr": "#B9F96E",
                "lmt": 25
            },
            {
                "clr": "#FFF914",
                "lmt": 30
            },
            {
                "clr": "#FAC81E",
                "lmt": 35
            },
            {
                "clr": "#EB9628",
                "lmt": 40
            },
            {
                "clr": "#FA3C3C",
                "lmt": 45
            },
            {
                "clr": "#CD005A",
                "lmt": 50
            },
            {
                "clr": "#B400B4",
                "lmt": 60
            },
            {
                "clr": "#9600C8",
                "lmt": 70
            },
            {
                "clr": "#A064DC",
                "lmt": 80
            },
            {
                "clr": "#BE8CC8",
                "lmt": 90
            },
            {
                "clr": "#E1AFC3",
                "lmt": 100
            },
            {
                "clr": "#E1C8BE",
                "lmt": 120
            },
            {
                "clr": "#F0DCE1",
                "lmt": 10000
            }
        ],
        "mesUnit": "mm 1h",
        "visible": true,
        "hasChilds":false,
        "hasSubLevel": false,
        "hasThirdLevel": false,
        "myLevel": 0,
        "selected":false,
        "hasDavisStation":true
    },{
        "active": false,
        "clickable": true,
       "selected":false,
        "code": "Pluvio",
        "count": 50,
            "sensorClass":2,
        "description": "OMIRLCONFIG_SENSORTHERMO",
        "imageLinkInv": "img/sensors/pluviometriInv.png",
        "imageLinkOff": "img/sensors/pluviometriOff.png",
        "imageLinkOn": "img/sensors/pluviometriOn.png",
        "isActive": false,
        "isClickable": true,
        "isVisible": true,
        "legendLink": "img/sensors/tp01h_pal.png",
        "linkCode":"cima-sensors",
        "legends": [
            {
                "clr": "#FEFEFE",
                "lmt": 0.2
            },
            {
                "clr": "#E0EBFF",
                "lmt": 0.5
            },
            {
                "clr": "#B5C9FF",
                "lmt": 1
            },
            {
                "clr": "#8EB2FF",
                "lmt": 2
            },
            {
                "clr": "#7F96FF",
                "lmt": 5
            },
            {
                "clr": "#6370F7",
                "lmt": 10
            },
            {
                "clr": "#009F1E",
                "lmt": 15
            },
            {
                "clr": "#3CBC3D",
                "lmt": 20
            },
            {
                "clr": "#B9F96E",
                "lmt": 25
            },
            {
                "clr": "#FFF914",
                "lmt": 30
            },
            {
                "clr": "#FAC81E",
                "lmt": 35
            },
            {
                "clr": "#EB9628",
                "lmt": 40
            },
            {
                "clr": "#FA3C3C",
                "lmt": 45
            },
            {
                "clr": "#CD005A",
                "lmt": 50
            },
            {
                "clr": "#B400B4",
                "lmt": 60
            },
            {
                "clr": "#9600C8",
                "lmt": 70
            },
            {
                "clr": "#A064DC",
                "lmt": 80
            },
            {
                "clr": "#BE8CC8",
                "lmt": 90
            },
            {
                "clr": "#E1AFC3",
                "lmt": 100
            },
            {
                "clr": "#E1C8BE",
                "lmt": 120
            },
            {
                "clr": "#F0DCE1",
                "lmt": 10000
            }
        ],
        "mesUnit": "mm 1h",
        "visible": true,
        "hasSubLevel": false,
        "myLevel": 0,
        "hasDavisStation":true

    }];

        this.aoCimaImpactLayer= [
                {
                    "category": "forecast",
                    "dataid": "PAI_COMUNEGE",
                    "descr": "Genoa Flooding areas",
                    "hierarchy": "hydro models",
                    "icon": "pericolosità_idraulica_-_gar_2015",
                    "id": 254,
                    "latn": 50,
                    "lats": 30,
                    "lone": 18,
                    "lonw": 6,
                    "metadata": "",
                    "metadataurl": "",
                    "name": "Genoa Flooding areas",
                    "server": {
                        "descr": "Dewetra Data Server at Cima Foundation",
                        "id": 1,
                        "name": "ddscima",
                        "url": "http://dds.cimafoundation.org"
                    },
                    "tags": [
                        {
                            "descr": "Floods, flash floods, debris-flow and landslides",
                            "id": 57,
                            "name": "Floods debris-flow landslides"
                        }
                    ],
                    "thumb": "",
                    "type": {
                        "code": "dynamic",
                        "id": 1,
                        "name": "dynamic"
                    },
                    "visible": true,
                    "hasSubLevel": false,
                    "myLevel": 0,
                    "active": false,
                    "clickable": true,
                    "selected":false,
                    "code": "Pluvio",
                    "count": 50,
                    "sensorClass":2,
                    "description": "PAI_COMUNEGE",
                    "imageLinkInv": "img/map/anywhereInv.png",
                    "imageLinkOff": "img/map/anywhereOff.png",
                    "imageLinkOn": "img/map/anywhereOn.png",
                    "isActive": false,
                    "isClickable": true,
                    "isVisible": true,
                    "legendLink": "img/sensors/tp01h_pal.png",
                    "linkCode":"cima-impact",
                },
                {
                    "category": "forecast",
                    "dataid": "comunege.idro.probabilisticlami",
                    "descr": "Genoa nowcasting-hydro sections",
                    "hierarchy": "hydro models",
                    "icon": "weather_stations",
                    "id": 253,
                    "latn": 46.968887,
                    "lats": 36.733334,
                    "lone": 18.489166,
                    "lonw": 6.68583,
                    "metadata": "",
                    "metadataurl": "",
                    "name": "Genoa nowcasting-hydro sections",
                    "server": {
                        "descr": "Dewetra Data Server at Cima Foundation",
                        "id": 1,
                        "name": "ddscima",
                        "url": "http://dds.cimafoundation.org"
                    },
                    "tags": [
                        {
                            "descr": "Floods, flash floods, debris-flow and landslides",
                            "id": 57,
                            "name": "Floods debris-flow landslides"
                        }
                    ],
                    "thumb": "",
                    "type": {
                        "code": "section_probabilistic_lami",
                        "id": 6,
                        "name": "section probabilistic LAMI"
                    },
                    "visible": true,
                    "hasSubLevel": false,
                    "myLevel": 0,
                    "active": false,
                    "clickable": true,
                    "selected":false,
                    "code": "Pluvio",
                    "count": 50,
                    "sensorClass":2,
                    "description": "Genoa nowcasting-hydro sections",
                    "imageLinkInv": "img/map/anywhereInv.png",
                    "imageLinkOff": "img/map/anywhereOff.png",
                    "imageLinkOn": "img/map/anywhereOn.png",
                    "isActive": false,
                    "isClickable": true,
                    "isVisible": true,
                    "legendLink": "img/sensors/tp01h_pal.png",
                    "linkCode":"cima-impact",
                }
            ];







        this.getStaticLayerOptionList = function() {
            var aoStaticLinks = [
                {

                }
            ];

            return aoStaticLinks;
        }


        this.getFlattedHydro = function()
        {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/flattedhydro');
        }

        this.fetchHydroFirstLevels = function() 
        {
            var oControllerVar = this;

            oControllerVar.m_aoHydroFirstLevels = [];

            this.m_oHttp.get(this.APIURL + '/mapnavigator/hydro').success(function(data,status) {
                
                //******************************************************************
                // Add the flag to indicate the menu link item level and 
                // if the menu link has a sub-level.
                // or not. These parametere should come from server but, at the
                // moment, are initialized here
                for(var key in data)
                {
                    data[key].hasSubLevel = data[key].hasChilds;
                    data[key].myLevel = 0;
                }
                //******************************************************************
                
                
                oControllerVar.m_aoHydroFirstLevels = data;

                // Remember links
                for (var iElement = 0; iElement < data.length; iElement++) {
                    oControllerVar.m_oConstantsService.pushToHydroLinks(data[iElement]);
                }

            }).error(function(data,status){
                alert('Error Contacting Omirl Server');
            });
        }


        this.getHydroFirstLevels = function() {
            return this.m_aoHydroFirstLevels;
        }

        this.getHydroSecondLevels = function(linkCode) {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/hydro/'+linkCode);
        }

        this.getHydroThirdLevel = function(linkCode) {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/hydrothird/'+linkCode);
        }



        this.fetchRadarFirstLevels = function() {
            var oServiceVar = this;

            oServiceVar.m_aoRadarFirstLevels = [];

            this.m_oHttp.get(this.APIURL + '/mapnavigator/radar').success(function(data,status) {
                //******************************************************************
                // Add the flag to indicate the menu link item level and 
                // if the menu link has a sub-level.
                // or not. These parametere should come from server but, at the
                // moment, are initialized here
                for(var key in data)
                {
                    data[key].hasSubLevel = data[key].hasChilds;
                    data[key].myLevel = 0;
                }
                //******************************************************************
                
                oServiceVar.m_aoRadarFirstLevels = data;
            }).error(function(data,status){
                alert('Error Contacting Omirl Server');
            });
        }

        this.getRadarFirstLevels = function() {
            return this.m_aoRadarFirstLevels;
        }

        this.getRadarSecondLevels = function(linkCode) {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/radar/'+linkCode);
        }

        this.getRadarThirdLevel = function(linkCode) {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/radarthird/'+linkCode);
        }



        this.fetchSatelliteFirstLevels = function() {
            var oServiceVar = this;

            oServiceVar.m_aoSatelliteFirstLevels = [];

            this.m_oHttp.get(this.APIURL + '/mapnavigator/satellite').success(function(data,status) {
                
                //******************************************************************
                // Add the flag to indicate the menu link item level and 
                // if the menu link has a sub-level.
                // or not. These parametere should come from server but, at the
                // moment, are initialized here
                for(var key in data)
                {
                    data[key].hasSubLevel = data[key].hasChilds;
                    data[key].myLevel = 0;
                }
                //******************************************************************
                
                oServiceVar.m_aoSatelliteFirstLevels = data;
            }).error(function(data,status){
                alert('Error Contacting Omirl Server');
            });
        }

        this.getSatelliteFirstLevels = function() {
            return this.m_aoSatelliteFirstLevels;
        }

        this.getSatelliteSecondLevels = function(linkCode) {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/satellite/'+linkCode);
        }

        this.getSatelliteThirdLevel = function(linkCode) {
            return this.m_oHttp.get(this.APIURL + '/mapnavigator/satellitethird/'+linkCode);
        }

        this.getCimaSensorsFirstLevels = function () {

            return this.aoCimaSensorsLayer;
        };

        this.getCimaImpactFirstLevels = function () {

            return this.aoCimaImpactLayer;
        };


        this.getFeaturesInfo = function (url) {
            return this.m_oHttp.get(url);
        }

        // TEST Code with hard-coded json
/*


        this.getMapFirstLevelsOLD = function() {
            var aoMapLinks = [
                {
                    "link":"img/rain_drops.png",
                    "linkId":1,
                    "selected": false,
                    "hasThirdLevel": false,
                    "description":"Pioggia",
                    "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                    "legendLink": "img/mapLegend.jpg",
                    "layerID": ""
                },
                {
                    "link":"img/wet.png",
                    "linkId":2,
                    "selected": false,
                    "hasThirdLevel": false,
                    "description":"Umidita' del suolo",
                    "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                    "legendLink": "img/mapLegend.jpg",
                    "layerID": ""
                },
                {
                    "link":"img/thermometer.png",
                    "linkId":3,
                    "selected": false,
                    "hasThirdLevel": false,
                    "description":"Temperatura",
                    "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                    "legendLink": "img/mapLegend.jpg",
                    "layerID": ""
                }
            ];

            return aoMapLinks;
        }

        this.getSensorFirstLevelOLD = function() {
            var aoSensorFirstLevels = [
                {
                    "code": "Pluvio",
                    "description": "Precipitazione",
                    "imageLinkOn": "img/sensors/pluviometriOn.png",
                    "imageLinkOff": "img/sensors/pluviometriOff.png",
                    "imageLinkInv": "img/sensors/pluviometriInv.png",
                    "count": 50,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "mm"
                },
                {
                    "code": "Termo",
                    "description": "Termometri",
                    "imageLinkOn": "img/sensors/temperaturaOn.png",
                    "imageLinkOff": "img/sensors/temperaturaOff.png",
                    "imageLinkInv": "img/sensors/temperaturaInv.png",
                    "count": 43,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "°C"
                },
                {
                    "code": "Idro",
                    "description": "Idrometri",
                    "imageLinkOn": "img/sensors/idrometriOn.png",
                    "imageLinkOff": "img/sensors/idrometriOff.png",
                    "imageLinkInv": "img/sensors/idrometriInv.png",
                    "count": 43,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "m/s"
                },
                {
                    "code": "Vento",
                    "description": "Vento",
                    "imageLinkOn": "img/sensors/ventoOn.png",
                    "imageLinkOff": "img/sensors/ventoOff.png",
                    "imageLinkInv": "img/sensors/ventoInv.png",
                    "count": 43,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "km/h"
                },
                {
                    "code": "Igro",
                    "description": "Umidita' del Suolo",
                    "imageLinkOn": "img/sensors/igrometriOn.png",
                    "imageLinkOff": "img/sensors/igrometriOff.png",
                    "imageLinkInv": "img/sensors/igrometriInv.png",
                    "count": 43,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "%"
                },
                {
                    "code": "Radio",
                    "description": "Radiazione Solare",
                    "imageLinkOn": "img/sensors/radiazioneOn.png",
                    "imageLinkOff": "img/sensors/radiazioneOff.png",
                    "imageLinkInv": "img/sensors/radiazioneInv.png",
                    "count": 43,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "<sup>W</sup>&frasl;<sub>m<sup>2</sup></sub>"
                },
                {
                    "code": "Foglie",
                    "description": "Bagnatura Foliare",
                    "imageLinkOn": "img/sensors/anywhereOn.png",
                    "imageLinkOff": "img/sensors/anywhereOff.png",
                    "imageLinkInv": "img/sensors/anywhereInv.png",
                    "count": 43,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "%"
                },
                {
                    "code": "Press",
                    "description": "Pressione Atmosferica",
                    "imageLinkOn": "img/sensors/pressioneOn.png",
                    "imageLinkOff": "img/sensors/pressioneOff.png",
                    "imageLinkInv": "img/sensors/pressioneInv.png",
                    "count": 43,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "hPa"
                },
                {
                    "code": "Batt",
                    "description": "Tensione Batteria",
                    "imageLinkOn": "img/sensors/batteriaOn.png",
                    "imageLinkOff": "img/sensors/batteriaOff.png",
                    "imageLinkInv": "img/sensors/batteriaInv.png",
                    "count": 43,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "V"
                },
                {
                    "code": "Boa",
                    "description": "Boaondametrica",
                    "imageLinkOn": "img/sensors/boeOn.png",
                    "imageLinkOff": "img/sensors/boeOff.png",
                    "imageLinkInv": "img/sensors/boeInv.png",
                    "count": 43,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "%"
                },
                {
                    "code": "Neve",
                    "description": "Neve",
                    "imageLinkOn": "img/sensors/neveOn.png",
                    "imageLinkOff": "img/sensors/neveOff.png",
                    "imageLinkInv": "img/sensors/neveInv.png",
                    "count": 43,
                    "isActive": false,
                    "legendLink": "img/sensors/sensorsLegend.jpg",
                    "mesUnit": "%"
                }
            ];

            return aoSensorFirstLevels;
        }


        this.getStaticLayerLinksOLD = function() {
            var aoStaticLinks = [
                {
                    "selected": false,
                    "description":"Comuni della Liguria",
                    "layerWMS": "http://geoserver.cimafoundation.org/geoserver/dew/wms",
                    "layerID": "Municipalities_ISTAT12010"
                },
                {
                    "selected": false,
                    "description":"Province della Liguria",
                    "layerWMS": "http://geoserver.cimafoundation.org/geoserver/dew/wms",
                    "layerID": "Districts_ISTAT2010"
                },
                {
                    "selected": false,
                    "description":"Aree Allertamento",
                    "layerWMS": "http://geoserver.cimafoundation.org/geoserver/dew/wms",
                    "layerID": "Zone_di_Allertamento"
                },
                {
                    "selected": false,
                    "description":"Spartiacque della Liguria",
                    "layerWMS": "http://geoserver.cimafoundation.org/geoserver/dew/wms",
                    "layerID": "piccoli_bacini_genova_rev1"
                },
                {
                    "selected": false,
                    "description":"Reticolo Idrografico",
                    "layerWMS": "http://geoserver.cimafoundation.org/geoserver/dew/wms",
                    "layerID": "Reticolo_ISPRA"
                },
                {
                    "selected": false,
                    "description":"Aree Inondabili",
                    "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                    "layerID": ""
                }
            ];

            return aoStaticLinks;
        }


        this.getMapSecondLevelsOLD = function(linkId) {
            if(linkId==1) {
                var aoMapLinks = [
                    {
                        "link":"img/15m.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Pioggia - Ultimi 15'",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "legendLink": "img/mapLegend.jpg",
                        "layerID": "OMIRL:rainfall15m"
                    },
                    {
                        "link":"img/30m.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Pioggia - Ultimi 30'",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "legendLink": "img/mapLegend.jpg",
                        "layerID": "OMIRL:rainfall30m"
                    },
                    {
                        "link":"img/1h.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Pioggia - Ultima Ora",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "legendLink": "img/mapLegend.jpg",
                        "layerID": "OMIRL:rainfall1h"
                    },
                    {
                        "link":"img/3h.png",
                        "linkId":2,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Pioggia - Ultime 3 Ore",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "legendLink": "img/mapLegend.jpg",
                        "layerID": "OMIRL:rainfall3h"
                    },
                    {
                        "link":"img/6h.png",
                        "linkId":3,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Pioggia - Ultime 6 Ore",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "legendLink": "img/mapLegend.jpg",
                        "layerID": "OMIRL:rainfall3h"
                    },
                    {
                        "link":"img/12h.png",
                        "linkId":4,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Pioggia - Ultime 12 Ore",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "legendLink": "img/mapLegend.jpg",
                        "layerID": "OMIRL:rainfall3h"
                    },
                    {
                        "link":"img/24h.png",
                        "linkId":5,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Pioggia - Ultime 24 Ore",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "legendLink": "img/mapLegend.jpg",
                        "layerID": "OMIRL:rainfall24h"
                    },
                    {
                        "link":"img/7d.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Pioggia - Ultimi 7 Giorni",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "legendLink": "img/mapLegend.jpg",
                        "layerID": "OMIRL:rainfall7d"
                    },
                    {
                        "link":"img/15d.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Pioggia - Ultimi 15 Giorni",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "legendLink": "img/mapLegend.jpg",
                        "layerID": "OMIRL:rainfall15d"
                    },
                    {
                        "link":"img/30d.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Pioggia - Ultimi 30 Giorni",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "legendLink": "img/mapLegend.jpg",
                        "layerID": "OMIRL:rainfall30d"
                    }
                ];

                return aoMapLinks;
            }
            else if (linkId == 2) {
                var aoMapLinks = [
                    {
                        "link":"img/wet0.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Umidità del suolo - Stato alle 00:00",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "layerID": "OMIRL:humidity00"
                    },
                    {
                        "link":"img/wet6.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Umidità del suolo - Stato alle 06:00",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "layerID": "OMIRL:humidity06"
                    },
                    {
                        "link":"img/wet12.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Umidità del suolo - Stato alle 12:00",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "layerID": "OMIRL:humidity12"
                    },
                    {
                        "link":"img/wet18.png",
                        "linkId":2,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Umidità del suolo - Stato alle 18:00",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "layerID": "OMIRL:humidity12"
                    },
                    {
                        "link":"img/wetstart.png",
                        "linkId":3,
                        "selected": false,
                        "hasThirdLevel": true,
                        "description":"Umidità del suolo - Condizioni Iniziali",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "layerID": "OMIRL:humidityStart"
                    }
                ];

                return aoMapLinks;
            }
            else if (linkId == 3) {
                var aoMapLinks = [
                    {
                        "link":"img/temp-min.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": false,
                        "description":"Temperatura - Minima",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "layerID": "tempMin"
                    },
                    {
                        "link":"img/temp-avg.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": false,
                        "description":"Temperatura - Media",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "layerID": "tempMean"
                    },
                    {
                        "link":"img/temp-max.png",
                        "linkId":1,
                        "selected": false,
                        "hasThirdLevel": false,
                        "description":"Temperatura - Massima",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "layerID": "tempMax"
                    },
                    {
                        "link":"img/theta.png",
                        "linkId":2,
                        "selected": false,
                        "hasThirdLevel": false,
                        "description":"Temperatura - Theta da Media",
                        "layerWMS": "http://www.nfsproject.com/geoserver/OMIRL/wms",
                        "layerID": "tempTheta"
                    }
                ];

                return aoMapLinks;
            }
        }


        this.getMapThirdLevelOLD = function(oMapItem) {
            var aoMapLinks = [
                {
                    "isDefault": true,
                    "mapItem": oMapItem,
                    "description":"Interpolata",
                    "layerIDModifier": ""
                },
                {
                    "isDefault": false,
                    "mapItem": oMapItem,
                    "description":"Comuni",
                    "layerIDModifier": "Com"
                },
                {
                    "isDefault": false,
                    "mapItem": oMapItem,
                    "description":"Bacini",
                    "layerIDModifier": "Bac"
                },
                {
                    "isDefault": false,
                    "mapItem": oMapItem,
                    "description":"Aree Allertamento",
                    "layerIDModifier": "AA"
                }
            ];

            return aoMapLinks;
        }
*/
    }]);

