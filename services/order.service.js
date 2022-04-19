const docClient = require('./dynamodb.service');
const CounterService = require('./counter.service')
const productService = require('./product.service')
let table = "OrderTable";


module.exports.getOrderedItems = async (email) => {
  try {
			  console.log( "OrderService: getOrderedItems Start",email );
          const params = {
              TableName: table,
              FilterExpression: "#email = :email",
              ExpressionAttributeNames: {
                  "#email": "email",
              },
              ExpressionAttributeValues: {
                  ":email": email,
              }
           };
          let message="List of Ordered Items!";
    
          let response = await docClient.scan(params).promise();
          console.log("OrderService: getOrderedItems End",response);            
          let resp ={Success: true, Message: message, Data: response.Items, "error": {}};
          return resp;
		} catch ( error ) {
			console.log( `ProductService: getalliproducts error occurred: ${error.stack}` );
			throw error;
		}
}

module.exports.orderItem = async (item) =>{
  try {
    const counterSrv = new CounterService();
    let counter = await counterSrv.getCounter("order");
    
      item.order_id= counter;
    let params = {
      TableName: table,
      Item: item
     }
    const quantityCheck = await productService.updateProductQuantity(item);
    if(!quantityCheck){
      return {
        message: "Product Out of Stock!",
        success: false,
        error:{},
        data: item
      }
    }
    let result = await docClient.put(params).promise();
    console.log("Product has been Ordered!",result);
    return {
        message: "Product has been Ordered!",
        success: true,
        error:{},
        data: item
    }
  } catch (error) {
    productService.updateProductQuantity(item, true);
    console.log(error);
    return error;
  }
};

