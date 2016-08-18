(function () {
    'use strict';
    angular.module('inflight.destination.ticketmaster')
        .controller('TicketmasterArtistController', TicketmasterArtistController);


    TicketmasterArtistController.$inject = ['$stateParams', 'AngularyticsLoggerHandler', '$sessionStorage'];
    function TicketmasterArtistController($stateParams, AngularyticsLoggerHandler, $sessionStorage) {
        var vm = this;

        onInit();
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~
            Method Declaration
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        function onInit() {
            if (!$stateParams.currentEvent) {
                $stateParams.currentEvent = $sessionStorage.event;
            }
            
            vm.currentEvent = $stateParams.currentEvent;
            AngularyticsLoggerHandler.trackEventback('Ticketmaster', "See Artist", vm.currentEvent.name); //log data...
        }

        
    }

})();
