(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	let player,
		camera,
		cameraDistance;



	/**
	* update the position of the camera
	* @param {object} p - The models player-object
	* @returns {undefined}
	*/
	const updateCameraPosition = function(p) {
		console.log(p.pos, p.rotation.y);
		const x = p.pos.x + cameraDistance * window.util.math.sinDeg(p.rotation.y),
			z = p.pos.z + cameraDistance * window.util.math.cosDeg(p.rotation.y),
			y = camera.getAttribute('position').y;

		camera.setAttribute('position', {x, y, z});
		console.log(x,y,z);
	};
	


	/**
	* update the position of the player
	* @param {object} p - The models player-object
	* @returns {undefined}
	*/
	const positionUpdateHandler = function(p) {
		player.setAttribute('position', p.pos);

		updateCameraPosition(p);
	};


	/**
	* update the rotation of the player
	* @param {object} p - The models player-object
	* @returns {undefined}
	*/
	const rotationUpdateHandler = function(p) {
		// console.log('rotate', p.rotation);
		player.setAttribute('rotation', p.rotation);
		camera.setAttribute('rotation', p.rotation);
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
	const initWorld = function() {
		player = document.getElementById('player');
		camera = document.getElementById('camera');

		// assume that camera is in straight line behind player
		const playerPos = player.getAttribute('position')
		cameraDistance = camera.getAttribute('position').z - playerPos.z;
		console.log(cameraDistance, playerPos);
	};
	


	
	/**
	* initialize the VR world view
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initVRWorldView = function() {
		initWorld();
		initSocketListeners();
	};

	
	/**
	* initialize all when scene and connection are ready
	* @returns {undefined}
	*/
	const init = function() {
		const scene = document.getElementById('scene');

		const loadedPromise = new Promise((resolve, reject) => {
			scene.addEventListener('loaded', resolve);
		});

		const connectionPromise = new Promise((resolve, reject) => {
			document.addEventListener('connectionready.socket', resolve);
		});

		// wait until both are ready
		Promise.all([loadedPromise, connectionPromise])
			.then(initVRWorldView)
			.catch((e) => {
				console.warn('something went wrong', e);
			});
	};
	

	// single point of entry
	document.addEventListener('DOMContentLoaded', init);

})();