(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	


	/**
	* handle the orientation change of one of the remote devices
	* @param {object} data Data sent by remote.js's tiltchange event
	* @returns {undefined}
	*/
	var reloadAllHandler = function(data) {
		window.location.reload();
	};


	/**
	* initialize reload all link - if it's present
	* @returns {undefined}
	*/
	const initReloadLink = function() {
		const reloadLink = document.getElementById('reload-all-sockets');
		if (reloadLink) {
			reloadLink.addEventListener('click', (e) => {
				e.preventDefault();
				window.util.sockets.sendEventToSockets('reloadall.sockets');
			});
		}
	};
	



	
	/**
	* initialize this hub when
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initReloadAll = function() {
		initReloadLink();
		io.on('reloadall.sockets', reloadAllHandler);
	};

	

	// init when connection is ready	
	document.addEventListener('connectionready.socket', initReloadAll);

})();