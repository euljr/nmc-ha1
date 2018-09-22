const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');

// Method to parse the request and returns the data in a promise
function parseRequest(req) {
    return new Promise(resolve => {
        // Parse the URL
        const parsedUrl = url.parse(req.url, true);
        let data = {
            path: parsedUrl.pathname.replace(/^\/+|\/+$/g, ''),
            query: parsedUrl.query,
            body: {}
        };

        // Decode the incoming data
        let bodyStr = '';
        const decoder = new StringDecoder('utf-8');
        req.on('data', buffer => bodyStr += decoder.write(buffer));
        req.on('end', () => {
            bodyStr += decoder.end();
            if(bodyStr) {
                data.body = JSON.parse(bodyStr);
            }
            resolve(data);
        });
    });
}

// Server main function
async function unifiedServer(req, res) {
    console.log(`${req.method.toUpperCase()} ${req.url}`);
    // Parses the request and get the path, query and body
    const { path, query, body } = await parseRequest(req);

    // Default response data
    let responseData;
    // Default response status - 404 Not found
    let responseStatus = 404;

    // I could make a router like in the lecture, but I'm trying to make things as simple as possible
    // so I'm just checking the path for this assignment
    if(path === 'hello') {
        if(req.method.toLowerCase() === 'get' || req.method.toLowerCase() === 'post') {
            // Correct path and method - 200 Success
            responseStatus = 200;
            // Set the responseData variable depending on the request query or body parameters
            const name = query.name || body.name;
            if(name) {
                responseData = { message: `Hello ${name}!`};
            } else {
                responseData = { message: 'Hello World!' };
            }
        } else {
            // Correct path but wrong method - 405 Method not allowed
            responseStatus = 405;
        }
    }
    // Send the json response
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(responseStatus);
    res.end(responseData ? JSON.stringify(responseData) : '');
}

// Create and start the server
const httpServer = http.createServer(unifiedServer);
const httpsServer = https.createServer({
    cert: fs.readFileSync('./https/cert.pem'),
    key: fs.readFileSync('./https/key.pem'),
}, unifiedServer);
httpServer.listen(config.httpPort, () => console.log(`HTTP server listening on port ${config.httpPort} env ${config.envName}`));
httpsServer.listen(config.httpsPort, () => console.log(`HTTPS server listening on port ${config.httpsPort} env ${config.envName}`));