//jshint esversion:6
require('dotenv').config();
const express= require("express");
const request= require("request");
const https = require("https");
const bodyParser= require("body-parser");
const zomato = require("zomato.js");
const z = new zomato(process.env.API_KEY_ZOMATO);

const app = express();

var rest = [];
var resthumb = [];
var resAdd= [];



app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + "/public"));

app.get("/success", function(req,res){
  res.render("success");
});

app.get("/signup", function(req,res){
  res.render("signup");
});
app.post("/signup", function(req,res){

  const userName = req.body.username;
  const emailAddress= req.body.email;
  const passWord = req.body.password;

var data = {
  members: [
    {
      email_address: emailAddress,
      status: "subscribed",
      merge_fields:{
        FNAME: userName,
        LNAME: passWord
      }
    }
  ]
};

var jsonData = JSON.stringify(data);

const url = process.env.MAILCHIP_URL;

const options = {
  method: "POST",
  auth: process.env.API_KEY_MAIL
}

const request= https.request(url,options,function(response){

  if (response.statusCode === 200) {
    res.render("success");
  }else {
    res.render("failure");
  }


})

request.write(jsonData);
request.end();

});

app.get("/", function(req, res) {
  res.render("index");
});


app.post("/", function(req, res) {

  var entry = req.body.searchbox;
  var ids = 0;
  var cityName = "";
  z.cities({
      q: entry,
      count: 1
    })
    .then(function(data) {
      ids = (data[0].id);

      z.search({
          entity_id: ids,
          entity_type: "city",
          count: 12,
          sort: "rating",
          order: "desc"
        })
        .then(function(data) {
          cityName = entry;
          for (var i = 0; i < 12; i++) {
            rest[i] = data.restaurants[i].name;
            resthumb[i] = data.restaurants[i].thumb;
            resAdd[i]= data.restaurants[i].location.address;
          }

          res.render(__dirname + "/views/city.ejs", {
            cityName: cityName,
            resName0: rest[0],
            resName1: rest[1],
            resName2: rest[2],
            resName3: rest[3],
            resName4: rest[4],
            resName4: rest[4],
            resName5: rest[5],
            resName6: rest[6],
            resName7: rest[7],
            resName8: rest[8],
            resName9: rest[9],
            resName10: rest[10],
            resName11: rest[11],
            resthumb0: resthumb[0],
            resthumb1: resthumb[1],
            resthumb2: resthumb[2],
            resthumb3: resthumb[3],
            resthumb4: resthumb[4],
            resthumb5: resthumb[5],
            resthumb6: resthumb[6],
            resthumb7: resthumb[7],
            resthumb8: resthumb[8],
            resthumb9: resthumb[9],
            resthumb10: resthumb[10],
            resthumb11: resthumb[11],
            resAdd0: resAdd[0],
            resAdd1: resAdd[1],
            resAdd2: resAdd[2],
            resAdd3: resAdd[3],
            resAdd4: resAdd[4],
            resAdd5: resAdd[5],
            resAdd6: resAdd[6],
            resAdd7: resAdd[7],
            resAdd8: resAdd[8],
            resAdd9: resAdd[9],
            resAdd10: resAdd[10],
            resAdd11: resAdd[11]
          });
          //  res.send(data);
        })
        .catch(function(err) {
          console.error(err);
        });

    })
    .catch(function(err) {
      console.error(err);
    });
});

app.post("/city", function(req, res) {

})



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.")
});
