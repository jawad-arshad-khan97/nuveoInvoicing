import express from "express";

import {
  getConvertedAmount,
  getLatestConversionRatesAndUpdateInDB,
  getTargetCurrencyRateFromDB,
} from "../middleware/currencyConversion.js";

const router = express.Router();

router.route("/convertAmount").get(getConvertedAmount);
router.route("/rates").get(getTargetCurrencyRateFromDB);
router.route("/updateRates").post(getLatestConversionRatesAndUpdateInDB);

export default router;
