cmApp.factory('userRoutes', ["$resource",
	function($resource) {
		var rule = $resource('/users', {
			id: '@id'
		}, {
			login: {
				url: '/users/login',
				method: 'POST'
			},
			update: {
				url: '/users/:id',
				method: 'PUT'
			},
			signup: {
				url: '/users/signup',
				method: 'POST'
			},
			isLogged: {
				url: '/users/is_valid',
				method: 'GET'
			},
			team: {
				url: '/users/team',
				method: 'POST'
			},
			get_team_todos: {
				url: '/users/team_todos',
				method: 'GET',
				isArray: true
			},
			add_member: {
				url: '/users/add_member',
				method: 'POST'
			},
			remove_member: {
				url: '/users/remove_member',
				method: 'POST'
			}
		});
		return rule;
	}
])