'use strict';

angular.module('ueni', ['ui.router', 'ngFileUpload', 'ui.bootstrap'])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
      $urlRouterProvider.otherwise('/');

      $stateProvider
        .state('home', {
          url:'/',
          templateUrl: 'app/main/main.html',
          controller: 'MainController'
        });
}]);
