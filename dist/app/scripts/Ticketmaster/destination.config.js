(function () {
    'use strict';
    angular.module('inflight.destination', [
        'inflight.destination.ticketmaster'
//        'inflight.destination.cityhook',
//        'inflight.destination.cityguide',
//        // 'likewhere.destinations',
//        // 'inflight.destination.livingsocial',
//        'inflight.destination.groupon',
//        'inflight.destination.hotel',
//        'inflight.destination.car',
//        'inflight.destination.advertisement',
//        'inflight.destination.information'
    ])
        .config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('destination', {
            url: '/destination',
            abstract: true,
            views: {
                'main': {
                    template: '<ion-nav-view></ion-nav-view>'
                }
            }
        })
    }
})();