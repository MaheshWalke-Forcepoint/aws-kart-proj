const AWS = require('aws-sdk');
const awsRegion = ("ap-south-1");

const docClient = new AWS.DynamoDB.DocumentClient({
    region: awsRegion,
    accessKeyId: "AKIAYNTWZK4G5D7WFB43",
    secretAccessKey:"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"
});
module.exports = docClient;