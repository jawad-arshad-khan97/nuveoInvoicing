import mongoose from "mongoose";

const CurrencySchema = new mongoose.Schema({
  baseCurrency: { type: String, required: false, default: "USD" },
  latestUpdatedTime: { type: Date, required: false },
  targetCurrency: { type: String, required: false, default: "USD" },
  rates: { type: Map, of: Number, required: false },
});

const CurrencyModel = mongoose.model("Currency", CurrencySchema);

export default CurrencyModel;
