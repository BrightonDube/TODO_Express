//jshint esversion:8
const express = require('express');
const app = express();
const port = 4000;
const date = require(__dirname + '/date.js');
const Task = require(`${__dirname}/Tasks.model.js`);
// view engine setup
app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/public'));


app.get('/', async (req, res) => {
  const day = date.date;
  
  await Task.find().
    exec((err, tasks) => {
      if (err) {
        console.log(`An error has occured: ${err}`);
      } else {
      let items = tasks;
        console.log(items);
        res.render('index', { title: day, day: day, items: items });
      }
    });
  
});

app.post("/", async (req, res) => {
  const item = req.body.item;
  // use the model created in the Tasks.model
  let task = new Task({content:item});
  //task.content = item;
  //Save the task to the database.
  await Task.insertMany([task], function (err) {
    if (err) throw err;
    console.log('Task saved successfully!');
  });
  res.redirect('/');
});

app.all('/:id', async(req, res)=>{
  let _id = req.params.id;
  Task.findByIdAndDelete(_id, function (err) {
    if (err) throw err;
    console.log('Task deleted successfully!');
  });
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
