import Invoice from "../mongodb/models/invoice.js";
import Account from "../mongodb/models/account.js";
import Service from "../mongodb/models/service.js";
import User from "../mongodb/models/user.js";
import mongoose from "mongoose";

const getAllInvoices = async (req, res) => {
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
      "filters[name][$containsi]": nameFilter,
      "filters[phone][$containsi]": phoneFilter,
    } = req.query;
    if (ownerEmailFilter)
      query.owner_email = { $regex: new RegExp(ownerEmailFilter, "i") };
    if (ownerNameFilter)
      query.owner_name = { $regex: new RegExp(ownerNameFilter, "i") };
    if (nameFilter) query.name = { $regex: new RegExp(nameFilter, "i") };
    if (phoneFilter) query.phone = { $regex: new RegExp(phoneFilter, "i") };
    Object.keys(req.query).forEach((key) => {
      if (key.endsWith("_like")) {
        const field = key.replace("_like", "");
        query[field] = { $regex: new RegExp(req.query[key], "i") };
      }
    });

    const { id, name, owner_name } = req.query;
    if (id) {
      query.id = { $regex: new RegExp(`^${id}$`, "i") };
    }
    // if (name) {
    //   query.name = { $regex: new RegExp(`^${name}$`, "i") }; // Exact match for title, case-insensitive
    // }
    // if (owner_name) {
    //   query.owner_name = { $regex: new RegExp(`^${owner_name}$`, "i") }; // Partial match for owner, case-insensitive
    // }
    // if (owner_email) {
    //   query.owner_email = { $regex: new RegExp(`^${owner_email}$`, "i") }; // Partial match for owner, case-insensitive
    // }

    let queryBuilder = Invoice.find(query)
      .limit(options.limit)
      .skip(options.skip)
      .sort(options.sort);
    const { "populate[2]": populateInvoices } = req.query;
    if (populateInvoices) {
      queryBuilder = queryBuilder.populate("invoices");
    }

    queryBuilder = queryBuilder.populate([{ path: "client" }]);
    queryBuilder = queryBuilder.populate([{ path: "account" }]);

    const totalCount = await Invoice.countDocuments(query);

    const invoices = await queryBuilder;

    res.header("x-total-count", totalCount);
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getInvoiceDetail = async (req, res) => {
  const { id } = req.params;
  const invoiceExists = await Invoice.findOne({ id: id })
    .populate("account")
    .populate("invoices");
  if (invoiceExists) {
    res.status(200).json(invoiceExists);
  } else {
    res.status(404).json({ message: "Invoice not found" });
  }
};

const createInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      name,
      account,
      client,
      services,
      tax,
      subtotal,
      total = 0.0,
      status,
      invoiceDate,
      note,
      custom_id,
      currency,
      userId = "",
    } = req.body;

    if (!account || !client || !invoiceDate || !services || !total) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const maxIdInvoice = await Invoice.findOne().sort({ id: -1 }).select("id");
    const nextId = maxIdInvoice ? parseInt(maxIdInvoice.id) + 1 : 1;

    const serviceDocs = await Service.insertMany(
      services.map((service) => ({ ...service, creator: userId })),
      { session }
    );

    const newInvoice = new Invoice({
      id: nextId,
      name,
      account,
      client,
      status,
      createdDate: new Date(),
      services: serviceDocs.map((s) => s._id),
      tax,
      subtotal,
      total,
      invoiceDate: new Date(invoiceDate),
      note,
      custom_id,
      currency,
      creator: userId,
    });

    const savedInvoice = await newInvoice.save({ session });

    if (account) {
      const accountToUpdate = await Account.findOne({ _id: account });
      accountToUpdate.invoices.push(newInvoice._id);
      await accountToUpdate.save({ session });
    }

    await session.commitTransaction();

    res
      .status(201)
      .json({ message: "Invoice created successfully", data: savedInvoice });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    if (error.code === 11000) {
      return res.status(409).json({ message: "Owner email already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

const updateInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { id } = req.params;
    const { account, client, date, services, tax, subtotal, total, userId } =
      req.body;

    if (!account || !client || !date || !services || !total) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const invoice = await Invoice.findById(id).session(session);
    if (!invoice) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Invoice not found" });
    }

    // Extract existing service IDs
    const existingServiceIds = invoice.services.map((s) => s.toString());

    // Separate services: existing, new, and deleted
    const newServices = services.filter((s) => !s._id); // No ID means new service
    const updatedServices = services.filter(
      (s) => s._id && existingServiceIds.includes(s._id)
    );
    const deletedServices = existingServiceIds.filter(
      (sId) => !services.some((s) => s._id === sId)
    );

    // Insert new services
    const newServiceDocs = await Service.insertMany(
      newServices.map((service) => ({ ...service, creator: userId })),
      { session }
    );

    // Update existing services
    for (const service of updatedServices) {
      await Service.findByIdAndUpdate(service._id, service, { session });
    }

    // Remove deleted services
    if (deletedServices.length > 0) {
      await Service.deleteMany({ _id: { $in: deletedServices } }, { session });
    }

    // Update the invoice
    invoice.account = account;
    invoice.client = client;
    invoice.date = date;
    invoice.services = [
      ...updatedServices.map((s) => s._id),
      ...newServiceDocs.map((s) => s._id),
    ];
    invoice.tax = tax;
    invoice.subtotal = subtotal;
    invoice.total = total;
    invoice.creator = userId;

    await invoice.save({ session });

    if (account) {
      const accountToUpdate = await Account.findOne({ _id: account }).session(
        session
      );
      if (accountToUpdate && !accountToUpdate.invoices.includes(invoice._id)) {
        accountToUpdate.invoices.push(invoice._id);
        await accountToUpdate.save({ session });
      }
    }

    await session.commitTransaction();
    res
      .status(200)
      .json({ message: "Invoice updated successfully", data: invoice });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    session.endSession();
  }
};

const deleteInvoice = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;

    const invoice = await Invoice.findOne({ id })
      .populate("account")
      .session(session);

    if (!invoice) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Invoice not found" });
    }

    invoice.account.invoices.pull(invoice);

    await invoice.account.save({ session });

    await Invoice.deleteMany({ invoiceId: invoice.id }).session(session);

    await Invoice.deleteOne({ id }).session(session);

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "Invoice and related resources deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: error.message });
  }
};

export {
  getAllInvoices,
  getInvoiceDetail,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
