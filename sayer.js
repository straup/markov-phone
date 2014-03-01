#!/usr/bin/env node

var http = require('http');
var fs = require('fs');

var markov = require('markov');
var opts = require('optimist');

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

var server = http.createServer(function(request, response){
    
    var rsp = function(msg){

	console.log("Send " + msg);

	response.writeHead(200, {"Content-Type": 'text/xml'});
	response.write("<?xml version=\"1.0\" encoding=\"UTF-8\" ?><Response><Say>This is ' + argv['name'] + ', as a service.</Say><Pause /><Say>" + msg + "</Say></Response>");
	response.end();
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
	var msg = generateLine(maxLength1) + '. ' + generateLine(maxLength2);
	rsp(msg);
    });

});

console.log("Listening on port " + argv['port']);
server.listen(argv['port']);

