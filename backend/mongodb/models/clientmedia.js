import mongoose from "mongoose";

const ClientMediaSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    client_name: { type: String, required: true },
    client_email: { type: String, required: false },
    address: { type: String, required: false },
    phone: { type: String, required: false },
    createdDate: { type: Date, required: true, default: Date.now },
    updatedDate: { type: Date, required: false },
    client: {type: mongoose.Schema.Types.ObjectId, ref: "Client", required: true,},
    logo: { type: String, required: false },
    invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
});

const ClientMediaModel = mongoose.model("ClientMedia", ClientMediaSchema);

export default ClientMediaModel;
