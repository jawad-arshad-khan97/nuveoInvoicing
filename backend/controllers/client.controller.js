import Client from "../mongodb/models/client.js";
import User from "../mongodb/models/user.js";
import File from "../mongodb/models/file.js";

import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { deleteFileById } from "../middleware/deleteFiles.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllClients = async (req, res) => {
  const {
    _end,
    _order = "asc",
    _start,
    _sort = "name",
    q,
    createdAt_gte,
    createdAt_lte,
  } = req.query;

  const query = {};

  try {
    if (q) {
      query.$or = [
        { name: { $regex: new RegExp(q, "i") } },
        { email: { $regex: new RegExp(q, "i") } },
      ];
    }

    if (createdAt_gte || createdAt_lte) {
      query.createdDate = {
        $gte: new Date(createdAt_gte),
        $lte: new Date(createdAt_lte),
      };
    }

    const count = await Client.countDocuments({ query });

    const clients = await Client.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order })
      .populate("logo");

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getClientDetail = async (req, res) => {
  const { id } = req.params;
  const clientExists = await Client.findOne({ _id: id }).populate("logo");
  if (clientExists) {
    res.status(200).json(clientExists);
  } else {
    res.status(404).json({ message: "Client not found" });
  }
};

const createClient = async (req, res) => {
  try {
    const { name, email, userEmail, address, city, country, website, logo } =
      req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ userEmail }).session(session);

    if (!user) throw new Error("User not found");

    const newClient = await Client.create({
      name,
      email,
      address,
      city,
      country,
      website,
      logo: logo._id,
      creator: user._id,
    });

    user.allClients.push(newClient._id);
    await user.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Client created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, address, city, country, website, logo } = req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const curLogo = await Client.findById(id).populate("logo").session(session);
    const curLogoId = curLogo.logo._id;

    if (logo?._id) {
      // Assuming File model has a method to delete the file by its ID
      await deleteFileById(curLogoId, session);
    }

    const currentDate = new Date();

    await Client.findByIdAndUpdate(
      { _id: id },
      {
        name,
        email,
        address,
        city,
        country,
        website,
        updatedDate: currentDate,
        logo: logo?._id,
      }
    );
    res.status(200).json({ message: "Client updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const clientToDelete = await Client.findById({ _id: id }).populate(
      "creator"
    );
    if (!clientToDelete) throw new Error("Client not found");
    const session = await mongoose.startSession();
    session.startTransaction();

    if (clientToDelete.logo) {
      // Assuming File model has a method to delete the file by its ID
      await deleteFileById(clientToDelete.logo._id, session);
    }

    await Client.deleteOne({ _id: id }, { session });

    clientToDelete.creator.allClients.pull(clientToDelete);
    await clientToDelete.creator.save({ session });
    await session.commitTransaction();
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
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
