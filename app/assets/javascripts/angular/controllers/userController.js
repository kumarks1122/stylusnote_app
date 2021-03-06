cmApp.controller("userController", ["$scope", "$timeout", "$location", "$rootScope", "$routeParams", "$filter","userRoutes","userFactory", "Notification",
  function($scope, $timeout,$location, $rootScope, $routeParams, $filter, userRoutes, userFactory, Notification) {
    $scope.loginUser = {}
    $scope.signupUser = {}
    $scope.editUser = !is_empty($rootScope.user) ? $rootScope.user: {}
    $scope.login = function() {
      Notification.clearAll()
      userRoutes.login({user: $scope.loginUser},function(resp) {
        setSessionInfo(resp.token)
        Notification.success({message: "Logged in successfully", delay: 1000})
        $location.path('/')
      },function(error) {
        Notification.error({message: error.data.message, delay: 3000})
        console.log(error.message)
      })
    }
    $scope.updateUser = function() {
      Notification.clearAll()
      userRoutes.update({id: $scope.editUser.id, user: $scope.editUser},function(resp) {
        console.log("updated");
        Notification.success({message: "Updated Successfully", delay: 3000})
      },function(error) {
        Notification.error({message: "Invalid token", delay: 3000})
        console.log("failed");
      })
    }
    $scope.signup = function() {
      userRoutes.signup({user: $scope.signupUser},function(resp) {
        setSessionInfo(resp.token)
        $location.path('/')
        Notification.success({message: "Logged in successfully", delay: 1000})
      },function(error) {
        console.log(error.data.message)
        Notification.clearAll()
        Notification.error({message: error.data.message, delay: 3000})
      })
    }
  }
])