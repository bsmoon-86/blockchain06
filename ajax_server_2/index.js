const express = require('express')

const app = express()

const port = 3000

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

require('dotenv').config()


const user = require('./routes/user')()
app.use('/', user)



const server = app.listen(port, function(){
    console.log('Server Start')
})