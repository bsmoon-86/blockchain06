// express 로드 
const express = require('express')

const app = express()

app.use(express.urlencoded({extended:false}))

app.set('views', __dirname+'/views')
app.set('view engine', 'ejs')

// mysql 연동
const mysql = require('mysql2')
const connection = mysql.createConnection(
    {
        host : 'localhost', 
        port : 3306, 
        user : 'root', 
        password : '1234', 
        database : 'new_deal2'
    }
)

app.get('/', function(req,res){
    res.render('key.ejs')
})

// localhost:3000/data [get]
app.get('/data', function(req, res){
    const input1 = req.query.input1
    const input2 = req.query.input2
    console.log('input1 = ', input1)
    console.log('input2 = ', input2)
    res.send('ok')
})

app.post('/data', function(req, res){
    const input1 = req.body.input1
    const input2 = req.body.input2
    console.log(input1, input2)
    const sql = `
        insert 
        into 
        table1
        values 
        (?, ?)
    `
    const values = [input1, input2]

    connection.query(
        sql, 
        values, 
        function(err, result){
            if(err){
                console.log(err)
            }else{
                console.log(result)
                res.json({
                    'data' : result
                })
            }
        }
    )
})

app.listen(3000, function(){
    console.log('Server Start')
})