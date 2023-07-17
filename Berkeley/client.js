var currenttime;
var currenttimediv;
var currentclienttimediv;
var currentclienttime;
var timeskew =0;
var errorboxdiv;
var timeskewinput;
var logging = {};
var xhr = new XMLHttpRequest();
var correctionOffset =0;
var proposedoffset = 0;
var proposedoffsetdiv;


var startTime;
var timeDrift=0;
var timedriftinput;
xhr.open("POST", "localhost:3000", true);

const udp = require('dgram')
const client = udp.createSocket('udp4')

document.addEventListener("DOMContentLoaded", ()=>{
    client.bind()
    client.on("listening", Register)
    client.on("message", HandleMessage)
    console.log("Loaded Javascript");
    currenttimediv = document.getElementById("currenttime")
    currentclienttimediv = document.getElementById("currentclienttime")
    errorboxdiv = document.getElementById("errorbox")
    document.getElementById("adjusttimebutton").addEventListener("click",ReadjustTime)

    proposedoffsetdiv = document.getElementById("proposedoffset")
    timeskewinput = document.getElementById("timeskewinput")
    timeskewinput.addEventListener("change", setSkew)
    timeskewinput.value = 0
    timedriftinput = document.getElementById("timedriftinput")
    timedriftinput.addEventListener("change", setDrift)

    timedriftinput.value = 0
    startTime = Date.now()
    // Register()
    setCurrentTimePeriodically();
})

const HandleMessage = (msg, info)=>{
    let jsoned = JSON.parse(msg);
    switch(jsoned.type){
        case "requesttime":
            console.log(' Sending client time: ',currentclienttime.getTime())                        
            client.send(
                JSON.stringify({
                    type: "time",
                    time: currentclienttime.getTime()
                }), 4000, "localhost", (error)=>{
                    if(error){
                        console.log(' error: ', error)
                    }else{
                        console.log("Message sent");
                    }
                })
            break;
        case "rebalance":
            proposedoffset = jsoned.offset
            proposedoffsetdiv.innerHTML = proposedoffset
                
            // console.log("compared with ", curTime)
            // console.log("And original time", currenttime.getTime())
            // let logData = {}
            // logData.CorrectTime = currenttime.getTime()
            // logData.IncorrectTime = currentclienttime
            // logData.ReceivedTime = parseInt(jsoned.tserver)
            // logData.SuggestedTime = Math.floor(parseInt(jsoned.tserver)+ ((curTime-t0)/2))
            
            // logData.error = logData.SuggestedTime- logData.CorrectTime
            // console.table(logData)
            break;
    }
}

const Register = ()=>{
    console.log("Sending message");
    console.log(' client.address().port: ', client.address().port)
    let data = {}
    data.type = "register";
    client.send(JSON.stringify(data), 4000, "localhost", (error)=>{
        if(error){
            console.log(' error: ', error)
        }else{
            console.log("Message sent");
        }
    })
}
const setSkew= ()=>{
    let tempskew = parseInt(timeskewinput.value)
    // if (tempskew<0){
    //     tempskew = 0
    // }
    timeskew = tempskew
    timeskewinput.value = timeskew
}
const setDrift= ()=>{
    timeDrift = parseFloat(timedriftinput.value)
}
const lpad = (value, padding)=> {
    var zeroes = new Array(padding+1).join("0");
    return (zeroes + value).slice(-padding);
}
const setCurrentTime = ()=>{
    currenttime = new Date();
    logging.currenttime = currenttime
    let h = currenttime.getHours();
    let m = currenttime.getMinutes();
    let s = currenttime.getSeconds();
    let ms = currenttime.getMilliseconds()
    let time = `${h}:${m}:<span id = 'small'>${lpad(s,2)}.${lpad(ms,3)}</span>|`;
    currenttimediv.innerHTML = time
}
const setSkewedTime = ()=>{
    currentclienttime = new Date(currenttime.getTime())
    //Calculate error obtained by drifting and skewing
    // console.log(' timeDrift: ', timeDrift)
    
    let timeerror = timeskew + (Date.now()-startTime)*(timeDrift/100)
    currentclienttime.setMilliseconds(currentclienttime.getMilliseconds() + timeerror - proposedoffset)
    logging.currentclienttime = currentclienttime
    errorboxdiv.innerHTML = currentclienttime-currenttime
    let h = currentclienttime.getHours();
    let m = currentclienttime.getMinutes();
    let s = currentclienttime.getSeconds();
    let ms = currentclienttime.getMilliseconds()
    let time = `${h}:${m}:<span id = 'small'>${lpad(s,2)}.${lpad(ms,3)}</span>|`;
    currentclienttimediv.innerHTML = time
}

const setCurrentTimePeriodically = ()=>{
    setCurrentTime();
    setSkewedTime();
    // if(logging.l)
    // console.clear()
    // console.table(logging)
    setInterval(setCurrentTimePeriodically, 100);
}

const ReadjustTime = ()=>{
    console.log("Executing Rebalance");
    let t0 = currentclienttime.getMilliseconds()
    let data = {}
    data.time = currentclienttime.getTime()
    data.type = "initiaterebalance"
    
    client.send(JSON.stringify(data), 4000, "localhost",()=>{
        console.log(' Sent: ')
                    
    })
}