const mysql = require('mysql');

/*  var con = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "project_nenu"
      }
);  */  
 


var con = mysql.createConnection({
    host: "node60666-vgtproject.th1.proen.cloud",
    user: "root",
    password: "OZIxac77163",
    database: "project_nenu"
});   

module.exports = con;