'use strict';

const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;

exports.lookup = (event, context, callback) => {
    var shortened = event['pathParameters']['shortened'];

    var params = {
        TableName: tableName,
        Key: {
            shortened: shortened
        }
    };

    docClient.get(params, function (err, data) {
        if (err) {
            console.log(err);
            callback(err, response(502, {
                error: "Failed to shorten."
            }));
        } else {
            callback(null, response(
                data.Item ? 200 : 400,
                { url: data.Item.url }
        ));
        }
    });
};


var response = function (statusCode, body) {
    return {
        isBase64Encoded: false,
        statusCode: statusCode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    }
};