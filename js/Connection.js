var socket,
		players = {};

function readPlayerValues( obj )
{
	
	var id = obj.message;
	lastUpdate = new Date().getTime();
	
	if ( id in players )
	{
		// update position
		var player = players[id];
		player.x = ( obj.x * 2 - 1 ) * ratio;
		player.y = obj.y * -2 + 1;
		player.touched = obj.touched;
		player.lastUpdate = new Date().getTime();
	}
	else
	{
		// new player : create and add to array
		//score.innerHTML = "player " + id + " connected, WELCOME";
		var newPlayer = {};
		newPlayer.color = 'rgba(' + Math.round( Math.random() * 180 ) + ', ' + Math.round( Math.random() * 180 ) + ', ' + Math.round( Math.random() * 180 ) + ', .2)';
		newPlayer.touched = true;//obj.values.touched;
		newPlayer.x = ( obj.x * 2 - 1 ) * ratio;
		newPlayer.y = obj.y * -2 + 1;
		newPlayer.lastUpdate = new Date().getTime();
		players[id] = newPlayer;
		
		switchColor();
	}
}


function connect()
{
//	socket = new io.Socket(null, {port: 80, rememberTransport: false});
//	socket.connect();
	socket = io.connect('http://localhost');
	socket.on('message', function(obj){
//		console.log(obj);
		if ( obj["message"] )
		{
			readPlayerValues(obj);
		}
		else if (obj['disconnect']){
			//score.innerHTML = "player " + obj.disconnect + " disconnected";
			//delete players[ obj.disconnect ];
		} 
		else if (obj['config']){
			switch( obj.config ) {
				case "mode1":
				setRenderMode(0);
				break;
				case "mode2":
				setRenderMode(1);
				break;
				case "mode3":
				setRenderMode(2);
				break;
				case "mode4":
				setRenderMode(3);
				break;
				case "color":
				switchColor();
				break;
				case "infos":
				toggleConnect();
				break;
			}
		}
		else
		{
			//score.innerHTML = "received something";
		}
	});

	socket.on('connect', function(){ 
		console.log("connected");
		//ctx.fillStyle = 'rgba(0,255,0, .2)';
		//ctx.fillRect( 0, 0, cw, ch );
		socket.send( 'master' );
	});
	socket.on('disconnect', function(){ console.log("disconnected"); message({ message: ['System', 'Disconnected']})});
	socket.on('reconnect', function(){ console.log("reconnect");message({ message: ['System', 'Reconnected to server']})});
	socket.on('reconnecting', function( nextRetry ){ message({ message: ['System', 'Attempting to re-connect to the server, next attempt in ' + nextRetry + 'ms']})});
	socket.on('reconnect_failed', function(){ message({ message: ['System', 'Reconnected to server FAILED.']})});
}

function message( a ) {
	
}