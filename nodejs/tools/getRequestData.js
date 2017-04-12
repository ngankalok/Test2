/**
 * Created by MacBook Air on 2017/4/11.
 */

var querystring = require("querystring");
module.exports = function(req,callback){
    var buffers = [];
    req.on("data",function(chunk){
        buffers.push(chunk);
    });
    req.on("end",function(){
        req.rawBody = Buffer.concat(buffers).toString();
        if(req.headers['content-type'].indexOf('application/x-www-form-urlencoded') >= 0){
            req.body = querystring.parse(req.rawBody);
            if(callback instanceof Function){
                callback();
            }
        }
        if(req.headers['content-type'].indexOf('application/json') >= 0){
            req.body = JSON.parse(req.rawBody);
            if(callback instanceof Function){
                callback();
            }
        }
    });
};