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
	var sgOrientation = {// current orientation
			tiltLR: 0,
			tiltFB: 0,
			dir: 0
		},
		sgCompassCorrection = 0,
		sgScreenAngle;

	


	/**
	* handle input from dummy
	* @returns {undefined}
	*/
	const mimicTiltchange = function(e, data) {
		e.preventDefault();
		const tiltLRdelta = data.tiltLR || 0,
			  tiltFBdelta = data.tiltFB || 0,
			  dirDelta = data.dir || 0;

		// correct dir for values < 0 and compassCorrection
		let newDir = sgOrientation.dir + dirDelta;
		newDir -= sgCompassCorrection;

		if (newDir < 0) {
			newDir += 360;
		} else if (newDir > 360) {
			newDir -= 360;
		}

		let newTiltLR = sgOrientation.tiltLR + tiltLRdelta;
		// todo: also correct newTiltLR -90 - +90

		let newTiltFB = sgOrientation.tiltFB + tiltFBdelta;
		// todo: also correct newTiltFB -180 - +180

		sgOrientation.tiltLR = newTiltLR;// left-to-right tilt in degrees, where right is positive
		sgOrientation.tiltFB = newTiltFB;// front-to-back tilt in degrees, where front is positive
		sgOrientation.dir = newDir;// compass direction the device is facing in degrees

		const evt = new CustomEvent('tiltchange.deviceorientation', {detail: sgOrientation});
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


	
	// init when connection is ready	
	document.addEventListener('connectionready.socket', initDummy);


})(jQuery);