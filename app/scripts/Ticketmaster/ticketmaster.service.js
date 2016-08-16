(function () {
    'use strict';
    angular.module('inflight.destination.ticketmaster')
        .factory('TicketmasterAPI', TicketmasterAPI);


    TicketmasterAPI.$inject = ['$http', '$q', 'appConfig'];
    function TicketmasterAPI($http, $q, appConfig) {
        var service = this,
            endpoint = appConfig.getAPIURL() + "api/ticketmaster",
            city = new City();

        service.cities = city.getCities();
        service.currentCity = service.cities[0];
        service.events = [];
        service.networkError = false;
        service.popularEvents = [];
        service.start = 0;
        service.dateToEvents = {};
        service.eventDates = [];
        service.selectedDate = 0;
        service.selectedName = "";
        service.eventDetail = {};
        service.prices = [];
        service.venue = {};

        service.get = get;
        service.getEvents = getEvents;
        service.createDateToEvents = createDateToEvents;
        service.loadPopularEvents = loadPopularEvents;
        service.loadEvents = loadEvents;
        service.loadMoreEvents = loadMoreEvents;
        service.loadEventDetail = loadEventDetail;
        service.loadEventPrices = loadEventPrices;
        service.loadEventVenue = loadEventVenue;
        service.searchEventsByName = searchEventsByName;
        service.getVenueDetail = getVenueDetail;
        service.getPrices = getPrices;
        service.getEventsWithUpdate = getEventsWithUpdate;
        service.getPopularEvents = getPopularEvents;
        service.getEventDetail = getEventDetail;
        service.getCountries = getCountries;service.getCitiesByCountry = getCitiesByCountry;
        service.getCities = getCities;

        onInit();

        return service;

        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~
         Method Declaration
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        function onInit() {
            service.loadPopularEvents();
            service.loadEvents();
        }


        function get(api, params) {
            service.networkError = false;
            var deferred = $q.defer();
            params.offline = appConfig.useOfflineServices();
            $http({
                url: endpoint + api,
                method: "GET",
                params: params
            })
                .then(function (data) {
                    deferred.resolve(data.data);
                }, function (data) {
                    service.networkError = true;
                    deferred.reject(data.status);
                });
            return deferred.promise;
        }

        function getEvents(params) {
            return service.get('/events', params);
        }

        function getCountries() {
            return service.get('/countries', {});
        }

        function getCitiesByCountry(countryId) {
            return service.get('/cities/' + countryId, {});
        }

        function getCities(countryId) {
            service.getCitiesByCountry(countryId).then(function (cities) {
                service.cities = cities;
                service.currentCity = cities[0];
                service.loadDeals();
            }, function (reason) {
                console.log('Failed getting cities: ' + reason);
            });
        }

        function getEventDetail(event) {
            var params = {
                domain_id: event.domain_id
            };
            return service.get('/event/' + event.id, params);
        }

        function getPopularEvents(useDate) {
            var params = {
                rows: 20,
                city_ids: service.currentCity.id,
                sort_by: 'popularity'
            };
            if (useDate) {
                params.eventdate_from = moment(service.selectedDate).format('YYYY-MM-DDT00:00:00') + 'Z';
                // params.eventdate_to = moment(service.selectedDate).format('YYYY-MM-DDT23:59:59') + 'Z';
            }
            return service.get('/events', params);
        }

        function getEventsWithUpdate(update, useDate, useName) {
            var params = {
                start: service.start,
                rows: 10,
                city_ids: service.currentCity.id,
                sort_by: "eventdate",
                order: "asc"
            };
            if (useDate) {
                params.eventdate_from = moment(service.selectedDate).format('YYYY-MM-DDT00:00:00') + 'Z';
                // params.eventdate_to = moment(service.selectedDate).format('YYYY-MM-DDT23:59:59') + 'Z';
            }
            if (useName && appConfig.useOfflineServices() === 1) {
                params.search = service.selectedName;
            } else if (useName) {
                params.event_name = service.selectedName;
            }
            service.getEvents(params).then(function (events) {
                    if (update) {
                        service.events = service.events.concat(events.events);
                    } else {
                        service.events = events.events;
                    }
                    service.createDateToEvents(events.events);
                },
                function (reason) {
                    console.log('Failed getting events: ' + reason);
                });
        }

        function getPrices(event) {
            var params = {
                domain_id: event.domain_id
            };
            return service.get('/event/' + event.id + '/prices', params);
        }

        function getVenueDetail(event) {
            var params = {
                domain_id: event.domain_id
            };
            return service.get('/venues/' + event.venue.id, params);
        }

        function createDateToEvents(events) {
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                if (event.localeventdate === undefined) {
                    continue;
                }
                var key = moment(event.localeventdate).format("dddd, MMMM Do YYYY");
                if (service.dateToEvents[key] === undefined) {
                    service.dateToEvents[key] = [event];
                } else {
                    service.dateToEvents[key] = service.dateToEvents[key].concat(event);
                }
            }
            service.eventDates = Object.keys(service.dateToEvents);
        }

        function loadPopularEvents(useDate) {
            service.getPopularEvents(useDate).then(function (events) {
                service.popularEvents = events.events;
            }, function (reason) {
                console.log('Failed getting popular events: ' + reason);
            });
        }

        function loadEvents(useDate) {
            service.dateToEvents = {};
            service.eventDates = [];
            service.getEventsWithUpdate(false, useDate, false);
        }

        function loadMoreEvents(useDate, useName) {
            service.getEventsWithUpdate(true, useDate, useName);
        }

        function loadEventDetail(event) {
            service.getEventDetail(event).then(function (eventDetail) {
                service.eventDetail = eventDetail;
            }, function (reason) {
                console.log('Failed getting event detail: ' + reason);
            });
        }

        function loadEventPrices(event) {
            return service.getPrices(event).then(function (prices) {
                service.prices = prices.event.price_types;
            }, function (reason) {
                console.log('Failed getting event prices: ' + reason);
            });
        }

        function loadEventVenue(event) {
            service.getVenueDetail(event).then(function (venue) {
                service.venue = venue;
            }, function (reason) {
                console.log('Failed getting event venue: ' + reason);
            });
        }

        function searchEventsByName(useName) {
            service.dateToEvents = {};
            service.eventDates = [];
            service.getEventsWithUpdate(false, false, true);
        }
    }

    function City() {

        this.cities = [{
            "id": 90988,
            "name": "London",
            "region_id": 45000,
            "country_id": 826
        }, {
            "id": 30003,
            "name": "Amsterdam",
            "region_id": 30007,
            "country_id": 528
        }, {
            "id": 60000,
            "name": "Berlin",
            "region_id": 60000,
            "country_id": 276
        }, {
            "id": 60055,
            "name": "Düsseldorf",
            "region_id": 60003,
            "country_id": 276
        }];

        this.getCities = function () {
            return this.cities;
        };
    }
})();
