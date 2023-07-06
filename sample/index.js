const express = require('express')

const app = express()

const cors = require('cors')

const bodyparser = require('body-parser')

app.use(express.urlencoded({extended:true}))
app.use(bodyparser())
app.use(cors())

app.post('/', (req, res)=>{
    console.log(req.body)
    const input1 = req.body.input1;

    console.log(input1)
    res.send('true')
})

app.listen(3000, function(){
    console.log('server start')
})