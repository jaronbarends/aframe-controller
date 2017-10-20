(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	const carData = {
			speed: {
				x: 0,
				y: 0,
				z: 0
			}
		},
		dSpeed = 0.01,
		maxSpeed = 0.1;

	let sgCar;

	let worldTimer;// timer for updating the world



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

		// var h = '<tr>';
		// 	h += '<td>'+orientation.tiltLR+'</td>';
		// 	h += '<td>'+orientation.tiltFB+'</td>';
		// 	h += '<td>'+orientation.dir+'</td>';
		// 	h += '</td>';
		console.log(orientation.tiltLR);
		carData.speed.z += dSpeed;
		carData.speed.z = Math.min(maxSpeed, carData.speed.z);
		console.log(carData.speed.z);
	};


	/**
	* get car's current position
	* @returns {undefined | object} position {x,y,z}
	*/
	const getCarPos = function() {
		const pos = sgCar.getAttribute('position');
		if (typeof pos !== 'string') {// it is a string until aframe kicks in
			return pos;
		}
	};
	


	/**
	* update the world. yay.
	* @returns {undefined}
	*/
	const updateWorld = function() {
		clearTimeout(worldTimer);

		let pos = getCarPos();
		// console.log(pos);
		if (pos) {

			pos.x += carData.speed.x;
			pos.y += carData.speed.y;
			pos.z -= carData.speed.z;
			// console.log(pos);

			sgCar.setAttribute('position', pos);
		}

		worldTimer = setTimeout(updateWorld, 50);
	};
	
		
	

	/**
	* add event listeners for socket
	* @returns {undefined}
	*/
	var initSocketListeners = function() {
		io.on('tiltchange', tiltChangeHandler);
	};


	/**
	* 
	* @returns {undefined}
	*/
	const initElms = function() {
		// sgCar = document.getElementById('car');
		sgCar = document.getElementById('camera');
	};
	


	
	/**
	* initialize this controller
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initController = function() {
		initElms();
		initSocketListeners();
		updateWorld();
	};

	
	document.addEventListener('connectionready.socket', initController);

})();