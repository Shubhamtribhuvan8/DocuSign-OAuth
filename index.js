const express=require("express");
const bodyParser = require('body-parser');
const path=require("path");
const dotenv=require("dotenv");
const app=express();
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/form",(request,response)=>{
console.log("recived form data",request.body);
response.send("Recived")
})

app.get("/",(request,response)=>{
    response.sendFile(path.join(__dirname,"main.html"))
})

app.listen(3000,()=>{
    console.log("server statted succesfully!",process.env.USER_ID);
})
