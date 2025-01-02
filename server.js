const express = require('express');
const path = require('path');
const dotenv=require('dotenv');
const articleRouter=require('./routes/article');
const {connectDB} = require('./config/db.js');
const methodOverride=require('method-override')

dotenv.config();

const app = express();

const PORT =process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use('/articles',articleRouter);

connectDB();

app.listen(PORT, () => {

  console.log(`Listening at ${PORT}`);
});



// ejs does not work with es import/export js system