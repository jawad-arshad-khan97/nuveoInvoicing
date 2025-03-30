import Account from "../mongodb/models/account.js";
import Client from "../mongodb/models/client.js";
import Invoice from "../mongodb/models/invoice.js";
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
    const options = { sort: {}, limit: 10, skip: 0 };

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

    const { _sort = "updatedAt", _order = "desc", sort } = req.query;
    if (sort) {
      const [sortField, sortOrder] = sort.split(":");
      options.sort[sortField] = sortOrder === "desc" ? -1 : 1;
    } else if (_sort) {
      options.sort[_sort] = _order === "desc" ? -1 : 1;
    }

    const {
      "filters[owner_email][$containsi]": ownerEmailFilter,
      "filters[owner_name][$containsi]": ownerNameFilter,
      "filters[account_name][$containsi]": accountNameFilter,
      "filters[phone][$containsi]": phoneFilter,
    } = req.query;
    if (ownerEmailFilter)
      query.owner_email = { $regex: new RegExp(ownerEmailFilter, "i") };
    if (ownerNameFilter)
      query.owner_name = { $regex: new RegExp(ownerNameFilter, "i") };
    if (accountNameFilter)
      query.account_name = { $regex: new RegExp(accountNameFilter, "i") };
    if (phoneFilter) query.phone = { $regex: new RegExp(phoneFilter, "i") };
    Object.keys(req.query).forEach((key) => {
      if (key.endsWith("_like")) {
        const field = key.replace("_like", "");
        query[field] = { $regex: new RegExp(req.query[key], "i") };
      }
    });

    const { id, account_name, owner_name } = req.query;
    if (id) {
      query.id = { $regex: new RegExp(`^${id}$`, "i") };
    }
    if (account_name) {
      query.account_name = { $regex: new RegExp(`^${account_name}$`, "i") }; // Exact match for title, case-insensitive
    }
    if (owner_name) {
      query.owner_name = { $regex: new RegExp(`^${owner_name}$`, "i") }; // Partial match for owner, case-insensitive
    }

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

    queryBuilder = queryBuilder.populate([{ path: "invoices" }]);
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
  const accountExists = await Account.findOne({
    id: id,
  })
    .populate("clients")
    .populate({
      path: "invoices",
      populate: {
        path: "client", // ✅ Populates client inside invoices
      },
    });
  if (accountExists) {
    res.status(200).json(accountExists);
  } else {
    res.status(404).json({ message: "Account not found" });
  }
};

const createAccount = async (req, res) => {
  try {
    const {
      account_name,
      owner_name,
      owner_email,
      address,
      phone,
      country = "",
      logo = "",
      note = "",
      userId = "",
    } = req.body;

    if (!account_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const maxIdAccount = await Account.findOne().sort({ id: -1 }).select("id");
    const nextId = maxIdAccount ? parseInt(maxIdAccount.id) + 1 : 1;

    let photoUrl = "";

    if (logo) {
      photoUrl = await cloudinary.uploader.upload(logo, {
        folder: "InvoiceManagement",
      });
    }

    const newAccount = new Account({
      id: nextId,
      account_name,
      owner_name,
      owner_email,
      address,
      phone,
      country,
      logo: photoUrl?.url,
      note,
      creator: userId,
    });

    const savedAccount = await newAccount.save();

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
    const {
      account_name,
      owner_name,
      owner_email,
      address,
      phone,
      country,
      logo,
      note,
      userId,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const account = await Account.findOne({ id: id });
    if (!account) {
      return res.status(404).json({ message: "Account not found" });
    }

    const _id = account._id;

    const updatedFields = {};

    if (logo && !logo.startsWith("http")) {
      // If `logo` is not a URL, assume it's a new base64 string
      if (account.logo) {
        const publicId = account.logo.split("/").pop().split(".")[0]; // Extract the public ID from the URL
        if (publicId) {
          await cloudinary.uploader.destroy(`InvoiceManagement/${publicId}`); // Delete the old image
        }
      }

      // Upload the new image
      const photoUrl = await cloudinary.uploader.upload(logo, {
        folder: "InvoiceManagement",
      });
      updatedFields.logo = photoUrl.url;
    } else if (logo) {
      // If `logo` is a URL, keep it as-is
      updatedFields.logo = logo;
    }

    // Add other fields to `updatedFields` if they are provided
    if (account_name) updatedFields.account_name = account_name;
    if (owner_name) updatedFields.owner_name = owner_name;
    if (owner_email) updatedFields.owner_email = owner_email;
    if (address) updatedFields.address = address;
    if (phone) updatedFields.phone = phone;
    if (country) updatedFields.country = country;
    if (note) updatedFields.note = note;
    if (userId) updatedFields.creator = userId;

    const updatedAccount = await Account.findByIdAndUpdate(
      _id,
      { $set: updatedFields },
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    res
      .status(200)
      .json({ message: "Account updated successfully", data: updatedAccount });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Owner email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteAccount = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const account = await Account.findOne({ id }).session(session);

    if (!account) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Account not found" });
    }

    if (account.logo) {
      const publicId = account.logo.split("/").pop().split(".")[0]; // Extract public ID
      await cloudinary.uploader.destroy(`InvoiceManagement/${publicId}`);
    }

    await Client.deleteMany({ accountId: account.id }).session(session);

    await Invoice.deleteMany({ accountId: account.id }).session(session);

    await Account.deleteOne({ id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Account and related resources deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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
