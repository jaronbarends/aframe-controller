;(function() {
	
	

	/**
	* send an event to the socket server that will be passed on to all sockets
	* @returns {undefined}
	*/
	const sendEventToSockets = function(eventName, eventData) {
		var data = {
			eventName: eventName,
			eventData: eventData
		};
		io.emit('passthrough', data);
	};
	
	// define util-object
	window.util = window.util || {};
	window.util.sockets = window.util.sockets || {};

	// expose functions to window
	window.util.sockets.sendEventToSockets = sendEventToSockets;
})();