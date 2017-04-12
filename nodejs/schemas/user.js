/**
 * Created by MacBook Air on 2017/4/11.
 */

var mongoose = require("mongoose");
var UserSchema = new mongoose.Schema({
    email:String,
    password:String,
    code:String,
    collectionArr:Array,
    active:{type:Boolean,default:false},
    update:{type:Date,default:Date.now()}
});
module.exports = UserSchema;