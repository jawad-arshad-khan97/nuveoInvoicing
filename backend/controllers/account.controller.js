import Account from "../mongodb/models/account.js";
import User from "../mongodb/models/user.js";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import mongoose from "mongoose";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllAccounts = async (req, res) => {
  try {
    const query = {};
    const options = { sort: {}, limit: 10, skip: 0 }; // Default options

    // Pagination: Handle _start, _end, and pagination[pageSize], pagination[page]
    const {
      _start,
      _end,
      "pagination[page]": page,
      "pagination[pageSize]": pageSize,
    } = req.query;
    if (_start) options.skip = parseInt(_start, 10);
    if (_end) options.limit = parseInt(_end, 10) - options.skip;
    if (page && pageSize) {
      options.limit = parseInt(pageSize, 10);
      options.skip = (parseInt(page, 10) - 1) * options.limit;
    }

    // Sorting: Handle _sort, _order, and sort (e.g., "field:order")
    const { _sort = "updatedAt", _order = "desc", sort } = req.query;
    if (sort) {
      const [sortField, sortOrder] = sort.split(":");
      options.sort[sortField] = sortOrder === "desc" ? -1 : 1;
    } else if (_sort) {
      options.sort[_sort] = _order === "desc" ? -1 : 1;
    }

    // Filters: Handle dynamic filter keys with _like or $containsi
    const {
      "filters[owner_email][$containsi]": ownerEmailFilter,
      "filters[phone][$containsi]": phoneFilter,
    } = req.query;
    if (ownerEmailFilter)
      query.owner_email = { $regex: new RegExp(ownerEmailFilter, "i") };
    if (phoneFilter) query.phone = { $regex: new RegExp(phoneFilter, "i") };
    Object.keys(req.query).forEach((key) => {
      if (key.endsWith("_like")) {
        const field = key.replace("_like", "");
        query[field] = { $regex: new RegExp(req.query[key], "i") };
      }
    });

    // Population: Handle populate parameters
    let queryBuilder = Account.find(query)
      .limit(options.limit)
      .skip(options.skip)
      .sort(options.sort);
    const {
      "populate[0]": populateLogo,
      "populate[1]": populateClients,
      "populate[2]": populateInvoices,
    } = req.query;
    if (populateLogo) queryBuilder = queryBuilder.populate("logo");
    if (populateClients) queryBuilder = queryBuilder.populate("clients");
    if (populateInvoices) {
      queryBuilder = queryBuilder.populate({
        path: "clients",
        populate: { path: "invoices" },
      });
    }

    // Total count for pagination
    const totalCount = await Account.countDocuments(query);

    // Execute query
    const accounts = await queryBuilder;

    // Respond with results and total count
    res.header("x-total-count", totalCount);
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.status(200).json(accounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAccountDetail = async (req, res) => {
  const { id } = req.params;
  const accountExists = await Account.findOne({ id: id })
    .populate("clients")
    .populate("invoices");
  if (accountExists) {
    res.status(200).json(accountExists);
  } else {
    res.status(404).json({ message: "Account not found" });
  }
};

const createAccount = async (req, res) => {
  try {
    const {
      company_name,
      owner_name,
      owner_email,
      address,
      phone,
      country = "", // Optional default value for country
      logo = "", // Optional default value for logo
      note = "",
      userId = "", // Optional default value for note
    } = req.body;

    if (!company_name || !owner_name || !owner_email || !address || !phone) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const maxIdAccount = await Account.findOne().sort({ id: -1 }).select("id");
    const nextId = maxIdAccount ? maxIdAccount.id + 1 : 1;

    const photoUrl = await cloudinary.uploader.upload(logo, {
      folder: "InvoiceManagement",
    });

    // Prepare the account data
    const newAccount = new Account({
      id: nextId,
      company_name,
      owner_name,
      owner_email,
      address,
      phone,
      country,
      logo: photoUrl.url,
      note,
      creator: userId, // Assuming `req.user.id` is set for authenticated users
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

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    file.stream.on("data", (chunk) => chunks.push(chunk));
    file.stream.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer.toString("base64"));
    });
    file.stream.on("error", (err) => reject(err));
  });

export {
  getAllAccounts,
  getAccountDetail,
  createAccount,
  updateAccount,
  deleteAccount,
};
