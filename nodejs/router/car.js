/**
 * Created by MacBook Air on 2017/4/12.
 */

var getRequestData = require("../tools/getRequestData");
var url = require("url");
var congif = require("../config/config");
var User = require("../models/user");
var Car = require("../models/car");

var handle = {};

handle["/car/search"] = function(req,res){
    if(req.method == "GET"){
        var query = url.parse(req.url,true).query;
        var keyword = query.keyword;
        var regex = new RegExp('\w*'+keyword+'\w*','i');
        Car.find({name:{$regex:regex}},function(err,results){
            if(err){
                console.log(err);
            }else{
                res.writeHead(200, {'Content-Type':"text/html"});
                res.write(JSON.stringify(returnObj(0,"query was successful",results)));
                res.end();
            }
        });
    }
};

module.exports = function(req,res){
    var pathname = url.parse(req.url).pathname;
    if(handle[pathname] instanceof  Function){
        handle[pathname](req,res);
    }else{
        res.writeHead(404, {'Content-Type':'text/plain'});
        res.end();
    }
};

// return obj
function returnObj(status,msg,data){
    var backData = {};
    backData.status = status || 0;
    backData.msg = msg || "";
    if(data){
        backData.body = data;
    }
    return backData;
}
