
// const AWS = require('aws-sdk');
// const docClient = new AWS.DynamoDB.DocumentClient();
const userHandler = require('./services/user.service');
const orderHandler = require('./services/order.service');

const handler = async (event) => {
    let fname = "test5";
    let lname = "test5";
    let email = "mahesh@g.com";
    let pwd = "test";
    let  tab = "published";
    let  item_id = "2";
    let order ={
        "email": "demo1",
        "item_id": "115",
        "order_status": "ordered",
        "quantity": "1"
    }
    // const response = await userHandler.loginUser({fname,lname,email,pwd})
    // const response = await userHandler.registerUser({fname,lname,email,pwd});
    // console.log("resp -----",response)
    // return response;
    
    // const response = await productHandler.addProductItem({
    //     "price": "100",
    //     "prod_name": "abc",
    //     "quantity_available": "12",
    //     "supplier_email": "test1@g.com"
    // });
    // const response = await productHandler.getAllProductItem({email,tab});
    // const response = await productHandler.deleteProductItem({item_id});
    const response = await orderHandler.orderItem({
        "email": email,
        "item_id": "3",
        "order_status": "ordered",
        "quantity": "1"
    });
    // const response = await orderHandler.getOrderedItems(email);
    return response;
};
handler();
exports.handler = handler;
