cmApp.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {

  $locationProvider.html5Mode(true);
  var isLogged = function(userFactory){
    return userFactory.isLogged();
  }
  $routeProvider
  .when("/",
  { 
    templateUrl: "/assets/todos/index.html",
    controller: "todoController",
    login:true,
    resolve:{'logged':function(userFactory){
      return userFactory.isLogged()
    }}
  })
  .when("/login",
  { 
    templateUrl: "/assets/users/login.html",
    controller: "userController",
    login:false
  })
  .when("/signup",
  { 
    templateUrl: "/assets/users/signup.html",
    controller: "userController",
    login:false
  })
  .when("/todos",
  { 
    templateUrl: "/assets/todos/index.html",
    controller: "todoController",
    login:true,
    resolve:{'logged':function(userFactory){
      return userFactory.isLogged()
    }}
  })
  .when("/me",
  { 
    templateUrl: "/assets/users/edit.html",
    controller: "userController",
    login:true,
    resolve:{'logged':function(userFactory){
      return userFactory.isLogged()
    }}
  })
  .when("/team_settings",
  { 
    templateUrl: "/assets/team/edit_team.html",
    controller: "teamController",
    login:true,
    resolve:{'logged':function(userFactory){
      return userFactory.isLogged()
    }}
  })
  .when("/team",
  { 
    templateUrl: "/assets/team/index.html",
    controller: "teamController",
    login:true,
    resolve:{'logged':function(userFactory){
      return userFactory.isLogged()
    }}
  })
  .otherwise({ redirectTo: "/" });

}])

cmApp.run(
	["$rootScope", "$location", "userFactory", "$timeout",
		function($rootScope, $location, userFactory, $timeout) {
			$rootScope.$on("$routeChangeStart", function(event, next, current) {
				userFactory.isLogged().then(function(data) {
          $rootScope.curPage = $location.path()
					if (data.valid != true && next.login == true) {
            eraseCookie('auth_token')
						$location.path("/login")
					}
					if (data.valid == true && ($location.path() == "/login" || $location.path() == "/signup")) {
						$location.path("/")
					}
				}, function(error) {
          eraseCookie('auth_token')
          $location.path("/login")
        })
			})
		}
	])