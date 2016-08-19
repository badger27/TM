(function () {
    'use strict';
    angular.module('inflight.destination.ticketmaster', ['ion-affix'])
        .config(config);


    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('destination.ticketmaster', {
                url: '/ticketmaster',
                views: {
                    '@destination': {
                        controller: 'TicketmasterController',
                        controllerAs: 'ticketmasterCtrl',
                        templateUrl: 'components/destination/ticketmaster/ticketmaster.html'
                    }
                }
            })
            .state('destination.ticketmaster.detail', {
                url: '/detail',
                views: {
                    '@destination': {
                        controller: 'TicketmasterDetailController',
                        controllerAs: 'ticketmasterDetailCtrl',
                        templateUrl: 'components/destination/ticketmaster/ticketmaster-detail.html'
                    }
                },
                params: {
                    currentEvent: null
                }
            })
            .state('destination.ticketmaster.detail.artist', {
                url: '/artist',
                views: {
                    '@destination': {
                        controller: 'TicketmasterArtistController',
                        controllerAs: 'ticketmasterArtistCtrl',
                        templateUrl: 'components/destination/ticketmaster/ticketmaster-artist.html'
                    }
                },
                params: {
                    currentEvent: null
                }
            })
            .state('destination.ticketmaster.detail.ticket', {
                url: '/ticket',
                views: {
                    '@destination': {
                        controller: 'TicketmasterTicketController',
                        controllerAs: 'ticketmasterTicketCtrl',
                        templateUrl: 'components/destination/ticketmaster/ticketmaster-ticket.html'
                    }
                },
                params: {
                    currentEvent: null
                }
            })
            .state('destination.ticketmaster.detail.venue', {
                url: '/venue',
                views: {
                    '@destination': {
                        controller: 'TicketmasterVenueController',
                        controllerAs: 'ticketmasterVenueCtrl',
                        templateUrl: 'components/destination/ticketmaster/ticketmaster-venue.html'
                    }
                },
                params: {
                    currentEvent: null
                }
            });
    }
})();
