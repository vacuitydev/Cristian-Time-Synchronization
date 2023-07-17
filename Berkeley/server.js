const udp = require('dgram')
const server = udp.createSocket('udp4')
const clients = []

// In this case, the server must also offset itself to keep to the average
let offset = 0

server.bind(4000)
server.on('listening',()=>{
    console.log(' server.address.port: ', server.address().port)
})
server.on('message', (message, info)=>{
    // console.log("Received smth");
    let jsoned = JSON.parse(message);
    // console.log(' jsoned: ', jsoned)
    
    switch (jsoned.type){
        case "register":
            console.log("Received request to register from ", info.port);
            registerClient(info.port)
            break;
        case "time":
            console.log("Received time from ", info.port);
            // console.log(' jsoned: ', jsoned)
            
            registerTime(info.port, jsoned.time)
            break;
        case "initiaterebalance":
            console.log("Received rebalancing request from ", info.port);
            // console.log(' jsoned: ', jsoned)
            
            Rebalance(info.port, jsoned.time);
            break;
    }
})

const Rebalance= (port, time)=>{
    let targetClient = clients.filter((client)=>client.port ===port)[0]
    targetClient.hasSentTime = true;
    targetClient.hasBeenSentTime = false;
    targetClient.time = time
    console.log(' Requesting client: ', clients.filter((client)=>client.port ===port)[0])
    clients.forEach((element)=>{
        server.send(
            JSON.stringify({type: "requesttime"}), element.port, "localhost", ()=>{
                console.log("Sent to ",element.port);
            }
        )
    })
    delayedRebalance(function(){
        console.log("Calculating average time");
        let AverageTime = clients.reduce((sum,client)=>{
            return sum + client.time
        },Date.now() + offset)/(clients.length+1)
        console.log("Client times are:", clients.map((client)=>{return client.time}));
        console.log("Average time is:", AverageTime);
        console.log("Average difference is ", clients.reduce((diff, client)=>{
            return client.time - AverageTime
        },Date.now()+offset-AverageTime))


        clients.forEach((client)=>{
            server.send(
                JSON.stringify({
                    type: "rebalance",
                    offset: parseInt(client.time- AverageTime)
                }), client.port, "localhost"
            )
        })
        offset = AverageTime- (Date.now()+offset)
        console.log("The clocks should follow ", Date.now() + offset)
    })
}

const delayedRebalance = (next)=>{
    if(clients.filter((el)=>el.hasSentTime===false).length>0){
        console.log("Waiting on some clients");
        // console.log(' clients: ', clients)
        setTimeout(delayedRebalance, 500, next)
    }else{
        console.log("All time received");
        next();
    }
}
const registerClient = (port)=>{
    let newClient = {}
    newClient.port = port
    newClient.hasSentTime = false
    newClient.time = Date.now()
    newClient.hasBeenSentTime = false
    clients.push(newClient)
    console.log(' clients: ', clients)
    
    // setTimeout()
}
const registerTime = (port,time)=>{
    let targetClient = clients.filter((client)=>client.port ===port)[0]
    targetClient.hasSentTime = true;
    targetClient.hasBeenSentTime = false;
    targetClient.time = time
    console.log(' targetClient: ', clients.filter((client)=>client.port ===port)[0])
    
}