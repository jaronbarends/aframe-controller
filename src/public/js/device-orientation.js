;(function() {

	// define semi-global variables (vars that are "global" in this file's scope) and prefix them
	// with sg so we can easily distinguish them from "normal" vars

	/**
	* handle device orientation change
	* @param {object} data Event data
	* @returns {undefined}
	*/
	var deviceOrientationHandler = function(data) {
		//create object with data to pass on
		var newData = {
			tiltLR: data.gamma, //left-to-right tilt in degrees, where right is positive
			tiltFB: data.beta,//front-to-back tilt in degrees, where front is positive
			dir: data.alpha,//compass direction the device is facing in degrees
		};

		const evt = new CustomEvent('tiltchange.deviceorientation', {detail: newData});
		document.body.dispatchEvent(evt);
	};


	/**
	* initialize all
	* @returns {undefined}
	*/
	var init = function() {

		if (window.DeviceOrientationEvent) {
			window.addEventListener('deviceorientation', deviceOrientationHandler, false);
		} else {
			//notify the rest of the page deviceorientation is not supported
			const evt = new CustomEvent('nosupport.deviceorientation');
			document.body.dispatchEvent(evt);
		}
	};
	
	document.addEventListener('DOMContentLoaded', init);

})();