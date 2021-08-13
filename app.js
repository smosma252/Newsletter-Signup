const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");
const { response } = require("express");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile( __dirname + "/signup.html");
});

app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                } 
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const url = "https://us5.api.mailchimp.com/3.0/lists/8b8b4f1b50";
    const options = {
        method:"POST",
        auth: "osama1:9f1bad7d2090c224efb8d163ff746746-us5"
    };

    const request = https.request(url, options, function(response){
        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });

        var statusCode = response.statusCode; 
        
        if (statusCode == 200) {
            //display success site
            res.sendFile( __dirname + "/success.html");

        } else {
            //display failure site
            res.sendFile( __dirname + "/failure.html");

        }

    });

    request.write(jsonData);
    request.end();

});


app.post("/failure", function(req, res){
    res.redirect("/");
})


app.listen(process.env.PORT || 3000 , function(){
    console.log("Server is running on port 3000");
}) 




//API KEY
//9f1bad7d2090c224efb8d163ff746746-us5


//Unique ID (List Id)
//8b8b4f1b50