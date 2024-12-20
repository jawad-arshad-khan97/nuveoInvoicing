import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
    originalFilename: { type: String, required: true },
    filePath: { type: String, required: true },
});

const FileModel  = mongoose.model("File", FileSchema);

export default FileModel ;