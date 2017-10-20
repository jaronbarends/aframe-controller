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
	const sgOrientationTable = document.getElementById('orientation-table');



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
		sgOrientationTable.classList.remove('u-is-hidden');
		var orientation = data.orientation;

		var h = '<tr>';
			h += '<td>'+orientation.tiltLR+'</td>';
			h += '<td>'+orientation.tiltFB+'</td>';
			h += '<td>'+orientation.dir+'</td>';
			h += '</td>';

		let currH = sgOrientationTable.innerHTML;
		h = currH + h;
		sgOrientationTable.innerHTML = h;

		var trs = sgOrientationTable.querySelectorAll('tr');
		if (trs.length === 12) {
			trs[1].remove();
		}
	};
		
	

	/**
	* add event listeners for socket
	* @returns {undefined}
	*/
	var initSocketListeners = function() {
		io.on('tiltchange', tiltChangeHandler);
	};


	
	/**
	* initialize this hub when
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initTableView = function() {
		initSocketListeners();
	};

	
	document.addEventListener('connectionready.socket', initTableView);

})();