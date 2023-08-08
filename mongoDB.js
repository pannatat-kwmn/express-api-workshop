require('dotenv').config();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL
const dbName = 'express-workshop';

mongoose.connect(`${mongoString}/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
});

database.once('connected', () => {
  console.log('Database Connected');
});

module.exports = database;