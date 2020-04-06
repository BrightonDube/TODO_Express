//jshint esversion:6

const express = require('express');
const https = require("https");
const app = express();
const port = 3200;

// view engine setup
app.set('views', (__dirname+'/views'));

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

const items = [];



app.use(express.static(__dirname+'/public'));

app.get('/', (req, res) => {

  //res.render('index', {title: "Home"});
  const today = new Date();
  
  // const weekday = new Array(7);
  // weekday[0] = "Sunday";
  // weekday[1] = "Monday";
  // weekday[2] = "Tuesday";
  // weekday[3] = "Wednesday";
  // weekday[4] = "Thursday";
  // weekday[5] = "Friday";
  // weekday[6] = "Saturday";
  
  //const day = weekday[today.getDay()]; 
  //res.render("index",{ day : day});
  const options = {weekday:"long",day: "numeric", month: "long", year: "numeric"};// options to pass to the toLocale method
  const day = today.toLocaleString("us-En", options);
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
