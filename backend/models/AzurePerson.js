const mongoose = require("mongoose");


const PersonSchema = new mongoose.Schema({
    personId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    userData: {
        type: String,
        required: false
    },
    persistedFaceIds: {
        type: Array,
        required: false,
        default: []
    }

}, {_id: false});

module.exports = Person = mongoose.model("Person", PersonSchema);
