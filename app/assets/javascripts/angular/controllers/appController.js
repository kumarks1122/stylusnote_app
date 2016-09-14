cmApp.controller("appController", ["$scope","$http", "$httpParamSerializer", "$timeout","$location","$window", "$rootScope", "$routeParams", "$filter",
  function($scope, $http, $httpParamSerializer, $timeout,$location, $window, $rootScope, $routeParams, $filter) {
		$scope.logout = function() {
			eraseCookie('auth_token')
			$location.path('/login')
		}
  }
])