;(function() {
	
	
	/**
	* convert degrees to radians
	* @returns {undefined}
	*/
	const degreesToRadians = function(degrees) {
		return degrees * (Math.PI/180);
	};


	/**
	* get sine of angle in degrees
	* @param {number} degrees - Angle in degrees
	* @returns {undefined}
	*/
	const sinDeg = function(degrees) {
		const radians = degreesToRadians(degrees);
		return Math.sin(radians);
	};


	/**
	* get cosine of angle in degrees
	* @param {number} degrees - Angle in degrees
	* @returns {undefined}
	*/
	const cosDeg = function(degrees) {
		const radians = degreesToRadians(degrees);
		return Math.cos(radians);
	};
	
	
	
	// define util-object
	window.util = window.util || {};
	window.util.math = window.util.math || {};

	// expose functions to window
	window.util.math.sinDeg = sinDeg;
	window.util.math.cosDeg = cosDeg;
})();