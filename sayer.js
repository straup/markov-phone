#!/usr/bin/env node

var http = require('http');
var url = require('url');
var fs = require('fs');
var markov = require('markov');
var opts = require('optimist');

// setup

var argv = opts.argv;

if (! argv['seed']){
    console.log("You forgot to specify a seed text");
    process.exit()
}

if (! argv['port']){
    argv['port'] = 9999;
}

if (! argv['name']){
    argv['name'] = 'Markov Phone';
}

if (argv['uid'] === undefined){
    argv['uid'] = (process.env.SUDO_UID) ? parseInt(process.env.SUDO_UID) : undefined;
}

if (argv['uid'] === undefined){
    console.log("Your forgot to specify a user ID");
    // process.exit();
}

console.log(argv);

console.log("Starting up " + argv['name']);
console.log("Reading from " + argv['seed']);

console.log("Listening on port " + argv['port']);

if (argv['uid'] === undefined){
    console.log("Running as you");
}

else {
    console.log("Running as user ID " + argv['uid']);
}

// functions and stuff

var server = http.createServer(function(request, response){

    var send_txt = function(msg){
	response.writeHead(200, {"Content-Type": 'text/plain'});
	response.write(msg);
	response.end();
    };
    
    var send_xml = function(msg){
	response.writeHead(200, {"Content-Type": 'text/xml'});
	response.write('<?xml version="1.0" encoding="UTF-8" ?>');
	response.write('<Response>');
	response.write('<Say>This is ' + argv['name'] + ', as a service.</Say>');
	response.write('<Pause />');
	response.write('<Say>' + msg + '</Say>');
	response.write('</Response>');
	response.end();
    };

    var send_msg = function(msg){

	console.log("Send '" + msg + "'");

	var headers = request.headers;
	var accept = headers['accept'];
	
	if (accept == 'text/plain'){
	    return send_txt(msg);
	}
	
	return send_xml(msg);
    };

    var generateLine = function(maxLength) {

	var line = '';

	var picked_words = [];
	var words = m.fill(m.pick());

	for (var i = 0; i < words.length; i++) {

	    picked_words.push(words[i]);
	    
	    if (picked_words.join(" ").length > maxLength) {
		picked_words.pop();
		break;
	    }
	    
	}
	
	if (picked_words[picked_words.length - 1] === "a") {
	    picked_words.pop();
	}
	
	line = picked_words.join(" ");
	return line;
    };

    var maxLength1 = Math.floor(Math.random()*(98-38+1)+38);
    var maxLength2 = 140 - 3 - maxLength1;

    var m = markov(1);
    var s = fs.createReadStream(argv['seed']);

    m.seed(s, function (){
	var msg = generateLine(maxLength1) + '. ' + generateLine(maxLength2) + '.';
	send_msg(msg);
    });

});

// go!

server.listen(argv['port'], function(err){

    if (err){
	console.log(err);
	process.exit();
    }

    if (argv['uid'] !== undefined){

	process.setuid(argv['uid']);
	whoami = process.getuid();

	if (whoami !== argv['uid']){
	    console.log("Tried to set UID as " + argv['uid'] + " but got back " + whoami);
	    process.exit();
	}
    }

    //console.log("Listening.");
});
