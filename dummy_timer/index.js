module.exports = function (context, myTimer) {
    context.log("Timer triggered at " + myTimer.next);
    var https = require('https'); 
    var pingPaths = [
        'api/devices?action=ping&code=S2BDCKLb1irqPU/iK5ijW1LvflNan8Drav9azvpC4ISa6A0oNeXp0A==',
        '/api/messages?action=ping&code=blfUL7SXmgc4gV1qQM9MFNIFymUh3AJEY7wDiMa3fxWyslmCEVvGpg==',
        '/api/message_feed?action=ping&code=nGYiKKC/z3FLR3yZb3sY71259NOtSVhqv/c178Ta5BJKsQTHe181AQ=='
    ]

    context.log("timer passed?",myTimer.isPastDue)
    if(myTimer.isPastDue)
    {
        context.log('Node.js is running late!');     
    } else {
        pingPaths.map((path)=> {
            var url = `https://${process.env.AF_HOST}${path}`
            context.log(`ping url: ${url}`)
            var req = https.get(url)
            req.end()
        })

        context.log("Timer triggered at " + myTimer.next);
    };

    context.done();
}