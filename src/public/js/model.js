(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	const p = {// player
			speed: {
				x: 0,
				y: 0,
				z: 0
			},
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
			gas: false,
			brake: false,
			acceleration: 0,// +1: gas; -1: brake; 0: no change
		},
		dSpeed = 0.05,
		maxSpeed = 0.5,
		dRotationMax = 1;


	let tickTimer;// timer for updating the model


	/**
	* send an event to the socket server that will be passed on to all sockets
	* @returns {undefined}
	*/
	const sendEventToSockets = function(eventName, eventData) {
		var data = {
			eventName: eventName,
			eventData: eventData
		};
		io.emit('passthrough', data);
	};


	/**
	* handle the orientation change of one of the remote devices
	* @param {object} data Data sent by remote.js's tiltchange event
	* @returns {undefined}
	*/
	var tiltChangeHandler = function(data) {
		showOrientationData(data);
	};



	/**
	* show orientation data DIFFERENT DEVICES ARE NOT DISTINGUISHED YET
	* @param {object} data Data sent by remote.js's tiltchange event
	* @returns {undefined}
	*/
	var showOrientationData = function(data) {
		const orientation = data.orientation;

		// console.log(orientation.tiltLR);
		p.speed.z += dSpeed;
		p.speed.z = Math.min(maxSpeed, p.speed.z);
		// console.log(p.speed.z);
	};


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
			let newSpeedZ = p.speed.z + p.acceleration * dSpeed
			newSpeedZ = Math.min(maxSpeed, newSpeedZ);
			newSpeedZ = Math.max(0, newSpeedZ);

			p.speed.z = newSpeedZ;
		}
	};
	
	


	/**
	* update player's position
	* called on every tick
	* @returns {undefined}
	*/
	const updatePosition = function() {
		if (p.speed.x !== 0 || p.speed.y !== 0 || p.speed.z !== 0) {
			p.pos.x += p.speed.x;
			p.pos.y += p.speed.y;
			p.pos.z -= p.speed.z;
			sendEventToSockets('positionupdate', p.pos);
		}
	};
	
	

	/**
	* update player's rotation
	* called on every tick
	* @returns {undefined}
	*/
	const updateRotation = function() {
		if (p.rotationFactor.x !== 0 || p.rotationFactor.y !== 0 || p.rotationFactor.z !== 0) {
			p.rotation.x += p.rotationFactor.x * dRotationMax;
			p.rotation.y += p.rotationFactor.y * dRotationMax;
			p.rotation.z += p.rotationFactor.z * dRotationMax;
			sendEventToSockets('rotationupdate', p.rotation);
		}
	};
	


	/**
	* update the world. yay.
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
		// io.on('tiltchange', tiltChangeHandler);
		io.on('behaviorchange', behaviorChangeHandler);
		io.on('directionchange', directionChangeHandler);
	};



	/**
	* start the world
	* @returns {undefined}
	*/
	const startWorld = function() {
		// const playerElm = document.getElementById('car');
		const playerElm = document.getElementById('camera');
		p.pos = playerElm.getAttribute('position');

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