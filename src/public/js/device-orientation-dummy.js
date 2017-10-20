/*
* device-orientation-dummy.js
* 
* dummy for emulating device orientation
*/
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
	* when remote is tilted, update sgOrientation for future updates
	* @param {event} e The tiltchange.deviceorientation event sent by device-orientation.js
	* @returns {undefined}
	*/
	var tiltChangeHandler = function(e) {
		const data = e.detail;
		var tiltLR = Math.round(data.tiltLR),
			tiltFB = Math.round(data.tiltFB),
			dir = Math.round(data.dir);

		dir -= sgCompassCorrection;

		if (sgOrientation.tiltLR !== tiltLR || sgOrientation.tiltFB !== tiltFB || sgOrientation.dir !== dir) {
			sgOrientation = {
				tiltLR: tiltLR,
				tiltFB: tiltFB,
				dir: dir
			};
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
	* handle input from dummy
	* @returns {undefined}
	*/
	const mimicTiltchange = function(e, data) {
		e.preventDefault();
		const tiltLRdelta = data.tiltLR || 0,
			  tiltFBdelta = data.tiltFB || 0,
			  dirDelta = data.dir || 0;
		
		var newData = {
			tiltLR: sgOrientation.tiltLR + tiltLRdelta, //left-to-right tilt in degrees, where right is positive
			tiltFB: sgOrientation.tiltFB + tiltFBdelta,//front-to-back tilt in degrees, where front is positive
			dir: sgOrientation.dir + dirDelta,//compass direction the device is facing in degrees
		};

		const evt = new CustomEvent('tiltchange.deviceorientation', {detail: newData});
		document.body.dispatchEvent(evt);
	};
	


	/**
	* initialize dummy remote
	* @returns {undefined}
	*/
	const initControls = function() {
		const delta = 10;
		document.getElementById('lr-minus').addEventListener('click', (e) => { mimicTiltchange(e, {tiltLR: -delta}); });
		document.getElementById('lr-plus').addEventListener('click', (e) => { mimicTiltchange(e, {tiltLR: delta}); });
		document.getElementById('fb-minus').addEventListener('click', (e) => { mimicTiltchange(e, {tiltFB: -delta}); });
		document.getElementById('fb-plus').addEventListener('click', (e) => { mimicTiltchange(e, {tiltFB: delta}); });
		document.getElementById('dir-minus').addEventListener('click', (e) => { mimicTiltchange(e, {dir: -delta}); });
		document.getElementById('dir-plus').addEventListener('click', (e) => { mimicTiltchange(e, {dir: delta}); });
	};
	
	
	


	/**
	* initialize the remote
	* @returns {undefined}
	*/
	var initDummy = function() {
		initControls();
	};


	/**
	* kick off the app once the socket connection is ready
	* @param {event} e The ready.socket event sent by socket js
	* @returns {undefined}
	*/
	var init = function(e) {
		initDeviceOrientation();
		initDummy();
	};
	
	
	// init when connection is ready	
	document.addEventListener('connectionready.socket', init);


})(jQuery);