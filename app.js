//jshint esversion:8
const express = require('express');
const app = express();
const port = 4000;
const date = require(__dirname + '/date.js');
const Task = require(`${__dirname}/Tasks.model.js`);
const List = require(`${__dirname}/Lists.model.js`);
const day = date.date;

// view engine setup
app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/public'));


app.get('/', async (req, res) => { 
  
  await Task.find().
    exec((err, tasks) => {
      if (err) {
        console.log(`An error has occured: ${err}`);
      } else {
        let items = tasks;

        res.render('index', { title: day, day: day, items: items });
      }
    });
});

app.get("/:customList", async (req, res) => {
  let customUrl = req.params.customList;

  if (customUrl === "favicon.ico") res.redirect("/");
  else {
    const listFromDb = await List.findOne({ name: customUrl });
    if (listFromDb === null) {
      let list = new List({
        name: customUrl,
        listItems: customArray
      });
      list.save();
      res.redirect("/"+ customUrl);
    } else {
      res.render('index', { title: customUrl, day: day, items: listFromDb.listItems });
    }
  } 

});

app.post("/", async (req, res) => {
  const item = req.body.item;
  const listTitle = req.body.list;
  let customArray;
  // use the model created in the Tasks.model
  let task = new Task({ content: item });
  //task.content = item;
  //Save the task to the database.
  if (listTitle === day){
  await Task.insertMany([task], function (err) {
    if (err) throw err;
    console.log('Task saved successfully!');
  });
  res.redirect('/');
}
else{
  customArray = [];
  customArray.push(item);
  List.findOneAndUpdate({name:listTitle}, 
    {$set: {listItems: customArray}}, 
    (err)=>{
      if (err) {
        console.log("There was an error\n"+err);
      } else {
        console.log("List updated successfully");
        res.redirect("/"+listTitle);
      }
    });
  
}
});

app.post('/:id', async (req, res) => {
  let _id = req.params.id;
  await Task.findByIdAndDelete(_id, function (err) {
    if (err) throw err;
    console.log('Task deleted successfully!');
  });
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
