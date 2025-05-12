import './database.js'; // this will automatically connect when the file is loaded
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/index.js'

dotenv.config();

const app = express();



app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json

// use it before all route definitions
app.use(cors({
    origin : "http://localhost:3000", // (Whatever your frontend url is) 
    credentials: true, // <= Accept credentials (cookies) sent by the client
  }));

app.use(cookieParser());


//both index.js and things.js should be in same directory
app.use('/api', router);
 
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});