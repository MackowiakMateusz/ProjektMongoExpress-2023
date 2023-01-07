const express = require('express');
const app = express();
const animes = require('./routes/animes');
const cors = require('cors')
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204 
}
app.use(cors(corsOptions));//cors(corsOptions)
app.use(express.json());

// „Podłączamy” obsługę „endpointów”, które zdefiniowaliśmy dla kolekcji 'animes' w katalogu routes/animes.js
app.use('/animes', animes);

require('dotenv').config();
const dbConnData = {
    user: process.env.MONGO_USER || 'adminuser',
    password: process.env.MONGO_PASSWORD || 'password123',
    host: process.env.MONGO_HOST || "127.0.0.1",//'10.109.122.170',//'host.docker.internal',//'127.0.0.1',
    port: process.env.MONGO_PORT || 27017,//27017,
    database: process.env.MONGO_DATABASE || 'products'//products
};
// Łączymy się z bazą i „stawiamy” serwer API
// Do kontaktu z serwerem MongoDB wykorzystamy bibliotekę Mongoose

const mongoose = require('mongoose');
const connectionURI=`mongodb://${dbConnData.user}:${dbConnData.password}@${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`
console.log(dbConnData)
mongoose
  .connect(process.env.MONGODB_URI || connectionURI, {//`mongodb://${dbConnData.user}:${dbConnData.password}@${dbConnData.host}:${dbConnData.port}/${dbConnData.database}`
  poolSize: 10,
  authSource: "admin",
  user: process.env.MONGO_USER || 'adminuser',
  pass: process.env.MONGO_PASSWORD || 'password123',
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  })
  .then(response => {
    console.log(`Connected to MongoDB. Database name: "${response.connections[0].name}"`)
    const port = process.env.PORT || 5000
    app.listen(port, () => {
      console.log(`API server listening at http://localhost:${port}`);
    });
  })
  .catch(error => console.error('Error connecting to MongoDB', error));

