require('babel-register')({
    ignore: /node_modules/
});

require('babel-polyfill');

require('dotenv').config();

require('./server/');