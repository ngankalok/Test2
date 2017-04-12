/**
 * Created by MacBook Air on 2017/4/12.
 */
var mongoose = require("mongoose");
var CarSchema = require("../schemas/car");
var Car = mongoose.model("car",CarSchema);
module.exports = Car;