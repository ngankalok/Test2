/**
 * Created by MacBook Air on 2017/4/11.
 */


var http = require("http");
var url = require("url");
var path = require("path");
var mongoose = require("mongoose");
var config = require("./config/config");
var router = require("./router/router");
var User = require("./models/user");
var Car = require("./models/car");

// mongodb connect
mongoose.connect("mongodb://localhost:27017/nodejs");
var db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",function(callback){
    console.log("db service connected");
});

// set static path
config.staticPath = path.join(__dirname,"static");
console.log(config.staticPath);

//add test data
Car.remove({},function(err){
    if(err){
        console.log(err);
    }else{
        console.log("remove sucessful");
        var data = [
            {
                name:"Model S",
                content:"Model S is designed from the ground up to be the safest, most exhilarating sedan on the road. With unparalleled performance delivered through Tesla's unique, all-electric powertrain, Model S accelerates from 0 to 60 mph in as little as 2.5 seconds. Model S comes with Autopilot capabilities designed to make your highway driving not only safer, but stress free.",
                img:"/files/Model_S.png"
            },
            {
                name:"Model X",
                content:"Model X is the safest, fastest and most capable sport utility vehicle in history. With all-wheel drive and a 100 kWh battery providing 295 miles of range, Model X has ample seating for seven adults and all of their gear. And it’s ludicrously fast, accelerating from zero to 60 miles per hour in as quick as 2.9 seconds. Model X is the SUV uncompromised.",
                img:"/files/Model_X.png"
            },
            {
                name:"Model 3",
                content:"Model 3 combines real world range, performance, safety and spaciousness into a premium sedan that only Tesla can build. Our most affordable car yet, Model 3 achieves 215 miles of range per charge while starting at only $35,000 before incentives. Model 3 is designed to attain the highest safety ratings in every category.",
                img:"/files/Model_3.png"
            }
        ];
        var car = [];
        for(var i = 0; i < data.length; i++){
            car[i] = new Car({
                name:data[i].name,
                desc:data[i].content,
                img:data[i].img
            });
            car[i].save(function(err){
                if(err){
                    console.log(err);
                }else{
                    console.log("sucessful");
                }
            });
        }
    }
});




// mongodb empty
//User.remove({},function(err){
//    if(err){
//        console.log(err);
//    }else{
//        console.log("sucess");
//    }
//});

http.createServer(function(req,res){
    router(req,res);
}).listen(config.port);
