//jshint esversion:6
const express = require('express');
const app = express();
const port = 3200;
const date = require(__dirname+'/date.js');


// view engine setup
app.set('views', (__dirname+'/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(__dirname+'/public'));
const items = [];

app.get('/', (req, res) => {
  let day = date.day;
  res.render('index', {title: day, day: day, items: items});
});

app.post("/",(req, res)=>{
  let item = req.body.item;
  items.push(item);
  res.redirect('/');
});

app.listen(port, ()=>{
  console.log(`Server listening on port ${port}`);
});
