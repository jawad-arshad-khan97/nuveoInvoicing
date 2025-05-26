import Client from "../mongodb/models/client.js";
import Account from "../mongodb/models/account.js";
import Invoice from "../mongodb/models/invoice.js";
import User from "../mongodb/models/user.js";
import mongoose from "mongoose";

const getAllClients = async (req, res) => {
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
      "filters[client_email][$containsi]": clientEmailFilter,
      "filters[client_name][$containsi]": nameFilter,
      "filters[phone][$containsi]": phoneFilter,
    } = req.query;
    if (clientEmailFilter)
      query.client_email = { $regex: new RegExp(clientEmailFilter, "i") };
    if (nameFilter) query.client_name = { $regex: new RegExp(nameFilter, "i") };
    if (phoneFilter) query.phone = { $regex: new RegExp(phoneFilter, "i") };
    Object.keys(req.query).forEach((key) => {
      if (key.endsWith("_like")) {
        const field = key.replace("_like", "");
        query[field] = { $regex: new RegExp(req.query[key], "i") };
      }
    });

    const { ["account.account_name"]: accountName } = req.query;

    const { id, client_name, client_email } = req.query;
    if (id) {
      query.id = { $regex: new RegExp(`^${id}$`, "i") };
    }
    if (client_name) {
      query.client_name = { $regex: new RegExp(`^${client_name}$`, "i") }; // Exact match for title, case-insensitive
    }
    if (accountName) {
      const account = await Account.findOne({
        account_name: new RegExp(`^${accountName}$`, "i"),
      }).select("_id");

      if (account) {
        query.account = account._id;
      }
    }
    if (client_email) {
      query.client_email = { $regex: new RegExp(`^${client_email}$`, "i") };
    }

    let queryBuilder = Client.find(query)
      .limit(options.limit)
      .skip(options.skip)
      .sort(options.sort);
    const { "populate[2]": populateInvoices } = req.query;
    if (populateInvoices) {
      queryBuilder = queryBuilder.populate({
        // path: "clients",
        populate: { path: "invoices" },
      });
    }

    queryBuilder = queryBuilder.populate([{ path: "account" }]);
    queryBuilder = queryBuilder.populate([{ path: "invoices" }]);

    const totalCount = await Client.countDocuments(query);

    const clients = await queryBuilder;

    res.header("x-total-count", totalCount);
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClientDetail = async (req, res) => {
  const { id } = req.params;
  const clientExists = await Client.findOne({ id: id })
    .populate("account")
    .populate({
      path: "invoices",
      populate: {
        path: "client", // ✅ Populates client inside invoices
      },
    });
  if (clientExists) {
    res.status(200).json(clientExists);
  } else {
    res.status(404).json({ message: "Client not found" });
  }
};

const createClient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      account,
      client_email,
      client_name,
      address,
      phone,
      userId = "",
      logo,
    } = req.body;

    if (!client_name) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const maxIdClient = await Client.findOne().sort({ id: -1 }).select("id");
    const nextId = maxIdClient ? parseInt(maxIdClient.id) + 1 : 1;

    let photoUrl = "";

    const newClient = new Client({
      id: nextId,
      client_name,
      client_email,
      account,
      address,
      phone,
      creator: userId,
      logo,
    });

    const savedClient = await newClient.save({ session });

    if (account) {
      const accountToUpdate = await Account.findOne({ _id: account });
      accountToUpdate.clients.push(newClient._id);
      await accountToUpdate.save({ session });
    }

    await session.commitTransaction();

    res
      .status(201)
      .json({ message: "Client created successfully", data: savedClient });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.code === 11000) {
      return res.status(409).json({ message: "Client email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateClient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { client_name, client_email, address, phone, account, logo, userId } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const client = await Client.findOne({ id: id }).populate("account");
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const _id = client._id;

    const updatedFields = {};

    if (client_name) updatedFields.client_name = client_name;
    if (client_email) updatedFields.client_email = client_email;
    if (address) updatedFields.address = address;
    if (phone) updatedFields.phone = phone;
    if (account) updatedFields.account = account;
    if (userId) updatedFields.creator = userId;
    if (userId) updatedFields.logo = logo;

    const updatedClient = await Client.findByIdAndUpdate(
      _id,
      { $set: updatedFields },
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    if (!updateClient) {
      throw new Error("Client not found");
    }

    if (account) {
      if (client.account) {
        client.account.clients.pull(client);
        client.account.clients.push(updatedClient);
        await client.account.save({ session });
      }
    }

    await session.commitTransaction();

    res
      .status(200)
      .json({ message: "Client updated successfully", data: updatedClient });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.code === 11000) {
      return res.status(409).json({ message: "Client email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

const deleteClient = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const client = await Client.findOne({ id })
      .populate("account")
      .session(session);

    if (!client) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Client not found" });
    }

    client.account.clients.pull(client);

    await client.account.save({ session });

    await Invoice.deleteMany({ clientId: client.id }).session(session);

    await Client.deleteOne({ id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Client and related resources deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllClients,
  getClientDetail,
  createClient,
  updateClient,
  deleteClient,
};
