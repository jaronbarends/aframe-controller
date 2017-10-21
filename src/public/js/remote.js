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
	* handle socket's acceptance of entry request
	* @param {object} data Data sent by the socket (currently empty)
	* @returns {undefined}
	*/
	var joinedHandler = function(data) {
		//this remote has been joined the room
		document.getElementById('login-form').classList.add('u-is-hidden');
	};


	/**
	* handle entry of new user in the room
	* @param {object} users Updated array with users; the newly added user is the last one in the array
	* @returns {undefined}
	*/
	var newUserHandler = function(users) {
	};


	/**
	* handle user disconnecting 
	* @returns {undefined}
	*/
	var userDisconnectHandler = function() {
	};
	


	/**
	* add event listeners for so cket
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initSocketListeners = function() {
		io.on('joined', joinedHandler);
		io.on('newuser', newUserHandler);
		io.on('disconnect', userDisconnectHandler);
	}
;

	/**
	* send event to server to request entry to room
	* @returns {undefined}
	*/
	var joinRoom = function() {
		var user = {
				role: sgRole,
				id: io.id,
				username: sgUsername,
				color: sgUserColor
			};

		io.emit('join', user);
	};


	/**
	* set an identifying color for this user
	* @returns {undefined}
	*/
	var setUserColor = function() {
		var colors = ['Aqua', 'Aquamarine', 'Black', 'Blue', 'BlueViolet', 'Brown', 'CadetBlue', 'Chartreuse', 'Chocolate', 'Coral', 'CornflowerBlue', 'Crimson', 'DarkBlue', 'DarkCyan', 'DarkGoldenRod', 'DarkGray', 'DarkGreen', 'DarkMagenta', 'DarkOliveGreen', 'DarkOrange', 'DarkOrchid', 'DarkRed', 'DarkSalmon', 'DarkSeaGreen', 'DarkSlateBlue', 'DarkSlateGray', 'DarkTurquoise', 'DarkViolet', 'DeepPink', 'DeepSkyBlue', 'DimGray', 'DodgerBlue', 'FireBrick', 'ForestGreen', 'Fuchsia', 'Gold', 'GoldenRod', 'Gray', 'Green', 'GreenYellow', 'HotPink', 'IndianRed ', 'Indigo ', 'LawnGreen', 'LightBlue', 'LightCoral', 'LightGreen', 'LightPink', 'LightSalmon', 'LightSeaGreen', 'LightSkyBlue', 'LightSlateGray', 'LightSteelBlue', 'Lime', 'LimeGreen', 'Magenta', 'Maroon', 'MediumAquaMarine', 'MediumBlue', 'MediumOrchid', 'MediumPurple', 'MediumSeaGreen', 'MediumSlateBlue', 'MediumTurquoise', 'MediumVioletRed', 'MidnightBlue', 'Navy', 'Olive', 'OliveDrab', 'Orange', 'OrangeRed', 'Orchid', 'PaleVioletRed', 'Peru', 'Pink', 'Plum', 'Purple', 'RebeccaPurple', 'Red', 'RosyBrown', 'RoyalBlue', 'SaddleBrown', 'Salmon', 'SandyBrown', 'SeaGreen', 'Sienna', 'SkyBlue', 'SlateBlue', 'SlateGray', 'SpringGreen', 'SteelBlue', 'Tan', 'Teal', 'Tomato', 'Turquoise', 'Violet', 'Yellow', 'YellowGreen'],
			len = colors.length;

		sgUserColor = colors[Math.floor(len*Math.random())];

		document.getElementById('user-color').style.background = sgUserColor;
	};


	/**
	* send an event to the socket server that will be passed on to all sockets
	* @returns {undefined}
	*/
	var sendEventToSockets = function(eventName, eventData) {
		var data = {
			eventName: eventName,
			eventData: eventData
		};
		io.emit('passthrough', data);
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
			sendEventToSockets('tiltchange', newData);

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



	/**
	* initialize the login form
	* @returns {undefined}
	*/
	var initLoginForm = function() {
		document.getElementById('login-form').addEventListener('submit', function(e) {
			e.preventDefault();

			var form = e.currentTarget;
			sgUsername = form.querySelector('[name="username"]').value || sgUsername;

			joinRoom();
		});
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
			sendEventToSockets('behaviorchange', data);
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
			gasBtn.addEventListener('touchend', () => { changeBehavior('gas', false); });
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
			sendEventToSockets('directionchange', fractionOfMax);
		};
		


		/**
		* initialize the direction controller
		* @returns {undefined}
		*/
		const initDirectionController = function() {
			
		};
		


	//-- End direction controller --
	



	/**
	* initialize the remote
	* @returns {undefined}
	*/
	var initRemote = function() {
		sgUsername = io.id;
		setUserColor();
		initSocketListeners();
		initDeviceOrientation();
		initLoginForm();
		initAccelerationController();
		initDirectionController();
	};


	// init when connection is ready	
	document.addEventListener('connectionready.socket', initRemote);


})();