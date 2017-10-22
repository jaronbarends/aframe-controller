(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	let scene,
		worldRotationWrapper,
		world,
		player,
		camera,
		cameraDistance;



	/**
	* update the position of the camera
	* @param {object} p - The models player-object
	* @returns {undefined}
	*/
	const updateCameraPosition = function(p) {
		const x = p.pos.x + cameraDistance * window.util.math.sinDeg(p.rotation.y),
			z = p.pos.z + cameraDistance * window.util.math.cosDeg(p.rotation.y),
			y = camera.getAttribute('position').y;

		camera.setAttribute('position', {x, y, z});
	};
	


	/**
	* update the position of the player
	* @param {object} p - The models player-object
	* @returns {undefined}
	*/
	const positionUpdateHandler = function(p) {
		// player.setAttribute('position', p.pos);
		const worldPos = world.getAttribute('position');
		worldPos.x = -p.pos.x;
		worldPos.z = -p.pos.z;
		world.setAttribute('position', worldPos);

		// updateCameraPosition(p);
	};


	/**
	* update the rotation of the player
	* @param {object} p - The models player-object
	* @returns {undefined}
	*/
	const rotationUpdateHandler = function(p) {
		// console.log('rotate', p.rotation);
		// player.setAttribute('rotation', p.rotation);
		// camera.setAttribute('rotation', p.rotation);

		const worldRotation = Object.assign({}, p.rotation);
		worldRotation.y = -worldRotation.y;
		// console.log('set:', worldRotation);
		worldRotationWrapper.setAttribute('rotation', worldRotation);
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
		worldRotationWrapper = document.getElementById('world-rotation-wrapper');
		world = document.getElementById('world');
		player = document.getElementById('player');
		camera = document.getElementById('camera');

		// assume that camera is in straight line behind player
		const playerPos = player.getAttribute('position')
		cameraDistance = camera.getAttribute('position').z - playerPos.z;
	};
	


	
	/**
	* initialize the VR world view
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initVRWorldView = function() {
		window.r = (y) => { let rot = world.getAttribute('rotation'); console.log(rot); world.setAttribute('rotation', {x: rot.x, y: y, z: rot.z})};
		initWorld();
		initSocketListeners();
	};

	
	/**
	* initialize all when scene and connection are ready
	* @returns {undefined}
	*/
	const init = function() {
		scene = document.getElementById('scene');

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