(function() {

	'use strict';

	/* global io */ //instruction for jshint

	//globals:
	//window.io is defined by socket.IO.
	//It represents the socket server.
	//io is a bit of a strange name, but it's being used in examples everywhere,
	//so let's stick to that.


	// define semi-global variables (vars that are "global" in this file's scope) and prefix them
	// with sg so we can easily distinguish them from "normal" vars
	var sgRole = 'hub',
		sgDeviceIdPrefix = 'device-',//prefix used for device elements' ids
		sgDevices = document.getElementById('devices-container'),
		sgUsers = [],//array of users, in order of joining
		sgHiddenClass = 'u-is-hidden';


	/**
	* handle socket's acceptance of join request
	* @param {object} data Data sent by the socket (currently empty)
	* @returns {undefined}
	*/
	var joinedHandler = function(data) {
		//this hub has been joined the room
	};


	/**
	* create a device on screen for a user
	* @param {object} data Info about the newly connected user
	* @returns {undefined}
	*/
	var createDevice = function(data) {
		var deviceId = sgDeviceIdPrefix+data.id,
			clone = document.querySelector('#device-clone-src').cloneNode(true);

		clone.id = deviceId;
		clone.querySelector('.user').textContent = data.username;
		clone.querySelector('.user-color').style.background = data.color;

		sgDevices.appendChild(clone);
		clone.classList.remove(sgHiddenClass);
		console.log('done');
	};



	/**
	* remove a device from screen
	* @returns {undefined}
	*/
	var removeDevice = function(id) {
		var deviceId = sgDeviceIdPrefix+id,
			device = document.getElementById(deviceId);

		if (device) {
			device.classList.add(sgHiddenClass);
			setTimeout(() => {device.remove();}, 500);
		}
	};
	


	/**
	* handle entry of new user in the room
	* @param {object} users Updated array with users; the newly added user is the last one in the array
	* @returns {undefined}
	*/
	var newUserHandler = function(users) {
		var newUser = users[users.length-1];

		sgUsers = users;
		if (newUser.role === 'remote') {
			createDevice(newUser);
		}
	};


	/**
	* handle user disconnecting
	* @param {object} data Object containing disconnected user's id
	* @returns {undefined}
	*/
	var disconnectHandler = function(data) {
		//console.log('disconnect', data);
		if (data.removedUser) {
			//there is no removed user when a client disconnects that hadn't joined the room yet
			var removedUserId = data.removedUser.id;
			removeDevice(removedUserId);
		}
	};
	


	/**
	* handle the orientation change of one of the remote devices
	* @param {object} data Data sent by remote.js's tiltchange event
	* @returns {undefined}
	*/
	var tiltChangeHandler = function(data) {
		var orientation = data.orientation;

		var dirCorrection = 0;//direction is determined by the devices angle relative to the screen at the time of connecting

		orientation.tiltFB -= 90;//tiltFB = 0 when remote device is horizontal, we want it to correspond with vertical screen
		orientation.dir += dirCorrection;

		const rotateLR = "rotate3d(0,0,1, "+ orientation.tiltLR +"deg)",
			rotateFB = "rotate3d(1,0,0, "+ (orientation.tiltFB*-1)+"deg)",
			rotateDir = "rotate3d(0,0,1, "+(orientation.dir*-1)+"deg)";

		const device = document.querySelector('#'+sgDeviceIdPrefix+data.id+' .device'),
			transform = rotateLR+' '+rotateFB+' '+rotateDir;
			
		if (device) {
			device.style.transform = transform;
		}
	};



	/**
	* add event listeners for socket
	* @returns {undefined}
	*/
	var initSocketListeners = function() {
		io.on('joined', joinedHandler);
		io.on('newuser', newUserHandler);
		io.on('disconnect', disconnectHandler);
		io.on('tiltchange', tiltChangeHandler);
	};


	
	/**
	* initialize this view when connection is ready
	* @returns {undefined}
	*/
	var initView = function() {
		initSocketListeners();
	};

	
	/**
	* kick off the app once the socket is ready
	* @param {event} e The ready.socket event sent by socket js
	* @param {Socket} socket This client's socket
	* @returns {undefined}
	*/
	var connectionReadyHandler = function(e, io) {
		if (io) {
			initView();
		}
	};
	
	

	// init when connection is ready	
	document.addEventListener('connectionready.socket', initView);
	// document.addEventListener('DOMContentLoaded', init);

})();