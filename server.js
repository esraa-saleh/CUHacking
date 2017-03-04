
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
	}
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
