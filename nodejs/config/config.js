/**
 * Created by MacBook Air on 2017/4/11.
 */
var path = require("path");
// base config
module.exports = {
    // listen port
    port:3300,

    // static file path
    staticPath:"",

    // send mail address
    mail:{
        user:    "hope.ngankalok@gmail.com",
        password:"92224257",
        host:    "smtp.gmail.com",
        ssl:     true
    },

    registerActive:{
        title:"Welcome to activate registration",
        content:"Your registration verification code is:",
        codeLen:6
    },
    activeAddress: path.join(__dirname,"index.html"),

    // static file type
    fileType:{
        "html" : "text/html",
        "css"  : "text/css",
        "js"   : "text/javascript",
        "json" : "application/json",
        "ico"  : "image/x-icon",
        "gif"  : "image/gif",
        "jpeg" : "image/jpeg",
        "jpg"  : "image/jpeg",
        "png"  : "image/png",
        "pdf"  : "application/pdf",
        "svg"  : "image/svg+xml",
        "swf"  : "application/x-shockwave-flash",
        "tiff" : "image/tiff",
        "txt"  : "text/plain",
        "wav"  : "audio/x-wav",
        "wma"  : "audio/x-ms-wma",
        "wmv"  : "video/x-ms-wmv",
        "xml"  : "text/xml"
    }
};
