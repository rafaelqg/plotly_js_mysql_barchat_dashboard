const express = require('express');//npm install express
const mysql = require('mysql');//npm install mysql

const app = express();
app.listen(3333);//initialize web server

//initialize mysql connection
const MYSQL_IP="localhost";
const MYSQL_LOGIN="root";
const MYSQL_PASSWORD="root";

let con = mysql.createConnection({
  host:  MYSQL_IP,
  user: MYSQL_LOGIN,
  password: MYSQL_PASSWORD,
  database: "sakila"
});

con.connect(function(err) {
  if (err){
    console.log(err);
    throw err;
  }
  console.log("Connection with mysql established");
});

app.get('/actors', function (req, res) {
  //let sql="SELECT * FROM actor";
  let sql =`SELECT concat ( concat(c.first_name, " "), c.last_name) as full_name, sum(amount) as total FROM sakila.payment p
  inner join customer c on c.customer_id = p.customer_id
  group by p.customer_id order by total desc limit 10`;
  con.query(sql, function (err, result) {
    if (err){
      res.status(500);
      res.send(JSON.stringify(err));
    }else{
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      //CORS
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods","POST,GET,OPTIONS,PUT,DELETE,HEAD");
      res.setHeader("Access-Control-Allow-Headers","X-PINGOTHER,Origin,X-Requested-With,Content-Type,Accept");
      res.setHeader("Access-Control-Max-Age","1728000");
      res.send(JSON.stringify(result));
    }
  });
 
});

console.log("node express is running");
