import * as dotenv from "dotenv";
import User from "../mongodb/models/user.js";
import axios from "axios";
dotenv.config();

const getConvertedAmount = async (req, res) => {
  try {
    // const invoice = await Invoice.findById(req.params.id);
    //`https://api.currencybeacon.com/latest`

    const { email, targetCurrency, baseCurrency, amount } = req.query;

    const user = await User.findOne({ email: email }).populate("currency");

    const response = await axios.get(
      process.env.CURRENCY_BEACON_BASE_URL + "/convert",
      {
        params: {
          api_key: process.env.CURRENCY_BEACON_API_KEY,
          from: baseCurrency,
          to: targetCurrency,
          amount: amount,
        },
      }
    );

    const convertedAmount = response.data.value;

    // const conversionRate = response.data.rates[targetCurrency];
    // const convertedAmount = invoice.amount * conversionRate;

    // Update the invoice with the new currency and converted amount
    // const updatedInvoice = await Invoice.findByIdAndUpdate(
    //   req.params.id,
    //   { currency: targetCurrency, amount: convertedAmount },
    //   { new: true }
    // );

    res.json({
      baseCurrency: baseCurrency,
      tagetCurrency: targetCurrency,
      amount: amount,
      convertedAmount: convertedAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getLatestConversionRatesAndUpdateInDB = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate(
      "currency"
    );

    const baseCurrency = user.currency.baseCurrency; //defaultbase in mongodb aswell as currencybeacon is "USD"

    const response = await axios.get(
      process.env.CURRENCY_BEACON_BASE_URL + "/latest",
      {
        params: {
          api_key: process.env.CURRENCY_BEACON_API_KEY,
          base: baseCurrency,
        },
      }
    );

    user.currency.rates = response.data.rates;
    user.currency.latestUpdatedTime = new Date();
    await user.currency.save();

    res.json({
      rates: response.data.rates,
      latestUpdatedTime: user.currency.latestUpdatedTime,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTargetCurrencyRateFromDB = async (req, res) => {
  try {
    const { email, targetCurrency } = req.query;
    const user = await User.findOne({ email: email }).populate("currency");

    if (!user) {
      console.error("User not found");
      return;
    }

    const rate = user.currency.rates.get(targetCurrency);
    const base = user.currency.baseCurrency;

    res.json({
      targetCurrency: req.params.targetCurrency,
      rate: rate,
      base: base,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  getConvertedAmount,
  getLatestConversionRatesAndUpdateInDB,
  getTargetCurrencyRateFromDB,
};
