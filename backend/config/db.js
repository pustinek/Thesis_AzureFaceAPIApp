const mongoose = require("mongoose");
const config = require("config");
const db = process.env.MONGO_URI || config.get("mongoURI");


const connectDB = async () => {
    try{
        await mongoose.connect(db, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false});
        console.log("MongoDB Connected...");
    }catch(err){
        console.error(err.message);

        // Exit procress with failure
        process.exit(1);
    }
    
}

module.exports = connectDB; 