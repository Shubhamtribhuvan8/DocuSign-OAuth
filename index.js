const express=require("express");
const bodyParser = require('body-parser');
const path=require("path");
const dotenv=require("dotenv");
const docusign=require("docusign-esign")
const fs=require("fs")
const app=express();
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/form",(request,response)=>{
console.log("recived form data",request.body);
response.send("Recived")
})

app.get("/",async(request,response)=>{
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(process.env.BASE_PATH);
    const results = await dsApi.requestJWTUserToken(process.env.INTEGRATION_KEY,process.env.USER_ID ,"signature", fs.readFileSync(path.join(__dirname,"private_key")), 3600);
    
    response.sendFile(path.join(__dirname,"main.html"))
})

app.listen(3000,()=>{
    console.log("server statted succesfully!",process.env.USER_ID);
})
