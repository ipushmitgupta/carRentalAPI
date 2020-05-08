let mongoose = require('mongoose');

class Database {
  constructor() {
    this._connect();
  }
  
_connect() {
     mongoose.connect(`mongodb+srv://gpushmit:pongapandat@pushmit-database-uhjme.mongodb.net/test?retryWrites=true&w=majority`, 
     { useFindAndModify: false})
       .then(() => {
         console.log('Database connection successful');
       })
       .catch(err => {
         console.error(`Database connection error ${err}`);
       });
  }
}

module.exports = new Database();