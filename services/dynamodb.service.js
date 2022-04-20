const AWS = require('aws-sdk');
const awsRegion = ("ap-south-1");

const docClient = new AWS.DynamoDB.DocumentClient({
    region: awsRegion
});
module.exports = docClient;
