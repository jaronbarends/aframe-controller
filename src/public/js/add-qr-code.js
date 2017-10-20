;(function() {

	'use strict';

	const sgHiddenClass = 'qr-box--is-hidden';

	/**
	* 
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var addRemoteQRCode = function() {
		var url = window.location.href,
			arr = url.split('/'),
			remoteUrl = arr[0]+'//'+arr[2]+'/remote.html',
			qrSrc = 'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl='+encodeURIComponent(remoteUrl),
			qrElm = document.getElementById('qr-code');
		
		qrElm.innerHTML = '<img src="'+qrSrc+'"><br><a href="'+remoteUrl+'">'+remoteUrl+'</a>';
	};


	/**
	* handle new user connecting - hide the qr-box
	* @returns {undefined}
	*/
	const newUserHandler = function() {
		document.getElementById('qr-box').classList.add('qr-box--is-hidden');
	};


	/**
	* handle new user connecting - hide the qr-box
	* @returns {undefined}
	*/
	const disconnectHandler = function() {
		document.getElementById('qr-box').classList.remove('qr-box--is-hidden');
	};
	


	/**
	* kick off the app once the socket connection is ready
	* @param {event} e The ready.socket event sent by socket js
	* @param {Socket} socket This client's socket
	* @returns {undefined}
	*/
	const init = function(e) {
		addRemoteQRCode();
		io.on('newuser', newUserHandler);
		io.on('disconnect', disconnectHandler);
	};
	


	// init when connection is ready	
	document.addEventListener('connectionready.socket', init);

})();