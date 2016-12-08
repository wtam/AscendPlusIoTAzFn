var EventHubClient = require('azure-event-hubs').Client;

function processRequest(context, req) {
    context.log('Node.js HTTP trigger function processed a request. StartAfterOffset=%s', req.query.after_offset);

    //context.log('azure-event-hubs pkg loading.......');
    //var EventHubClient = require('azure-event-hubs').Client;
    //context.log('azure-event-hubs pkg loaded');

    var connectionString = `HostName=${process.env.IOTHUB_HOSTNAME};SharedAccessKeyName=iothubowner;SharedAccessKey=${process.env.IOTHUBOWNER_SHAREDACCESSKEY}`

    var printError = function (err) {
    context.log(`error occurred: ${err.message}`);
    };

    //var printMessage = function (message) {
    //console.log('Message received from: ', message.body.deviceId);
    //context.log('Message received: ');
    //context.log(JSON.stringify(message.body));
    //context.log('');
    //return messagesArray.push[message.body];
    //}; 

    var messageList = []
    var messageBodyList = []

    var appendMessageToList = function (message) {
        messageBodyList.push({
            offset: message.offset,
            sequenceNumber: message.sequenceNumber,
            enqueuedTimeUtc: message.enqueuedTimeUtc,
            body: message.body
        })
        messageList.push(message)
        context.log(message)
        return true;
    }

    context.log('Before registry to IoTHub.....');
    var client = EventHubClient.fromConnectionString(connectionString);
    context.log('Connecting to IoTHub.....');

    var closeClientAndCompleteContext = function() {
        client.close();
        context.done();
    }

    client.open()
        .then(client.getPartitionIds.bind(client))
        .then(function (partitionIds) {
            context.log('Connected to IoTHub.....');
            setTimeout(function() {
                        context.res = {
                            status: 201,
                            body: JSON.stringify({'messages': messageBodyList})
                        }
                        
                        closeClientAndCompleteContext()
                
                    }, 5000)
                    
            return partitionIds.map(function (partitionId) {
                context.log('Retirving Data from queue.....');
                return client.createReceiver(process.env.MESSAGE_POLL_CONSUMERGROUP, partitionId, { 'startAfterOffset': (req.query.after_offset || 0) }).then(function(receiver) {
                    context.log(`connected. PartitionId: ${partitionId}`)                
                    receiver.on('errorReceived', printError);
                    receiver.on('message', appendMessageToList);
                    
                });
            });
        })
        .catch(printError);
}
function routeRequest(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    if (req.query.action == 'ping')
    {
        context.log('ping, ignore')
        context.done()
    }    
    else
        processRequest(context, req)
}

module.exports = function(context, req) {
    context.log('Node.js HTTP trigger function processed a request. RequestUri=%s', req.originalUrl);

    routeRequest(context, req)

};