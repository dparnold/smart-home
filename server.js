//step 1) require the modules we need
var
    http = require('http'),
    path = require('path'),
    fs = require('fs'),

    //these are the only file types we will support for now
    extensions = {
        ".html": "text/html",
        ".css": "text/css",
        ".js": "application/javascript",
        ".png": "image/png",
        ".gif": "image/gif",
        ".jpg": "image/jpeg"
    };
subfolders = {
    ".html": "text/html",
    ".css": "css/",
    ".js": "js/",
    ".png": "images/",
    ".gif": "images/",
    ".jpg": "images/"
};

function getFile(filePath, res, page404, mimeType) {
    fs.exists(filePath, function (exists) {
        if (exists) {
            fs.readFile(filePath, function (err, contents) {
                if (!err) {
                    res.writeHead(200, {
                        "Content-type": mimeType,
                        "Content-Length": contents.length
                    })
                    res.end(contents);
                } else {
                    console.dir(err);
                }
            })
        } else {

            fs.readFile(page404, function (err, contents) {
                if (!err) {
                    res.writeHead(404, { 'Content-Type': 'text/html' })
                    res.end(contents);
                } else {
                    console.dir(err);
                }
            })
        }
    })
}

function requestHandler(req, res) {
    var
        fileName = path.basename(req.url) || 'index.html',
        ext = path.extname(fileName),
        localFolder = __dirname + '/public',
        page404 = localFolder + '/404.html';
        subDirname = path.dirname(req.url);
    if (subDirname =="/"){subDirname="";}
    var filePath = localFolder+subDirname +"/"+ fileName;
    console.log(filePath);
    if (!extensions[ext]) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end("<html><head></head><body>The requested file type is not supported</body></html>");
    }

    getFile(filePath, res, page404, extensions[ext]);
}


http.createServer(requestHandler).listen(52114);

console.log('Node server is running on http://localhost:52114');