//jshint esversion: 8
const mongoose = require('mongoose');
//Use mongoose to connect to the Database that you need to work with
mongoose.connect('mongodb://localhost/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

//This gives confirmation of whether we are connected or not
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log(`Connection established to the ${db.name} Database.`);
});

//Let's create the schema that maps to the Lists collection
const Schema = mongoose.Schema;

const listSchema = new Schema({
    name: String,
    listItems: []
});
// create model for our list documents
const List = new mongoose.model('list', listSchema);

module.exports = List;