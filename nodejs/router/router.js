/**
 * Created by MacBook Air on 2017/4/11.
 */

var user = require("./user");
var car = require("./car");
var url = require("url");
var config = require("../config/config");
var fs = require("fs");

var handle = {
    "/user":user,
    "/car":car
};


function readStaticFile(path,type,res){
    fs.exists(path,function(exists){
        if(!exists){
            res.writeHead(404, {'Content-Type':'text/plain'});
            res.end();
        }else{
            fs.readFile(path, 'binary', function(err, file){
                if(err){
                    console.log(err);
                }else{
                    res.writeHead(200, {'Content-Type': config.fileType[type]});
                    res.write(file, 'binary');
                    res.end();
                }
            })
        }
    });
}

module.exports = function(req,res){
    var pathname = url.parse(req.url).pathname;
    var prePath = "";
    var realPath = "";
    var type = "";
    if(pathname.indexOf("/") >= 0 && pathname.length > 1){
        prePath = "/" + pathname.split("/")[1];
    }else{
        prePath = pathname;
    }
    if(handle[prePath] instanceof Function){
        handle[prePath](req,res);                     // router
    }else{
        if(prePath == "" || prePath == "/"){         // request for static file
            realPath = config.staticPath + "/index.html";
            type = "html";
        }else{
            if(pathname.indexOf("/") > 0){
                realPath = config.staticPath + "/" + pathname;
            }else{
                realPath = config.staticPath + pathname;
            }
            if(pathname.indexOf(".") >= 0){
                var typeArr = pathname.split(".");
                type = typeArr[typeArr.length - 1];
            }else{
                res.writeHead(404, {'Content-Type':'text/plain'});
                res.end();
                return;
            }
        }
        readStaticFile(realPath,type,res);
    }

};