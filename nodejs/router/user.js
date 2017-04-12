/**
 * Created by MacBook Air on 2017/4/11.
 */

var getRequestData = require("../tools/getRequestData");
var url = require("url");
var congif = require("../config/config");
var User = require("../models/user");
var email   = require("emailjs");
var server  = email.server.connect(congif.mail);

var handle = {};

// login
handle["/user/login"] = function(req,res){
    if(req.method == "POST"){
        getRequestData(req,function(){
            var email = req.body.email;
            var password = req.body.password;
            User.find({email:email,password:password},function(err,results){
                if(err){
                    console.log(err);
                }else{
                    if(results.length == 0){
                        res.writeHead(200, {'Content-Type':"text/html"});
                        res.write(JSON.stringify(returnObj(1,"User name does not exist or password error")));
                        res.end();
                    }else{
                        if(results[0].active){
                            res.writeHead(200, {'Content-Type':"text/html"});
                            res.write(JSON.stringify(returnObj(0,"success",results[0]._id)));
                            res.end();
                        }else{
                            res.writeHead(200, {'Content-Type':"text/html"});
                            res.write(JSON.stringify(returnObj(1,"Account not activated",req.body)));
                            res.end();
                        }
                    }
                }
            });
        });

    }
};

// register
handle["/user/register"] = function(req,res){
    if(req.method == "POST"){
        getRequestData(req,function(){
            var email = req.body.email;
            var password = req.body.password;
            User.find({email:email},function(err,results){
                if(err){
                    console.log(err);
                }else{
                    if(results.length > 0){
                        res.writeHead(200, {'Content-Type':"text/html"});
                        res.write(JSON.stringify(returnObj(1,"email is exist")));
                        res.end();
                    }else{
                        var code ="";
                        for(var i = 0; i < congif.registerActive.codeLen; i++){
                            code += "" + Math.floor(Math.random() * 10);
                        }
                        var user = new User({
                            email:email,
                            password:password,
                            code:code
                        });
                        user.save(function(err,results){
                            if(err){
                                console.log(err);
                            }else{
                                var mailOptions = {
                                    from:congif.mail.user,
                                    to:email,
                                    subject: congif.registerActive.title,
                                    text: congif.registerActive.content + " " + code
                                };
                                server.send(mailOptions,function(err,message) {
                                    if(err){
                                       console.log(err);
                                    }else{
                                        res.writeHead(200, {'Content-Type':"text/html"});
                                        res.write(JSON.stringify(returnObj(0,"Registered successfully, please go to your mailbox activation")));
                                        res.end();
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }
};

// code
handle["/user/code"] = function(req,res){
    if(req.method == "POST"){
        getRequestData(req,function(){
            var email = req.body.email;
            var password = req.body.password;
            var code = req.body.code;
            User.find({email:email,password:password},function(err,results){
                if(err){
                    console.log(err);
                }else{
                    console.log(results);
                    if(results[0].code == code){
                        User.update({_id:results[0]._id},{active:true},function(err,results){
                            if(err){
                                console.log(err);
                            }else{
                                res.writeHead(200, {'Content-Type':"text/html"});
                                res.write(JSON.stringify(returnObj(0,"Activation success")));
                                res.end();
                            }
                        })
                    }else{
                        res.writeHead(200, {'Content-Type':"text/html"});
                        res.write(JSON.stringify(returnObj(1,"Incorrect verification code")));
                        res.end();
                    }
                }
            });
        });

    }
};

// love
handle["/user/group/add"] = function(req,res){
    if(req.method == "GET"){
        var query = url.parse(req.url,true).query;
        var name = query.name;
        var userId = query.userId;
        User.find({_id:userId},function(err,results){
            if(err){
                console.log(err);
            }else{
                var collectionArr = results[0].collectionArr;
                var isExist = false;
                for(var i = 0; i < collectionArr.length; i++){
                    if(collectionArr[i].name == name){
                        isExist = true;
                        break;
                    }
                }
                if(isExist){
                    res.writeHead(200, {'Content-Type':"text/html"});
                    res.write(JSON.stringify(returnObj(1,"group name is exist")));
                    res.end();
                }else{
                    var obj = {};
                    obj.name = name;
                    obj.list = [];
                    collectionArr.push(obj);
                    User.update({_id:userId},{$set:{collectionArr:collectionArr}},function(err,result){
                        if(err){
                            console.log(err);
                        }else{
                            if(result.nModified > 0){
                                res.writeHead(200, {'Content-Type':"text/html"});
                                res.write(JSON.stringify(returnObj(0,"add group success")));
                                res.end();
                            }
                        }
                    });
                }
            }
        });
    }
};

// get list
handle["/user/group/list"] = function(req,res){
    if(req.method == "GET"){
        var query = url.parse(req.url,true).query;
        var userId = query.userId;
        User.find({_id:userId},function(err,results){
            if(err){
                console.log(err);
            }else{
                res.writeHead(200, {'Content-Type':"text/html"});
                res.write(JSON.stringify(returnObj(0,"success",results[0].collectionArr)));
                res.end();
            }
        });
    }
};

// love
handle["/user/group/love"] = function(req,res){
    if(req.method == "GET"){
        var query = url.parse(req.url,true).query;
        var userId = query.userId;
        var name = query.name;
        var data = JSON.parse(query.data);
        User.find({_id:userId},function(err,results){
            if(err){
                console.log(err);
            }else{
                var collectionArr = results[0].collectionArr;
                for(var i = 0; i < collectionArr.length; i++){
                    if(collectionArr[i].name == name){
                        var list = collectionArr[i].list;
                        var isLoved = false;
                        for(var j = 0; j < list.length; j++){
                            if(list[j].name == data.name){
                                isLoved = true;
                                break;
                            }
                        }
                        if(isLoved){
                            res.writeHead(200, {'Content-Type':"text/html"});
                            res.write(JSON.stringify(returnObj(1,"Has been concerned about")));
                            res.end();
                        }else{
                            list.push(data);
                        }
                        break;
                    }
                }
                User.update({_id:userId},{$set:{collectionArr:collectionArr}},function(err,result){
                    if(err){
                        console.log(err);
                    }else{
                        if(result.nModified > 0){
                            res.writeHead(200, {'Content-Type':"text/html"});
                            res.write(JSON.stringify(returnObj(0,"Focus on success",result)));
                            res.end();
                        }
                    }
                });

            }
        });
    }
};

// delete
handle["/user/group/delete"] = function(req,res){
    if(req.method == "GET"){
        var query = url.parse(req.url,true).query;
        var name = query.name;
        var userId = query.userId;
        User.find({_id:userId},function(err,results){
            if(err){
                console.log(err);
            }else{
                var collectionArr = results[0].collectionArr;
                for(var i = collectionArr.length - 1; i >= 0; i--){
                    if(collectionArr[i].name == name){
                        collectionArr.splice(i,1);
                        break;
                    }
                }
                User.update({_id:userId},{$set:{collectionArr:collectionArr}},function(err,result){
                    if(err){
                        console.log(err);
                    }else{
                        if(result.nModified > 0){
                            res.writeHead(200, {'Content-Type':"text/html"});
                            res.write(JSON.stringify(returnObj(0,"delete sucessful")));
                            res.end();
                        }
                    }
                });
            }
        });
    }
};

// delete sub
handle["/user/group/subDelete"] = function(req,res){
    if(req.method == "GET"){
        var query = url.parse(req.url,true).query;
        var name = query.name;
        var userId = query.userId;
        var subIndex = query.subIndex;
        User.find({_id:userId},function(err,results){
            if(err){
                console.log(err);
            }else{
                var collectionArr = results[0].collectionArr;
                var list = [];
                for(var i = collectionArr.length - 1; i >= 0; i--){
                    if(collectionArr[i].name == name){
                        list = collectionArr[i].list;
                        break;
                    }
                }
                list.splice(subIndex,1);
                User.update({_id:userId},{$set:{collectionArr:collectionArr}},function(err,result){
                    if(err){
                        console.log(err);
                    }else{
                        if(result.nModified > 0){
                            res.writeHead(200, {'Content-Type':"text/html"});
                            res.write(JSON.stringify(returnObj(0,"delete sucessful")));
                            res.end();
                        }
                    }
                });
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
