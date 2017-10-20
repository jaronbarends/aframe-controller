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
		sgUsers = [];//array of users, in order of joining

	
	/**
	* add identifier for this user
	* @returns {undefined}
	*/
	var initIdentifier = function() {
		const idBox = document.getElementById('id-box');
		if (idBox) {
			idBox.querySelector('.user-id').textContent = io.id;
		}
	};


	/**
	* handle socket's acceptance of join request
	* @param {object} data Data sent by the socket (currently empty)
	* @returns {undefined}
	*/
	var joinedHandler = function(data) {
		//this hub has joined the room
	};



	/**
	* handle entry of new user in the room
	* @param {object} users Updated array with users; the newly added user is the last one in the array
	* @returns {undefined}
	*/
	var newUserHandler = function(users) {
		// console.log('new user has joined: '+data.id+' ('+data.role+')');
		var newUser = users[users.length-1];

		sgUsers = users;
		console.log('new user. number of users:'+sgUsers.length);
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
		}
	};
	


	/**
	* handle the orientation change of one of the remote devices
	* @param {object} data Data sent by remote.js's tiltchange event
	* @returns {undefined}
	*/
	var tiltChangeHandler = function(data) {
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
	* send event to server to request entry to room
	* @returns {undefined}
	*/
	var joinRoom = function() {
		var user = {
				role: sgRole,
				id: io.id,
			};

		//tell socket we want to join the session
		io.emit('join', user);
	};
		
	
	/**
	* initialize this hub when
	* @param {string} varname Description
	* @returns {undefined}
	*/
	var initHub = function() {
		initIdentifier();
		initSocketListeners();
		joinRoom();
	};

	


	// init when connection is ready	
	document.addEventListener('connectionready.socket', initHub);
	// document.addEventListener('connectionready.socket', connectionReadyHandler);

})();