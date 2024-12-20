import Account from "../mongodb/models/account.js";
import User from "../mongodb/models/user.js";
import Client from "../mongodb/models/client.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const getAllAccounts = async (req, res) => {
  const {
    "pagination[page]": page = 1,
    "pagination[pageSize]": pageSize = 10,
    "populate[0]": populateLogo,
    "populate[1]": populateClients,
    "populate[2]": populateInvoices,
    "filters[owner_email][$containsi]": ownerEmailFilter,
    "filters[phone][$containsi]": phoneFilter,
    sort = "updatedAt:desc",
  } = req.query;

  const query = {};
  const options = {};

  try {
    if (ownerEmailFilter) {
      query.owner_email = { $regex: new RegExp(ownerEmailFilter, "i") };
    }
    if (phoneFilter) {
      query.phone = { $regex: new RegExp(phoneFilter, "i") };
    }

    const [sortField, sortOrder] = sort.split(":");
    options.sort = { [sortField]: sortOrder === "desc" ? -1 : 1 };

    const limit = parseInt(pageSize, 10);
    const skip = (parseInt(page, 10) - 1) * limit;

    const count = await Account.countDocuments(query);

    let queryBuilder = Account.find(query)
      .limit(limit)
      .skip(skip)
      .sort(sortOption);

    // if (populateLogo) queryBuilder = queryBuilder.populate("logo");
    if (populateClients) queryBuilder = queryBuilder.populate("clients");
    if (populateInvoices)
      queryBuilder = queryBuilder.populate({
        path: "clients",
        populate: { path: "invoices" },
      });

    const accounts = await queryBuilder;

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAccountDetail = async (req, res) => {
  const { id } = req.params;
  const accountExists = await Account.findOne({ _id: id }).populate("client");
  if (accountExists) {
    res.status(200).json(accountExists);
  } else {
    res.status(404).json({ message: "Account not found" });
  }
};

const createAccount = async (req, res) => {
  try {
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ message: "Invalid request payload" });
    }

    const {
      company_name,
      owner_name,
      owner_email,
      address,
      phone,
      country = "", // Optional default value for country
      logo = "", // Optional default value for logo
      note = "", // Optional default value for note
    } = data;

    if (!company_name || !owner_name || !owner_email || !address || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const maxIdAccount = await Account.findOne().sort({ id: -1 }).select("id");
    const nextId = maxIdAccount ? maxIdAccount.id + 1 : 1;

    // Prepare the account data
    const newAccount = new Account({
      id: nextId,
      company_name,
      owner_name,
      owner_email,
      address,
      phone,
      country,
      logo,
      note,
      creator: req.user?.id || null, // Assuming `req.user.id` is set for authenticated users
    });

    // Save the account to the database
    const savedAccount = await newAccount.save();

    // Respond with the saved account
    res
      .status(201)
      .json({ message: "Account created successfully", data: savedAccount });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Owner email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = req.body;

    if (!id || !data) {
      return res
        .status(400)
        .json({ message: "Invalid request parameters or payload" });
    }

    const existingAccount = await Account.findById(id);

    if (!existingAccount) {
      return res.status(404).json({ message: "Account not found" });
    }

    const {
      company_name,
      owner_name,
      owner_email,
      address,
      phone,
      country,
      logo,
      note,
    } = data;

    // Prepare update object
    const updateFields = {};
    if (company_name) updateFields.company_name = company_name;
    if (owner_name) updateFields.owner_name = owner_name;
    if (owner_email) updateFields.owner_email = owner_email;
    if (address) updateFields.address = address;
    if (phone) updateFields.phone = phone;
    if (country) updateFields.country = country;
    if (logo) updateFields.logo = logo;
    if (note) updateFields.note = note;

    updateFields.updatedDate = new Date();

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ userEmail }).session(session);
    if (!user) throw new Error("User not found");

    const updatedAccount = await Account.findByIdAndUpdate(
      id,
      { $set: updateFields, updatedDate: new Date() }, // Include updatedDate as part of the update
      { new: true, session } // Return the updated document
    );

    if (!updatedAccount) {
      throw new Error("Account not found");
    }

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Account updated successfully", data: updatedAccount });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    if (error.code === 11000) {
      return res.status(409).json({ message: "Owner email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Account ID is required" });
    }
    const accountToDelete = await Account.findById({ id: id }).populate(
      "client"
    );
    if (!accountToDelete) throw new Error("Account not found");
    const session = await mongoose.startSession();
    session.startTransaction();

    if (accountToDelete.client) {
      accountToDelete.client.account.pull(accountToDelete);
      await accountToDelete.client.save({ session });
    }

    await Account.deleteOne({ id: id }, { session });

    await session.commitTransaction();
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllAccounts,
  getAccountDetail,
  createAccount,
  updateAccount,
  deleteAccount,
};
