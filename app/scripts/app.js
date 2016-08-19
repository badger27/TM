'use strict';

/**
 * @ngdoc overview
 * @name IonicGulpSeed
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */
	var config = {
    apiKey: "AIzaSyA8KIbTUXW57Fg6_y1ptYR6M6sebj5kEuM",
    authDomain: "project-6570233619858853741.firebaseapp.com",
    databaseURL: "https://project-6570233619858853741.firebaseio.com",
    storageBucket: "project-6570233619858853741.appspot.com",
  };
    firebase.initializeApp(config);

var tm = angular.module('IonicGulpSeed', ['ionic', 'ngCordova', 'ngResource', 'ngSanitize', 'firebase']);

     

tm.constant('FIREBASE_URL', 'https://ticketmaster-5f33e.firebaseio.com') 
       
       
        
        .run(function($ionicPlatform) {

        $ionicPlatform.ready(function() {
            // save to use plugins here
        });

        // add possible global event handlers here

    }).config(function($httpProvider, $stateProvider, $urlRouterProvider ) {
        // register $http interceptors, if any. e.g.
        // $httpProvider.interceptors.push('interceptor-name');

        // Application routing
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/main.html',
                controller: 'MainController'
            })
            .state('app.home', {
                url: '/home',
                cache: true,
                views: {
                    'viewContent': {
                        templateUrl: 'templates/views/home.html',
                        controller: 'HomeController'
                    }
                }
            })
            .state('app.settings', {
                url: '/settings',
                cache: true,
                views: {
                    'viewContent': {
                        templateUrl: 'templates/views/settings.html',
                        controller: 'SettingsController'
                    }
                }
            });


        // redirects to default route for undefined routes
        $urlRouterProvider.otherwise('/app/home');
        
    })


