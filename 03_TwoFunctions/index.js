'use strict';
console.log('Loading HelloWorld function');

exports.handler = (event, context, callback) => {
    callback(null, 'Hello, ' + event['name'] + '!');
};

exports.second = (event, context, callback) => {
    callback(null, 'Second function was invoked!')
}
