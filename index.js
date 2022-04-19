
const userHandler = require('./services/user.service');
const orderHandler = require('./services/order.service');
const productHandler = require('./services/product.service');
const serverless = require('serverless-http');
const express = require('express');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/createuser', async(req, res) => {
    console.log(req.body);
    let response = await userHandler.registerUser(req.body);
    response = JSON.stringify(response);
    console.log(response);
    res.send(response);
});
app.get('/userlogin', async(req, res) => {
    console.log(req.query);
    const params = {email:req.query.email, pwd:req.query.pwd}
    let response = await userHandler.loginUser(params);
    response = JSON.stringify(response);
    console.log(response);
    res.send(response);
});
app.get('/getalliproducts', async(req, res) => {
    console.log(req.query);
    const params = {email:req.query.email, tab:req.query.tab}
    let response = await productHandler.getAllProductItem(params);
    response = JSON.stringify(response);
    console.log(response);
    res.send(response);
});
app.post('/orderitem', async(req, res) => {
    console.log(req.body);
    let response = await orderHandler.orderItem(req.body.data);
    response = JSON.stringify(response);
    console.log(response);
    res.send(response);
});

app.get('/getordereditems', async(req, res) => {
    console.log(req.query);
    let response = await orderHandler.getOrderedItems(req.query.email);
    response = JSON.stringify(response);
    console.log(response);
    res.send(response);
});
app.get('/deleteproduct', async(req, res) => {
    console.log(req.query);
    const params = {email:req.query.email, item_id:req.query.item_id}
    let response = await productHandler.deleteProductItem(params);
    response = JSON.stringify(response);
    console.log(response);
    res.send(response);
});

app.get('/createeditproduct', async(req, res) => {
    console.log(req.body);
    let response = await productHandler.addUpdateProductItem(req.body.data);
    response = JSON.stringify(response);
    console.log(response);
    res.send(response);
});

module.exports.handler = serverless(app);

const handler = async (event) => {
    // let fname = "test5";
    // let lname = "test5";
    let email = "test1@g.com";
    // let pwd = "test";
    // let  tab = "published";
    let  item_id = "8";
    // let order ={
    //     "email": "demo1",
    //     "item_id": "115",
    //     "order_status": "ordered",
    //     "quantity": "1"
    // }
    // const response = await userHandler.loginUser({fname,lname,email,pwd})
    // const response = await userHandler.registerUser({fname,lname,email,pwd});
    // console.log("resp -----",response)
    // return response;
    
    // const response = await productHandler.addUpdateProductItem({
    //     "price": "100",
    //     "prod_name": "abc1",
    //     "quantity_available": "1",
    //     "supplier_email": "test1@g.com"
    // });
    // const response = await productHandler.getAllProductItem({email,tab});
    const response = await productHandler.deleteProductItem({item_id,email});
    // const response1 = await orderHandler.orderItem({
    //     "email": email,
    //     "item_id": "6",
    //     "order_status": "ordered",
    //     "quantity": "6"
    // });
    // const response = await orderHandler.getOrderedItems(email);
    // return response1;
    
    // let response = {
    //     statusCode: 200,
    //     body: JSON.stringify({}),
    // };
    // if(event.resource === '/createuser1'){
    //     if(event && event.body){
    //         const item = JSON.parse(event.body);
    //         response.body  = JSON.stringify(await userHandler.registerUser(item));
    //     }
    // }
    // console.log('index-response-----------',response);
    
    console.log('event------------',event)
    
};

// module.exports.handler = handler;