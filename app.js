const http = require('http');
const tester = require('./tester');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    res.statusCode = 200;

    res.setHeader('Content-Type', 'text/html');

    res.end('<h1>Hello World !!!</h1>');


});

server.listen(port, () => {

    console.log(`Server running at port ` + port);
    tester(2);

});
