var domains = ["http://stylusnote.dev", "http://localhost:3000", "https://stylusnote.co"];

function is_empty(data) {
	return typeof(data)=='undefined' || data==undefined || data==null || data==''
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function getUrlParams(){
	var vars = {}, hash;
	var hashes = window.location.href.split('?');

	if(hashes.length > 1) {
		var hash = hashes[1].split('&');

		for(i=0 ; i < hash.length; i++) {
			var temp = hash[i].split('=');
			vars[temp[0]] = temp[1];
		}

		return vars;
	}
	else 
		return 0;
}

function getSessionInfo() {
	token = readCookie('auth_token')
	return token
}

function setSessionInfo(token) {
	createCookie('auth_token',token, 1000)
}

$(document).ready(function(){
    $(".push_menu").click(function(){
        $(".wrapper").toggleClass("active");
    });
});