let express = require("express");
var mysql = require('mysql');
let app = express();
let ejs = require("ejs");
let pdf = require("html-pdf");
const fs = require('fs');
let path = require("path");

var con = mysql.createConnection({
    host: "localhost",    
    user: "root",   
    password: "",   
    database: "dbtest" 
  });


  con.connect((err)=>{
    if(err) throw err;
  });

app.get("/generateReport", (req, res) => {
    con.query("SELECT * FROM books", function (err, data){
    ejs.renderFile(path.join(__dirname, './views/', "templatee.ejs"), {con: data}, (err, data1) => {
    if (err) {
          res.send(err);
    } else {
        let options = {
            "height": "11.25in",
            "width": "8.5in",
            "header": {
                "height": "20mm"
            },
            "footer": {
                "height": "20mm",
            },
        };

        pdf.create(data1, options).toFile("report2.pdf", function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.send("File created successfully");
            }
        });
    }})
});
})

app.get('/', function(req, res, next) {
    var data =fs.readFileSync('./pdf/report2.pdf');
  res.contentType("application/pdf");
  res.send(data);
  });
  

app.listen(3000);