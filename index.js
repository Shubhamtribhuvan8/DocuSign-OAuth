const express=require("express");
const bodyparser=require("body-parser");
const path=require("path");

const app=express();
app.use(bodyparser.urlencoded({extended:true}))

app.post("/form",(request,response)=>{
console.log("recived form data",request.body);
response.send("Recived")
})

app.get("/",(request,response)=>{
    response.sendFile(path.join(__dirname,"main.html"))
})

app.listen(3000,()=>{
    console.log("server statted succesfully!");
})
