'use strict';

/**
 * @ngdoc function
 * @name IonicGulpSeed.controller:HomeController
 * @description
 * # HomeController
 */

  tm.controller('HomeController', ['$scope','$location','$firebaseAuth', '$firebaseObject', '$firebaseArray', 'ExampleService',
      function($scope,$location,$firebaseAuth,$firebaseObject, $firebaseArray,ExampleService) {

        
     
    
   console.log($firebaseArray); // <- verified here that the injection works
    var rootRef = firebase.database().ref();
           

     

        $scope.myHTML = null;

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
        
//          var ref = new Firebase(FIREBASE_URL);
       
//       $scope.messages = $firebaseArray(ref);
    }]);


