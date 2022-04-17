// Import mysql for database connections and express for Hosting
const mysql  = require("mysql");
const express = require("express");
const app = express();
var axios = require('axios');


//Import body parser to parse requests of API endpoints

let bodyParser = require('body-parser');
const { response } = require("express");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let isUserAgentMobile = false;


app.get('/',(req,res) =>  res.send("helo hari! BFF for customer is up"));

let dateNow = new Date();

//Function to validate user information
const isValidJWTandUserAgent = (req,res) => {
    isUserAgentMobile = false;
    if(req.headers["user-agent"] === undefined){
        res.status(400).json({
            statusCode: 400,
            message : "User agent is not present in the request"
        });
        return false;
    }
    if(req.headers.authorization === undefined){
        res.status(401).json({
            statusCode: 401,
            message : "Absence of JWT token detected"
        });
        return false;
    }
    console.log(req.headers["user-agent"]);
    let base64Url = req.headers.authorization.split('.')[1]; // token you get
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    let decodedData = JSON.parse(Buffer.from(base64, 'base64').toString('binary'));
 if(decodedData["sub"] === undefined || decodedData["exp"] === undefined || decodedData["iss"] === undefined){
        res.status(401).json({
            statusCode: 401,
            message : "Invalid JWT token detected"
        });
        return false;
    }
    else if(decodedData["sub"] !== undefined && !(decodedData["sub"] === "starlord" || decod$
        res.status(401).json({
            statusCode: 401,
            message : "Invalid JWT token detected"
        });
        return false;
    }
    else if(decodedData["iss"] !== undefined && decodedData["iss"] !== "cmu.edu"){
        res.status(401).json({
            statusCode: 401,
            message : "Invalid JWT token detected"
        });
        return false;
    }


    else if(decodedData["exp"] !== undefined && dateNow > Date(decodedData["exp"])){
        res.status(401).json({
            statusCode: 401,
            message : "Token expired"
        });
        return false;
    }
    if (req.headers["user-agent"].includes("Mobile")){
        isUserAgentMobile = true;
    }
    return true;
  };

//=================================API end point for adding a customer to customer table====$
app.post("/customers",(req,res) =>{
    if(isValidJWTandUserAgent(req,res)){
        axios.post('http://3.224.154.151:3000/customers', req.body)
          .then(function (response) {
            res.status(response.status).json({
                ...response.data
            });
          })
          .catch(function (error) {
            if(error){
                res.status(error.response.status).json({
                        ...error.response.data
                } );
            }
          });

    }
});

app.get('/customers/:id',(req,res) =>{
    if(isValidJWTandUserAgent(req,res)){


          axios.get(`http://3.224.154.151:3000/customers/${req.params.id}`, {
            params: {
            }
          })
          .then(function (response) {
            if(isUserAgentMobile){
                res.status(200).json({
                   "id": response.data.id,
                   "userId":response.data.userId,
                   "name":response.data.name,
                   "phone":response.data.phone
                });
            }
            else{
                res.status(200).json({
                    ...response.data
                });
            }
          })
          .catch(function (error) {
            res.status(error.response.status).json({
                ...error.response.data
            });
          })
          .then(function () {
            // always executed
            console.log("Done!");
          });
    }
});

//=================================API end point for retrieving a customer from customer tab$
app.get('/customers',(req,res) =>{
    if(isValidJWTandUserAgent(req,res)){

          axios.get(`http://3.224.154.151:3000/customers?userId=${req.query.userId}`)
                .then(function (response) {
                    // handle success\
                    if(isUserAgentMobile){
                        res.status(200).json({
                           "id": response.data.id,
                           "userId":response.data.userId,
                           "name":response.data.name,
                           "phone":response.data.phone
                        });
                    }
                    else{
                        res.status(200).json({
                            ...response.data
                        });
                    }
                })
                .catch(function (error) {
                    // handle error

                    res.status(error.response.status).json({
                        ...error.response.data
                    });
                })
                .then(function () {
                    console.log("Done!");
                });

    }
});

//=================================API end point for retrieving all customers from customer $
app.get('/customerall',(req,res) =>{
    let sql = `SELECT * FROM customers `;

    if(isValidJWTandUserAgent(req,res)){
        request("http://3.224.154.151:3000/customerall", { json: true }, (err, res, body) =>{
            if (err) {
                console.log("Error detected");
            }
            console.log(body);
          });
    }
});

app.get("/status",(req,res) => {
    res.set('content-type', 'text/plain');
    res.send('OK');
    });


app.listen('80', () => {
    console.log("BFF customer service up on Port 80");
});






