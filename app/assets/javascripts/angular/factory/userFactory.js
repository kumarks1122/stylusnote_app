cmApp.factory('userFactory', ["$window", "$location", "$rootScope", "$routeParams", "$rootScope", "$q", "$timeout", "userRoutes",
  function($window, $location, $rootScope, $routeParams, $rootScope, $q, $timeout, userRoutes) {
    var userFactory = {}
    userFactory.model = {
      current_user: undefined,
      active: false,
      token: undefined
    }
    // Factory for Get user token
    userFactory.getUserToken = function() {
      return userFactory.model.token;
    }

    // Factory for Login
    userFactory.login = function(data,scope) {
      var deferred = $q.defer();
      $rootScope.is_user_active = false
      //console.log(data,scope);
      return userRoutes.login(data,function(response) {
            setSessionInfo(response.token)
            userFactory.model.active = true
            // Assign token to userFactory.model.token
            userFactory.model.token = response.token
            $rootScope.user_token = response.token
            $rootScope.is_user_active = true
            deferred.resolve({"success": "Successfully Logged In"});
      }, function(response) {
        if (is_empty(response.data)) {
          error_return = {
            "error": "Not Found."
          }
        }
        else if(is_empty(response.data)==false && response.data.error){
          error_return = {
            "error": response.data.error
          }
        } else {
          error_return = {
            "error": "Unkown Error"
          }
        }
        deferred.reject(error_return)
      })
    }

    userFactory.signup = function(data,scope) {
      //console.log(data,scope);
      var deferred = $q.defer();
      $rootScope.is_user_active = false
      return userRoutes.signup(data,function(response) {
            setSessionInfo(response.token)
            userFactory.model.active = true
            // Assign token to userFactory.model.token
            userFactory.model.token = response.token
            $rootScope.user_token = response.token
            $rootScope.is_user_active = true
            deferred.resolve({"success": "Successfully Signed Up"});
      }, function(response) {
        if (is_empty(response.data)) {
          error_return = {
            "error": "Not Found."
          }
        }
        else if(is_empty(response.data)==false && response.data.error){
          error_return = {
            "error": response.data.error
          }
        } else {
          error_return = {
            "error": "Unkown Error"
          }
        }
        deferred.reject(error_return)
      })
    }

    // Factory for Logout
    userFactory.logout = function() {
      return userRoutes.logout({},function(resp) {
        sessionStorageData = getSessionInfo()
        if (!is_empty(sessionStorageData["loginInfo"])) {
          eraseCookie('auth_token')
          $rootScope.is_user_active = false
          $location.path('/login')
        }
      })
    }

    // Factory for after succesfull login
    userFactory.isLogged = function() {
      var deferred = $q.defer();
      $rootScope.is_user_active = false
      auth_token = getSessionInfo()
      if (token) {
        // Assign Login information to userInfo
        userRoutes.isLogged({},function(resp) {
          if (resp.valid == true) {
            // Assign User info token to userFactory.model.token
            userFactory.model.token = auth_token
            $rootScope.user_token = auth_token
            userFactory.model.active = true
            $rootScope.user = resp.user
            $rootScope.team = resp.team
            $rootScope.is_user_active = true
            //Assign company name from local storage to company_name
          } else {
            userFactory.model.token = undefined
            userFactory.model.active = false
            $rootScope.user_token = undefined
          }
          deferred.resolve(resp);
        },function(error) {
          deferred.reject(error);
        })
      } else {
        deferred.resolve({
          "valid": false
        });
      }
      return deferred.promise
    }

    return userFactory;
  }
])