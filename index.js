const express = require("express");
const bodyParser = require('body-parser')
require('dotenv').config()
const appRouter = require('./routes/routes');
const { connectToDB, client } = require("./config/db");

const PORT = 8000;
const app = express();
app.use(express.json());
app.use(bodyParser.json())

connectToDB();

app.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
});

app.use("", appRouter);