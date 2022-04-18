// const AWS = require('aws-sdk');
// const docClient = new AWS.DynamoDB.DocumentClient();
const CounterService = require('./counter.service')
const docClient = require('./aws.dynamodb.service');
let table = "ProductTable";


module.exports.getAllProductItem = async ({tab, email}) => {
  try {
			console.log( "ProductService: getalliproducts Start" );
            let message="List of Products available in the market.",
                filterExp ="#email <> :email";
            
            if( tab == "published") {
                filterExp = "#email = :email"
                message =  `List of Products Published by ${email}`;
            }
            
            const params = {
                TableName: table,
                FilterExpression: filterExp,
                ExpressionAttributeNames: {
                    "#email": "supplier_email",
                },
                ExpressionAttributeValues: {
                    ":email": email,
                }
             };
            
            let response = await docClient.scan(params).promise();
            console.log( "ProductService: getalliproducts End" );            
            let resp ={Success: true, Message: message, Data: response.Items, "error": {}};
            return resp;
		} catch ( error ) {
			console.log( `ProductService: getalliproducts error occurred: ${error.stack}` );
			throw error;
		}
}

module.exports.addUpdateProductItem = async (item) =>{
  try {
      const counterSrv = new CounterService();
    let counter = await counterSrv.getCounter("product");
    
      item.item_id= counter;
    let params = {
      TableName: table,
      Item: item
     }

    let result = await docClient.put(params).promise();
    if (result) {
      console.log(">>>>>>>>>", result);
    }
    return {
        message: "Product entry has been added!",
        success: true,
        error:{},
        data: item
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.deleteProductItem = async (item) =>{
  try {
  	console.log( "ProductService: deleteproduct Start" );
    let params = {
      TableName: table,
      Key:{ item_id: item.item_id}
     }

    let result = await docClient.delete(params).promise();
    console.log(result)
    return {
        message: "Product has been Deleted!",
        success: true,
        error:{}
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.updateProductQuantity = async (item, rollbackQuantity) =>{
  try {
   
        let itemData = await docClient.get({
            "TableName": table,
            "Key": {
              "item_id": item.item_id 
            },
            "ConsistentRead": true
          }).promise()
          let currentValue = itemData.Item.quantity_available;
          if(currentValue){
            currentValue = parseInt(currentValue);
          }
          console.log("item quantity available-",currentValue);
          if(!rollbackQuantity && currentValue === 0){
            return false
          }
          let newValue = 0;
          const itemQuantity =  parseInt(item.quantity)
          if(rollbackQuantity){
            newValue = currentValue + itemQuantity;
          }else{
            newValue = currentValue - itemQuantity;
          }
          let resData = await docClient.update({
            "TableName": table,
            "ReturnValues": "UPDATED_NEW",
            "ExpressionAttributeValues": {
              ":quantity": newValue
            },
            "ExpressionAttributeNames": {
              "#quantity": "quantity_available"
            },
            "UpdateExpression": "SET #quantity = :quantity",
            "Key": {
              "item_id": item.item_id 
            }
        }).promise();
        if(resData.Attributes && resData.Attributes.quantity_available){
          return true
        }
        console.log(resData);
        return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};