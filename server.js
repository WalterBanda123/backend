const http = require('http');
const app =  require('./app');
const express = require('express')

const port = process.env.PORT || 4000;


app.use(express.static('public'));
const server = http.createServer(app);
server.listen(port);