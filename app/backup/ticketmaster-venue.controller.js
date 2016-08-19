(function () {
    'use strict';
    angular.module('inflight.destination.ticketmaster')
        .controller('TicketmasterVenueController', TicketmasterVenueController);

    TicketmasterVenueController.$inject = ['$scope', '$stateParams', '$sce', 'TicketmasterAPI', 'AngularyticsLoggerHandler', '$sessionStorage'];
    function TicketmasterVenueController($scope, $stateParams, $sce, TicketmasterAPI, AngularyticsLoggerHandler, $sessionStorage) {
        var vm = this;

        if (!$stateParams.currentEvent) {
            $stateParams.currentEvent = JSON.parse($sessionStorage.event);
        }
        vm.venue = TicketmasterAPI.venue;
        vm.currentEvent = $stateParams.currentEvent;
        vm.descriptionHtml = $sce.trustAsHtml($stateParams.currentEvent.description);

        onInit();
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~
            Method Declaration
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        function onInit() {


            startWatchingModel();
            TicketmasterAPI.loadEventVenue($stateParams.currentEvent);
            AngularyticsLoggerHandler.trackEventback('Ticketmaster', "See Venue", $stateParams.currentEvent); //log data...
        }

        function startWatchingModel() {
            $scope.$watch(function () {
                return TicketmasterAPI.venue;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.venue = newVal;
                }
            });
        }


    }

})();
