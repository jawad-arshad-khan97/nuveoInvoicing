import express from "express";

import {
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getInvoiceDetail,
  updateInvoice,
} from "../controllers/invoice.controller.js";

const router = express.Router();

router.route("/").get(getAllInvoices);
router.route("/:id").get(getInvoiceDetail);
router.route("/").post(createInvoice);
router.route("/:id").patch(updateInvoice);
router.route("/:id").delete(deleteInvoice);

export default router;
