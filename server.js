'use strict';

const Hapi = require('hapi');
var pg = require('pg');
var async = require('async');
var connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/testdeploy';
// var client = new pg.Client(connectionString);
// client.connect();
    
// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

var insertion = function(request, reply) {
  pg.connect(connectionString, function(err, client, done) {
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
        return reply('hello world');
    });
  });
};

// Add the route
// server.route({
//     method: 'GET',
//     path:'/hello', 
//     handler: function (request, reply) {
//         for (var i=0; i < 500; i++)
//             var query = client.query('INSERT INTO test (descr) VALUES (\'test2\')');
//         return reply('hello world');
//     }
// });
server.route({
    method: 'GET',
    path:'/hello', 
    handler: insertion
});


// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});