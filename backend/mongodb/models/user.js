import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String, required: false },
  createdDate: { type: Date, required: true, default: Date.now },
  updatedDate: { type: Date, required: false },
  user_role: { type: String, required: false },
  address: { type: String, required: false },
  phone_number: { type: String, required: false },
  allClients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Client" }],
});

const userModel = mongoose.model("User", UserSchema);

export default userModel;
