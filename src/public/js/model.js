(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	const p = {// player
			pos: {
				x: 0,
				y: 0,
				z:0
			},
			rotation: {
				x: 0,
				y: 0,
				z: 0
			},
			rotationFactor: {// current value of rotation factor between -1 and 1
				x: 0,
				y: 0,
				z: 0
			},
			speed: 0,// speed along vetor of rotation
			gas: false,
			brake: false,
			acceleration: 0,// +1: gas; -1: brake; 0: no change
		},
		// dSpeed = 0.05,
		// maxSpeed = 0.5,
		dSpeed = 0.01,
		maxSpeed = 0.1,
		dRotationMax = 1;


	let tickTimer,// timer for updating the model
		cameraDistance;



	/**
	* update player's acceleration
	* called on every tick
	* @returns {undefined}
	*/
	const updateAcceleration = function() {
		p.acceleration = 0;
		if (p.gas) {
			p.acceleration = 1;
		}
		if (p.brake) {
			p.acceleration = -1;
		}
	};


	/**
	* update player's speed
	* called on every tick
	* @returns {undefined}
	*/
	const updateSpeed = function() {
		if (p.acceleration !== 0) {
			let newSpeed = p.speed + p.acceleration * dSpeed
			newSpeed = Math.min(maxSpeed, newSpeed);
			newSpeed = Math.max(0, newSpeed);

			p.speed = newSpeed;
		}
	};
	
	


	/**
	* update player's position
	* and send event to sockets when changed
	* called on every tick
	* @returns {undefined}
	*/
	const updatePosition = function() {
		if (p.speed !== 0) {
			p.pos.x +=  -1 * p.speed * window.util.math.sinDeg(p.rotation.y);
			// p.pos.y += p.speed.y;
			p.pos.z += -1 * p.speed * window.util.math.cosDeg(p.rotation.y);
			window.util.sockets.sendEventToSockets('positionupdate', p);
		}
	};
	
	

	/**
	* update player's rotation
	* and send event to sockets when changed
	* called on every tick
	* @returns {undefined}
	*/
	const updateRotation = function() {
		if (p.rotationFactor.x !== 0 || p.rotationFactor.y !== 0 || p.rotationFactor.z !== 0) {
			p.rotation.x += p.rotationFactor.x * dRotationMax;
			p.rotation.y += p.rotationFactor.y * dRotationMax;
			p.rotation.z += p.rotationFactor.z * dRotationMax;
			window.util.sockets.sendEventToSockets('rotationupdate', p);
		}
	};
	


	/**
	* the app's heartbeat
	* @returns {undefined}
	*/
	const tick = function() {
		clearTimeout(tickTimer);

		updateAcceleration();
		updateSpeed();
		updatePosition();
		updateRotation();

		tickTimer = setTimeout(tick, 50);
	};


	/**
	* handle behavior change
	* @returns {undefined}
	*/
	const behaviorChangeHandler = function(data) {
		p[data.prop] = data.value;
	};


	/**
	* handle change in direction
	* @param {number} fractionOfMax - fraction between 0 and 1 or 0 and -1 of max direction change
	* @returns {undefined}
	*/
	const directionChangeHandler = function(fractionOfMax) {
		p.rotationFactor.y = fractionOfMax;
	};
	
	
	
		
	

	/**
	* add event listeners for socket
	* @returns {undefined}
	*/
	var initSocketListeners = function() {
		io.on('behaviorchange', behaviorChangeHandler);
		io.on('directionchange', directionChangeHandler);
	};



	/**
	* start the world
	* @returns {undefined}
	*/
	const startWorld = function() {
		const playerElm = document.getElementById('car'),
			cameraElm = document.getElementById('camera');
		p.pos = playerElm.getAttribute('position');

		// assume that camera is in straight line behind player
		cameraDistance = cameraElm.getAttribute('position').z - p.pos.z;
		console.log('dist:', cameraDistance, cameraElm.getAttribute('position'), p.pos);

		// start the tick (heartbeat)
		tick();
	};
	
	


	/**
	* initialize this controller
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initModel = function() {
		const scene = document.getElementById('scene');
		scene.addEventListener('loaded', startWorld);// kick off when all is loaded
		initSocketListeners();
	};

	
	document.addEventListener('connectionready.socket', initModel);

})();