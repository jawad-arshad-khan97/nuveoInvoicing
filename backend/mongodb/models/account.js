import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  account_name: { type: String, required: true },
  owner_name: { type: String, required: false },
  owner_email: { type: String, required: false },
  logo: { type: String, required: false },
  country: { type: String, required: false },
  address: { type: String, required: false },
  phone: { type: String, required: false },
  createdDate: { type: Date, required: true, default: Date.now },
  updatedDate: { type: Date, required: false },
  clients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
  invoices: [{ type: mongoose.Schema.Types.ObjectId, ref: "Invoice" }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  note: { type: String, required: false },
});

const accountModel = mongoose.model("Account", AccountSchema);

export default accountModel;
