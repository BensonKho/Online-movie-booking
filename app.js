const express = require('express');
const mysql = require('mysql');
const mysql2 = require('mysql2');
const app =  express();
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

//view engine
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static("public/css"));

//database
const con = require('./database');

//connect to database
con.connect(function(err){
    if(err) throw err;
    console.log("connected to db");
});

//routes
app.get('/', (req,res)=> res.render('first'));
 
app.get('/home', (req,res)=> res.render('home'));
 
app.get('/login', (req,res)=> res.render('login'));
 
app.get('/register', (req,res)=> res.render('register'));

app.get('/', (req,res)=> res.render('first'));

app.get('/home', (req,res)=> res.render('home'));
 
app.get('/home/:movie_id', (req,res)=> {
    con.query("SELECT * FROM movie WHERE movie_id = '"+ req.params.movie_id +"'", function(err,result)
    {
        var r=result;
        console.log(r);
        con.query("SELECT * FROM moviedetails WHERE movie_id = '"+ req.params.movie_id + "'", function(err,result2)
        {
            res.render('details', {
            pageTitle:"Movie Details",
            movie:r,
            lists:result2
            });
        });
    });
});

app.get('/home/book/:show_id', (req,res)=> {
    res.render('forms',{
        uid: req.params.show_id
    });
});

app.post('/home/book/:show_id', (req,res)=> {
    var u=req.body;
    var uid;
    var stime;
    var sid=req.params.show_id;
    var sql1="INSERT INTO user(name,email,phone,age) VALUES(?,?,?,?);";
    con.query(sql1,[u.name,u.email,u.phone,u.age],(err)=>{
         if(!err)console.log("user added"); else console.log(err);
         con.query("SELECT * FROM user ORDER BY id DESC LIMIT 1;",(err,result)=>{
         uid=result[0].id;
         userData=result; 
         
             con.query("SELECT * FROM moviedetails WHERE show_id= '"+ sid +"'",(err,result)=>{
             stime=result[0].time;
             movieDetails=result;
             console.log(stime);
             console.log(result);
             var sql2="INSERT INTO booking(show_id,no_of_seats,booking_time,user_id) VALUES(?,?,?,?);";
             con.query(sql2,[sid,req.body.seat,stime,uid],(err)=>{
                if(!err)console.log("booking added"); else console.log(err)  });
                 res.render('final',
                    {   pageTitle: 'Booking Details',
                        userDetails: userData,
                        bookingDetails: movieDetails,
                        seatNo: req.body.seat
                    });
             });
        });
    });   
});


//start the server
app.listen(5000,function(){console.log('server running at port 5000')});
