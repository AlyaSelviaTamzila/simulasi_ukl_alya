const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')
const jwt = require('jsonwebtoken')

const app = express()

const secretKey = 'thisisverysecretkey'

//enable body parser agar dapat menerima request application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

//inisialisai koneksi ke db
const db = mysql.createConnection({
    host:'localhost',
    port:'3306',
    user:'root',
    password:'',
    database: 'penyewaan_alya'
})

//melakukan koneksi ke db
db.connect((err)=>{
    if(err) throw err
    console.log('Database connected');
})

//fungsi untuk mengecek tken dari jwt
const isAuthorized = (request, result, next)=>{
    //cek apakah user sudah mengirim header 'x-api-key'
    if(typeof(request.headers['x-api-key'])=='undefined'){
        return result.status(403).json({
            success: false,
            message: 'Unauthorized. Token is not provided'
        })
    }

    
    let token = request.headers['x-api-key']

    
    jwt.verify(token, secretKey, (err, decoded)=>{
        if(err){
            return result.status(401).json({
                success: false,
                message: 'Unauthorized. Token is invalid'
            })
        }
    })


    next()
}

// -----list end point----- //


app.get('/login', (request, result)=>{
    let data = request.body

    if (data.username == 'admin' && data.password == 'admin') {
        let token = jwt.sign(data.username + '|' + data.password, secretKey)

        result.json({
            success: true,
            message: 'Login success, welcome back Admin!!!!',
            token: token
        })
    }
    result.json({
        success: false,
        message: 'You are not person with username admin and have password admin!'
    })
})


/********************* END POINT  */




app.listen(5000, ()=>{
    console.log('App is running on port 5000!');
})