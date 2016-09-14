cmApp.controller("todoController", ["$scope","$http", "$httpParamSerializer", "$timeout","$location","$window", "$rootScope", "$routeParams", "$filter", "todoRoutes",
  function($scope, $http, $httpParamSerializer, $timeout,$location, $window, $rootScope, $routeParams, $filter, todoRoutes) {
		$scope.question = "What are your five most important tasks right now?"
		$scope.newTodoText = ""
		$scope.todos = []
		$scope.date = moment().format("ddd, MMM Do")
		$scope.current_date = 0
		$scope.teamName = !is_empty($rootScope.team.name) ? $rootScope.team.name : 'Team'

		$scope.todoType = !is_empty($rootScope.user.team_id) ? "team" : "personal"
		$scope.todoLoading = false
		$scope.addTodo = function() {
			todoRoutes.create({todo: { text: $scope.newTodoText , status: 'new', item_type: $scope.todoType, current_date: $scope.current_date}},function(resp) {
				$scope.todos.push(resp.data)
				$scope.newTodoText = ""
			})
		}

		$scope.updateTodo = function(item) {
			item.current_date = $scope.current_date
			todoRoutes.update({id: item.id, todo: item},function(resp) {
				angular.forEach($scope.todos,function(value) {
					if (resp.data.id) {
						value = resp.data
					};
				})
			})
		}

		$(".notes-icon").click(function(){
			$(".notes-container").toggleClass("active");
		});
		$(document).keyup(function(e) {
			if (e.keyCode == 27) {
				$(".notes-container").toggleClass("active");	
			}
		})

		$scope.switchDate = function(new_date) {
			$scope.current_date -= new_date;
			var new_date_in_moment = moment().subtract("days", $scope.current_date);
			$scope.date = new_date_in_moment.format("ddd, MMM Do")
			$scope.question = $scope.current_date==0 ? "What are your five most important tasks right now?" : $scope.current_date==-1 ? "What are you working on tomorrow?" : $scope.current_date==1 ? "Here's what you worked on yesterday" : "Here's what you worked on "+$scope.date
			$scope.getTodos(new_date_in_moment)
		}

		$scope.getTodos = function(date) {
			$scope.todoLoading = true
			date = date==undefined ? moment(): date
			todoRoutes.getTodos({date: date.format('MM/DD/YYYY'), item_type: $scope.todoType},function(resp) {
				$scope.todoLoading = false
				$scope.todos = resp.todos
				$scope.notes = resp.notes
				// $scope.notes = [{'text':"<p>sadfasdf asdf  asdf asdfasd fasdf </p><p>sadfasdf asdf  asdf asdfasd fasdf sadf asdf asdf</p><p>sadfasdf asdf  asdf asdfasd fasdf  dasf asdf asd fasd fams fasdfa </p>"},{'text':"<p>sadfasdf asdf  asdf asdfasd fasdf </p><p>sadfasdf asdf  asdf asdfasd fasdf sadf asdf asdf</p><p>sadfasdf asdf  asdf asdfasd fasdf  dasf asdf asd fasd fams fasdfa </p>"}]
			})
		}

		$scope.getTodos(moment())
		$scope.changeTodoStatus = function(todo,status) {
			todo.status = status
			$scope.updateTodo(todo)
		}

		$scope.checkKeyPress = function(keyEvent, actionType, editItem, valid) {
			if (9 == keyEvent.which) {
				if (keyEvent.preventDefault(), 1 == valid) return "edit" == actionType ? $scope.updateTodo(editItem) : "add" == actionType && $scope.addTodo(), !1
			} else 27 == keyEvent.which && (keyEvent.preventDefault(), $scope.syncTasks());
			return !0
		}
		$scope.checkBlur = function(actionType, editItem, valid, editable) {
			if (1 == valid) {
				if ("edit" == actionType && 1 == editable) return $scope.updateTodo(editItem), !1;
				"add" == actionType && $scope.addTodo()
			}
		}

		$scope.newNote = {
			text: ''
		}
		$scope.updateNote = function(note) {
			todoRoutes.updateNotes({note: note},function(resp) {
				console.log("success");
				if ($scope.newNoteVisible) {
					$scope.newNoteVisible = false
					$scope.notes.push(resp)
					$scope.newNote.text = ""
				};
			})
		}

		$scope.toggleNewNoteVisible = function() {
			$scope.newNoteVisible = !$scope.newNoteVisible
		}

		$scope.removeNote = function(note) {
			note.status = 'deleted'
			$scope.updateNote(note)
		}

		$scope.slackHook = function(item,item_type) {
			
		}
  }
])