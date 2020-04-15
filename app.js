//jshint esversion:8
const express = require('express');
const app = express();
const port = 4000;
const date = require(__dirname + '/date.js');
const Task = require(`${__dirname}/Tasks.model.js`);
const List = require(`${__dirname}/Lists.model.js`);
const day = date.date;
const _ = require("lodash");
// view engine setup
app.set('views', (__dirname + '/views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(express.static(__dirname + '/public'));


app.get('/', async (req, res) => { 
  //find the list of documents from the database
  await Task.find().
    exec((err, tasks) => {
      if (err) {
        console.log(`An error has occured: ${err}`);
      } else {
        // store the returned results in a variable for latter use
        let items = tasks;
        //display the index page with custom paramaters
        res.render('index', { title: day, day: day, items: items });
      }
    });
});
/**
 * This route creates a new custom page and a new database based on the title of the page
 */
app.get("/:customList", async (req, res) => {
  let customUrl = _.lowerCase(req.params.customList);

  if (customUrl === "favicon.ico") res.redirect("/");//when offline it creates /favicon.ico on home (bug)
  else {
    // Find the list from the database that has a name which matches what the user typed in the url
    const listFromDb = await List.findOne({ name: customUrl });
    // If the document does not exist, create it with one Default item
    if (listFromDb === null) {
      let list = new List({
        name: customUrl,
        listItems: [{_id: 0, content: "This is the default list item, delete it by pressing -->"}]
      });
      list.save();//save the document on the database and redirect to the page you started from
      res.redirect("/"+ customUrl);
    } else {
      //if the document already exists, render it on the respective pase.
      res.render('index', { title: customUrl, day: day, items: listFromDb.listItems });
    }
  } 

});

app.post("/", async (req, res) => {
  const item = req.body.item;
  const listTitle = _.lowerCase(req.body.list); 
 
  // use the model created in the Tasks.model
  let task = new Task({ content: item });
  //task.content = item;
  //Save the task to the database.
  if (listTitle === _.lowerCase(day)){
  await Task.insertMany([task], function (err) {
    if (err) throw err;
    console.log('Task saved successfully!');
  });
  res.redirect('/');
}
else{
 await List.findOne({name:listTitle}, (err, result)=>{  
      if (err) {
        console.log("There was an error\n"+err);
      } else {
        result.listItems.push({_id: result.listItems.length, content: item});
        result.save();
        console.log("List updated successfully");
        res.redirect("/"+listTitle);
      }
    });
  
}
});

app.post('/:id', async (req, res) => {
  let _id = req.params.id;
  let listTitle = _.lowerCase(req.body.delete);  
  
  if(listTitle === _.lowerCase(day)){
    await Task.findByIdAndDelete(_id, function (err) {
      if (err) console.log(err);
      else{
      res.redirect('/');
      console.log('Task deleted successfully!');
      }
    });
    
  }
  else{
    await List.findOneAndUpdate({name: listTitle}, {$pull: {listItems: {_id: _id}}}, (err)=>{
          if (err) {
            console.log("An error occured\n"+err);
          } else {
            console.log("Item Deleted successfully!");
            res.redirect("/" +  listTitle);
          }
        });      
  }
  
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
