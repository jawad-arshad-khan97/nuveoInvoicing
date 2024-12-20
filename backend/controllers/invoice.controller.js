import Invoice from "../mongodb/models/invoice.js";
import User from "../mongodb/models/user.js";
import Client from "../mongodb/models/client.js";
import Account from "../mongodb/models/account.js";
import Service from "../mongodb/models/service.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const getAllInvoices = async (req, res) => {
  const {
    _end,
    _order = "asc",
    _start,
    _sort = "name",
    q,
    createdAt_gte,
    createdAt_lte,
    amountGreaterThan_gte,
    amountLessthan_lte,
  } = req.query;

  const query = {};

  const amount_greaterthan = amountGreaterThan_gte
    ? parseFloat(amountGreaterThan_gte)
    : 0;
  const amount_lessthan = amountLessthan_lte
    ? parseFloat(amountLessthan_lte)
    : Number.POSITIVE_INFINITY;

  try {
    if (q) {
      query.$or = [
        { name: { $regex: new RegExp(q, "i") } },
        { custom_id: { $regex: new RegExp(q, "i") } },
      ];
    }

    if (createdAt_gte || createdAt_lte) {
      query.createdDate = {
        $gte: new Date(createdAt_gte),
        $lte: new Date(createdAt_lte),
      };
    }

    if (amount_greaterthan || amount_lessthan) {
      query.total = {
        $gte: amount_greaterthan,
        $lte: amount_lessthan,
      };
    }

    const count = await Invoice.countDocuments({ query });

    const invoices = await Invoice.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order })
      .populate([
        { path: "client", populate: { path: "logo" } },
        ,
        "items",
        "contact",
      ]);

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceDetail = async (req, res) => {
  const { id } = req.params;
  const invoiceExists = await Invoice.findOne({ _id: id }).populate("items");
  if (invoiceExists) {
    res.status(200).json(invoiceExists);
  } else {
    res.status(404).json({ message: "Invoice not found" });
  }
};

const createInvoice = async (req, res) => {
  try {
    const {
      name,
      userEmail,
      status,
      invoiceDate,
      custom_id,
      currency,
      items: itemData,
      note,
      discountPercentage,
      taxPercentage,
      client,
      contact,
    } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ userEmail }).session(session);

    if (!user) throw new Error("User not found");

    const currentDate = new Date();
    const itemIds = [];
    let subTotal = 0;

    for (const item of itemData) {
      item.itemTotal = item.quantity * item.pricePerItem;
      item.createdDate = currentDate;
      item.creator = user._id;
      const newItem = await Item.create({ ...item });
      subTotal += item.itemTotal;
      itemIds.push(newItem._id);
    }

    const { discountTotal, taxTotal, total } = calculateInvoiceTotal(
      subTotal,
      discountPercentage,
      taxPercentage
    );

    const curClient = await Client.findOne({ client }).session(session);
    const curAccount = await Account.findOne({ contact }).session(session);

    const newInvoice = await Invoice.create(
      [
        {
          name,
          status,
          invoiceDate,
          createdDate: currentDate,
          custom_id,
          currency,
          items: itemIds,
          note,
          discountPercentage,
          taxPercentage,
          client: curClient?._id,
          contact: curAccount?._id,
          creator: user._id,
          total,
          subTotal,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    res.status(200).json({ message: "Invoice created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      userEmail,
      status,
      invoiceDate,
      custom_id,
      currency,
      items: itemData,
      note,
      discountPercentage,
      taxPercentage,
      client,
      contact,
    } = req.body;

    const existingInvoice = await Invoice.findById(id);

    if (!existingInvoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const currentDate = new Date();

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ userEmail }).session(session);
    if (!user) throw new Error("User not found");

    const itemIds = [];
    let subTotal = 0;
    for (const item of itemData) {
      item.itemTotal = item.quantity * item.pricePerItem;
      subTotal += total;
      await Item.findByIdAndUpdate(item._id, { ...item }).session(session);
      itemIds.push(item._id);
    }

    const { discountTotal, taxTotal, total } = calculateInvoiceTotal(
      subTotal,
      discountPercentage,
      taxPercentage
    );
    const curClient = await Client.findOne({ client }).session(session);
    const curAccount = await Account.findOne({ contact }).session(session);

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      { _id: id },
      {
        name,
        status,
        invoiceDate,
        updatedDate: currentDate,
        custom_id,
        currency,
        items: itemIds,
        note,
        discountPercentage,
        taxPercentage,
        client: curClient?._id,
        contact: curAccount?._id,
        updatedDate: currentDate,
        creator: user._id,
        total,
        subTotal,
      },
      { new: true } // Return the updated document
    );

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Invoice updated successfully", updatedInvoice });
  } catch (error) {
    // Rollback the transaction in case of an error
    res.status(500).json({ message: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoiceToDelete = await Invoice.findById({ _id: id }).populate(
      "item"
    );
    if (!invoiceToDelete) throw new Error("Invoice not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    const itemIds = invoice.items.map((item) => item._id);
    await Item.deleteMany({ _id: { $in: itemIds } }).session(session);

    await Invoice.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateInvoiceTotal = (subTotal, discountPercentage, taxPercentage) => {
  const discountTotal = subTotal * (discountPercentage / 100);
  const taxTotal = subTotal * (taxPercentage / 100);
  const total = subTotal - discountTotal + taxTotal;

  return { discountTotal, taxTotal, total };
};

export {
  getAllInvoices,
  getInvoiceDetail,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
