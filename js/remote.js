var canvas, ctx,
	cw = 128,
	ch = 96,
	touchX,
	touchY,
	touchID,
	touched = false,
	start,
	wait,
	started = false,
	values = { x:0, y: 0, touched: false };

var status = "connecting",
	splash,
	splashContainer,
	splashStatus,
	info,
	infoBtn,
	pointer;

/*******************************************************************/
/* SET-UP **********************************************************/
/*******************************************************************/

function init() 
{
	// connect to socket server
	if ( window["io"] ) connect();	
	
	// set-up touch interaction
	document.addEventListener( 'touchstart', onInput, false );

	// set-up mouse interaction
	document.addEventListener( 'mousedown', onInput, false );
}

function onInput(event) {
	if ( event.target.id ) {
		socket.emit('config', { info: event.target.id } );
	}
}


/*******************************************************************/
/* COMMUNICATION STUFF *********************************************/
/*******************************************************************/

function connect()
{
	//socket = new io.Socket(null, {port: 80, rememberTransport: false});
	//socket.connect();
	socket = io.connect(null );//'http://192.168.2.8'); // null);//
	socket.on('connect', function(){ 
		//wait.style.display = "none";
		status = "connected";
	});
	
	socket.on('disconnect', function(){ 
		//wait.style.display = "block"; 
		message( 'Disconnected', true ) 
	});
	
	socket.on('reconnect', function(){  
		//wait.style.display = "none";
		message( 'Reconnected to server', false ) 
	});
	
	socket.on('reconnecting', function( nextRetry ){ 
		//wait.style.display = "block"; 
		//message( 'Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms', true );
		message( 'Attempting to re-connect to the server', true ) 
	} );
		
	socket.on('reconnect_failed', function(){ 
		//wait.style.display = "block"; 
		message( 'Reconnected to server FAILED.', true ) 
	});
}

function message( msg, showDiv ) {
	/*
	wait.innerHTML = msg; // + '<br/>';
	if ( showDiv )
		wait.style.display = "block";
	else
		wait.style.display = "none";
		*/
}

