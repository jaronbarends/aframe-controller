(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	let car,
		camera;




	/**
	* update the position of the player
	* @param {object} p - The models player-object
	* @returns {undefined}
	*/
	const positionUpdateHandler = function(p) {
		car.setAttribute('position', p.pos);
	};


	/**
	* update the rotation of the player
	* @param {object} p - The models player-object
	* @returns {undefined}
	*/
	const rotationUpdateHandler = function(p) {
		console.log('rotate', p.rotation);
		car.setAttribute('rotation', p.rotation);
	};
	
		
	

	/**
	* add event listeners for socket
	* @returns {undefined}
	*/
	var initSocketListeners = function() {
		io.on('positionupdate', positionUpdateHandler);
		io.on('rotationupdate', rotationUpdateHandler);
	};


	/**
	* 
	* @returns {undefined}
	*/
	const initElms = function() {
		car = document.getElementById('car');
		camera = document.getElementById('camera');
	};
	


	
	/**
	* initialize the VR world view
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initVRWorldView = function() {
		initElms();
		initSocketListeners();
	};

	
	document.addEventListener('connectionready.socket', initVRWorldView);

})();