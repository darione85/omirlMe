/**
 * Created by p.campanella on 29/05/2015.
 */

'use strict';
angular.module('omirl.MapLayerService', ['omirl.ConstantsService']).
    service('MapLayerService', ['$http',  'ConstantsService', '$location', function ($http, oConstantsService, oLocation) {
        this.APIURL = oConstantsService.getAPIURL();


        this.m_oHttp = $http;
        this.m_oLocation = oLocation;

        this.getLayerId = function(sCode, sModifier) {
            return this.m_oHttp.get(this.APIURL + '/maps/layer/'+sCode+'/'+sModifier);
        }

        this.getLayerProperties =  function (layer) {

            return this.m_oHttp.get(oConstantsService.buildDDSURL('ddsmap/' + layer.server.id + '/' + layer.dataid + '/properties/'),);
        }

        //     return this.m_oHttp.get(oConstantsService.buildDDSURL('ddsmap/' + layer.server.id + '/' + layer.dataid + '/properties/'))
        // }

        this.getLayerAvailability =  function (layer, props,from,to) {

            var obj = {
                props: props,
                from: from,
                to: to
            };

            return this.m_oHttp({
                method:"POST",
                url:oConstantsService.buildDDSURL('ddsmap/' + layer.server.id + '/availability/'),
                // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                headers: {'Content-Type': 'application/json'},
                // transformRequest: function(obj) {
                //     var str = [];
                //     for(var p in obj)
                //         str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                //     return str.join("&");
                // },
                data: obj
            });

            // return this.m_oHttp.post(oConstantsService.buildDDSURL('ddsmap/' + layer.server.id + '/availability/'), obj)
        }

        this.publishLayer =  function (layer) {

            if(oConstantsService.getReferenceDate() != ""){
                var to = moment.utc(oConstantsService.getReferenceDate(),'DD/MM/YYYY HH:mm').valueOf()/1000;
                var from =moment.utc(oConstantsService.getReferenceDate(),'DD/MM/YYYY HH:mm').subtract(24,"hours").valueOf()/1000
            }else {
                var to = moment.utc(new Date()).valueOf()/1000;
                var from =moment.utc(new Date()).subtract(24,"hours").valueOf()/1000
            }

            var obj = {
                layer: layer.id,
                from: from,
                to: to
            };

            return this.m_oHttp.post(oConstantsService.buildDDSURL('ddsmap/layer/'), obj)
        }

        this.rePublishLayer =  function (layer, props, from, to, item) {

            var modProperties = angular.copy(props);
            if(modProperties.layerProperties.attributes && modProperties.layerProperties.attributes.length >0){
                modProperties.layerProperties.attributes.forEach(function (prop) {
                    if(prop.hasOwnProperty("visible")){
                        delete prop.visible;
                    }
                })
            }

            var obj = {
                props: modProperties,
                data: item,
                from: from,
                to: to
            };

            return this.m_oHttp.post(oConstantsService.buildDDSURL('ddsmap/' + layer.server.id + '/publish/'), obj)
        };

        this.getDDSLayerData= function (layer) {

            return this.m_oHttp.get(oConstantsService.buildDDSURL('ddsserie/' + layer.server.id + '/' + layer.dataid.split('.').join('__') + '/properties/'))
        };

        this.getFloodProofLayer = function (server, serieId ) {

            if(oConstantsService.getReferenceDate() != ""){
                var to = moment.utc(oConstantsService.getReferenceDate(),'DD/MM/YYYY HH:mm').valueOf()/1000;
            }else {
                var to = moment.utc(new Date()).valueOf()/1000;
            }
            to = Math.ceil(to);

            return this.m_oHttp.get(oConstantsService.buildDDSURL('floodproof/layer/'+server+'/' + serieId + '/' + to + '/'))


        }



    }]);