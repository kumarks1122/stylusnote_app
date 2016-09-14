cmApp.controller("teamController", ["$scope","$http", "$httpParamSerializer", "$timeout","$location","$window", "$rootScope", "$routeParams", "$filter", "userRoutes", "Notification",
  function($scope, $http, $httpParamSerializer, $timeout,$location, $window, $rootScope, $routeParams, $filter, userRoutes, Notification) {
  	$scope.editTeam = angular.copy($rootScope.team)
  	$scope.team_members = []
  	if (!is_empty($rootScope.team.id)) {
  		userRoutes.get_team_todos({},function(resp) {
  			$scope.team_members = resp
  		})
  	}
  	$scope.updateteam = function() {
  		userRoutes.team({team: $scope.editTeam},function(resp) {
  			if(is_empty($scope.editTeam.id)){
  				Notification.success({message: "Created successfully",delay: 3000})
  			} else {
  				Notification.success({message: "Updated successfully",delay: 3000})
  			}
  				$location.path('/')
  		},function(error) {
  			Notification.error({message: "You don't have access to edit",delay: 3000})
  		})
  	}

  	$scope.showAddMember = false
  	$scope.toggleAddMember = function() {
  		$scope.showAddMember = !$scope.showAddMember
  	}

  	$scope.addMemberEmail = ""
  	$scope.addMember = function() {
  		userRoutes.add_member({email: $scope.addMemberEmail},function(resp) {
  			$scope.team_members.push(resp.user)
  			$scope.addMemberEmail = ""
  			Notification.success({message: resp.message,delay: 3000})
  		},function(error) {
  			Notification.error({message: error.data.message, delay: 3000})
  		})
  	}

  	$scope.removeMember = function(userId, userIndex) {
  		removingUser = $scope.team_members[userIndex]
  		userRoutes.remove_member({user_id: userId},function(resp) {
  			$scope.team_members.splice(userIndex,1)
  			if (userId==$rootScope.user.id) {
  				location.reload()
  			};
  			Notification.success({message: resp.message,delay: 3000})
  		},function(error) {
  			Notification.error({message: error.data.message,delay: 3000})
  		})
  	}
  }
])