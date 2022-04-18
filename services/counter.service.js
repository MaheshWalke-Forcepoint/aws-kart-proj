const AWS = require('aws-sdk');
const { count } = require('console');

const awsRegion = ( "ap-south-1" );//"localhost"
const tableName = "Counters";
const docClient = require('./aws.dynamodb.service');
class CounterService {
	constructor() {
        // this.docClient = new AWS.DynamoDB.DocumentClient( { region: awsRegion } );
        this.docClient = docClient;
	}


 async getCounter(name){

    try{
        let data = await this.docClient.get({
            "TableName": tableName,
            "Key": {
              "counterName": name+"Counter"
            },
            "ConsistentRead": true
          }).promise()

          const currentValue = data.Item.currentValue;
          const newValue = currentValue + 1;
          data = await this.docClient.update({
            "TableName": tableName,
            "ReturnValues": "UPDATED_NEW",
            "ExpressionAttributeValues": {
              ":a": currentValue,
              ":bb": newValue
            },
            "ExpressionAttributeNames": {
              "#currentValue": "currentValue"
            },
            "ConditionExpression": "(#currentValue = :a)",
            "UpdateExpression": "SET #currentValue = :bb",
            "Key": {
              "counterName": name+"Counter"
            }
        }).promise()
        let count = data.Attributes.currentValue
        return count.toString()
    }catch(error){
        console.log(error)
    }
    return 0
 }  
} 
module.exports = CounterService;