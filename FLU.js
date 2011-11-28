var http = require('http'),
	url = require('url'),
	fs = require('fs'),
	io = require('socket.io'),//require('../'), //
	sys = require(process.binding('natives').util ? 'util' : 'sys'),
	server;
    
server = http.createServer( function( req, res ) 
{
	var path = url.parse(req.url).pathname;
	
	if ( path == '/' )
	{
		fs.readFile( __dirname + "/controller.html", function(err, data){
			if (err) return send404(res);
			res.writeHead(200, {'Content-Type': 'text/html'})
			res.write(data, 'utf8');
			res.end();
		});
	}
	else
	{
		var extension = path.substr( path.lastIndexOf(".")+1 );

		switch ( extension )
		{
			case 'htm':
			case 'html':
				fs.readFile( __dirname + path, function(err, data){
					if (err) return send404(res);
					res.writeHead(200, {'Content-Type': 'text/html'})
					res.write(data, 'utf8');
					res.end();
				});
				break;
				
			case 'js':
				fs.readFile( __dirname + path, function(err, data){
					if (err) return send404(res);
					res.writeHead(200, {'Content-Type': 'text/javascript'})
					res.write(data, 'utf8');
					res.end();
				});
				break;
				
			case 'css':
				fs.readFile( __dirname + path, function(err, data){
					if (err) return send404(res);
					res.writeHead(200, {'Content-Type': 'text/css'})
					res.write(data, 'utf8');
					res.end();
				});
				break;	
				
			case 'jpg':
			case 'png':
			case 'gif':
				fs.readFile(__dirname + path, function(err, data){
					if (err) return send404(res);
					res.writeHead(200, {'Content-Type': 'image/'+extension })
					res.write(data, 'utf8');
					res.end();
				});
				break;
				
			case 'swf':
				fs.readFile(__dirname + path, function(err, data){
					if (err) return send404(res);
					res.writeHead(200, {'Content-Type': 'application/x-shockwave-flash' })
					res.write(data, 'utf8');
					res.end();
				});
				break;
				
			default:
				//send404(res);
				fs.readFile( __dirname + "/controller.htm", function(err, data){
					if (err) return send404(res);
					res.writeHead(200, {'Content-Type': 'text/html'})
					res.write(data, 'utf8');
					res.end();
				});
		}
	}
} ),

send404 = function(res){
	res.writeHead(404);
	res.write('404');
	res.end();
};

server.listen(80);


var io = io.listen(server),
	masterClient,
	buffer = [];
  
io.sockets.on('connection', function(client)
{
	//sys.debug("======== connection");
	//client.send({ buffer: buffer });
	//client.broadcast({ announcement: client.sessionId + ' connected' });
	client.on('message', function(message)
	{
		if ( message == 'master' ) 
		{
			masterClient = client;
			//sys.debug( '=== found a master : ' + masterClient.id );
		}
		else
		{
//			sys.debug( '=== message received : ' + message.touched );
			//sys.debug( 'got values : ' + message );
			if ( masterClient != null )
			{
				masterClient.json.send( { 
					"message": client.id, 
					"x": message.x,
					"y": message.y,
					"touched": message.touched,
					"plus": "chose"
				} );
			}
		}
	} );
	
	client.on('config', function(message)
	{
		if ( masterClient != null ) {
			masterClient.json.send( { 
				"config": message.info
			} );
		}
	} );

	client.on('disconnect', function()
	{
		if ( masterClient != null )
		{
			if ( client.id == masterClient.id ) 
			{
				//sys.debug( '=== disconnecting master with id: ' + client.id );
				masterClient = null;
			}
			else if ( masterClient != null )
			{
				//sys.debug( '=== disconnecting player width id: ' + client.id );
				masterClient.json.send( { "disconnect": client.id });
			}
		}
	});
	
});