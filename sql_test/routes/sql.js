const express = require('express')
const router = express.Router()

const mysql = require('mysql2')

const connection = mysql.createConnection({
    host : "127.0.0.1", 
    port : 3306, 
    user : 'root', 
    password : '1234', 
    database : 'blockchain'
})


module.exports  = function(){
    const query = require("./query")

    router.get('/user_list',function(req, res){
        const sql = query.select

        connection.query(
            sql, 
            function(err, result){
                if(err){
                    console.log(err)
                }else{
                    console.log(result)
                    res.json(result)
                }
            }
        )
    })

    router.get('/user_insert', function(req, res){
        const sql = query.insert
        const values = ['test2', '1234', 'test2']

        connection.query(
            sql, 
            values, 
            function(err, result){
                if(err){
                    console.log(err)
                }else{
                    console.log(result)
                    res.send(true)
                }
            }
        )
    })

    return router
}