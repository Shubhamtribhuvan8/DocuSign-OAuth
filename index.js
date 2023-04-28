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

function getEnvelopeApi(request){
    let dsApiClient = new docusign.ApiClient();
    dsApiClient.setBasePath(process.env.BASE_PATH);
    dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + request.session.access_token);
    return new docusign.EnvelopesApi(dsApiClient);
}
function makeEnvelope(args){

    // Create the envelope definition
    let env = new docusign.EnvelopeDefinition();
    env.templateId = args.templateId;

    // Create template role elements to connect the signer and cc recipients
    // to the template
    // We're setting the parameters via the object creation
    let signer1 = docusign.TemplateRole.constructFromObject({
        email: args.signerEmail,
        name: args.signerName,
        roleName: 'signer'});

    // Create a cc template role.
    // We're setting the parameters via setters
    let cc1 = new docusign.TemplateRole();
    cc1.email = args.ccEmail;
    cc1.name = args.ccName;
    cc1.roleName = 'cc';

    // Add the TemplateRole objects to the envelope object
    env.templateRoles = [signer1, cc1];
    env.status = "sent"; // We want the envelope to be sent

    return env;
}

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
