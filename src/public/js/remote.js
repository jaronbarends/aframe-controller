;(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	// define semi-global variables (vars that are "global" in this file's scope) and prefix them
	// with sg so we can easily distinguish them from "normal" vars
	var sgUsername = '',
		sgRole = 'remote',
		sgUserColor,
		sgOrientation = {
			tiltLR: 0,
			tiltFB: 0,
			dir: 0
		},
		sgCompassCorrection = 0,
		sgScreenAngle,
		sgUsers = [];//array of users, in order of joining

	



	/**
	* add event listeners for so cket
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initSocketListeners = function() {
		// io.on('newuser', newUserHandler);
		// io.on('disconnect', userDisconnectHandler);
	};



	/**
	* when remote is tilted, send orientation data and this device's id to the socket
	* @param {event} e The tiltchange.deviceorientation event sent by device-orientation.js
	* @returns {undefined}
	*/
	var tiltChangeHandler = function(e) {
		const data = e.detail;

		var tiltLR = Math.round(data.tiltLR),
			tiltFB = Math.round(data.tiltFB),
			dir = Math.round(data.dir);

		dir -= sgCompassCorrection;

		if (sgOrientation.dir !== dir) {
			directionChangeHandler(dir);
		}

		if (sgOrientation.tiltLR !== tiltLR || sgOrientation.tiltFB !== tiltFB || sgOrientation.dir !== dir) {
			sgOrientation = {
				tiltLR: tiltLR,
				tiltFB: tiltFB,
				dir: dir
			};

			var newData = {
				id: io.id,
				orientation: sgOrientation
			};
			window.util.sockets.sendEventToSockets('tiltchange', newData);

		}

	};


	/**
	* initialize stuff for handling device orientation changes
	* listen for events triggered on body by device-orientation.js
	* @returns {undefined}
	*/
	var initDeviceOrientation = function() {
		document.body.addEventListener('tiltchange.deviceorientation', tiltChangeHandler);
	};



	//-- Start gas and break controls --


		/**
		* handle change in state a behavior
		* @returns {undefined}
		*/
		const changeBehavior = function(prop, value) {
			const data = {
				prop: prop,
				value: value
			}
			window.util.sockets.sendEventToSockets('behaviorchange', data);
		};
		


		/**
		* initialize acceleration controller
		* @returns {undefined}
		*/
		const initAccelerationController = function() {
			const gasBtn = document.getElementById('gas'),
				brakeBtn = document.getElementById('brake');

			gasBtn.addEventListener('mouseenter', () => { changeBehavior('gas', true); });
			gasBtn.addEventListener('touchstart', () => { changeBehavior('gas', true); });
			gasBtn.addEventListener('mouseleave', () => { changeBehavior('gas', false); });
			gasBtn.addEventListener('touchend', () => { changeBehavior('gas', false); changeBehavior('brake', true); });
			brakeBtn.addEventListener('mouseenter', () => { changeBehavior('brake', true); });
			brakeBtn.addEventListener('touchstart', () => { changeBehavior('brake', true); });
			brakeBtn.addEventListener('mouseleave', () => { changeBehavior('brake', false); });
			brakeBtn.addEventListener('touchend', () => { changeBehavior('brake', false); });

		};

	//-- End gas and break controls --


	//-- Start direction controller --

		const minAngle = 5,// angle has to be at least 3 degrees
			maxAngle = 30;// steering angle can vary between 0-30 degrees both sides


		/**
		* handle change in direction; called by tiltchangeHandler
		* @returns {undefined}
		*/
		const directionChangeHandler = function(dir) {
			// dir will be 0-360;
			if (dir < 180) {
				dir = Math.min(dir, maxAngle);
				if (dir < minAngle) {
					dir = 0;
				}
			} else {
				dir -= 360;
				dir = Math.max(dir, -1*maxAngle);
				if (dir > -1*minAngle) {
					dir = 0;
				}
			}
			const fractionOfMax = dir/maxAngle;// converts it to value between 0 1 or 0 -1

			// now send the fraction to sockets
			window.util.sockets.sendEventToSockets('directionchange', fractionOfMax);
		};
		



	//-- End direction controller --
	



	/**
	* initialize the remote
	* @returns {undefined}
	*/
	var initRemote = function() {
		// sgUsername = io.id;
		// setUserColor();
		initSocketListeners();
		initDeviceOrientation();
		// initLoginForm();
		initAccelerationController();
	};


	// init when connection is ready	
	document.addEventListener('connectionready.socket', initRemote);


})();