module.exports = function (context, myTimer) {
    context.log("Timer triggered at " + myTimer.next);
    var https = require('https'); 
    var pingPaths = [
        '/api/devices?action=ping&code=i/KJ0BOPCiiSFfamZ3YLRxEtajzFdgtUkZ7nwe2pc6RpireVRTXvuw==',
        '/api/messages?action=ping&code=TQXpK4bqC11EPbHeY6sWzbR8Hg318TyR1VnukNlV1XaLvHbHfx1MYQ==',
        '/api/message_feed?action=ping&code=a3G5z/Dt2yWvQL0VCyzaeQrnW1VrkbE5lH6kbsNuYOeDhsf5A4LUrw=='
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