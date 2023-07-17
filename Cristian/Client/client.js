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

document.addEventListener("DOMContentLoaded", ()=>{
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
    setCurrentTimePeriodically();
})
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
    console.log("Executing adjustment");
    let t0 = currentclienttime
    let data = {}
    data.t0 = t0
    // console.log(' data: ', data)
    var formBody = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch("http://localhost:3000/now",{
        method:"POST",
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        // mode: "cors",
        body: JSON.stringify(formBody)
    }).then((res)=>{
        res.json().then(
            (jsoned)=>{
                let curTime = currentclienttime
                // currentclienttime = jsoned.tserver + (curTime-t0)/2
                // currentclienttime = new Date(currentclienttime + proposedoffset)
                proposedoffset = curTime - (jsoned.tserver+ (curTime-t0)/2)
                proposedoffsetdiv.innerHTML = proposedoffset
                
                // console.log("compared with ", curTime)
                // console.log("And original time", currenttime.getTime())
                let logData = {}
                logData.CorrectTime = currenttime.getTime()
                logData.IncorrectTime = currentclienttime
                logData.ReceivedTime = parseInt(jsoned.tserver)
                logData.SuggestedTime = Math.floor(parseInt(jsoned.tserver)+ ((curTime-t0)/2))
                
                logData.error = logData.SuggestedTime- logData.CorrectTime
                console.table(logData)
            })
    })
}