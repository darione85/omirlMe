/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';
angular.module('omirl.sidebarMenuDirective', [])
    //directive('omirlHighChart', ['ChartService',  function (oChartService) {
.directive("sidebarMenu", function(){
    return {
        restrict    : 'E',
        templateUrl : "partials/SidebarMenuView.html",
        //controller  : "ModelsGalleryController",
        replace     : true,
        scope       : {
            "id" : "@id",
            "menuTitle" : "@menuTitle",
            "onMainItemClick" : "=onMainItemClick",
            "onSubItemClick" : "=onSubItemClick",
            "menuItemsList" : "=menuLinkItems",
            "submenuItemsListVarName" : "@submenuListVarName",
            "onSubItemUnclick" : "=onSubItemUnclick"
        },
        link: function($scope, elem, attrs)
        {
            $scope.m_sParentText = ""; //$scope.menuTitle;
            $scope.m_sChildText = ""; //$scope.menuTitle;
            
            if( !$scope.submenuItemsListVarName )
                $scope.submenuItemsListVarName = "submenuItems";
/*
            $scope.menuItemsList = [
                {
                    iconSrc : "img/wet.png",
                    description : "Descrizione di test 1"
                },
                {
                    iconSrc : "img/rain_drops.png",
                    description : "Descrizione di test 2",
                    submenuItems : [
                        {
                            iconSrc : "img/15m.png",
                            description : "15 minuti"
                        },
                        {
                            iconSrc : "img/30m.png",
                            description : "30 minuti"
                        }
                    ]
                }
            ];
            */
            
            
            $scope.submenuItems = [];
            
            $scope.activeMenuItem = null;
            $scope.m_bIsSubmenuVisible = false;
            
            
            $scope.isActive = function(menuItem)
            {
               return ($scope.activeMenuItem == menuItem);
            }

            $scope.isSubActive = function(menuItem)
            {
                return ($scope.activeSubItem == menuItem);
            }
            
            
            $scope.mainItemClick = function(item)
            {
                console.debug("mainItemClick:", item);
                
                if( $scope.isActive(item) == true)
                {
                    $scope.m_bIsSubmenuVisible = false;
                    $scope.activeMenuItem = null;
                    
                    $scope.m_sParentText = "";

                    $scope.m_sChildText = "";
                }
                else
                {
                    $scope.activeMenuItem = item;
                    $scope.m_bIsSubmenuVisible = true;
                    
                    $scope.m_sParentText = item.description;

                    $scope.m_sChildText = "";
                    
                    if( item[$scope.submenuItemsListVarName] )
                    {
                        $scope.submenuItems = item[$scope.submenuItemsListVarName];
                    }
                    else
                        item.submenuItems = [];

                    if( typeof $scope.onMainItemClick == "function")
                    {
                        $scope.onMainItemClick(item);
                    }
                }
            }
            
            $scope.submenuItemClick = function(item)
            {

                console.debug("submenuItemClick:", item);

                if( $scope.isSubActive(item) == true)
                {
                    $scope.activeSubItem = null;

                    $scope.m_sParentText = $scope.m_sParentText;

                    $scope.m_sChildText = "";

                    if( typeof $scope.onSubItemUnclick == "function")
                    {
                        $scope.onSubItemUnclick(item);
                    }
                }
                else
                {
                    $scope.activeSubItem = item;

                    $scope.m_sParentText = $scope.m_sParentText;

                    $scope.m_sChildText = item.description;

                    if( typeof $scope.onSubItemClick == "function")
                    {
                        $scope.onSubItemClick(item);
                    }
                }
            }
        }
    }
});


//**************************************************************
//* Legacy version to maintain compatibility with old menu
//**************************************************************
angular.module('omirl.sidebarMenuLegacyDirective', [])
    //directive('omirlHighChart', ['ChartService',  function (oChartService) {
.directive("sidebarMenuLegacy", function(){
    return {
        restrict    : 'E',
        templateUrl : "partials/SidebarMenuLegacyView.html",
        //controller  : "ModelsGalleryController",
        replace     : true,
        scope       : {
            "id" : "@id",
            "controller" : "=controller",
            "menuLegendSelected" : "=menuLegendSelected",
            "menuLegendHover" : "=menuLegendHover",
            "isFirstLevel" : "=isFirstLevel",
            "onMenutItemClick" : "=onMenuItemClick",
            "menuItemsList" : "=menuItemsList",
            "getMenuItems" : "=getMenuItemsMethod",
            "thirdLevelMenuItems" : "=thirdLevelMenuItems",
            "thirdLevelMenuSelection" : "=thirdLevelMenuSelectedItem",
            "thirdLevelMenuClick" : "=thirdLevelMenuClick"
        },
        link: function($scope, elem, attrs)
        {
            $scope.MENU_LEVEL_1 = 0;
            $scope.MENU_LEVEL_2 = 1;
            $scope.MENU_LEVEL_3 = 2;
            
            $scope.m_sParentText = ""; //$scope.menuTitle;
            $scope.m_sChildText = ""; //$scope.menuTitle;
            
//            $scope.menuLegendSelected = $scope.controller.m_sMapLegendSelected;
//            $scope.menuLegendHover = $scope.controller.m_sMapLegendHover;
//            $scope.isFirstLevel = $scope.controller.m_bIsFirstLevel;
//            $scope.onMapLinkClick = $scope.controller.mapLinkClicked;
////            //"menuItemsList" : "=menuLinkItems",
            $scope.getMenuItems = $scope.controller.getMapLinks;
            
            $scope.menuItemsByLevel = [];
            
            
            $scope.thirdLevelComboBox = {
                selection: null,
                options: [],
               };
            
            
            if( !$scope.submenuItemsListVarName )
                $scope.submenuItemsListVarName = "submenuItems";
            
            
            $scope.submenuItems = [];
            
            $scope.activeMenuItem = null;
            $scope.m_bIsSubmenuVisible = false;
            
            $scope.hasMenuItemBeenUpdated = true;
            
            $scope.firstLevelMenuRows = [];
            $scope.menuLevelToUpdate = $scope.MENU_LEVEL_1;
            $scope.secondLevelMenuOpened = -1;
            $scope.isThirdLevelVisible = false;
            
            
            //****************************************************************************************
            //* Directive listeners
            //****************************************************************************************
            $scope.$watch("menuItemsList", function(newValue){               
               $scope.updateMapLinks();
               $scope.hasMenuItemBeenUpdated = true;
            });
            
            $scope.$watch("thirdLevelMenuItems", function(newValue){               
               $scope.updateMapLinks();
               $scope.hasMenuItemBeenUpdated = true;
            });
            
            $scope.$watch(function(){ return $scope.thirdLevelComboBox.selection;}, function(newValue){
                $scope.thirdLevelMenuSelection = $scope.thirdLevelComboBox.selection;
                
                
                if(newValue && $scope.thirdLevelMenuClick && typeof $scope.thirdLevelMenuClick == "function" )
                {
                    var oItem;
                    for(var key in $scope.thirdLevelComboBox.options)
                    {
                        if( $scope.thirdLevelComboBox.options[key].description == $scope.thirdLevelComboBox.selection)
                        {
                            oItem = $scope.thirdLevelComboBox.options[key];
                            break;
                        }
                    }
                    $scope.thirdLevelMenuClick(oItem, $scope.controller);
                }
               
            });
            
            $scope.$watch("thirdLevelMenuSelection", function(newValue){
               $scope.thirdLevelComboBox.selection = $scope.thirdLevelMenuSelection;
            });
            
            
            
            
            
            
            //****************************************************************************************
            //* Directive scope methods
            //****************************************************************************************
            
            $scope.resetThirdLevel = function(bIsVisible)
            {
                $scope.thirdLevelComboBox.selection = null;
                $scope.thirdLevelComboBox.options = [];
                
                if( bIsVisible != null || bIsVisible != undefined && typeof bIsVisible == "boolean")
                    $scope.isThirdLevelVisible = bIsVisible;
            }
            
            $scope.isSelected = function(option)
            {
                return ($scope.thirdLevelComboBox.selection == option.description)
            }
            
            $scope.updateThirdLevelSelection = function()
            {
                for(var key in $scope.menuItemsByLevel[$scope.MENU_LEVEL_3])
                {
                   if( $scope.menuItemsByLevel[$scope.MENU_LEVEL_3][key].description == $scope.thirdLevelMenuSelectedItemDescription)
                   {
                       $scope.thirdLevelMenuSelectedItem = $scope.menuItemsByLevel[$scope.MENU_LEVEL_3][key];
                       return;
                   }
                }
            }
            
            $scope.setThirdLevelSelection = function(oItem)
            {
                if( $scope.thirdLevelMenuSelectedItem)
                    $scope.thirdLevelMenuSelectedItemDescription = $scope.thirdLevelMenuSelectedItem.description;
            }
            
            
            
            
            $scope.isLastLinkOfRow = function(oRow, oMenuLink)
            {
                return oRow.getlastMenuLink().$$hashKey == oMenuLink.$$hashKey;
            }
            
            $scope.isSecondLevelRowOpen = function(iRowId)
            {
                return iRowId == $scope.secondLevelMenuOpened;
            }
            
            $scope.updateFirstLevelMenuRows = function()
            {
                if( !$scope.menuItemsByLevel[0] || $scope.menuItemsByLevel[0].length == 0)
                {
                    return;
                }                
                
                var ITEM_PER_ROW = 3;
                var iCounter = 0;
                var iRowIdToOpen = 0;
                Utils.emptyArray($scope.firstLevelMenuRows);
                
                var iRowCounter = 0;
                var oCurrMenuRow = null;
                for(var key in $scope.menuItemsByLevel[0])
                {
                    if( $scope.firstLevelMenuRows.length == 0)
                    {
                        // Performed only on the first loop
                        $scope.firstLevelMenuRows[iRowCounter] = new MenuRowFirstLevel(false, iRowIdToOpen);
                    }
                    
                    // If the max item per row has been reached
                    // then add a new row which is the container for
                    // the second level menu items
                    if( iCounter == ITEM_PER_ROW)
                    {
                        // Add a row which represent the 'second level container'
                        var oContainerId = iRowIdToOpen;
                        iRowCounter++;
                        $scope.firstLevelMenuRows[iRowCounter] = new MenuRowFirstLevel(true, oContainerId);
                        
                        iCounter = 0;
                        iRowIdToOpen++;
                        
                        // then create new row
                        iRowCounter++;
                        $scope.firstLevelMenuRows[iRowCounter] = new MenuRowFirstLevel(false, iRowIdToOpen);
                    }
                    
                    $scope.firstLevelMenuRows[iRowCounter].addMenuLink($scope.menuItemsByLevel[0][key]);
                    
                    iCounter++;
                }
                
                // Add a final 'second level wrapper'
                var oContainerId = iRowIdToOpen;
                iRowCounter++;
                $scope.firstLevelMenuRows[iRowCounter] = new MenuRowFirstLevel(true, oContainerId);
                
            }
            
            
            $scope.initMenuLinks = function()
            {
                if( $scope.getMenuItems && typeof $scope.getMenuItems == "function")
                    $scope.getMenuItems();
            }
            
            $scope.updateMapLinks = function()
            {
                $scope.hasMenuItemBeenUpdated = false;
                if( $scope.menuLevelToUpdate == $scope.MENU_LEVEL_1)
                {
                    $scope.menuItemsByLevel[$scope.MENU_LEVEL_1] = $scope.menuItemsList;
                    //$scope.menuItemsByLevel[0].push( {});
                    
                    $scope.updateFirstLevelMenuRows();
                    
                    $scope.m_sParentText = $scope.menuLegendSelected;
                    
                }
                else if( $scope.menuLevelToUpdate == $scope.MENU_LEVEL_2)
                {
                    $scope.menuItemsByLevel[$scope.MENU_LEVEL_2] = $scope.menuItemsList;
                    $scope.m_sChildText = $scope.menuLegendSelected;
                }
                else if( $scope.menuLevelToUpdate == $scope.MENU_LEVEL_3)
                {
                    $scope.menuItemsByLevel[$scope.MENU_LEVEL_3] = $scope.thirdLevelMenuItems;
                    $scope.thirdLevelComboBox.options = $scope.menuItemsByLevel[$scope.MENU_LEVEL_3];
                }
            }
            
            
            $scope.isActive = function(menuItem)
            {
               return ($scope.activeMenuItem == menuItem);
            }

            $scope.isSubActive = function(menuItem)
            {
                return ($scope.activeSubItem == menuItem);
            }
            
            
            $scope.mainItemClick = function(oMenuLink, iSecondLevelRowIdToOpen)
            {
                console.debug("mainItemClick:", oMenuLink);
                
                $scope.isFirstLevel = true;
                $scope.controller.m_bIsFirstLevel = $scope.isFirstLevel;
                
                if( $scope.isActive(oMenuLink) == true)
                {
                    // Item already selected
                    $scope.secondLevelMenuOpened = -1;
                    $scope.m_bIsSubmenuVisible = false;
                    $scope.activeMenuItem = null;
                    
                    $scope.m_sParentText = "";
                    $scope.m_sChildText = "";
                }
                else
                {
                    // Item not selected
                    $scope.secondLevelMenuOpened = iSecondLevelRowIdToOpen;
                    $scope.activeMenuItem = oMenuLink;
                    $scope.m_bIsSubmenuVisible = true;
                    
                    $scope.m_sParentText = oMenuLink.description;
                    $scope.m_sChildText = "";
                    
                    if( oMenuLink[$scope.submenuItemsListVarName] )
                    {
                        $scope.submenuItems = oMenuLink[$scope.submenuItemsListVarName];
                    }
                    else
                        oMenuLink.submenuItems = [];
                }
                
                // reset 3rd level and make it not visible
                $scope.resetThirdLevel(false);
                
                $scope.menuLevelToUpdate = $scope.MENU_LEVEL_2;
                
                // Execute the external 'on click' method 
                if( typeof $scope.onMenutItemClick == "function")
                {
                    //$scope.hasMenuItemBeenUpdated = false;
                    $scope.onMenutItemClick(oMenuLink, $scope.controller);
                    
                    //oMenuLink.selected = $scope.isSubActive(oMenuLink);
                }
            }
            
            $scope.submenuItemClick = function(item)
            {
                console.debug("submenuItemClick:", item);
                
                $scope.isFirstLevel = false;

                if( $scope.isSubActive(item) == true)
                {
                    $scope.activeSubItem = null;

                    $scope.m_sParentText = $scope.m_sParentText;
                    $scope.m_sChildText = "";
                    
                    // reset 3rd level and make it not visible
                    $scope.resetThirdLevel(false);
                }
                else
                {
                    $scope.activeSubItem = item;

                    $scope.m_sParentText = $scope.m_sParentText;

                    $scope.m_sChildText = item.description;

                    $scope.isThirdLevelVisible = item.hasThirdLevel;
                }
                
                $scope.menuLevelToUpdate = $scope.MENU_LEVEL_3;
                
                // Execute the external 'on click' method 
                if( typeof $scope.onMenutItemClick == "function")
                {
                    $scope.onMenutItemClick(item, $scope.controller);
                    
                    item.selected = $scope.isSubActive(item);
                }
            }
            
            
            // Initialize
            $scope.updateMapLinks();
            
//            if( $scope.controller )
//            {
//                if( methodName && typeof methodName == "string")
//                {
//                    var methodName = "getMapThirdLevels";//$scope.getThirdLevelMenuItemsMethodName;
//                    methodName = methodName.replace("()", "");
//                    methodName = methodName.split(".");
//                    methodName = methodName[ methodName.length - 1];
//
//                    if( typeof methodName == "function")
//                        $scope.getThirdLevelMenuItems = $scope.controller[methodName];
//                    else
//                        $scope.getThirdLevelMenuItems = function(){};
//                }
//                else
//                    $scope.getThirdLevelMenuItems = function(){};
//            }
        }
    }
});
