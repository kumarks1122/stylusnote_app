var cmApp = angular.module('cmApp',["ngRoute", "ngResource", "ui-notification"]);

cmApp.config(function($httpProvider) {
	$httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content');
	$httpProvider.interceptors.push('tokenInterceptor')
});