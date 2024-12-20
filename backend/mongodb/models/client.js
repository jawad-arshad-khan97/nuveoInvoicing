import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  owner_name: { type: String, required: true },
  owner_email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  // city: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String, required: false },
  createdDate: { type: Date, required: true, default: Date.now },
  updatedDate: { type: Date, required: false },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ClientModel = mongoose.model("Client", ClientSchema);

export default ClientModel;
