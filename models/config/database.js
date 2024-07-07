const mysql = require('mysql');

/* var con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "databasevgtproject"
      }
);  */  
 


 var con = mysql.createConnection({
    host: "node60666-vgtproject.th1.proen.cloud",
    user: "root",
    password: "OZIxac77163",
    database: "databasevgtproject"
});    

module.exports = con;