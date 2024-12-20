import express from "express";

import {
  createAccount,
  deleteAccount,
  getAllAccounts,
  getAccountDetail,
  updateAccount,
} from "../controllers/account.controller.js";

const router = express.Router();

router.route("/").get(getAllAccounts);
router.route("/:id").get(getAccountDetail);
router.route("/").post(createAccount);
router.route("/:id").patch(updateAccount);
router.route("/:id").delete(deleteAccount);

export default router;
