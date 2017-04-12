/**
 * Created by MacBook Air on 2017/4/11.
 */

var mongoose = require("mongoose");
var CarSchema = new mongoose.Schema({
    name:String,
    desc:String,
    img:String,
    update:{type:Date,default:Date.now()}
});
module.exports = CarSchema;