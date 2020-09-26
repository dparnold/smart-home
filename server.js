var
	http = require('http'),
	path = require('path'),
	fs = require('fs');

var alarm;

const { exec } = require('child_process');

const codes = ["1394001", "1394004", "1397073", "1397087", "1397841", "1397844", "1398033", "1398036"];

//these are the only file types we will support for now
extensions = {
	".html": "text/html",
	".css": "text/css",
	".js": "application/javascript",
	".png": "image/png",
	".gif": "image/gif",
	".jpg": "image/jpeg"
};

function sendCode(code, delay) {
	var alarm = setTimeout(function () {
		exec('/opt/433Utils/RPi_utils/codesend ' + code, (err, stdout, stderr) => {
			if (err) {
				console.error(err);
			} else {
				console.log(`stdout: ${stdout}`);
			}
		});
	}, delay * 1000);
	return alarm;
}

//helper function handles file verification
function getFile(filePath, res, page404, mimeType) {
	//does the requested file exist?
	fs.exists(filePath, function (exists) {
		//if it does...
		if (exists) {
			//read the fiule, run the anonymous function
			fs.readFile(filePath, function (err, contents) {
				if (!err) {
					//if there was no error
					//send the contents with the default 200/ok header
					res.writeHead(200, {
						"Content-type": mimeType,
						"Content-Length": contents.length
					});
					res.end(contents);
				} else {
					//for our own troubleshooting
					console.dir(err);
				};
			});
		} else {
			//if the requested file was not found
			//serve-up our custom 404 page
			fs.readFile(page404, function (err, contents) {
				//if there was no error
				if (!err) {
					//send the contents with a 404/not found header 
					res.writeHead(404, { 'Content-Type': 'text/html' });
					res.end(contents);
				} else {
					//for our own troubleshooting
					console.dir(err);
				};
			});
		};
	});
};

//a helper function to handle HTTP requests
function requestHandler(req, res) {
	var
		fileName = path.basename(req.url) || 'alarm.html',
		ext = path.extname(fileName),
		subDirname = path.dirname(req.url),
		url = req.url.split("/"),
		localFolder = __dirname + '/public',
		page404 = localFolder + '404.html';

	if (subDirname == "/") { subDirname = ""; }
	var filePath = localFolder + subDirname + "/" + fileName;



	if (url[1] == "api") {
		switch (url[2]) {
			case "socket":
				var socket = parseInt(url[3], 10) || 1;
				var state = parseInt(url[4], 10) || 0;
				var delay = parseInt(url[5], 10) || 0;
				sendCode(codes[2 * socket - state - 1], delay);
				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.end("Success");
				break;
			case "alarm":
				switch (url[3]) {
					case "set":
						alarm = sendCode(codes[0], parseInt(url[4], 10));
						break;
					case "stop":
						if (alarm == undefined) {
						}
						else {
							clearTimeout(alarm);
							alarm = undefined;
						}
						console.log("alarm stopped");
						break;
					default:
						break;
				}
				res.writeHead(200, { 'Content-Type': 'text/html' });
				res.end("Success");
				break;
		}
	}
	else {
		if (!extensions[ext]) {
			//for now just send a 404 and a short message
			res.writeHead(404, { 'Content-Type': 'text/html' });
			res.end("<html><head></head><body>The requested file type is not supported</body></html>");
		};
		getFile(filePath, res, page404, extensions[ext]);
	}
};

//step 2) create the server
http.createServer(requestHandler)

	//step 3) listen for an HTTP request on port 3000
	.listen(3000);