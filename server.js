
var http = require('http');
var fs = require('fs');
var mime = require('mime-types');
var url = require('url');

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data/myDB.db');

const ROOT = "./resources";

var server = http.createServer(respondToRequest);
server.listen(8080);
console.log("listening on port 8080");

function respondToRequest(req, res) {
	console.log(req.method + " :  " + req.url);
	var urlObj = url.parse(req.url, true);
	try {
		route(urlObj, res);
	} catch (err) {
		console.log(err);
		pageNotFound(res);
	}
}

function route(url, res) {
        var jsstars = [];
	var filename = ROOT+url.pathname;
	if (url.pathname == '/') {
		filename = ROOT+'/index.html';
		writeFile(filename, res);
	} else if (url.pathname == '/planets') {
	    res.writeHead(200, {'Content-Type': 'application/json'});
            db.all("SELECT * FROM Systems", function(err, rows) {
              rows.forEach( function(row) {
                var r = row.dist;
                var p = row.decLat;
                var t = row.ascLong; 
                jsstars[row.systemID-1] = [r*Math.cos(t)*Math.cos(p), r*Math.cos(t)*Math.sin(p), r*Math.sin(t)];
              });
            res.end(JSON.stringify(jsstars));
            }); 
	} else if(url.pathname=='/lists'){
		var list = [];
		var i = 0;
		console.log(url.query.aFilter);
		var q=url.query["aFilter"];
			if(q==1){
				db.all("select * from Planet where temp < 223", function (err, rows) {
				rows.forEach( function(row) {
					list[i++] = [row.systemID, row.name, row.temp, row.radius];
				});
				res.end(JSON.stringify(list))
				});
			}else if(q==2){
				db.all("select * from Planet where temp > 223 and temp < 273 order by temp desc", function (err, rows) {
					rows.forEach( function(row) {
					list[i++] = [row.systemID, row.name, row.temp, row.radius];
				});
				res.end(JSON.stringify(list)) }); 
		 	}else if(q==3){
				db.all("select * from Planet where temp > 273 and temp < 373 order by temp desc", function (err, rows) {
					rows.forEach( function(row) {
					list[i++] = [row.systemID, row.name, row.temp, row.radius];
				});
				res.end(JSON.stringify(list)) }); 
		 	}else if(q==4){
				db.all("select * from Planet where temp > 373 and temp < 2000 order by temp desc", function (err, rows) {
					rows.forEach( function(row) {
					list[i++] = [row.systemID, row.name, row.temp, row.radius];
				});
				res.end(JSON.stringify(list))
				});
			}else if(q==5){
				db.all("select * from Planet where temp > 2000 and temp < 4600 order by temp desc", function (err, rows) { 
					rows.forEach( function(row) { 
						list[i++] = [row.systemID, row.name, row.temp, row.radius]; 
					}); 
					res.end(JSON.stringify(list))
																												            });        }    
	} else {
		writeFile(filename, res);
	}
}

function writeFile(filename, res) {
	res.writeHead(200, {'Content-Type': mime.lookup(filename)});
	res.write(fs.readFileSync(filename));
	console.log(filename);
	res.end();
}

function pageNotFound(res) {
	res.writeHead(404, {'Content-Type': 'text/html'});
	console.log('404');
	res.end(fs.readFileSync(ROOT+'/404.html'));
}
