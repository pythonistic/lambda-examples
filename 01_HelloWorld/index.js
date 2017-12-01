'use strict';
console.log('Loading HelloWorld function');

exports.handler = (event, context, callback) => {
    callback(null, 'Hello, world!');
};

