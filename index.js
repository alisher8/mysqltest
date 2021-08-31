const express = require('express');
const mysql = require('mysql');
const fs = require('fs')
const bodyParser = require('body-parser');

app = express();
app.use(bodyParser.urlencoded({extended: true}));

var conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'dbtest'
});


conn.connect((err)=>{
  if(err) throw err;
});


app.get('/', function(req, res, next) {
  var data =fs.readFileSync('./forpdf/authors.pdf');
res.contentType("application/pdf");
res.send(data);
});



app.get('/books', (req, res)=>{
  res.writeHead(200, {'Content-type': 'text/json'});
  conn.query('Select * from books', (err, result)=>{
    res.write(JSON.stringify(result));
    res.end();
  })
})


app.get('/authors', (req, res)=>{
  res.writeHead(200, {'Content-type': 'text/json'});
  conn.query('Select * from authors', (err, result)=>{
    res.write(JSON.stringify(result));
    res.end();
  })
})


app.get('/tests', (req, res)=>{
  res.writeHead(200, {'Content-type': 'text/json'});
  conn.query('Select * from tests', (err, result)=>{
    res.write(JSON.stringify(result));
    res.end();
  })
})


app.post('/books', (req, res)=>{
  let bn = req.body.bn;
  let bin = req.body.bin;
  let ai = req.body.ai;
  let sql = ('INSERT INTO books (bookname, binding, author_id) VALUES (?, ?, ?)');
  conn.query(sql,[bn, bin, ai], (err, result)=>{
    if(err) throw err;
    res.send('Inserted successfully');
  });
});


app.put('/books', (req, res)=>{
  let bin = req.body.bin;
  let id = req.body.id;
  let sql = ('UPDATE books set binding = ? where book_id = ?');
  conn.query(sql,[bin, id], (err, result)=>{
    if(err) throw err;
    res.send('Updated successfully');
  });
});


app.post('/authors', (req, res)=>{
  let fn = req.body.fn;
  let ln = req.body.ln;
  let sql = ('INSERT INTO authors (firstname, lastname) VALUES (?, ?)');
  conn.query(sql,[fn, ln], (err, result)=>{
    if(err) throw err;
    res.send('Inserted successfully');
  });
});


app.delete('/books', (req, res)=>{
  let id = req.body.id;
  let sql = ('DELETE FROM books where book_id = ?');
  conn.query(sql,[id], (err, result)=>{
    if(err) throw err;
    res.send('Deleted successfully');
  });
});


app.delete('/authors', (req, res)=>{
  let id = req.body.id;
  let sql = ('DELETE FROM authors where author_id = ?');
  conn.query(sql,[id], (err, result)=>{
    if(err) throw err;
    res.send('Deleted successfully');
  });
});


app.get('/booksauthors', (req, res)=>{
  res.writeHead(200, {'Content-type': 'text/json'});
  conn.query('SELECT concat (authors.firstname, " ", authors.lastname), bk.bookname FROM authors JOIN books bk  ON authors.author_id = bk.author_id', (err, result)=>{
    res.write(JSON.stringify(result));
    res.end();
  })
})


app.listen(3000);