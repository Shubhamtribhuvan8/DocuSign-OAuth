const express=require("express");
const bodyParser = require('body-parser');
const path=require("path");
const dotenv=require("dotenv");
const docusign=require("docusign-esign")
const fs=require("fs")
const session=require("express-session")
const app=express();
dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret:"fsget473b4a",
                  resave:true,
                  saveUninitialized:true 
                }))
app.post("/form",(request,response)=>{
console.log("recived form data",request.body);
response.send("Recived")
})

async function CheckToken(request){
    if(request.session.access_token && Date.now()<request.session.expires_at){
        console.log("re-using-accses_token",request.session.access_token);
    }
    else{
        console.log("genrating new access token")
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(process.env.BASE_PATH);
    const results = await dsApiClient.requestJWTUserToken(process.env.INTEGRATION_KEY,process.env.USER_ID ,"signature",fs.readFileSync(path.join(__dirname,"private.key")), 3600);
    // https://account-d.docusign.com/oauth/auth?response_type=code &scope=signature%20impersonation&client_id=e1c3e4c6-f455-4610-8d33-492127d8e315 &redirect_uri=http://localhost:3000
    console.log(results.body)
    request.session.access_token=results.body.access_token;
    request.session.expires_at=Date.now()+(results.body.expires_in)*1000;
    }
}

app.get("/",async(request,response)=>{
    response.sendFile(path.join(__dirname,"main.html"))
})

app.listen(3000,()=>{
    console.log("server statted succesfully!",process.env.USER_ID);
})
