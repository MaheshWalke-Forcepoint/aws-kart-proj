const docClient = require('./dynamodb.service');
const bcrypt = require('bcryptjs');
let table = "UserTable";

async function addUserItem(item){
  try {
    let params = {
      TableName: table,
      Item: item
     }

    let result = await docClient.put(params).promise();
    if (result) {
      console.log(">>>>>>>>>", result);
    }
    return {
        message: "User entry has been added!",
        success: true,
        error:{}
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

// Function to getAllItems from DB
async function getItemByEmail(email) {
  let params = {
    TableName: table,
    Key:{
      "email": email
    }
  }
  console.log("email----------",params)
  try {
    let result = await docClient.get(params).promise();
    console.log("res------",result);
    return result
  } catch (error) {
    console.log("err--------",error)
   return null
  }
}

module.exports.registerUser = async (userItem) =>{
   try {
      const res = await getItemByEmail(userItem.email);
      console.log('check for existing user',res);
      if(res && res.Item && res.Item.email){
        return {
          "Success": false,
          "Message": "User Already Exist!",
          "error": {}
        }
      }
      userItem.pwd = bcrypt.hashSync(userItem.pwd, 10);

      const res1=  await addUserItem(userItem);
      console.log("add user--",res1);
      if(res1.success){
        return res1; 
      }

   }catch(err){
     console.log("user creation error",err)
   }
   return{
          "Success": false,
          "Message": "User Creation Failed!",
          "error": {}
    }
   
}

module.exports.loginUser = async (userItem) =>{
   let res = await getItemByEmail(userItem.email);
   console.log('check for login user');
  try{
   if (res.Item == undefined) {
			res = {"Success": false, "Message": "User Does not exists!", "error": {}};
	  } else if (res.Item != undefined && !bcrypt.compareSync(userItem.pwd, res.Item.pwd)) {
      res = {"Success": false, "Message": "Incorrect Password!", "error": {}};
    }else{
      res = {"Success": true, "Message": "User has been Authenticated!", "error": {}};
    }
  } catch ( error ) {
			console.log( `UserService: register error occurred: ${error.stack}` );
			throw error;
	}
   return res;
   
}
