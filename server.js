var http = require('http');
var fs = require('fs');
var mime = require('mime');
var path = require('path');


const PORT=8081;
const staticBasePath = './'


http.createServer(function(req, res) {
    if (req.method === 'POST') {
        var resolvedBase = path.resolve(staticBasePath);
        var safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
        var fileLoc = path.join(resolvedBase, safeSuffix);
        console.log('POST: ' + fileLoc);

        let body = '';
        req.on('data', function (data) {
            body += data;
        });
        
        console.log('post body: ' + req.body);
        fs.writeFile(fileLoc, body, (err) => {
            if (err){
                throw err;
            }
        });

    } else {
    var resolvedBase = path.resolve(staticBasePath);
    var safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    var fileLoc = path.join(resolvedBase, safeSuffix);
    console.log('Requested: ' + fileLoc);

    var stream = fs.createReadStream(fileLoc);

    stream.on('error', function(error) {
        res.writeHead(404, 'Not Found');
        res.write('404: File Not Found!');
        res.end();
    });

    res.writeHeader(200, {"Content-Type": mime.getType(req.url)});
    stream.pipe(res);}

}).listen(PORT);