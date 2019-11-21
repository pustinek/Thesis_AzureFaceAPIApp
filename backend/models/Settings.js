const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
    apiKey: {
        type: String,
        required: false,
        default: ""
    },
    region: {
        type: String,
        required: false,
        default: ""
    }
});

module.exports = Settings = mongoose.model("settings", SettingSchema);