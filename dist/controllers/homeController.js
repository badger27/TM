'use strict';

/**
 * @ngdoc function
 * @name IonicGulpSeed.controller:HomeController
 * @description
 * # HomeController
 */

  tm.controller('HomeController', function($scope, $firebaseArray, ExampleService, FIREBASE_URL) {
        
     
       
//       var ref = new Firebase("https://ticketmaster-5f33e.firebaseio.com");

        $scope.myHTML = null;


         $scope.test = "test";

        $scope.fetchRandomText = function() {
            ExampleService.doSomethingAsync()
                .then(ExampleService.fetchSomethingFromServer)
                .then(function(response) {
                    $scope.myHTML = response.data.text;
                    // close pull to refresh loader
                    $scope.$broadcast('scroll.refreshComplete');
                });
        };
        $scope.fetchRandomText();
        
          var ref = new Firebase(FIREBASE_URL);
       
       $scope.messages = $firebaseArray(ref);
    });


