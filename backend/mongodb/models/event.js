import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    event_name: { type: String, required: true },
    phone: { type: String, required: false },
    date: { type: Date, required: true },
    agenda: { type: String, required: false },
    status: { type: String, required: true },

});

const EventModel = mongoose.model("Event", EventSchema);

export default EventModel;