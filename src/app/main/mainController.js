'use strict';

function mainController($scope, $http) {
  $scope.search = '';

  $http.get('app/items.json').success(function(data) {
    $scope.items = data.buttons;
  });
}

mainController.$inject = ["$scope", "$http"];

angular.module('ueni').controller('MainController', mainController)