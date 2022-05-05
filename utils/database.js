const mongoose = require('mongoose')
require('dotenv').config()
mongoose.connect(
    process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

let schema = new mongoose.Schema({
    username: String,
    salt: String,
    hash: String
})

mongoose.model("JWTUsers", schema)