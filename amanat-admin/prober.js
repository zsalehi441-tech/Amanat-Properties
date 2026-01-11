const http = require('http');

const paths = [
    '/media-intake/ping',
    '/media-intake/property',
    '/media-intake/document',
];

const methods = ['POST', 'GET'];

paths.forEach(path => {
    methods.forEach(method => {
        const options = {
            hostname: '127.0.0.1',
            port: 1337,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`${method} ${path} -> ${res.statusCode} ${res.statusMessage}`);
                if (data.length < 100) console.log('Body:', data);
                else console.log('Body:', data.substring(0, 50) + '...');
            });
        });

        req.on('error', (e) => {
            console.error(`${method} ${path} -> Error:`, e);
        });

        req.end();
    });
});
