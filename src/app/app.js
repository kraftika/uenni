'use strict';

angular.module('founders', ['ui.router', 'ngFileUpload', 'ui.bootstrap'])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url:'/',
          templateUrl: 'app/main/main.html',
          controller: 'mainController'
        });
}]);
