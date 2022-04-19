const docClient = require('./dynamodb.service');
const CounterService = require('./counter.service')
let table = "ProductTable";


module.exports.getAllProductItem = async ({tab, email}) => {
  try {
			console.log( "ProductService: getalliproducts Start" );
            let message="List of Products available in the market.";
            
            const params = {
                TableName: table
             };
            
            if( tab === "published") {
                message =  `List of Products Published by ${email}`;
               params.FilterExpression="#email = :email";
               
                params.ExpressionAttributeNames = {
                    "#email": "supplier_email"
                }
                params.ExpressionAttributeValues = {
                    ":email": email
                }
             }
            
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
    let msg = "", params = {
      TableName: table,
      Item: item
     };

    if(item.item_id){
      msg = "Product details has been Modified"
      params.ConditionExpression = "(#email = :email)",
      params.ExpressionAttributeNames = {"#email": "supplier_email"};
      params.ExpressionAttributeValues = {":email": item.supplier_email}
    }else{
      const counterSrv = new CounterService();
      let counter = await counterSrv.getCounter("product");
      item.item_id= counter;
      msg = "New Product has been Published!";
    }
    let result = await docClient.put(params).promise();
    if (result) {
      console.log(">>>>>>>>>", result);
    }
    return {
        message: msg,
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
      Key:{ item_id: item.item_id},
      "UpdateExpression": "SET #email = :email",
        "ExpressionAttributeNames": {
          "#email": "supplier_email"
        },
        "ExpressionAttributeValues": {
          ":email": item.email
        },
        "ConditionExpression": "(#email = :email)"
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