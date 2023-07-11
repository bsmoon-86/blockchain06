const express = require('express')

const app = express()

const port = 3000


const sql = require('./routes/sql')()
app.use('/sql', sql)



app.listen(port, function(){
    console.log('Server Start')
})