'use strict';
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

exports.resources = (event, context, callback) => {
  const params = {
    TableName : tableName
  };
  dynamo.scan(params, function(err, data) {
    const statusCode = (err) ? 500 : 200;
    const body = (err) ? err : data.Items;
    callback(null, createResponse(statusCode, body));
  });
};

exports.putResource = (event, context, callback) => {
  const params = {
    TableName : tableName,
    Item: {
      'id': parseInt(event.pathParameters.id, 10),
      'name': JSON.parse(event.body).name
    }
  };
  dynamo.put(params, (err, data) => {
    const statusCode = (err) ? 500 : 200;
    const body = (err) ? err : data || null;
    callback(null, createResponse(statusCode, body));
  });
};
