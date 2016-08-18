(function () {
    'use strict';
    angular.module('inflight.destination.ticketmaster')
        .controller('TicketmasterTicketController', TicketmasterTicketController);

    TicketmasterTicketController.$inject = ['$scope', '$state', '$stateParams', '$sce', '$ionicPopup', 'TicketmasterAPI', 'AngularyticsLoggerHandler', '$ionicHistory', 'appConfig', '$sessionStorage'];
    function TicketmasterTicketController($scope, $state, $stateParams, $sce, $ionicPopup, TicketmasterAPI, AngularyticsLoggerHandler, $ionicHistory, appConfig, $sessionStorage) {

        var vm = this;

        vm.internetConnection = appConfig.getServerName() != 'KONTRON' && appConfig.getServerName() != 'WICASTR';
        startWatchingModel();

        if (!$stateParams.currentEvent) {
            $stateParams.currentEvent = $sessionStorage.event;
        }
        vm.currentEvent = $stateParams.currentEvent;
        vm.prices = TicketmasterAPI.prices;
        vm.descriptionHtml = $sce.trustAsHtml($stateParams.currentEvent.description);

        vm.getCurrencyString = getCurrencyString;
        vm.purchase = purchase;


        onInit();
        /* ~~~~~~~~~~~~~~~~~~~~~~~~~~~
         Method Declaration
         ~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        function onInit() {
            TicketmasterAPI.loadEventPrices($stateParams.currentEvent);
        }

        function startWatchingModel() {
            $scope.$watch(function () {
                return TicketmasterAPI.prices;
            }, function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    vm.prices = newVal;
                }
            });
        }


        function getCurrencyString(item) {
            if (item.currency === 'USD' || item.currency === 'NZD' || item.currency === 'AUD') {
                return '$';
            } else if (item.currency === 'EUR') {
                return '€';
            } else if (item.currency === 'GBP') {
                return '£';
            }
        };

        function purchase() {
            AngularyticsLoggerHandler.trackEventback('Ticketmaster', "Purchasing Ticket", $stateParams.currentEvent); //log data...
            if (vm.internetConnection) {
                window.open($stateParams.currentEvent.url, '_blank');
                return;
            }
            var payPopup = $ionicPopup.confirm({
                title: "Enter Credit Card Details",
                templateUrl: 'components/common/pay/pay.html',
                cancelText: 'Cancel',
                okText: 'Pay with credit card '
            });
            payPopup.then(function (res) {
                payPopup.close();
                var alertPopup = $ionicPopup.alert({
                    title: 'Passbook',
                    buttons: [{
                        text: 'OK',
                        onTap: function (e) {
                            $ionicHistory.goBack(-2);
                            $state.go('destination.ticketmaster');
                            alertPopup.close();
                        }
                    }],
                    templateUrl: 'components/common/alerts/alertpassdeals.tpl.html'
                });

            });
        };
    }


})();
