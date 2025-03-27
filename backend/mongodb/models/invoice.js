import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  createdDate: { type: Date, required: true, default: Date.now },
  updatedDate: { type: Date, required: false },
  invoiceDate: { type: Date, required: true },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  custom_id: { type: String, required: true },
  note: { type: String, required: false },
  currency: { type: String, required: true },
  services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  discount: { type: Number, required: false },
  tax: { type: Number, required: false },
  total: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  status: { type: String, required: true },
});

const invoiceModel = mongoose.model("Invoice", InvoiceSchema);

export default invoiceModel;
