import express from "express";

import { getMonthlyIncomeDetails } from "../controllers/analytics.controller.js";

const router = express.Router();

router.route("/").get(getMonthlyIncomeDetails);

export default router;
