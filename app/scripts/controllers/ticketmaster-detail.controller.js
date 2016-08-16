(function () {
    'use strict';
    angular.module('inflight.destination.ticketmaster')
        .controller('TicketmasterDetailController', TicketmasterDetailController);


    TicketmasterDetailController.$inject = ['$scope', '$stateParams', 'TicketmasterAPI', 'AngularyticsLoggerHandler', '$sessionStorage'];
    function TicketmasterDetailController($scope, $stateParams, TicketmasterAPI, AngularyticsLoggerHandler, $sessionStorage) {
        var vm = this;

        vm.findTicket = findTicket;

        onInit();

        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~
         Method Declaration
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        //save to session, or get value from session

        function onInit() {
            if (angular.isUndefined($stateParams.currentEvent) || !$stateParams.currentEvent) {
                if (!angular.isUndefined($sessionStorage.event)) {
                    $stateParams.currentEvent = $sessionStorage.event;
                }
            } else {
                $sessionStorage.event = $stateParams.currentEvent;
            }
            startWatchingModel();
            TicketmasterAPI.loadEventDetail($stateParams.currentEvent);
        }

        function startWatchingModel() {
            $scope.$watch(function () {
                return TicketmasterAPI.eventDetail;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.currentEvent = newVal;
                }
            });
        }


        function findTicket() {
            AngularyticsLoggerHandler.trackEventback('Ticketmaster', "Ticket Found", $stateParams.currentEvent);
        }

    }


})();
