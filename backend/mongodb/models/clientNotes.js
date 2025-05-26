import mongoose from "mongoose";
const ClientNotesSchema = new mongoose.Schema({
    content: {type: String, required: true,},
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User',},
    createdAt: {type: Date, default: Date.now,},
});

const ClientNotesModel = mongoose.model("ClientNotes", ClientNotesSchema);

export default ClientNotesModel;