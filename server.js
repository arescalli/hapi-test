'use strict';

const Hapi = require('hapi');
const Pg = require('pg');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/bs_translation_development';
var client = new Pg.Client(connectionString);
client.connect();
    
// Create a server with a host and port
const server = new Hapi.Server();
server.connection({ 
    host: 'localhost', 
    port: 8000 
});

// Add the route
server.route({
    method: 'GET',
    path:'/hello', 
    handler: function (request, reply) {
        var query = client.query('INSERT INTO translations_todos (t_key, t_value) VALUES (\'test1\', \'test2\')');
        return reply('hello world');
    }
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});