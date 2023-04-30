const express = require("express");
const path = require("path");
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const docusign = require("docusign-esign");
const fs = require("fs");
const session = require("express-session");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
   secret: "dfsf94835asda",
   resave: true,
   saveUninitialized: true,
}));
app.use(express.static('public'));

app.post("/form", async (request, response) => {
   await checkToken(request);
   let envelopesApi = getEnvelopesApi(request);
   let envelope = makeEnvelope(request.body.name, request.body.email, request.body.company);

   let results = await envelopesApi.createEnvelope(
       process.env.ACCOUNT_ID, {envelopeDefinition: envelope});
   console.log("envelope results ", results);


   let viewRequest = makeRecipientViewRequest(request.body.name, request.body.email);
   results = await envelopesApi.createRecipientView(process.env.ACCOUNT_ID, results.envelopeId,
       {recipientViewRequest: viewRequest});
       response.json({ url: results.url });
});

function getEnvelopesApi(request) {
   let dsApiClient = new docusign.ApiClient();
   dsApiClient.setBasePath(process.env.BASE_PATH);
   dsApiClient.addDefaultHeader('Authorization', 'Bearer ' + request.session.access_token);
   return new docusign.EnvelopesApi(dsApiClient);
}

function makeEnvelope(name, email, company){
   let env = new docusign.EnvelopeDefinition();
   env.templateId = process.env.TEMPLATE_ID;
   let text = docusign.Text.constructFromObject({
      tabLabel: "company_name", value: company});
   let tabs = docusign.Tabs.constructFromObject({
      textTabs: [text],
   });

   let signer1 = docusign.TemplateRole.constructFromObject({
      email: email,
      name: name,
      tabs: tabs,
      clientUserId: process.env.CLIENT_USER_ID,
      roleName: 'Applicant'});

   env.templateRoles = [signer1];
   env.status = "sent";
   return env;
}

function makeRecipientViewRequest(name, email) {
   let viewRequest = new docusign.RecipientViewRequest();

   viewRequest.returnUrl = "https://docu-sign-o-auth-l2ol-pn50xxh4g-shubhamtribhuvan8.vercel.app/docusign-success?event=viewing_complete";
   viewRequest.authenticationMethod = 'none';
   viewRequest.email = email;
   viewRequest.userName = name;
   viewRequest.clientUserId = process.env.CLIENT_USER_ID;

   return viewRequest
}


async function checkToken(request) {
   if (request.session.access_token && Date.now() < request.session.expires_at) {
      console.log("re-using access_token ", request.session.access_token);
   } else {
      console.log("generating a new access token");
      let dsApiClient = new docusign.ApiClient();
      dsApiClient.setBasePath(process.env.BASE_PATH);
      const results = await dsApiClient.requestJWTUserToken(
          process.env.INTEGRATION_KEY,
          process.env.USER_ID,
          "signature",
          fs.readFileSync(path.join(__dirname, "private.key")),
          2000
      );
      console.log(results.body);
      request.session.access_token = results.body.access_token;
      request.session.expires_at = Date.now() + (results.body.expires_in - 60) * 1000;
   }
}

app.get("/", async (request, response) => {
   await checkToken(request);
   response.sendFile(path.join(__dirname, "public"));
});

app.get("/success", (request, response) => {
   response.send(`<h1 style={textalign:"center"}>Successfully Done With DocuSign!</>`);
 });

// https://account-d.docusign.com/oauth/auth?response_type=code&scope=signature%20impersonation&client_id=(YOUR CLIENT ID)&redirect_uri=http://localhost:8000/

app.listen(3000, () => {
   console.log("server has started", process.env.USER_ID);
});