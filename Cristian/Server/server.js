const express = require('express')
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser');

app.use(cors())
const port = 3000

let time = Date.now()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({ type: '*/*' }));

app.post('/now', (req, res) => {
    // console.log(' req: ', req.body)
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT,OPTIONS");
    // res.header["Access-Control-Allow-Origin"]="*"
    res.send(JSON.stringify({tserver:Date.now()}))
})

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})