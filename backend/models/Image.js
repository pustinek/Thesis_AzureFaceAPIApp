const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
    fileName: String,
    originalName: String,
    fileExtension: String,
    uploadDate: {
        type: Date,
        default: Date.now()
    },
    // azure obj is filled with data on image upload...
    azure: {
        personGroupId: String, 
        personGroupPersonId: String,
        uploadDate: Date, 
        persistedFaceId: String //supplied by azure on upload
        
    }
});

module.exports = Image = mongoose.model("image", ImageSchema);