cmApp.factory('todoRoutes', ["$resource",
	function($resource) {
		var rule = $resource('/todos', {
			id: '@id'
		}, {
			getTodos: {
				url: '/todos',
				method: 'GET'
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
			},
			getNotes: {
				url: '/todos/notes',
				method: 'GET'
			},
			updateNotes: {
				url: '/todos/update_notes',
				method: 'POST'
			}
		});
		return rule;
	}
])