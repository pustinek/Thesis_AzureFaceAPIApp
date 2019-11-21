const mongoose = require("mongoose");
const AzurePerson = require('./AzurePerson').schema;

const PersonGroupSchema = new mongoose.Schema({
    personGroupId: {
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
    recognitionModel: {
        type: String,
        required: false
    },
    people: [AzurePerson]

});

module.exports = PersonGroup = mongoose.model("PersonGroup", PersonGroupSchema);
