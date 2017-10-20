;(() => {

	'use strict';

	// (optional) tell jshint about globals (they should remain commented out)
	/* globals someGlobalVar */ //Tell jshint someGlobalVar exists as global var

	// define semi-globals (variables that are "global" in this file's anounymous function's scope)
	// prefix them with sg so we can distinguish them from normal function-scope vars
	// var sgSomeVar = '';


	/**
	* initialize all
	* @param {string} varname Description
	* @returns {undefined}
	*/
	const init = function() {
		var car = document.getElementById('car__body');
		car.addEventListener('mouseenter', () => {
			car.setAttribute('scale', {x:2, y: 2, z:2});
		});
	};

	// kick of the script when all dom content has loaded
	document.addEventListener('DOMContentLoaded', init);

})();
