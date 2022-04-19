const { count } = require('console');
const docClient = require('./dynamodb.service');
const tableName = "Counters";
class CounterService {
	constructor() {
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