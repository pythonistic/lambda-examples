`use strict`;

const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.redirect = (event, context, callback) => {
    // pull the url from the request context
    if (event && event.params && event.params['path'] && event.params['path']['redirect']) {
        var hash = event.params['path']['redirect'];

        var payload = {
          "pathParameters": {
              "shortened": hash
          }
        };

        var params = {
            FunctionName: "arn:aws:lambda:us-west-2:############:function:lookup",
            InvocationType: "RequestResponse",
            LogType: "Tail",
            Payload: new Buffer(JSON.stringify(payload))
        };
        lambda.invoke(params, function(err, data) {
           if (err) {
               console.log(err, err.stack);
               callback(err, response(404, "Failed"));
           } else {
               var payload = JSON.parse(data["Payload"]);
               var body = JSON.parse(payload["body"]);
               callback(err, response(302, { Location: body["url"] }));
           }
        });

    }

};

var response = function (statusCode, body) {
    return {
        isBase64Encoded: false,
        statusCode: statusCode,
        headers: { "Content-Type": "application/json" },
        body: body
    }
};

