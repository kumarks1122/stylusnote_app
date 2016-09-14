cmApp.factory('tokenInterceptor', ['$rootScope', '$window', function($rootScope, $window) {
	return {
		request: function($config) {
			user_token = getSessionInfo()
			if (!is_empty(user_token)) {
				$config.headers['Authorization'] = "Token " + user_token;
			}
			// sessionStorageData = getSessionInfo()
			// if ($config.url.indexOf("api.glydel.in") < 0 && !is_empty(sessionStorageData['fleet_key'])) {
			// 	$config.headers['FleetKey'] = sessionStorageData['fleet_key']
			// }
			return $config;
		}
	};
}]);