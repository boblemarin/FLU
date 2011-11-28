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
	splash = document.getElementById("splash");
	splashContainer = document.getElementById("splashContainer");
	splashStatus = document.getElementById("splashStatus");
	pointer = document.getElementById("pointer");
	infoBtn = document.getElementById("infoBtn");
	info = document.getElementById("infos");

	window.addEventListener( "resize", onResize, false );
//	window.addEventListener( "orientationchange", onResize );
	onResize();
	
	// show splash
	splash.className = "";

	// connect to socket server
	if ( window["io"] ) connect();
	
	// deal with iOS standalone mode
	
	if ( "standalone" in window.navigator && !window.navigator.standalone ) {
		//TODO: faire mieux que ça (div, resize, modal, tout)
		var n = document.createElement("div");
		n.className ="notification";
		document.body.appendChild(n);
		/*
		var img = new Image();
		img.src = "img/notification.png";
		img.id = "splash";
		img.style.display = "block";
		img.style.position = "absolute";
		img.style.left = "120px";
		img.style.top = "0px";
		img.style.zIndex = 20;
		document.body.appendChild( img );
		*/
	}
	
}

function toggleInfos() {
	if ( info.className == "visible" )
		info.className = "";
	else
		info.className = "visible";
}

function onResize(e) {
	var tw = 588,
		th = 171 + 123;
	
	cw = window.innerWidth; 
	ch = window.innerHeight;

	centerImage( tw, th, cw, ch, 20 );
}

function centerImage( w, h, sw, sh, m ) {
	var s = Math.min( 1, (sw-2*m)/w, (sh-2*m)/h );
	w *= s;
	h *= s;
	splashContainer.style.width = w + "px";
	splashContainer.style.height = h + "px";
	splashContainer.style.left = ((sw-w)*.5) + "px";
	splashContainer.style.top = ((sh-h)*.5) + "px";
}

function filterEvent( event ) {
	if ( event.target.nodeName == "A" ) {
		switch( event.target ) {
			case infoBtn:
				toggleInfos();
				return true;
				
			default:
//				console.log( event.target.href );
				window.open(event.target.href);
				return true;
				
		}
	}
	return false;
}

/*******************************************************************/
/* HANDLE TOUCH INPUT **********************************************/
/*******************************************************************/

function onTouchStart(event) 
{
	if ( !filterEvent(event) && !touched ) {
		/*
	if ( event.target == infoBtn ) {
		toggleInfos();
	}
	else if ( !touched )
	{
	*/
		var t = event.changedTouches[0];
		touchID = t.identifier;
		touchStart( t.pageX, t.pageY );
	}

	event.preventDefault(); 
	return true;
}

function onTouchMove(event) 
{
	if ( touched )
	{
		var ts = event.changedTouches,
				n = ts.length, t;
		while( n-- )
		{
			t = ts[n];
			if ( t.identifier == touchID )
			{
				touchMove( t.pageX, t.pageY );
				break;
			}
		}
	}

	event.preventDefault();
	return true;
} 

function onTouchEnd(event) 
{ 
	if ( touched )
	{
		var ts = event.changedTouches,
				n = ts.length, t;
		while( n-- )
		{
			t = ts[n];
			if ( t.identifier == touchID )
			{
				touchEnd();
				break;
			}
		}
	}
	
	event.preventDefault();
	return true;
}

/*******************************************************************/
/* HANDLE MOUSE INPUT **********************************************/
/*******************************************************************/

function onMouseDown( event ) 
{
	if ( !filterEvent(event) && !touched ) {
		/*
console.log();
	if ( event.target.nodeName == "A" )//event.target == infoBtn ) {
		switch( )
		toggleInfos();
	}
	else if ( !touched )
	{
	*/
		touchStart( event.pageX, event.pageY );
	}
	
	event.preventDefault();
	event.stopImmediatePropagation();
}

function onMouseMove(event) 
{
	if ( touched )
	{
		touchMove( event.pageX, event.pageY );
	}
	
	event.preventDefault();
	event.stopImmediatePropagation();
}

function onMouseUp( event ) 
{
	if ( touched )
	{
		touchEnd();
	}
	
	event.preventDefault();
	event.stopImmediatePropagation();
}



/*******************************************************************/
/* ABSTRACT INPUT HANDLERS *****************************************/
/*******************************************************************/


function touchStart( x, y )
{
	pointer.className = "touched";
	touched = true;
	values.touched = true;
	touchMove( x, y );
	//ctx.clearRect( 0, 0, cw, ch );
	//var t = e.changedTouches[0];
}

function touchMove( x, y )
{
	touchX = x;
	touchY = y;
	values.x = x / cw;
	values.y = y / ch;
}

function touchEnd()
{
	pointer.className = "";
	touched = false;
	values.touched = false;
	socket.emit('message', values);
	//socket.send( values );
	
}

/*******************************************************************/
/* MAIN LOOP *******************************************************/
/*******************************************************************/

function updateDisplay()
{
	
	if ( touched )
	{
		//var r = 40;
	
		//canvas.width = canvas.width;
	
//	ctx.clearRect( 0, 0, cw, ch );
	/*
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.fillStyle = 'rgba(200, 200, 200, .05)';
		ctx.strokeStyle = 'rgba(200, 200, 200, .2)';
		ctx.arc( touchX, touchY, r, 0, 7 );
		ctx.stroke();
		*/
//	ctx.fill();
		/*
		ctx.beginPath();
		ctx.lineWidth = 1;
		ctx.strokeStyle = 'rgba(200, 200, 200, .1)';
		ctx.arc( cw-touchX, touchY, r, 0, 7 );
		ctx.arc( cw-touchX, ch-touchY, r, 0, 7 );
		ctx.arc( touchX, ch-touchY, r, 0, 7 );
		ctx.stroke();

*/
		
		//pointer.style.webkitTransform = "translate( " + t.pageX + "px, " + t.pageY + "px );"
		pointer.style.top = touchY + "px";
		pointer.style.left = touchX + "px";
		
		//socket.send( values );	
		socket.emit('message', values);	
		//socket.broadcast.emit('message', values );
	}
}

function onStartAction(e) {
	
	splash.className = "hidden";
	status = "started";
	splashStatus.className = "started";

	pointer.style.top = "0px";
	pointer.style.left = "0px";
	
	document.removeEventListener( 'touchstart', onStartAction, false );
	document.removeEventListener( 'mousedown', onStartAction, false );
	
	started = true;
	
	// set-up touch interaction
	document.addEventListener( 'touchstart', onTouchStart, false );
	document.addEventListener( 'touchmove', onTouchMove, false );
	document.addEventListener( 'touchend', onTouchEnd, false );

	// set-up mouse interaction
	document.addEventListener( 'mousedown', onMouseDown, false );
	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'mouseup', onMouseUp, false );
	
	
	// watch loop
	setInterval( updateDisplay, 1000 / 35 );
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
		splashStatus.className = "connected";
		status = "connected";
		
		document.addEventListener( 'touchstart', onStartAction, false );
		document.addEventListener( 'mousedown', onStartAction, false );
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

