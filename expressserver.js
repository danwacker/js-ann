const express = require('express');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8081;
const staticBasePath = 'C:/Users/Dan/Documents/Code Projects/HTML/ANN/';
const handler = require('./handler.js');

app.use(bodyParser.text({limit: '100mb', type: "text/plain"}));
// app.use(bodyParser.json({limit: '100mb'}));

app.get('/', (req, res) => {
    let resolvedBase = path.resolve(staticBasePath);
    let safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    let fileLoc = path.join(resolvedBase, safeSuffix);
    console.log('Requested: ' + fileLoc);

    fileLoc = './SnakePage.html';
    let stream = fs.createReadStream(fileLoc);

    stream.on('error', function(error) {
        res.writeHead(404, 'Not Found');
        res.write('404: File Not Found!');
        res.end();
    });

    res.writeHeader(200, {"Content-Type": mime.getType(req.url)});
    stream.pipe(res);
});

app.get('/*', (req, res) => {
    let resolvedBase = path.resolve(staticBasePath);
    let safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
    let fileLoc = path.join(resolvedBase, safeSuffix);
    console.log('Requested: ' + fileLoc);

    let stream = fs.createReadStream(fileLoc);

    stream.on('error', function(error) {
        res.writeHead(404, 'Not Found');
        res.write('404: File Not Found!');
        res.end();
    });

    res.writeHeader(200, {"Content-Type": mime.getType(req.url)});
    stream.pipe(res);
});

app.post('/*', (req, res) => {
    var resolvedBase = path.resolve(staticBasePath);
        var safeSuffix = path.normalize(req.url).replace(/^(\.\.[\/\\])+/, '');
        var postText = path.join(resolvedBase, safeSuffix);
        console.log('POST');

        var commandList = JSON.parse(req.body);
        handler.main(commandList);
});

app.listen(PORT, () =>{
    console.log('Local Server online');
});