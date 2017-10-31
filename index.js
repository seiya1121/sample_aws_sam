'use strict';
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.TABLE_NAME;
const createResponse = (statusCode, body) => ({
  statusCode,
  body: JSON.stringify(body),
});

exports.averages = (event, context, callback) => {
  console.log('Start GetAverages');
  const params = {
    TableName : 'averages'
  };
  dynamo.scan(params, function(err, data) {
    const statusCode = (err) ? 500 : 200;
    const body = (err) ? err : data.Items;
    console.log(createResponse(statusCode, body));
    callback(null, createResponse(statusCode, body));
  });
};

exports.companies = (event, context, callback) => {
  console.log('Start GetCompanies');
  const params = {
    TableName : 'averages_companies',
    FilterExpression : `average_id = :average_id`,
    ExpressionAttributeValues : { ':average_id' : parseInt(event.pathParameters.id, 10) }
  };
  dynamo.scan(params, (err, data) => {
    const statusCode = (err) ? 500 : 200;
    const body = (err) ? err : data.Items ? data.Items.map(item => item.company_id) : null;
    console.log(data);
    console.log(createResponse(statusCode, body));
    callback(null, createResponse(statusCode, body));
  });
};

exports.scores = (event, context, callback) => {
  console.log('Start GetScores');
  const params = {
    TableName : 'averages_scores',
    FilterExpression : `average_id = :average_id`,
    ExpressionAttributeValues : { ':average_id' : parseInt(event.pathParameters.id, 10) }
  };
  dynamo.scan(params, (err, data) => {
    const statusCode = (err) ? 500 : 200;
    const body = (err) ? err : data.Items ? data.Items : null;
    console.log(createResponse(statusCode, body));
    callback(null, createResponse(statusCode, body));
  });
};

exports.putAverage = (event, context, callback) => {
  console.log('Start PutAverages');
  console.log(event);
  console.log(JSON.parse(event.body));
  console.log(JSON.parse(event.body).name);
  const params = {
    TableName : 'averages',
    Item: {
      'id': parseInt(event.pathParameters.id, 10),
      'name': JSON.parse(event.body).name
    }
  };
  dynamo.put(params, (err, data) => {
    const statusCode = (err) ? 500 : 200;
    const body = (err) ? err : data || null;
    console.log(createResponse(statusCode, body));
    callback(null, createResponse(statusCode, body));
  });
};
