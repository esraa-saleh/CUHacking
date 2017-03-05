
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');
const ROOT = "./resources";

var server = http.createServer(respondToRequest);
server.listen(8080);
console.log("listening on port 8080");

function respondToRequest(req, res) {
	console.log(req.method + " :  " + req.url);
	var urlObj = url.parse(req.url, true);
	try {
		route(urlObj, res);
		res.end();
	} catch (err) {
		console.log(err);
		pageNotFound(res);
		res.end();
	}
}

function route(url, res) {
	var filename = ROOT+url.pathname;
	if (url.pathname == '/') {
		filename = ROOT+'/index.html';
		writeFile(filename, res);
	} else if (url.pathname == '/planets') {
		res.writeHead(200, {'Content-Type': 'application/json'});
	var jsstars = [];
	for (i=0; i<6000; i++) {
		jsstars[i] = [1000*Math.random, 1000*Math.random, 1000*Math.random];
	}
		res.write(JSON.stringify(jsstars));
	} else if (url.pathname == '/filters') {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<h1>'+url.query+'</h1>');
	} else {
		writeFile(filename, res);
	}
	return res;
}

function writeFile(filename, res) {
	res.writeHead(200, {'Content-Type': mime.lookup(filename)});
	res.write(fs.readFileSync(filename));
	console.log(filename);
	return res;
}

function pageNotFound(res) {
	res.writeHead(404, {'Content-Type': 'text/html'});
	console.log('404');
	res.write(fs.readFileSync(ROOT+'/404.html'));
	return res;
}
