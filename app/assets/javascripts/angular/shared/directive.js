cmApp.directive("carryovers", ["$rootScope",
	function($rootScope) {
		return {
			templateUrl: "/assets/todos/_carryovers.html",
			link: function (scope, elem, attr) {
				$rootScope.is_user_active ? date_format = "YYYY-MM-DDTHH:mm:ssZ" : date_format = "ddd, DD MMM YYYY HH:mm:ss ZZ"
				scope.$watch("current_date", function(e) {
					var n = moment().subtract(e, "days");
					scope.carryover = n.diff(moment(attr.createdAt, date_format).startOf("day"), "days")
					scope.created_today = 0 == scope.carryover
				})
			}
		}
	}
])

cmApp.directive("toggleArchivedList", [
	function() {
		return function(t, e) {
			e.on("click", function() {
				var t = $(".archived-list"),
					n = e.find(".description");
				if (t.toggleClass("active"), e.toggleClass("active"), t.hasClass("active")) {
					var i = t.find(".task-list li"),
						r = 0;
					i.each(function(t, e) {
						var n = $(e).css("height");
						r += parseInt(n.split("px")[0])
					}), t.css("max-height", r + "px"), n.text("Hide archived")
				} else t.css("max-height", "0px"), n.text("Show archived")
			})
		}
	}
])