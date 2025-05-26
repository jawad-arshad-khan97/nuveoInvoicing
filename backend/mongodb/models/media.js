import mongoose from "mongoose";

const MediaSchema = new mongoose.Schema({
    title: {type: String, required: true},
    type: {type: String, enum: ['image', 'video', 'file', 'other'], required: true,},
    url: {type: String, required: true,},
    // Cloudinary public_id for deletion/reference
    public_id: {type: String, required: true,},
    uploadedAt: {type: Date, default: Date.now,},
    description: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
});

const mediaModel = mongoose.model("Media", MediaSchema);

export default mediaModel;
