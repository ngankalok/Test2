/**
 * Created by MacBook Air on 2017/4/11.
 */

var mongoose = require("mongoose");
var UserSchema = require("../schemas/user");
var User = mongoose.model("user",UserSchema);
module.exports = User;