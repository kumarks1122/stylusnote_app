cmApp.factory('todoRoutes', ["$resource",
	function($resource) {
		var rule = $resource('/todos', {
			id: '@id'
		}, {
			getTodos: {
				url: '/todos',
				method: 'GET',
				isArray: true
			},
			create: {
				url: '/todos',
				method: 'POST'
			},
			update: {
				url: '/todos/:id',
				method: 'PUT'
			},
			delete: {
				url: '/todos/:id',
				method: 'DELETE'
			}
		});
		return rule;
	}
])