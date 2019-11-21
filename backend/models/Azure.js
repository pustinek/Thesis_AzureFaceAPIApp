const mongoose = require("mongoose");


const AzureSchema = new mongoose.Schema({
    personGroupId: {
        type: String,
        required: true
    },
    person: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    role:
    {
        type: String,
        default: "guest"
    },
    date: {
        type: Date,
        default: Date.now
    },
    person: {
        type: String
    },
    images : [Image],
    azure: {
        personGroupId: String,
        personId: String,
        syncDate: Date
    }

});

module.exports = Azure = mongoose.model("azure", AzureSchema);
