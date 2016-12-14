var https = require('https'); 

module.exports = function (context, myTimer) {
    context.log("Timer triggered at " + myTimer.next);
    //var https = require('https'); 
    var pingPaths = [
        'api/devices?action=ping&code=y00bsO30Ri/1AZu1Otk6pew0EzqcdxrRQb/ArgI3j5VfrNpTzrhROA==',
        '/api/messages?action=ping&code=y00bsO30Ri/1AZu1Otk6pew0EzqcdxrRQb/ArgI3j5VfrNpTzrhROA==',
        '/api/message_feed?action=ping&code=y00bsO30Ri/1AZu1Otk6pew0EzqcdxrRQb/ArgI3j5VfrNpTzrhROA=='
    ]

    context.log("timer passed?",myTimer.isPastDue)
    if(myTimer.isPastDue)
    {
        context.log('Node.js is running late!');     
    } else {
        pingPaths.map(function (path)  {
            var url = `https://${process.env.AF_HOST}${path}`
            context.log(`ping url: ${url}`)
            var req = https.get(url)
            req.end()
        })

        context.log("Timer triggered at " + myTimer.next);
    };

    context.done();
}