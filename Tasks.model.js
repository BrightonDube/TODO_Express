//jshint esversion: 6
const mongoose = require('mongoose');
//Use mongoose to connect to the Database that you need to work with
mongoose.connect('mongodb://localhost/todo', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//This gives confirmation of whether we are connected or not
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log(`Connection established to the ${db.name} Database.`);
});

//Let's create the schema that maps to the tasks collection

const Schema = mongoose.Schema;

const tasksSchema = new Schema({ 
  content: {type:String,
            required: true    
  } 
});

const Task = mongoose.model("task", tasksSchema);

module.exports = Task;
