var nodemailer = require("nodemailer");

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{    
    service:'Gmail',    
    auth: {
        user: "agile.easy@gmail.com",
        pass: "whoamiqqg"
    }
});

/***************
 * to      reciver stirng or array
 * subject subject
 * text    context to send
 * callback
 */
exports.send = function(to, subject, text, callback){
    
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: "no reply ✔",       // sender address
        to: to,                   // list of receivers
        subject: subject,         // Subject line    
        text: 'Welcome to use EasyAgile',    
        html: text                // html body
    };

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            callback(error);
        }else{
            console.log("Message sent: " + response.message);
            callback(null, response);
        }
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
    });    
};