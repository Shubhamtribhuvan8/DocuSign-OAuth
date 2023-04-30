const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static('public'));

app.get("/",(req,res)=>{
   res.send("hello")
})



app.listen(8080, () => {
   console.log("server has started 8080");
});