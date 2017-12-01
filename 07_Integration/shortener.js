`use strict`;
const AWS = require('aws-sdk');

const client = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.shorten = (event, context, callback) => {
    var body = event['body'];
    var j = JSON.parse(body);
    var url = j['url'];
    var h = hash(url);

    var params = {
        TableName: tableName,
        Item: {
            shortened: h,
            url: url
        }
    };

    var redirect = h;
    if (event && event["headers"] &&
        event["headers"]["Host"] && event["requestContext"] &&
        event["requestContext"]["stage"]) {
        redirect = "https://" + event["headers"]["Host"] + "/" + event["requestContext"]["stage"] + "/" + redirect;
    }

    client.put(params, function(err, data) {
        if (err) {
            console.log("err: " + err);
            callback(err, response(502, {
                error: "Failed to shorten."
            }));
        } else {
            callback(null, response(200, {
                hash: h,
                redirect: redirect,
                url: url
            }));
        }
    });
}

var response = function(statusCode, body) {
    return {
        isBase64Encoded: false,
        statusCode: statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }
};

const TABLE = "ABCDEFGHJIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const TABLE_LEN = TABLE.length;

var hash = function(s) {
    // output
    var o = "";

    // salt the URL to prevent reversing/precomputing hashes
    s = Date.now() + s;

    // hash the URL
    var h = Math.abs(s.split("").reduce(function(a,b) {
        a = ((a<<5) - a) + b.charCodeAt(0);
        return a & a }, 0));

    // round up to an even number of bytes in the hash
    var hs = h.toString();
    if (hs.length % 2 != 0) {
        hs += "0";
    }

    // apply the hash against the table of character
    // discard most of the bytes, just use the mod
    for (var i = 0; i < hs.length; i += 2) {
        var b = hs[i] * 0xFF + hs[i + 1];
        o += TABLE[b % TABLE_LEN];
    }

    return o;
};
