#!/usr/bin/env node

var http = require('http');
var url = require('url');
var fs = require('fs');
var markov = require('markov');
var opts = require('optimist');
var strip = require('strip');

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

	msg_clean = strip(msg);

	response.writeHead(200, {"Content-Type": 'text/plain'});
	response.write(msg_clean);
	response.end();
    };
    
    var send_xml = function(msg){

	name_clean = strip(argv['name']);
	msg_clean = strip(msg);

	response.writeHead(200, {"Content-Type": 'text/xml'});
	response.write('<?xml version="1.0" encoding="UTF-8" ?>');
	response.write('<Response>');
	response.write('<Say>This is ' + name_clean + ', as a service.</Say>');
	response.write('<Pause />');
	response.write('<Say>' + msg_clean + '</Say>');
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

    // Okay. This is the part where a piece of relatively simple code gets silly
    // and complicated. But you know... doge. So it stays for the time being...
    // (20140304/straup)

    var generateDoge = function(){

	var generateDogeTreat = function(treat, tries){

	    if (! tries){
		tries = 1;
	    }
	    
	    var words = m.fill(m.pick());
	    
	    for (i in words){

		var w = words[i].toLowerCase();

		if (w.length > 10){

		    if (w != treat){
			return w;
		    }
		}
	    }

	    if (tries == 10){
		return 'KITTENS'
	    }

	    console.log("Couldn't find treat! Trying again...");

	    tries = tries + 1;
	    return generateDogeTreat(treat, tries);
	};
	
	var shuffle = function(array) {

	    for (var i = array.length - 1; i > 0; i--) {
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	    }

	    return array;
	}

	var doge = new Array('very', 'wow', 'much', 'wow', 'how', 'amaze');
	var count = doge.length;

	var idx = Math.floor((Math.random() * count)); 
	var extra = doge[idx];
	console.log('add ' + extra);

	doge.push(extra);
	doge = shuffle(doge);

	var msg = new Array();
	var treat = '';

	for (var d in doge){
	    treat = generateDogeTreat(treat);
	    // console.log(doge[d] + ' gets ' + treat);
	    msg.push(doge[d] + ' ' + treat);
	}

	msg = msg.join(' ', msg);
	return msg;
    }

    var maxLength1 = Math.floor(Math.random()*(98-38+1)+38);
    var maxLength2 = 140 - 3 - maxLength1;

    var m = markov(1);
    var s = fs.createReadStream(argv['seed']);

    m.seed(s, function (){

	if (argv['doge']){
	    var msg = generateDoge();
	}

	else {
	    var msg = generateLine(maxLength1) + '. ' + generateLine(maxLength2) + '.';
	}
	
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
