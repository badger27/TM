(function () {
    'use strict';
    angular.module('inflight.destination.ticketmaster')
        .controller('TicketmasterController', TicketmasterController);

    TicketmasterController.$inject = ['$scope', '$rootScope', '$ionicPopup', 'TicketmasterAPI', '$ionicPopover', 'appConfig', 'AngularyticsLoggerHandler'];
    function TicketmasterController($scope, $rootScope, $ionicPopup, TicketmasterAPI, $ionicPopover, appConfig, AngularyticsLoggerHandler) {
        var vm = this,
            searchSuggestion;

        vm.continueInfiniteLoad = true;
        vm.cities = TicketmasterAPI.cities;
        vm.dateToEvents = TicketmasterAPI.dateToEvents;
        vm.popularEvents = TicketmasterAPI.popularEvents;
        vm.eventDates = TicketmasterAPI.eventDates;
        vm.events = TicketmasterAPI.events;
        vm.currentCity = TicketmasterAPI.currentCity;
        vm.filterDate = false;
        vm.useName = false;
        vm.datePicker = {
            date: new Date()
        };

        vm.openDatePicker = openDatePicker;
        vm.applySearchFilter = applySearchFilter;
        vm.ticketDetail = ticketDetail;
        vm.loadMoreEvents = loadMoreEvents;
        vm.showCityPopover = showCityPopover;
        vm.showSubCategoryPopover = showSubCategoryPopover;
        vm.showCountryPopover = showCountryPopover;
        vm.showCityPopover = showCityPopover;


        onInit();
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~
         Method Declaration
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        function onInit() {
             searchSuggestion = new Bloodhound({
                datumTokenizer: function (d) {
                    return Bloodhound.tokenizers.whitespace(d.name);
                },
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                remote: {
                    url: appConfig.getAPIURL() + 'api/ticketmaster/events?event_name=%QUERY&rows=5&offline=' + $rootScope.USE_OFFLINE_SERVICES + '&city_ids=' + vm.currentCity.id,
                    wildcard: '%QUERY',
                    transform: function (response) {
                        return response.events;
                    }
                }
            });

            //Generate popover
            $ionicPopover.fromTemplateUrl('components/destination/ticketmaster/ticketmaster-popover.html', {
                scope: $scope
            }).then(function (popover) {
                vm.popover = popover;
            });


        }

        function openDatePicker() {
            var datePopup = $ionicPopup.show({
                template: '<datetimepicker data-datetimepicker-config="{ startView:\'day\', minView:\'day\' }" data-ng-model="datePicker.date" data-on-set-time="onTimeSet(newDate, oldDate)"></datetimepicker>',
                title: "Select",
                scope: $scope,
                buttons: [{
                    text: 'Cancel'
                }, {
                    text: '<b>Filter</b>',
                    type: 'button-positive',
                    onTap: function (e) {
                        vm.filterDate = true;
                        vm.useName = false;
                        TicketmasterAPI.selectedDate = vm.datePicker.date;
                        vm.events = [];
                        vm.eventDates = [];
                        vm.dateToEvents = {};
                        vm.continueInfiniteLoad = false;
                        vm.popularEvents = [];
                        TicketmasterAPI.start = 0;
                        TicketmasterAPI.loadEvents(vm.filterDate);
                        TicketmasterAPI.loadPopularEvents(vm.filterDate);

                        AngularyticsLoggerHandler.trackEventback("Ticketmaster", "Date Picker Opened", vm.datePicker.date); // log data...
                    }
                }]
            });
        }

        startWatchingModel();

        //Exposed function to HTML

        function applySearchFilter() {
            var query = document.getElementById("typeahead").value;
            if (query === "") {
                prepareUpdate();
                TicketmasterAPI.loadEvents(false);
                TicketmasterAPI.loadPopularEvents(false);
            } else {
                AngularyticsLoggerHandler.trackEventback('Ticketmaster', "Search Filter Applied", query); //log data...
                vm.filterDate = false;
                vm.useName = true;
                vm.popover.hide();
                vm.events = [];
                vm.eventDates = [];
                vm.dateToEvents = {};
                vm.continueInfiniteLoad = false;
                TicketmasterAPI.start = 0;
                TicketmasterAPI.selectedName = query;
                TicketmasterAPI.searchEventsByName(vm.useName);
            }
        }

        function showCityPopover(event) {
            vm.popoverTitle = 'Choose city';
            vm.dataToUse = vm.cities;
            vm.callbackToUse = onCityChanged;
            vm.popover.show(event);
        }

        function showSubCategoryPopover(event) {
            vm.popoverTitle = 'Choose subcategory';
            vm.dataToUse = vm.subcategories;
            vm.callbackToUse = onSubCategoryChanged;
            vm.popover.show(event);
        };

        function showCountryPopover(event) {
            vm.popoverTitle = 'Choose country';
            vm.dataToUse = vm.countries;
            vm.callbackToUse = onCountryChanged;
            vm.popover.show(event);
        }

        function loadMoreEvents() {
            TicketmasterAPI.start += 10;
            TicketmasterAPI.loadMoreEvents(vm.filterDate, vm.useName);
        }

        $rootScope.dateFormat = function (dateString) {
            return moment(dateString).format("dddd, MMMM Do YYYY");
        };

        function startWatchingModel() {
            $scope.$watch(function () {
                return TicketmasterAPI.currentCity;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.currentCity = newVal;
                }
            });

            $scope.$watch(function () {
                return TicketmasterAPI.eventDates;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.eventDates = newVal;
                }
            });

            $scope.$watch(function () {
                return TicketmasterAPI.popularEvents;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.popularEvents = newVal;
                }
            });

            vm.alertShowed = false;
            $scope.$watch(function () {
                return TicketmasterAPI.events;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    if (vm.events.length == newVal.length) {
                        vm.continueInfiniteLoad = false;
                        if (newVal.length === 0) {
                            if (!vm.alertShowed) {
                                vm.alertShowed = true;
                                var alertPopup = $ionicPopup.alert({
                                    title: 'Ticketmaster',
                                    template: 'No events found'
                                });
                                alertPopup.then(function (res) {
                                    vm.alertShowed = false;
                                });
                            }

                        }
                    } else {
                        vm.events = newVal;
                        vm.continueInfiniteLoad = true;
                        $rootScope.$broadcast('scroll.infiniteScrollComplete');
                    }
                }
            });

            $scope.$watch(function () {
                return TicketmasterAPI.dateToEvents;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.dateToEvents = newVal;
                }
            });

            $scope.$watch(function () {
                return TicketmasterAPI.cities;
            }, function (newVal, oldVal) {
                vm.cities = newVal;
            });

            $scope.$watch(function () {
                return TicketmasterAPI.networkError;
            }, function (newVal, oldVal) {
                if (newVal === true) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Ticketmaster',
                        template: 'Error connecting to the network. Try again.'
                    });
                    vm.continueInfiniteLoad = false;
                }
            });
        }

        function prepareUpdate() {
            vm.filterDate = false;
            vm.useName = false;
            vm.popover.hide();
            vm.events = [];
            vm.eventDates = [];
            vm.dateToEvents = {};
            vm.popularEvents = [];
            vm.continueInfiniteLoad = false;
            TicketmasterAPI.start = 0;
        }

        function onCityChanged(city) {
            AngularyticsLoggerHandler.trackEventback("Ticketmaster", "City Selected", city);
            TicketmasterAPI.currentCity = city;
            prepareUpdate();
            TicketmasterAPI.loadEvents(false);
            TicketmasterAPI.loadPopularEvents(false);
            configureTypeAhead(city);
        }




        function configureTypeAhead(city) {
            searchSuggestion.remote.url = appConfig.getAPIURL() + 'api/ticketmaster/events?event_name=%QUERY&rows=5&offline=' + $rootScope.USE_OFFLINE_SERVICES + '&city_ids=' + city.id;
        }

        // FIXME: component/directive
        $('.typeahead').typeahead(null, {
            name: 'search-suggestion',
            display: function (suggestion) {
                return suggestion.name;
            },
            source: searchSuggestion
        });

        $('.typeahead').bind('typeahead:select', function (ev, suggestion) {
            vm.applySearchFilter();
        });

        function ticketDetail(id) {
            AngularyticsLoggerHandler.trackEventback('Ticketmaster', "Ticket Chosen", id);
        }
    }

})();
