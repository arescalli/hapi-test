var http = require('http');
var pg = require('pg');
var async = require('async');

var connectionString = process.env.DATABASE_URL || 'postgres://@localhost:5432/bs_translation_development';


var server = http.createServer(function(req, res) {
	console.log('Creo server ' + req.url);
	if (req.url != '/write') {
		res.writeHead(200, {'content-type': 'text/plain'});    
    res.end('Ok. Call /write to write rows');
		return true;
	}
  // get a pg client from the connection pool
  pg.connect(connectionString, function(err, client, done) {

    var handleError = function(err) {
      // no error occurred, continue with the request
      if(!err) return false;

      // An error occurred, remove the client from the connection pool.
      // A truthy value passed to done will remove the connection from the pool
      // instead of simply returning it to be reused.
      // In this case, if we have successfully received a client (truthy)
      // then it will be removed from the pool.
      if(client){
        done(client);
      }
      res.writeHead(500, {'content-type': 'text/plain'});
      console.log(err);
      res.end('An error occurred');
      return true;
    };

    // handle an error from the connection
    if(handleError(err)) return;

    // record the visit
    var hugeArray = []
    for (var i = 0; i < 5000; i++) {
    	hugeArray.push(i);
		}

    // var query = client.query('INSERT INTO test (descr) VALUES ($1)', ['testing']);

    async.each(hugeArray, function (item, callback) {
		   client.query('INSERT INTO test (descr) VALUES ($1)', ['testing' + item], function(result) {
		   	callback();
		   })
		}, function() {
		    client.end(); 
    		res.writeHead(200, {'content-type': 'text/plain'});
    		res.end('writed all');
		});
    // query.on('end', function() { 
    // 	client.end(); 
    // 	res.writeHead(200, {'content-type': 'text/plain'});
    // 	res.end('writed all');
    // });

  });
})

server.listen(3001);
console.log('qui partito server');

